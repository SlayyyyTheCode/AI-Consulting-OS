"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Card, Button, Field, Spinner, inputClass } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
    };
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Registration failed.");
      setLoading(false);
      return;
    }
    // Auto sign-in after registration.
    await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card>
      <h1 className="mb-4 text-lg font-semibold">Create account</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label="Full name" htmlFor="name">
          <input id="name" name="name" required autoComplete="name" className={inputClass} />
        </Field>
        <Field label="Email" htmlFor="email">
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </Field>
        <Field label="Password" htmlFor="password" helper="Minimum 8 characters">
          <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
        </Field>
        {error && (
          <p role="alert" className="rounded-md bg-error-soft px-3 py-2 text-sm text-error">
            {error}
          </p>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner /> : "Create account"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-text-secondary">
        Have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
