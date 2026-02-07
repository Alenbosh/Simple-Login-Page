import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default function handler(_req: NextApiRequest, res:
  NextApiResponse
) {
  const isProd = process.env.NODE_ENV === 'production';
  res.setHeader('set-Cookie', serialize('token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
    secure: isProd,
  }));
  res.writeHead(302,{ Location:'/login'});
    res.end();
}
