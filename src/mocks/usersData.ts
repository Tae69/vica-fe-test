import { Role, DBUser } from './types';

const users: DBUser[] = [
  {
    id: 1,
    name: 'admin',
    password: 'testing123',
    role: Role.Admin,
    dateJoined: 1653999977386
  },
  {
    id: 2,
    name: 'editor',
    password: 'editor123',
    role: Role.Editor,
    dateJoined: 1653999977386
  },
  {
    id: 3,
    name: 'member1',
    password: 'testing123',
    role: Role.Member,
    dateJoined: 1653999977386
  },
  {
    id: 4,
    name: 'member2',
    password: 'testing123',
    role: Role.Member,
    dateJoined: 1653999977386
  },
  {
    id: 5,
    name: 'member3',
    password: 'testing123',
    role: Role.Member,
    dateJoined: 1653999977386
  },
  {
    id: 6,
    name: 'member4',
    password: 'testing123',
    role: Role.Member,
    dateJoined: 1653999977386
  },
  {
    id: 7,
    name: 'member5',
    password: 'testing123',
    role: Role.Member,
    dateJoined: 1653999977386
  },
  {
    id: 8,
    name: 'member6',
    password: 'testing123',
    role: Role.Member,
    dateJoined: 1653999977386
  },
  {
    id: 9,
    name: 'member7',
    password: 'testing123',
    role: Role.Member,
    dateJoined: 1653999977386
  },
  {
    id: 10,
    name: 'member8',
    password: 'testing123',
    role: Role.Member,
    dateJoined: 1653999977386
  },
  {
    id: 11,
    name: 'member9',
    password: 'testing123',
    role: Role.Member,
    dateJoined: 1653999977386
  }
];

export default users;