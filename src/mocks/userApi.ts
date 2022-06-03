import { ApiError, DBUser, Role, User } from './types';
import users from './usersData';

type LoginResponse = {
  user: User;
  token: string;
};

// sessions that maps token to user id
export const sessions: { [key: string]: number } = {};

function login(username: string, password: string): Promise<LoginResponse> {
  return new Promise((resolve, reject) => {
    const user = users.find((u) => u.name === username && u.password === password);

    if (!user) {
      setTimeout(() => {
        reject(new ApiError('User not found.'));
      }, 1000);

      return;
    }

    const token: string = `${user.id}-${Date.now()}-${Math.random().toString().substring(2)}`;

    sessions[token] = user.id;

    setTimeout(() => {
      resolve({
        user: { ...user },
        token
      });
    }, 1000);
  });
}

function listUsers(token: string, keyword?: string): Promise<User[]> {
  return new Promise((resolve, reject) => {
    const userId = sessions[token];
    if (!userId) {
      reject(new ApiError('Invalid token.'));
      return;
    }

    const user = users.find((u) => u.id === userId);

    if (!user || user.role === Role.Member) {
      reject(new ApiError('Invalid user role'));
      return;
    }

    if (keyword) {
      resolve(
        users.filter(
          (u) =>
            u.name.toLowerCase().indexOf(keyword) > -1 || u.role.toLowerCase().indexOf(keyword) > -1
        )
      );
      return;
    }

    resolve([...users]);
  });
}

function getUser(token: string, id: number): Promise<DBUser> {
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

    const user = users.find((u) => u.id === id);

    if (user === undefined) {
      reject(new ApiError('User not found'));
      return;
    }

    resolve(user);
  });
}

function updateUser(token: string, data: DBUser): Promise<User> {
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

    const user = users.find((u) => u.id === data.id);

    if (user === undefined) {
      reject(new ApiError('User not found'));
      return;
    }

    user.name = data.name;
    user.role = data.role;
    user.password = data.password;
    user.dateJoined = data.dateJoined;

    resolve(user);
  });
}

function removeUser(token: string, id: number): Promise<void> {
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

    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      reject(new ApiError('User not found'));
      return;
    }

    users.splice(index, 1);

    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

function createUser(token: string, data: Omit<DBUser, 'id'>): Promise<User> {
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

    const user = {
      id: users.length,
      name: data.name,
      role: data.role,
      password: data.password,
      dateJoined: data.dateJoined
    };

    users.push(user);

    resolve(user);
  });
}

export default {
  login,
  listUsers,
  getUser,
  updateUser,
  removeUser,
  createUser
};
