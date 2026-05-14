import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Lock, ArrowRight } from "@phosphor-icons/react";
import { useAuth } from "../lib/auth";
import { formatApiErrorDetail } from "../lib/api";

export default function AdminLogin() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect (effect avoids setState-during-render warning)
  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back.");
      navigate("/admin");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <Link to="/" className="flex flex-col items-center gap-3" data-testid="login-brand">
          <img
            src="/logo.png"
            alt="Asphaltiq"
            className="h-20 w-20 object-contain"
          />
          <span className="brand-wordmark text-2xl text-white">
            ASPHALT<span className="text-yellow-400">IQ</span>
          </span>
        </Link>
        <div className="overline text-center mt-8">Admin Access</div>
        <h1 className="heading-display text-4xl text-white font-bold text-center mt-2">Sign in</h1>

        <form onSubmit={onSubmit} className="mt-12 bg-zinc-950 border border-white/10 p-8 space-y-6" data-testid="admin-login-form">
          <div>
            <label htmlFor="l-email" className="field-label">Email</label>
            <input
              id="l-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
              autoComplete="email"
              data-testid="login-input-email"
            />
          </div>
          <div>
            <label htmlFor="l-password" className="field-label">Password</label>
            <input
              id="l-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-input"
              autoComplete="current-password"
              data-testid="login-input-password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full justify-center disabled:opacity-60"
            data-testid="login-submit-btn"
          >
            <Lock size={16} weight="bold" />
            {submitting ? "Signing in…" : "Sign In"}
            {!submitting && <ArrowRight size={16} weight="bold" />}
          </button>
        </form>

        <Link to="/" className="block mt-8 text-center text-xs text-zinc-500 hover:text-zinc-300 tracking-wider uppercase" data-testid="login-back-link">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
