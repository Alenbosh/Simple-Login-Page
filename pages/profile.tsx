import React from 'react';
import Link from 'next/link';
import { GetServerSideProps} from 'next';
import { parse } from 'cookie';
import { verifyToken } from '../lib/auth'


type Props = {
  user:{id:string; email:string};
};

export default function Profile({user}:Props){
  return(
    <main style={{padding:90}}>
      <h1>Profile</h1>
      <p>Welcome, <strong>{user.email}</strong></p>
      <p>
        <Link href="/">Home</Link> . <a href="/api/auth/logout">Logout</a>
      </p>
    </main>
  );
}

export const getServerSideProps:GetServerSideProps= async({req})=>{
  const cookieHeader = req.headers.cookie || '';
  const cookies = parse(cookieHeader || '');
  const token = cookies.token;
  if(!token){
    return{
      redirect:{ destination: '/login', permanent:false}
    };
  }
  const payload = verifyToken(token);
  if(!payload){
    return{
      redirect:{destination:'/login',permanent:false}
    };
  }
  return {props:{user: {id:payload.id, email:payload.email}}};
};







