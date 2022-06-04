export enum Role {
  Admin = 'Admin',
  Editor = 'Editor',
  Member = 'Member',
}

export type DBUser = {
  id: number;
  name: string;
  password: string;
  role: Role;
  dateJoined: number;
};

export type User = Omit<DBUser, 'password'>;

// See https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
export class ApiError extends Error {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export type DBBook = {
    id: number;
    title: string;
    description: string;
    genre: string;
    author: string;
    yearPublished: number;
    copies: number;
    availability: boolean;
};

export type Book = DBBook;
