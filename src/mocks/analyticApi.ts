import { ChartData } from 'chart.js';
import books from './booksData';
import { ApiError } from './types';
import { sessions } from './userApi';

type Criteria = 'genre' | 'yearPublished';

function getBookCountBy(
  criteria: Criteria,
  token: string
): Promise<ChartData<'bar', number[], string>> {
  return new Promise((resolve, reject) => {
    const userId = sessions[token];
    if (!userId) {
      reject(new ApiError('Invalid token.'));
      return;
    }
    const added: { [key: string]: number } = {};

    books.forEach((book) => {
      added[book[criteria]] = added[book[criteria]] || 0;
      added[book[criteria]] += 1;
    });

    let by: { key: string; value: number }[] = [];
    Object.keys(added).forEach((key) => {
      by.push({
        key,
        value: added[key]
      });
    });
    by = by.sort((a, b) => b.value - a.value);

    const labels: string[] = by.map((g) => g.key);

    const data = {
      labels,
      datasets: [
        {
          label: 'Number of books',
          data: by.map((g) => g.value),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)'
        }
      ]
    };

    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
}

export default {
  getBookCountBy
};
