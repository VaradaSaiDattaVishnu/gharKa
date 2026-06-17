"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LogOut,
  Settings,
  ShoppingBag,
  ChefHat,
  Shield,
  Info,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingPot } from "@/components/shared/loading-pot";
import { useAuthStore } from "@/store/auth-store";
import { useMe } from "@/hooks/use-auth";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const me = useMe();

  // Pull the freshest user from the server into the store. This also self-heals
  // a missing or corrupted stored user (e.g. from the earlier onboard bug that
  // wrote the wrong shape), so the navbar and the rest of the app recover too.
  useEffect(() => {
    if (me.data?.data) {
      setUser(me.data.data);
    }
  }, [me.data, setUser]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Prefer the server copy when available; fall back to whatever is stored.
  const currentUser = me.data?.data ?? user;

  // Never render a blank page: show a loader while fetching, or a recoverable
  // message if the profile genuinely can't be loaded.
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        {me.isLoading ? (
          <LoadingPot size="lg" />
        ) : (
          <>
            <p className="font-body text-slate">
              We couldn&apos;t load your profile. Please log in again.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              Go to login
            </Button>
          </>
        )}
      </div>
    );
  }

  const isAdmin = currentUser.role === "ADMIN";

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Profile Card */}
        <Card className="overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-turmeric to-terracotta" />
          <CardContent className="-mt-10 flex flex-col items-center text-center pb-6">
            <Avatar
              src={currentUser.avatarUrl}
              name={currentUser.name}
              size="xl"
              blob
              className="border-4 border-white shadow-md"
            />
            <h2 className="font-heading text-xl font-bold text-charcoal mt-3">
              {currentUser.name || "GharKa User"}
            </h2>
            <p className="text-sm font-body text-slate">{currentUser.phone}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant={
                  currentUser.role === "SELLER"
                    ? "coriander"
                    : currentUser.role === "ADMIN"
                      ? "terracotta"
                      : "turmeric"
                }
              >
                {currentUser.role === "SELLER" && (
                  <ChefHat className="h-3 w-3 mr-1" />
                )}
                {currentUser.role === "BUYER" && (
                  <ShoppingBag className="h-3 w-3 mr-1" />
                )}
                {currentUser.role === "ADMIN" && (
                  <Shield className="h-3 w-3 mr-1" />
                )}
                {currentUser.role}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-1.5">
          <MenuItem
            icon={Settings}
            label="Settings"
            href="/profile"
          />
          {isAdmin && (
            <MenuItem
              icon={Shield}
              label="Admin Dashboard"
              href="/admin"
            />
          )}
          <MenuItem icon={Info} label="About GharKa" href="/" />
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl bg-cloud/80 p-4 text-center">
          <p className="text-xs font-body text-slate leading-relaxed">
            GharKa connects neighbors who cook with those who want to eat.
            We don&apos;t process payments, guarantee food quality, or handle
            disputes. All transactions happen directly between users.
          </p>
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          size="lg"
          className="w-full text-error hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Log out
        </Button>
      </motion.div>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  href,
}: {
  icon: typeof Settings;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white border border-mist/30 hover:bg-cloud/50 transition-colors"
    >
      <Icon className="h-5 w-5 text-slate" />
      <span className="font-body text-sm font-medium text-charcoal">
        {label}
      </span>
    </Link>
  );
}
