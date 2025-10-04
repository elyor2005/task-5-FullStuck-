"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import img from "../../../public/assets/blue-geometric-xga6wgj3qndgxdhe.jpg";

const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => <input className={`flex h-10 w-[80%] rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...props} />;

const Button = ({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={`w-[80%] bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 rounded-lg transition-all duration-300 shadow-md ${className}`} {...props}>
    {children}
  </button>
);

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("error") === "unverified") {
      setMessage("⚠️ Your account is not verified. Please check your email.");
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "/admin";
      } else {
        if (data.error === "Please confirm your email first") {
          setMessage("⚠️ Your account is not verified. Please check your email.");
        } else {
          setMessage(`❌ ${data.error || "Invalid credentials"}`);
        }
      }
    } catch (err) {
      setMessage("❌ Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full h-screen bg-white shadow-xl flex overflow-hidden">
        {/* Left side - Image / Branding */}
        <div className="hidden md:flex w-1/2">
          <Image src={img} alt="img" className="w-full h-full object-cover" />
        </div>

        {/* Right side - Login form (as a centered card) */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gray-50">
          <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
            <h1 className="text-3xl font-bold mb-2 text-gray-800 text-center">Welcome back</h1>
            <p className="text-gray-500 mb-6 text-center">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required className="w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Input type={isPasswordVisible ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" required className="w-full pr-10" />
                  <button type="button" className="absolute inset-y-0 right-3 text-gray-500 hover:text-gray-700" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                    {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Logging in..." : "Sign in"}
              </Button>

              {message && <p className="mt-4 text-center text-sm text-red-500 font-medium">{message}</p>}
            </form>
            <p className="text-center text-sm text-gray-600 mt-6">
              Don`t have an account?{" "}
              <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Register
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
