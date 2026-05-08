"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, MessageCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroFallback } from "@/components/three/canvas-wrapper";

const DynamicHeroCanvas = dynamic(
  () =>
    import("@/components/three/canvas-wrapper").then((mod) => ({
      default: mod.HeroCanvas,
    })),
  { ssr: false, loading: () => <HeroFallback /> }
);

const steps = [
  {
    icon: Search,
    title: "Browse",
    description: "Discover homemade food available near you right now.",
    color: "bg-turmeric-light text-turmeric",
  },
  {
    icon: MessageCircle,
    title: "Request",
    description: "Request a dish and chat directly with the cook.",
    color: "bg-coriander-light text-coriander",
  },
  {
    icon: Package,
    title: "Pickup",
    description: "Pick up your fresh meal from your neighbor's door.",
    color: "bg-orange-50 text-terracotta",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 pb-16 lg:pt-20 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center lg:text-left"
            >
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                <span className="text-gradient-warm">
                  Your neighbor&apos;s kitchen,
                </span>
                <br />
                <span className="text-charcoal">one tap away</span>
              </h1>
              <p className="mt-6 text-lg font-body text-slate max-w-lg mx-auto lg:mx-0">
                Discover homemade food made by cooks in your community.
                Fresh, authentic, and just around the corner.
              </p>
              <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start flex-wrap">
                <Link href="/feed">
                  <Button variant="primary" size="lg">
                    Browse Food Near You
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/sell">
                  <Button variant="outline" size="lg">
                    Start Selling
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-[300px] sm:h-[400px] lg:h-[450px]"
            >
              <DynamicHeroCanvas className="h-full w-full" />
            </motion.div>
          </div>
        </div>

        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cloud to-transparent" />
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal">
              How it works
            </h2>
            <p className="mt-3 text-slate font-body">
              Three simple steps to enjoy homemade food
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.15,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${step.color} mb-4`}
                >
                  <step.icon className="h-8 w-8" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-charcoal text-white text-xs font-bold">
                    {i + 1}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-charcoal">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm font-body text-slate">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gradient-to-b from-white to-cloud">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center space-y-6">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal">
              GharKa connects neighbors.
              <br />
              <span className="font-handwritten text-4xl text-turmeric">
                That&apos;s it.
              </span>
            </h2>
            <p className="text-slate font-body max-w-xl mx-auto">
              We don&apos;t process payments, we don&apos;t take commissions, and we
              don&apos;t guarantee quality. We simply help you discover the
              amazing cooks living in your community and let you connect
              directly.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-8">
              {[
                { label: "Communities", value: "50+" },
                { label: "Home Cooks", value: "500+" },
                { label: "Meals Shared", value: "10K+" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <p className="font-heading text-3xl font-bold text-turmeric">
                    {stat.value}
                  </p>
                  <p className="text-sm font-body text-slate mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
