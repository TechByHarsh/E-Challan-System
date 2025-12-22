import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Signup() {
  const { signUp, googleSignIn, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Note: Redirect for logged-in users is handled by PublicRoute component in App.jsx

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setLocalError(null);
    try {
      await signUp(email, password);
      // Redirect will happen automatically via PublicRoute when user state updates
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    setLocalError(null);
    try {
      await googleSignIn();
      // Redirect will happen automatically via PublicRoute when user state updates
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };


  // 🔥 Signup Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Create an account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-2 text-sm text-gray-700">
            <span>Email</span>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </label>

          <label className="block space-y-2 text-sm text-gray-700">
            <span>Password</span>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 6 characters"
            />
          </label>

          <button
            className="w-full rounded-lg bg-blue-600 text-white font-semibold py-3 hover:bg-blue-700 transition disabled:opacity-50"
            type="submit"
            disabled={loading || submitting}
          >
            {submitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-500">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          className="w-full rounded-lg border border-gray-200 py-3 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || submitting}
        >
          Continue with Google
        </button>

        {(error || localError) && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error?.message || localError}
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
