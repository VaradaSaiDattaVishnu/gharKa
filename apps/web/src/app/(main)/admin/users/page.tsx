"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, UserCheck, UserX, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import type { PaginatedResponse, UserResponse } from "@gharka/shared";
import { useQuery } from "@tanstack/react-query";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search],
    queryFn: () =>
      api.get<PaginatedResponse<UserResponse>>("/api/admin/users", {
        search: search || undefined,
        limit: 50,
      }),
    staleTime: 30 * 1000,
  });

  const users = data?.data || [];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
      <Link
        href="/admin"
        className="flex items-center gap-1.5 text-sm font-body text-slate hover:text-charcoal transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <h1 className="font-heading text-2xl font-bold text-charcoal mb-6">
        Manage Users
      </h1>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ash" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-mist bg-white font-body text-sm text-charcoal placeholder:text-ash focus:outline-none focus:ring-2 focus:ring-turmeric/40 focus:border-turmeric transition-all"
            aria-label="Search users"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          title="No users found"
          description={search ? "Try a different search term" : "No users yet"}
        />
      ) : (
        <div className="space-y-2">
          {users.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={user.avatarUrl}
                    name={user.name}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-charcoal text-sm truncate">
                      {user.name || "Unnamed"}
                    </p>
                    <p className="text-xs font-body text-slate">
                      {user.phone}
                    </p>
                  </div>
                  <Badge
                    variant={
                      user.role === "ADMIN"
                        ? "terracotta"
                        : user.role === "SELLER"
                          ? "coriander"
                          : "turmeric"
                    }
                  >
                    {user.role}
                  </Badge>
                  <Badge variant={user.isActive ? "coriander" : "error"}>
                    {user.isActive ? "Active" : "Suspended"}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
