import Link from 'next/link';
import React from 'react';

export default function Home (){
  return (
    <main style={{padding:20}}>
      <h1>Next.js + TypeScript Simple Auth </h1>
      <p>
        <Link href="/signup"> Sign up </Link> . <Link href="/login">Login</Link>
        <Link href="/profile">Profile(protected)</Link>
      </p>
    </main>
  );
}
