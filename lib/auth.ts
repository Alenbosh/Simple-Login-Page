import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export type User = {
  id: string;
  email: string;
  password: string; //Hashed in storage
};

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const JWT_SECRET = (process.env.JWT_SECRET || 'dev_secret') as jwt.Secret;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? '1h') as jwt.SignOptions["expiresIn"];

async function ensureUsersFile() {
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
    await fs.writeFile(USERS_FILE, '[]', 'utf8');
  }
}

async function readUsers(): Promise<User[]> {
  await ensureUsersFile();
  const raw = await fs.readFile(USERS_FILE, 'utf8');
  try {
    const parsed = JSON.parse(raw || '[]') as User[];
    return parsed;
  } catch {
    return [];
  }
}

async function writeUsers(users: User[]) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}


export async function createUser({ email, password }: { email: string; password: string }) {
  const users = await readUsers();
  if (users.find(u => u.email === email)) {
    throw new Error('User already exits')
  }
  const hashed = await bcrypt.hash(password, 10);
  const user: User = { id: Date.now().toString(), email, password: hashed };
  users.push(user);
  await writeUsers(users);
  return { id: user.id, email: user.email };
}

export async function verifyUser({ email, password }: { email: string; password: string }) {
  const users = await readUsers();
  const user = users.find(u => u.email === email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  return { id: user.id, email: user.email };
}

export function signToken(payload: { id: string; email: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; iat: number; exp?: number };
    return decoded;
  } catch {
    return null;
  }
}

// 1
//Problem:

// Fixed "could not find a declarartion for module jsonwebtoken ".

// Missed type declaration for jsonwebtoken
//That refelected that @/types/jsonwebtoken was not installed properly, so the
// compiler treated jwt as any and type erros were noisy

// FIX:

// install the community types:
// npm install --savce-dev @Types/jsonwebtoken

// 2
//problem

// i accidnetly used { expireIn: JWT_EXPIRES_IN }. Typescript
// flagged that expireIn is not a property of signOptions and
// that made the call match a different overload,


//FIX:
// The correct option name is expiresIn


//TypeScript didn’t trust the type of expiresIn.
//Issue: jwt.sign has overloaded signatures. TypeScript expected the secret argument to be of type
// Because jwt.sign() has multiple versions (overloads), like:

//Is expiresIn valid here or not?”

// Because the type of your JWT_EXPIRES_IN variable was too vague.
//But jsonwebtoken doesn’t accept just any string.

// It wants a specific type like:

// "1d"

// "2h"

// 60 (number in seconds)
// (payload, secret, options)

// (payload, secret, callback)
// (payload, null, options)

// etc.

// Since your type didn’t match version #1 properly, TypeScript tried version #2…

// And suddenly it thought your { expiresIn: ... } object was a callback function.

// That’s why it said:

// 'expiresIn' does not exist in type 'SignCallback'

// Which makes zero sense at first glance.

//Fix: TypeScript didn’t trust the type of expiresIn.
