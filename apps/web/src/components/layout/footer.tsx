"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-mist bg-cloud/50 mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col items-center text-center gap-4">
          <Link href="/">
            <span className="font-heading text-xl font-bold text-turmeric">
              GharKa
            </span>
          </Link>

          <p className="text-sm font-body text-slate max-w-md">
            GharKa connects neighbors. We don&apos;t handle payments or
            guarantee food quality. All transactions are directly between
            buyers and sellers.
          </p>

          <p className="font-handwritten text-lg text-turmeric-dark">
            Made with love in your community
          </p>

          <div className="flex items-center gap-6 text-xs font-body text-ash">
            <Link href="#" className="hover:text-charcoal transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-charcoal transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-charcoal transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
