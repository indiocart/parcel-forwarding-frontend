'use client';

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="w-full flex justify-between items-center px-10 py-6 shadow-sm">
      
      {/* Logo */}
      <button onClick={() => router.push('/')} className="cursor-pointer">
        <h1 className="text-2xl font-extrabold text-blue-600">
          IndioCart
        </h1>
      </button>

      {/* Right side buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push('/login')}
          className="px-5 py-2 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50 transition"
        >
          Login
        </button>

        <button
          onClick={() => router.push('/register')}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </button>
      </div>

    </nav>
  );
}