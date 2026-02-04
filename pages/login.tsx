import React, { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await fetch("api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data?.message || "Error");
      return;
    }
    router.push("/profile");
  }
  return(
    <main style={{padding:20}}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email
            <br />
            <input value={email} onChange={e=> setEmail(e.target.value)} type="email" required />
          </label>
        </div>
        <div>
          <label>
            Password
            <br />
            <input  value={password} onChange={e=> setPassword(e.target.value)}  type="password" required />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    {err && <p style={{color:'red'}}>{err}</p>}
    </main>
  );
}
