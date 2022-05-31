import { ApiError, User } from "./types";
import users from "./usersData"

type LoginResponse = {
  user: User
  token: string
}

// sessions that maps token to user id
const sessions: { [key: string]: number } = {};

function login(username: string, password: string): Promise<LoginResponse> {
  return new Promise((resolve, reject) => {
    const user = users.find(u => {
      return u.name === username && u.password === password;
    });

    if (!user) {
      setTimeout(() => {
        reject(new ApiError('User not found.'));
      }, 1000);

      return;
    }

    const token: string = user.id + '-' + Date.now() + '-' + Math.random().toString().substring(2);

    sessions[token] = user.id;

    setTimeout(() => {
      resolve({
        user,
        token
      });
    }, 1000)
  });
}

export default {
  login
}