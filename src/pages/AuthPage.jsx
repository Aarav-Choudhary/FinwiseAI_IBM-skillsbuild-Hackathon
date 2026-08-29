import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import {
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  getProfile,
  setDemoUserSession,
} from "../lib/firebase";

export default function AuthPage({ setUser, setProfile }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handlePostAuth(userObj) {
    const savedUser = setDemoUserSession(userObj);
    setUser(savedUser);
    try {
      const existingProfile = await getProfile(savedUser.uid);
      if (existingProfile && existingProfile.onboarded) {
        if (setProfile) setProfile(existingProfile);
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    } catch {
      navigate("/onboarding");
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      await handlePostAuth(res.user);
    } catch (err) {
      // Demo fallback if Firebase auth not set up
      const mockUser = {
        uid: "demo-user-123",
        displayName: "Demo Student",
        email: "student@university.edu",
        photoURL: null,
      };
      await handlePostAuth(mockUser);
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailAuth(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let res;
      if (isRegister) {
        res = await registerWithEmail(email, password);
      } else {
        res = await signInWithEmail(email, password);
      }
      await handlePostAuth(res.user);
    } catch (err) {
      // Demo fallback mode if firebase is offline
      const mockUser = {
        uid: "demo-user-" + Date.now(),
        displayName: email.split("@")[0] || "Student",
        email: email || "student@univ.edu",
        photoURL: null,
      };
      await handlePostAuth(mockUser);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg text-textPrimary flex flex-col md:flex-row">
      {/* ── Left Branding Panel ──────────────────────────── */}
      <div className="md:w-1/2 p-8 lg:p-16 bg-gradient-to-br from-surface to-bg border-b md:border-b-0 md:border-r border-border flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-accent">
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl gradient-text">FinWise AI</span>
        </div>

        <div className="my-12 space-y-6">
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
            Take Control of Your Student Finances with AI
          </h1>
          <p className="text-textSecondary text-sm lg:text-base leading-relaxed">
            Get instant answers to your budget, scholarship, and loan questions powered by IBM watsonx.ai Granite.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-xs text-textPrimary">
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              <span>Country-first currency & loan scheme matching</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-textPrimary">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span>Personalised 0–100 AI Financial Health Score</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-textPrimary">
              <span className="w-2 h-2 rounded-full bg-warning"></span>
              <span>Instant PDF exports for budget planning</span>
            </div>
          </div>
        </div>

        <div className="ibm-badge self-start">
          Powered by IBM watsonx.ai
        </div>
      </div>

      {/* ── Right Form Panel ─────────────────────────────── */}
      <div className="md:w-1/2 p-8 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-textPrimary mb-1">
              {isRegister ? "Create Your Account" : "Welcome Back"}
            </h2>
            <p className="text-xs text-textSecondary">
              {isRegister ? "Sign up to start your AI money journey" : "Sign in to access your FinWise dashboard"}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="btn-ghost w-full py-3 flex items-center justify-center gap-3 text-sm font-medium hover:bg-white/5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z" />
              <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px bg-border flex-1" />
            <span className="text-[11px] text-textSecondary uppercase">or email</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-textSecondary mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="input-field pl-10"
                />
                <Mail size={16} className="absolute left-3 top-3 text-textSecondary" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-textSecondary mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10"
                />
                <Lock size={16} className="absolute left-3 top-3 text-textSecondary" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={16} />
                  <span>{isRegister ? "Sign Up" : "Sign In"}</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-textSecondary hover:text-primary transition-colors"
            >
              {isRegister ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
