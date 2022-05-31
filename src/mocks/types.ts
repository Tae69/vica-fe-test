export enum Role {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
  Member = 'Member'
}

export type DBUser = {
  id: number
  name: string
  password: string
  role: Role
  dateJoined: number
}

export type User = Omit<DBUser, 'password'>;

// See https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
export class ApiError extends Error {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
