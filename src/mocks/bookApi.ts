import { ApiError, DBBook, Role } from './types';
import books from './booksData';
import { sessions } from './userApi';
import users from './usersData';

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

function getBook(token: string, id: number): Promise<DBBook> {
  return new Promise((resolve, reject) => {
    const userId = sessions[token];
    if (!userId) {
      reject(new ApiError('Invalid token.'));
      return;
    }

    const currentUser = users.find((u) => u.id === userId);

    if (!currentUser || currentUser.role === Role.Member) {
      reject(new ApiError('Invalid user role'));
      return;
    }

    const book = books.find((b) => b.id === id);

    if (book === undefined) {
      reject(new ApiError('Book not found'));
      return;
    }

    setTimeout(() => {
      resolve(book);
    }, 1000);
  });
}

function updateBook(token: string, data: DBBook): Promise<DBBook> {
  return new Promise((resolve, reject) => {
    const userId = sessions[token];
    if (!userId) {
      reject(new ApiError('Invalid token.'));
      return;
    }

    const currentUser = users.find((u) => u.id === userId);

    if (!currentUser || currentUser.role === Role.Member) {
      reject(new ApiError('Invalid user role'));
      return;
    }

    const book = books.find((b) => b.id === data.id);

    if (book === undefined) {
      reject(new ApiError('Book not found'));
      return;
    }

    book.title = data.title;
    book.genre = data.genre;
    book.author = data.author;
    book.description = data.description;
    book.yearPublished = data.yearPublished;
    book.copies = data.copies;
    book.availability = data.availability;

    resolve(book);
  });
}

function createBook(token: string, data: Omit<DBBook, 'id'>): Promise<DBBook> {
  return new Promise((resolve, reject) => {
    const userId = sessions[token];
    if (!userId) {
      reject(new ApiError('Invalid token.'));
      return;
    }

    const currentUser = users.find((u) => u.id === userId);

    if (!currentUser || currentUser.role === Role.Member) {
      reject(new ApiError('Invalid user role'));
      return;
    }

    const book = {
      id: books.length + 1,
      title: data.title,
      genre: data.genre,
      author: data.author,
      description: data.description,
      yearPublished: data.yearPublished,
      copies: data.copies,
      availability: data.availability
    };

    books.push(book);

    resolve(book);
  });
}

function deleteBook(token: string, id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const userId = sessions[token];
    if (!userId) {
      reject(new ApiError('Invalid token.'));
      return;
    }

    const currentUser = users.find((u) => u.id === userId);

    if (!currentUser || currentUser.role === Role.Member) {
      reject(new ApiError('Invalid user role'));
      return;
    }

    const index = books.findIndex((b) => b.id === id);

    if (index === -1) {
      reject(new ApiError('Book not found'));
      return;
    }

    books.splice(index, 1);

    resolve();
  });
}

export default {
  listBooks,
  getBook,
  updateBook,
  createBook,
  deleteBook
};
