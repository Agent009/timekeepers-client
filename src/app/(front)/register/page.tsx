"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaClock, FaSpinner } from "react-icons/fa";
import { register } from "@lib/actions/register";
import { constants, getUrl } from "@lib/index";

export default function Register() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");

    // Validation
    if (!email || !password || !name) {
      setError("Full Name, Email, and Password are required.");
      return;
    }

    setLoading(true);

    const r = await register({
      email: email,
      password: password,
      name: name,
    });

    setLoading(false);
    ref.current?.reset();

    if (r?.error) {
      setError(r.error);
      console.error("register -> page -> handleSubmit -> error", r.error);
      return;
    } else {
      console.log("register -> page -> handleSubmit -> success -> redirecting to login page");
      return router.push(getUrl(constants.routes.login));
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <FaClock className="text-4xl text-indigo-500 mb-4" />
        <h1 className="mb-5 w-full text-3xl font-bold text-center">Register</h1>
        <form ref={ref} className="w-full flex flex-col gap-4" action={handleSubmit}>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <label className="w-full text-sm">Full Name</label>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full h-10 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            name="name"
          />
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
            {loading ? <FaSpinner className="animate-spin" /> : "Sign up"}
          </button>
        </form>
        <Link href={getUrl(constants.routes.login)} className="text-sm text-indigo-600 hover:underline mt-4">
          Already have an account?
        </Link>
      </div>
    </section>
  );
}
