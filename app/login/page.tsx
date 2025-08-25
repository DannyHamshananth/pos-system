"use client";
import { signIn } from "next-auth/react";

// Centered Google-only login component
// - Fully responsive, centered both vertically & horizontally
// - Minimal UI: one Google button


export default function Login() {

    const handleClick = async () => {
        signIn("google", {callbackUrl: '/'});
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
            <div className="w-full">
                <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/70 dark:bg-gray-900/60 backdrop-blur shadow-xl p-6 sm:p-8">
                    <button
                        type="button"
                        aria-label="Sign in with Google"
                        onClick={handleClick}
                        className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm sm:text-base font-medium shadow-sm hover:shadow-md active:scale-[.99] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {/* Google G logo (SVG) */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            className="h-5 w-5"
                            aria-hidden="true"
                        >
                            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.65 4.657-6.07 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C33.642 6.053 29.084 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.651-.389-3.917z"></path>
                            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.818C14.655 16.108 18.961 12 24 12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C33.642 6.053 29.084 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"></path>
                            <path fill="#4CAF50" d="M24 44c5.159 0 9.86-1.977 13.409-5.197l-6.191-5.238C29.211 35.091 26.715 36 24 36c-5.2 0-9.598-3.317-11.264-7.946l-6.53 5.027C9.517 39.556 16.227 44 24 44z"></path>
                            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.02 12.02 0 01-4.095 5.565l.003-.002 6.191 5.238C36.97 39.251 44 34 44 24c0-1.341-.138-2.651-.389-3.917z"></path>
                        </svg>
                        <span>Continue with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
}