"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "../auth.module.css";

export default function SignIn() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login: doLogin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const err = await doLogin(login, password);
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  const handleDiscordLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      `${window.location.origin}/auth/discord/callback`
    );
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify+email`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign In</h1>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Username or Email
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className={styles.input}
              required
            />
          </label>

          <label className={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </label>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <button
          onClick={handleDiscordLogin}
          className={styles.discordBtn}
          type="button"
        >
          Sign in with Discord
        </button>

        <p className={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
