"use client";

import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocationStore } from "@/store/location-store";

export function LocationPrompt() {
  const { requestLocation, isLoading, error } = useLocationStore();

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
          {error && (
            <p className="text-sm text-error font-body">{error}</p>
          )}
          <Button
            variant="primary"
            size="lg"
            onClick={requestLocation}
            isLoading={isLoading}
            className="w-full"
          >
            Enable Location
          </Button>
          <p className="text-xs font-body text-ash">
            Your location stays on your device. We never share it.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
