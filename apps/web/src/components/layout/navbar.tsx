"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const bgOpacity = useTransform(scrollY, [0, 100], [0.7, 0.95]);
  const height = useTransform(scrollY, [0, 100], [72, 60]);

  useEffect(() => {
    const handleClick = () => setMenuOpen(false);
    if (menuOpen) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [menuOpen]);

  return (
    <motion.header
      style={{ height }}
      className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b border-mist/50"
    >
      <motion.div
        className="absolute inset-0 bg-white"
        style={{ opacity: bgOpacity }}
      />
      <nav className="relative mx-auto max-w-6xl h-full flex items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span
            className="font-heading text-2xl font-extrabold text-turmeric"
            aria-label="GharKa home"
          >
            GharKa
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-mist/50 transition-colors"
                aria-expanded={menuOpen}
                aria-haspopup="true"
                aria-label="User menu"
              >
                <Avatar src={user.avatarUrl} name={user.name} size="sm" />
                <span className="hidden sm:block text-sm font-body font-medium text-charcoal max-w-[120px] truncate">
                  {user.name || "User"}
                </span>
                <ChevronDown className="h-4 w-4 text-slate" />
              </button>

              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white shadow-lg border border-mist/50 py-1 overflow-hidden"
                  role="menu"
                >
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-charcoal hover:bg-cloud transition-colors"
                    role="menuitem"
                  >
                    <User className="h-4 w-4 text-slate" />
                    Profile
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-charcoal hover:bg-cloud transition-colors"
                    role="menuitem"
                  >
                    <Settings className="h-4 w-4 text-slate" />
                    Settings
                  </Link>
                  <hr className="my-1 border-mist" />
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-body text-error hover:bg-red-50 transition-colors"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm">
                Log in
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
