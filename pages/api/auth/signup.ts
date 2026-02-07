import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser, signToken } from '../../../lib/auth';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method not Allowed');
  }
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
  try {
    const user = await createUser({ email, password });
    const token = signToken({ id: user.id, email: user.email });

    const isProd = process.env.NODE_ENV === 'production';
    res.setHeader('Set-Cookie', serialize('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60,
      sameSite: 'lax',
      secure: isProd
    }));
    return res.status(201).json({ ok: true });
  } catch (err: any) {
    return res.status(400).json({ message: err?.message || 'Error creating user' });
  }
}

