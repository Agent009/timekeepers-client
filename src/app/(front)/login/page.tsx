"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaClock, FaSpinner } from "react-icons/fa";
import { constants, getUrl } from "@lib/index";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    // Validation
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error as string);
      console.error("login -> page -> handleSubmit -> error", res.error);
    }

    if (res?.ok) {
      console.log("login -> page -> handleSubmit -> success -> redirecting to home");
      return router.push("/");
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <FaClock className="text-4xl text-indigo-500 mb-4" />
        <h1 className="mb-5 w-full text-3xl font-bold text-center">Sign In</h1>
        <form className="w-full flex flex-col gap-4" action={handleSubmit}>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <label className="w-full text-sm">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="w-full h-10 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            name="email"
          />
          <label className="w-full text-sm">Password</label>
          <input
            type="password"
            placeholder="Password"
            className="w-full h-10 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            name="password"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-400 transition duration-200"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Sign In"}
          </button>
        </form>
        <Link href={getUrl(constants.routes.register)} className="text-sm text-indigo-600 hover:underline mt-4">
          Don't have an account?
        </Link>
      </div>
    </section>
  );
}
