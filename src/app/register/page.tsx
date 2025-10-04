"use client";
import { motion } from "framer-motion";
import img from "../../../public/assets/blue-geometric-xga6wgj3qndgxdhe.jpg";
import { useState } from "react";
import Image from "next/image";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Registered successfully! Check your email to verify.");
      } else {
        setMessage(`❌ ${data.error || "Something went wrong"}`);
      }
    } catch (err) {
      setMessage("❌ Network error");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full h-screen bg-white shadow-xl flex overflow-hidden">
        {/* Left side - Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gray-50">
          <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
            <h1 className="text-3xl font-bold mb-2 text-gray-800 text-center">Create Account</h1>
            <p className="text-gray-500 mb-6 text-center">Register to get started</p>

            <form onSubmit={handleSubmit} className="space-y-5 text-black">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" placeholder="Your email" value={form.email} onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" name="password" placeholder="Choose a password" value={form.password} onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium">
                Register
              </button>

              {message && <p className="mt-4 text-center text-sm text-red-500 font-medium">{message}</p>}
            </form>

            {/* Extra links */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </a>
            </p>
          </div>
        </div>

        {/* Right side - Register form as card */}
        <div className="hidden md:flex w-1/2">
          <Image src={img} alt="img" className="w-full h-full object-cover" />
        </div>
      </motion.div>
    </main>
  );
}
