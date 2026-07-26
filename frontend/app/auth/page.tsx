"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Lock, User, Eye, EyeOff, ArrowLeft,
  ShieldCheck
} from "lucide-react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { insforge } from "@/lib/insforge";

function GoogleRealAuthButton({ onSuccessLogin, isLoading, setIsLoading, setError }: {
  onSuccessLogin: (user: { name: string; email: string; avatar?: string; provider: string }) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  setError: (val: string | null) => void;
}) {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch userinfo from Google.");
        const data = await res.json();
        if (data && data.email) {
          const userObj = {
            name: data.name || data.given_name || data.email.split("@")[0],
            email: data.email,
            avatar: data.picture,
            provider: "Google"
          };

          // Sync user record to InsForge Database
          try {
            await insforge.database.from("users").upsert([
              {
                email: userObj.email,
                name: userObj.name,
                avatar: userObj.avatar,
                provider: "Google"
              }
            ]);
          } catch (dbErr) {
            console.warn("Sync to InsForge DB failed or table structure pending:", dbErr);
          }

          onSuccessLogin(userObj);
        } else {
          setError("Gagal mengambil profil akun Google.");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Google userinfo fetch error:", err);
        setError("Terjadi kesalahan saat mengambil data profil Google asli.");
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error("Google Login Error:", errorResponse);
      if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        setError("PENTING: Client ID belum dipasang! Silakan buat Google OAuth Client ID di Google Cloud Console dan masukkan ke file frontend/.env.local pada variabel NEXT_PUBLIC_GOOGLE_CLIENT_ID agar login akun Google asli bisa digunakan.");
      } else {
        setError("Autentikasi Google gagal atau dibatalkan oleh pengguna.");
      }
    },
  });

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={() => {
        if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
          setError("Catatan: NEXT_PUBLIC_GOOGLE_CLIENT_ID belum diisi di .env.local. Membuka jendela OAuth Google...");
        }
        login();
      }}
      className="w-full bg-white hover:bg-neutral-50 text-neutral-700 font-medium py-2.5 px-4 rounded-xl text-sm border border-neutral-200/80 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-3 shadow-xs cursor-pointer disabled:opacity-70"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
        <path fill="#34A853" d="M12 24c3.31 0 6.09-1.09 8.12-2.96l-3.88-3.05c-1.1.74-2.51 1.18-4.24 1.18-3.26 0-6.02-2.2-7-5.17H1.01v3.15C3.06 21.2 7.25 24 12 24Z" />
        <path fill="#FBBC05" d="M5 13.01c-.25-.74-.39-1.54-.39-2.35s.14-1.61.39-2.35V5.16H1.01C.37 6.43 0 7.89 0 9.42s.37 2.99 1.01 4.26L5 13.01Z" />
        <path fill="#EA4335" d="M12 4.75c1.8 0 3.42.62 4.69 1.83l3.52-3.52C18.08 1.12 15.3 0 12 0 7.25 0 3.06 2.8 1.01 6.84L5 9.99c.98-2.97 3.74-5.24 7-5.24Z" />
      </svg>
      <span>Continue with Google</span>
    </button>
  );
}

function AuthFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [showGithubModal, setShowGithubModal] = useState(false);
  const [githubAuthLoading, setGithubAuthLoading] = useState(false);

  useEffect(() => {
    const paramMode = searchParams.get("mode");
    if (paramMode === "signup" || paramMode === "signin") {
      setMode(paramMode);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      const mockUser = {
        name: fullName || email.split("@")[0] || "Researcher",
        email: email || "researcher@kairo.studio",
        provider: "email"
      };
      localStorage.setItem("kairo_user", JSON.stringify(mockUser));
      router.push("/");
    }, 800);
  };

  const handleSocialAuth = (provider: string) => {
    if (provider === "GitHub") {
      setShowGithubModal(true);
    }
  };

  const handleAuthorizeGithub = () => {
    setGithubAuthLoading(true);
    setTimeout(() => {
      const mockUser = {
        name: "alex-rivera-dev",
        email: "alex.rivera@github.dev",
        provider: "GitHub"
      };
      localStorage.setItem("kairo_user", JSON.stringify(mockUser));
      router.push("/");
    }, 700);
  };


  return (
    <div className="min-h-[100dvh] grid grid-cols-1 lg:grid-cols-2 bg-warm-white text-primary selection:bg-[#E86A24]/20 selection:text-[#E86A24] font-sans">
      
      {/* Left Column: Brand Story & Illustration (Warm Cream Background #fef6ee) */}
      <div className="bg-[#fef6ee] border-b lg:border-b-0 lg:border-r border-neutral-200/60 flex flex-col justify-between relative overflow-hidden h-full">
        
        {/* Top Brand & Editorial Copy */}
        <div className="relative z-20 max-w-xl p-8 sm:p-12 lg:p-16 pb-0 sm:pb-0 lg:pb-0">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <img 
              src="/kairo-logo.svg" 
              alt="Kairo Studio Logo" 
              className="h-8 sm:h-9 w-auto transition-transform duration-200 group-hover:scale-[1.02]" 
            />
          </Link>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#1D1D1F] leading-[1.18] tracking-tight mt-10 sm:mt-14">
            AI-Native Research Operating System
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed mt-4 max-w-md">
            Discover papers. Understand deeply. Synthesize knowledge. Advance science.
          </p>
        </div>

        {/* Bottom Asset Illustration (/kairo-auth.png) - Fixed edge-to-edge fill with seamless blending */}
        <div className="relative z-10 flex-1 w-full min-h-[360px] sm:min-h-[440px] lg:min-h-[500px] mt-8 sm:mt-12 overflow-hidden flex items-end justify-center pointer-events-none select-none">
          {/* Top blending gradient so image merges into #fef6ee background seamlessly */}
          <div className="absolute top-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-b from-[#fef6ee] via-[#fef6ee]/80 to-transparent z-10 pointer-events-none" />
          
          {/* Side blending gradients to eliminate any sharp edges on ultra-wide screens */}
          <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-[#fef6ee] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-[#fef6ee] to-transparent z-10 pointer-events-none" />
          
          <img 
            src="/kairo-auth.png" 
            alt="Kairo Studio AI Research Environment" 
            className="w-full h-full object-cover object-bottom drop-shadow-[0_20px_40px_rgba(232,106,36,0.08)] scale-[1.02] transition-transform duration-700 hover:scale-[1.04]" 
          />
        </div>

        {/* Subtle decorative glow in background */}
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-gradient-to-br from-[#E86A24]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-0"></div>
      </div>

      {/* Right Column: Authentication Card & Form */}
      <div className="bg-white lg:bg-[#FAF9F6]/40 flex flex-col justify-between items-center p-6 sm:p-12 lg:p-16 relative min-h-[500px]">
        
        {/* Top Right Back Link */}
        <div className="w-full flex justify-end">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors duration-200 bg-white/80 hover:bg-white border border-neutral-200/80 rounded-full px-3.5 py-1.5 shadow-xs active:scale-[0.98]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Center Card Container */}
        <div className="w-full max-w-[420px] my-auto py-8 sm:py-4">
          <div className="bg-white rounded-[24px] sm:rounded-[28px] shadow-[0_12px_45px_rgba(0,0,0,0.04)] border border-neutral-200/70 p-7 sm:p-10 relative overflow-hidden transition-all duration-300">
            
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              >
                {/* Header */}
                <div className="mb-6">
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1D1D1F] tracking-tight">
                    {mode === "signin" ? "Welcome back" : "Create account"}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                    {mode === "signin" 
                      ? "Sign in to continue your research journey." 
                      : "Start your AI-native research journey today."}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Full Name Field (Signup only) */}
                  {mode === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <label className="text-xs font-medium text-neutral-700 mb-1.5 block">
                        Full Name
                      </label>
                      <div className="relative flex items-center">
                        <User className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full bg-neutral-50/60 focus:bg-white border border-neutral-200/80 focus:border-[#E86A24] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-3 focus:ring-[#E86A24]/10 transition-all duration-200"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Email Field */}
                  <div>
                    <label className="text-xs font-medium text-neutral-700 mb-1.5 block">
                      Email address
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full bg-neutral-50/60 focus:bg-white border border-neutral-200/80 focus:border-[#E86A24] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-3 focus:ring-[#E86A24]/10 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="text-xs font-medium text-neutral-700 mb-1.5 block">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={mode === "signin" ? "Enter your password" : "Min. 8 characters"}
                        className="w-full bg-neutral-50/60 focus:bg-white border border-neutral-200/80 focus:border-[#E86A24] rounded-xl pl-10 pr-10 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-3 focus:ring-[#E86A24]/10 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-neutral-400 hover:text-neutral-600 focus:outline-none p-0.5 transition-colors"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Forgot Password Link */}
                    {mode === "signin" && (
                      <div className="flex justify-end mt-1.5">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            alert("Password reset instructions have been sent to your email!");
                          }}
                          className="text-xs font-medium text-[#E86A24] hover:underline transition-colors"
                        >
                          Forgot password?
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Submit CTA Button (Emil Kowalski responsive press active:scale-[0.98]) */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 bg-[#E86A24] hover:bg-[#d55e1c] text-white font-medium py-3 px-4 rounded-xl text-sm transition-all duration-200 shadow-[0_3px_12px_rgba(232,106,36,0.22)] hover:shadow-[0_5px_18px_rgba(232,106,36,0.32)] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span>{mode === "signin" ? "Sign in" : "Create account"}</span>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6 gap-3">
                  <div className="h-px bg-neutral-200/70 flex-1"></div>
                  <span className="text-xs text-neutral-400 font-medium tracking-wide">
                    or continue with
                  </span>
                  <div className="h-px bg-neutral-200/70 flex-1"></div>
                </div>

                {/* OAuth Social Buttons */}
                <div className="space-y-2.5">
                  <GoogleRealAuthButton
                    onSuccessLogin={(user) => {
                      localStorage.setItem("kairo_user", JSON.stringify(user));
                      router.push("/");
                    }}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setError={setError}
                  />

                  <button
                    type="button"
                    onClick={() => handleSocialAuth("GitHub")}
                    className="w-full bg-white hover:bg-neutral-50 text-neutral-700 font-medium py-2.5 px-4 rounded-xl text-sm border border-neutral-200/80 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-3 shadow-xs"
                  >
                    <svg className="w-4 h-4 fill-current text-neutral-900" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>Continue with GitHub</span>
                  </button>
                </div>

                {/* Footer Switcher Inside Card */}
                <div className="text-xs text-neutral-500 text-center mt-7">
                  {mode === "signin" ? (
                    <>
                      <span>Don&apos;t have an account?</span>
                      <button
                        type="button"
                        onClick={() => {
                          setMode("signup");
                          setError(null);
                        }}
                        className="font-medium text-[#E86A24] hover:underline ml-1 transition-colors"
                      >
                        Create account
                      </button>
                    </>
                  ) : (
                    <>
                      <span>Already have an account?</span>
                      <button
                        type="button"
                        onClick={() => {
                          setMode("signin");
                          setError(null);
                        }}
                        className="font-medium text-[#E86A24] hover:underline ml-1 transition-colors"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>



            {/* GitHub Authorize Modal */}
            <AnimatePresence>
              {showGithubModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 font-sans"
                  onClick={() => !githubAuthLoading && setShowGithubModal(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                    className="bg-neutral-900 text-white rounded-2xl shadow-2xl border border-neutral-800 max-w-[400px] w-full overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6 text-center border-b border-neutral-800">
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-white text-neutral-900 flex items-center justify-center font-bold text-lg shadow-md">
                          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                          </svg>
                        </div>
                        <div className="text-neutral-500 font-medium text-lg">✕</div>
                        <img src="/kairo-logo.svg" alt="Kairo Studio" className="h-8 w-auto bg-white p-1 rounded-md" />
                      </div>
                      <h3 className="text-lg font-semibold">Authorize Kairo Studio</h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        Kairo Studio wants to access your GitHub account <span className="text-[#E86A24] font-mono font-medium">alex-rivera-dev</span>.
                      </p>
                    </div>

                    <div className="p-6 bg-neutral-950/50 space-y-4">
                      <div className="text-xs text-neutral-300 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>Read access to profile and email address</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>Access to academic & research repositories</span>
                        </div>
                      </div>

                      <div className="pt-2 flex gap-3">
                        <button
                          type="button"
                          disabled={githubAuthLoading}
                          onClick={() => setShowGithubModal(false)}
                          className="w-1/3 py-2.5 px-4 rounded-xl text-xs font-medium border border-neutral-700 hover:bg-neutral-800 transition-colors text-neutral-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={githubAuthLoading}
                          onClick={handleAuthorizeGithub}
                          className="flex-1 bg-[#238636] hover:bg-[#2ea043] text-white font-medium py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                          {githubAuthLoading ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <span>Authorize kairo-studio</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Bottom Security Badge & Legal Disclaimer (Outside Card) */}
        <div className="w-full text-center max-w-xs mx-auto space-y-1.5 mt-auto pt-4">
          <div className="text-xs text-neutral-400 flex items-center justify-center gap-1.5 font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>Your data is secure and encrypted.</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="#" className="text-[#E86A24] hover:underline font-medium">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#E86A24] hover:underline font-medium">
              Privacy Policy
            </a>.
          </p>
        </div>

      </div>

    </div>
  );
}

export default function AuthPage() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "demo-client-id.apps.googleusercontent.com";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Suspense fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-warm-white">
          <div className="w-6 h-6 border-2 border-[#E86A24]/30 border-t-[#E86A24] rounded-full animate-spin" />
        </div>
      }>
        <AuthFormContent />
      </Suspense>
    </GoogleOAuthProvider>
  );
}

