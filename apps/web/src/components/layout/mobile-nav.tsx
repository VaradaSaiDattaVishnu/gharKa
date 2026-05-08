"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ShoppingBag, MessageCircle, UserCircle } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/feed", label: "Home", icon: Home },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export function MobileNav() {
  const pathname = usePathname();
  const { mobileNavVisible, setMobileNavVisible } = useUIStore();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current + 10) {
        setMobileNavVisible(false);
      } else if (currentY < lastScrollY.current - 10) {
        setMobileNavVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setMobileNavVisible]);

  return (
    <AnimatePresence>
      {mobileNavVisible && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/90 backdrop-blur-md border-t border-mist/50 pb-safe"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-around px-2 py-1">
            {tabs.map((tab) => {
              const isActive =
                pathname === tab.href || pathname.startsWith(tab.href + "/");
              const Icon = tab.icon;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-colors min-w-[60px]",
                    isActive ? "text-turmeric" : "text-ash"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className="relative">
                    <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                    {isActive && (
                      <motion.div
                        layoutId="mobile-nav-indicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-4 rounded-full bg-turmeric"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </div>
                  <span className="text-[10px] font-body font-medium mt-1">
                    {tab.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
