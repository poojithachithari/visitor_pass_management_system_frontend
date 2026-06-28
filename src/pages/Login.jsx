import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authLogin } from "../services/api";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authLogin({ email, password });
      login(response.data.user, response.data.token);
      if (response.data.user.role === "admin") navigate("/admin/dashboard");
      else if (response.data.user.role === "security") navigate("/security/dashboard");
      else if (response.data.user.role === "employee") navigate("/employee/dashboard");
      else if (response.data.user.role === "visitor") navigate("/visitor/dashboard");
      else navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-8">
      <div className="text-center mt-[-60px]">
        <h1 className="text-3xl font-bold text-blue-700 mb-1">Visitor Management System</h1>
        <p className="text-gray-500 text-sm">Secure access for all roles</p>
      </div>

      <div className="w-full max-w-md">
        {/* Tab label */}
        <div>
          <span className="inline-block bg-white border border-b-0 border-gray-200 rounded-t-lg px-4 py-2 text-sm font-medium text-gray-600">
            Login Account
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-b-xl rounded-tr-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                name="email"
                value={email}
                placeholder="name@company.com"
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Login →
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;