"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { setToken, getCurrentUser } from "@/lib/auth";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      setErrorMessage(
        error === "access_denied"
          ? "You cancelled the sign-in process."
          : "An error occurred during sign-in. Please try again."
      );
      return;
    }

    if (token) {
      // Save the token
      setToken(token);

      // Verify the token by fetching user info
      getCurrentUser()
        .then((user) => {
          if (user) {
            setStatus("success");
            // Redirect to home after showing success
            setTimeout(() => {
              router.push("/");
            }, 2000);
          } else {
            setStatus("error");
            setErrorMessage("Failed to verify your account. Please try again.");
          }
        })
        .catch(() => {
          setStatus("error");
          setErrorMessage("An error occurred. Please try again.");
        });
    } else {
      // No token provided, redirect to sign in
      router.push("/auth");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center"
      >
        {status === "loading" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-[#E86A24]/10 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#E86A24] animate-spin" />
            </div>
            <h2 className="text-2xl font-serif text-[#1D1D1F] mb-2">
              Signing you in...
            </h2>
            <p className="text-neutral-600">
              Please wait while we complete the authentication.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-serif text-[#1D1D1F] mb-2">
              Welcome to Kairo Studio!
            </h2>
            <p className="text-neutral-600 mb-6">
              You have successfully signed in. Redirecting you to your workspace...
            </p>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-[#E86A24] border-t-transparent rounded-full animate-spin" />
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-serif text-[#1D1D1F] mb-2">
              Sign-in Failed
            </h2>
            <p className="text-neutral-600 mb-6">{errorMessage}</p>
            <button
              onClick={() => router.push("/auth")}
              className="px-6 py-3 bg-[#E86A24] text-white rounded-lg hover:bg-[#D55A1C] transition-colors"
            >
              Try Again
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
          <div className="w-8 h-8 border-4 border-[#E86A24] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
