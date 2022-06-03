import { ApiError, DBBook } from './types';
import books from './booksData';
import { sessions } from './userApi';

function listBooks(token: string, keyword?: string): Promise<DBBook[]> {
  return new Promise((resolve, reject) => {
    const userId = sessions[token];
    if (!userId) {
      reject(new ApiError('Invalid token.'));
      return;
    }

    if (keyword) {
      resolve(
        books.filter(
          (b) =>
            b.title.toLowerCase().indexOf(keyword) > -1 ||
            b.genre.toLowerCase().indexOf(keyword) > -1 ||
            b.author.toLowerCase().indexOf(keyword) > -1 ||
            b.description.toLowerCase().indexOf(keyword) > -1
        )
      );
      return;
    }

    resolve([...books]);
  });
}

export default {
  listBooks
};
