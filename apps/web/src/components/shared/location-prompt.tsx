"use client";

import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocationStore } from "@/store/location-store";

export function LocationPrompt() {
  const { requestLocation, geocodeAndSet, isLoading, error } =
    useLocationStore();
  const [query, setQuery] = useState("");

  const handleManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) geocodeAndSet(query);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-sm px-4"
    >
      <Card>
        <CardContent className="flex flex-col items-center text-center py-8 space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-turmeric-light">
            <MapPin className="h-8 w-8 text-turmeric" />
          </div>
          <h3 className="font-heading text-xl font-bold text-charcoal">
            Where are you?
          </h3>
          <p className="text-sm font-body text-slate">
            We need your location to show food available near you. We only use
            it to match you with nearby cooks in your community.
          </p>
          {error && <p className="text-sm text-error font-body">{error}</p>}
          <Button
            variant="primary"
            size="lg"
            onClick={requestLocation}
            isLoading={isLoading}
            className="w-full"
          >
            Enable Location
          </Button>

          <div className="flex items-center gap-2 w-full">
            <span className="h-px flex-1 bg-mist" />
            <span className="text-xs font-body text-ash">
              or enter it manually
            </span>
            <span className="h-px flex-1 bg-mist" />
          </div>

          <form onSubmit={handleManual} className="flex w-full gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Area, city or pincode"
              className="h-12 flex-1 rounded-xl border border-mist bg-cloud px-3 text-sm font-body text-charcoal focus:outline-none focus:ring-2 focus:ring-turmeric/40 focus:border-turmeric transition-all"
              aria-label="Enter your area, city, or pincode"
            />
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              isLoading={isLoading}
              disabled={!query.trim()}
              aria-label="Search location"
              className="px-4"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>

          <p className="text-xs font-body text-ash">
            Your location stays on your device. We never share it.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
