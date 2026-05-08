"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, UtensilsCrossed, ShoppingBag, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    label: "Total Users",
    value: "--",
    icon: Users,
    color: "text-coriander bg-coriander-light",
  },
  {
    label: "Active Listings",
    value: "--",
    icon: UtensilsCrossed,
    color: "text-turmeric bg-turmeric-light",
  },
  {
    label: "Orders Today",
    value: "--",
    icon: ShoppingBag,
    color: "text-terracotta bg-orange-50",
  },
  {
    label: "Growth",
    value: "--",
    icon: TrendingUp,
    color: "text-info bg-blue-50",
  },
];

const links = [
  { label: "Manage Users", href: "/admin/users", icon: Users },
  {
    label: "Manage Listings",
    href: "/admin/listings",
    icon: UtensilsCrossed,
  },
];

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
      <h1 className="font-heading text-2xl font-bold text-charcoal mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="flex flex-col items-center text-center py-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color} mb-2`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="font-heading text-2xl font-bold text-charcoal">
                  {stat.value}
                </p>
                <p className="text-xs font-body text-slate">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <h2 className="font-heading text-lg font-bold text-charcoal mb-4">
        Quick Links
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card hover>
              <CardContent className="flex items-center gap-4 py-5">
                <link.icon className="h-8 w-8 text-turmeric" />
                <span className="font-heading font-bold text-charcoal">
                  {link.label}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
