import type { NextApiRequest, NextApiResponse} from 'next';
import {verifyUser,signToken} from '../../../lib/auth';
import {serialize} from 'cookie';


export default async function handler(req: NextApiRequest, res:NextApiResponse){
  if(req.method !== 'POST'){
    res.setHeader('Allow','POST');
    return res.status(405).end('Method Not Allowed');
  }
  const {email,password}=req.body || {};
  if(!email || !password) return res.status(400).json({message:'Missing fields'});

  const user= await verifyUser({email, password});
  if(!user) return res.status(401).json({message:'Invalid credentials'});

  const token = signToken({id:user.id,email:user.email});
  const isProd = process.env.NODE_ENV === 'production';
  res.setHeader('set-Cookie',serialize('token',token,{
    httpOnly:true,
    path: '/',
    maxAge:60*60,
    sameSite:'lax',
    secure:isProd
  }));
  res.status(200).json({ok:true});
}
