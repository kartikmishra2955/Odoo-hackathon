// src/components/Login.jsx
import { useState } from "react";
import { login, registerEmployee } from "../api/auth";

const BrandMark = () => (
  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-[#2E5FCC]">
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M4 7L12 3L20 7V17L12 21L4 17V7Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4 7L12 11L20 7M12 11V21" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  </div>
);

function FloatTag({ label, className, dotClass = "bg-stable" }) {
  return (
    <div
      className={`absolute flex items-center gap-1.5 rounded-lg border border-border bg-panel-2 px-2.5 py-1.5 font-mono text-[10.5px] font-semibold text-ink-dim ${className}`}
    >
      <span className={`h-[5px] w-[5px] rounded-full ${dotClass}`} />
      {label}
    </div>
  );
}

export default function Login({ onAuthenticated }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await login({
        email: loginForm.email,
        password: loginForm.password,
      });
      onAuthenticated?.(data.user);
    } catch (err) {
      setError(err.message || "Sign in failed. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError(null);

    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (signupForm.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const data = await registerEmployee({
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
      });
      onAuthenticated?.(data.user);
    } catch (err) {
      setError(err.message || "Couldn't create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-bg font-sans text-ink">
      {/* Left: brand / atmosphere panel */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden border-r border-border-soft bg-panel p-11 md:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(#1F2530 1px, transparent 1px), linear-gradient(90deg, #1F2530 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(circle at 30% 30%, black, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle at 30% 30%, black, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 15% 20%, rgba(76,140,255,.16), transparent 45%), radial-gradient(circle at 85% 80%, rgba(76,140,255,.10), transparent 40%)",
          }}
        />

        <FloatTag label="AF-0114 · Verified" className="right-[14%] top-[22%]" dotClass="bg-stable" />
        <FloatTag label="Room B2 · Booked" className="right-[28%] top-[38%]" dotClass="bg-accent" />
        <FloatTag label="CAM-1104 · Overdue" className="right-[8%] top-[52%]" dotClass="bg-accent" />

        <div className="relative z-10 flex items-center gap-2.5">
          <BrandMark />
          <div>
            <div className="font-display text-[17px] font-semibold">AssetFlow</div>
            <div className="text-[10.5px] uppercase tracking-wide text-ink-faint">Management</div>
          </div>
        </div>

        <div className="relative z-10 mt-auto">
          <h1 className="max-w-[420px] font-display text-[32px] font-semibold leading-tight tracking-tight">
            Know where <span className="text-accent">everything</span> is, before someone has to ask.
          </h1>
          <p className="mt-3.5 max-w-[380px] text-[13.5px] leading-relaxed text-ink-dim">
            Centralized tracking, allocation, and maintenance for every asset your organization
            owns — with a risk index that tells you what needs attention first.
          </p>
          <div className="mt-9 flex gap-7">
            {[
              ["142", "Assets tracked"],
              ["96%", "On-time returns"],
              ["18", "Active bookings"],
            ].map(([num, label]) => (
              <div key={label}>
                <div className="font-mono text-[19px] font-semibold text-accent">{num}</div>
                <div className="mt-0.5 text-[10.5px] text-ink-faint">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="flex w-full flex-shrink-0 items-center justify-center p-10 md:w-[460px]">
        <div className="w-full max-w-[340px]">
          <div className="mb-6 flex rounded-[9px] border border-border-soft bg-panel-2 p-[3px]">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`flex-1 rounded-[7px] py-2 text-[12.5px] font-semibold transition-colors ${
                mode === "login" ? "bg-accent text-white" : "text-ink-faint"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
              className={`flex-1 rounded-[7px] py-2 text-[12.5px] font-semibold transition-colors ${
                mode === "signup" ? "bg-accent text-white" : "text-ink-faint"
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-critical/25 bg-critical-soft px-3 py-2.5 text-[12px] text-critical">
              {error}
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin}>
              <h2 className="font-display text-[22px] font-semibold">Welcome back</h2>
              <p className="mb-6 mt-1.5 text-[13px] text-ink-dim">Sign in to your AssetFlow account</p>

              <Field
                label="Email"
                type="email"
                placeholder="you@company.com"
                value={loginForm.email}
                onChange={(v) => setLoginForm((f) => ({ ...f, email: v }))}
                required
              />
              <Field
                label="Password"
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(v) => setLoginForm((f) => ({ ...f, password: v }))}
                required
              />

              <div className="mb-5 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-[12px] text-ink-dim">
                  <input type="checkbox" className="accent-accent" />
                  Remember me
                </label>
                <span className="cursor-pointer text-[12px] font-semibold text-accent">Forgot password?</span>
              </div>

              <SubmitButton loading={loading}>Sign In</SubmitButton>

              <Divider>new to assetflow</Divider>
              <p className="text-center text-[12.5px] text-ink-dim">
                Don't have an account?{" "}
                <b
                  className="cursor-pointer font-semibold text-accent"
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </b>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <h2 className="font-display text-[22px] font-semibold">Create your account</h2>
              <p className="mb-6 mt-1.5 text-[13px] text-ink-dim">
                Get access as an employee — admins assign roles later
              </p>

              <div className="mb-4.5 mb-[18px] flex gap-2.5 rounded-[9px] border border-accent/25 bg-accent-soft px-3 py-2.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0">
                  <path d="M12 9V13M12 16.5H12.01" stroke="#8FB4FF" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="9" stroke="#8FB4FF" strokeWidth="1.6" />
                </svg>
                <p className="text-[11.5px] leading-relaxed text-[#B7CDFF]">
                  New accounts are created as <b>Employee</b>. Department Head and Asset Manager
                  roles are assigned later by an Admin from the Employee Directory.
                </p>
              </div>

              <Field
                label="Full name"
                type="text"
                placeholder="Jordan Miller"
                value={signupForm.name}
                onChange={(v) => setSignupForm((f) => ({ ...f, name: v }))}
                required
              />
              <Field
                label="Work email"
                type="email"
                placeholder="you@company.com"
                value={signupForm.email}
                onChange={(v) => setSignupForm((f) => ({ ...f, email: v }))}
                required
              />
              <Field
                label="Password"
                type="password"
                placeholder="Minimum 8 characters"
                value={signupForm.password}
                onChange={(v) => setSignupForm((f) => ({ ...f, password: v }))}
                required
              />
              <Field
                label="Confirm password"
                type="password"
                placeholder="Re-enter password"
                value={signupForm.confirmPassword}
                onChange={(v) => setSignupForm((f) => ({ ...f, confirmPassword: v }))}
                required
              />

              <SubmitButton loading={loading}>Create Employee Account</SubmitButton>

              <Divider>already registered</Divider>
              <p className="text-center text-[12.5px] text-ink-dim">
                Have an account?{" "}
                <b
                  className="cursor-pointer font-semibold text-accent"
                  onClick={() => setMode("login")}
                >
                  Sign in
                </b>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, type, placeholder, value, onChange, required }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-[11.5px] font-semibold text-ink-dim">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-panel-2 px-3 py-2.5 text-[13.5px] text-ink outline-none transition-shadow placeholder:text-ink-faint focus:border-accent focus:shadow-[0_0_0_3px_rgba(76,140,255,.13)]"
      />
    </div>
  );
}

function SubmitButton({ children, loading }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-[9px] bg-accent py-3 text-[13.5px] font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,.15)_inset,0_8px_20px_-8px_rgba(76,140,255,.6)] transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

function Divider({ children }) {
  return (
    <div className="my-5.5 my-[22px] flex items-center gap-3 text-[11px] text-ink-faint">
      <span className="h-px flex-1 bg-border-soft" />
      {children}
      <span className="h-px flex-1 bg-border-soft" />
    </div>
  );
}
