import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center px-10 py-6 shadow-sm">
      
      {/* Logo */}
      <Link href="/">
        <h1 className="text-2xl font-extrabold text-blue-600 cursor-pointer">
          IndioCart
        </h1>
      </Link>

      {/* Right side buttons */}
      <div className="flex gap-4">
        <Link href="/login">
          <button className="px-5 py-2 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50">
            Login
          </button>
        </Link>

        <Link href="/register">
          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Register
          </button>
        </Link>
      </div>

    </nav>
  );
}