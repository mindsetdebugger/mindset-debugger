"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Check,
  Brain,
  Sparkles,
  LineChart,
  Target,
  BarChart3,
  Activity,
  Quote,
} from "lucide-react";

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [navSolid, setNavSolid] = useState(false);

  // typing effect state
  const fullInsight =
    "Detected a procrastination-with-rationalization loop. Emotional tone: anxiety + guilt. You are self-aware enough to change — you just need momentum-building micro-steps.";
  const [typedInsight, setTypedInsight] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      setNavSolid(window.scrollY > 30);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // typing effect
  useEffect(() => {
    let i = 0;
    setTypedInsight("");
    const interval = setInterval(() => {
      i++;
      setTypedInsight(fullInsight.slice(0, i));
      if (i >= fullInsight.length) {
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [fullInsight]);

  // parallax helper
  const slow = (multiplier: number) => ({
    transform: `translateY(${scrollY * multiplier}px)`,
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-indigo-50 to-blue-100 text-gray-900">

      {/* =============================== */}
      {/*         STICKY NAVBAR           */}
      {/* =============================== */}
      <header
        className={`
          fixed top-0 left-0 w-full z-50 transition-all backdrop-blur-xl
          ${navSolid ? "bg-white/80 shadow-sm py-3" : "bg-transparent py-5"}
        `}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`font-bold tracking-tight text-indigo-700 transition-all ${
              navSolid ? "text-lg" : "text-xl"
            }`}
          >
            Mindset Debugger
          </Link>

          {/* Menu */}
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
            <a href="#features" className="hover:text-indigo-700 transition">
              Features
            </a>
            <a href="#demo" className="hover:text-indigo-700 transition">
              AI Demo
            </a>
            <a href="#testimonials" className="hover:text-indigo-700 transition">
              Stories
            </a>
            <a href="#pricing" className="hover:text-indigo-700 transition">
              Pricing
            </a>
          </nav>

          {/* CTA */}
          <Link href="/auth">
            <Button
              className={`bg-indigo-600 hover:bg-indigo-700 transition-all ${
                navSolid ? "px-4 py-2 text-sm" : "px-5 py-2.5 text-sm"
              }`}
            >
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* =============================== */}
      {/* HERO + PARALLAX BACKGROUND      */}
      {/* =============================== */}
      <section className="relative overflow-hidden pt-40 pb-32 px-6 text-center">

        {/* BLOBS – PARALLAX */}
        <div className="pointer-events-none absolute inset-0">
          <div
            style={slow(0.05)}
            className="absolute top-[-140px] left-[8%] w-[380px] h-[380px] bg-indigo-300 opacity-40 blur-3xl rounded-full"
          />
          <div
            style={slow(0.12)}
            className="absolute bottom-[-180px] right-[5%] w-[520px] h-[520px] bg-purple-300 opacity-35 blur-3xl rounded-full"
          />
          <div
            style={slow(0.08)}
            className="absolute top-[40%] left-[-120px] w-[260px] h-[260px] bg-sky-200 opacity-40 blur-3xl rounded-full"
          />
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 max-w-3xl mx-auto">
          <div
            style={slow(0.02)}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-indigo-100 shadow-sm mb-6"
          >
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="text-xs font-medium text-gray-700">
              AI-powered mindset analytics · Early access
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Understand your mind.
            <span className="text-indigo-700"> Upgrade your mindset.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 mt-6 leading-relaxed">
            Mindset Debugger turns what you write into emotional insights,
            pattern detection, and clear guidance — like a mental performance
            coach powered by AI.
          </p>

          <p className="text-sm text-gray-500 mt-3">
            Not just journaling. Not therapy. A cognitive mirror for your inner code.
          </p>

          <div
            style={slow(0.04)}
            className="mt-10 flex justify-center gap-4 flex-wrap"
          >
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-300 transition-transform hover:-translate-y-0.5"
              >
                Start 7-Day Free Trial →
              </Button>
            </Link>

            <a href="#pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-indigo-600 text-indigo-700 hover:bg-indigo-50 transition-transform hover:-translate-y-0.5"
              >
                See Pricing
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* =============================== */}
      {/* STORYTELLING SECTION            */}
      {/* =============================== */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold">
          What if you could see the mental loops running in the background?
        </h2>

        <p className="text-gray-700 text-lg leading-relaxed">
          Most people don&apos;t fail because they&apos;re lazy or unmotivated.
          They get stuck in invisible loops — emotional patterns, limiting
          beliefs, and hidden rules about what they think is possible.
        </p>

        <p className="text-gray-700 text-lg leading-relaxed">
          Mindset Debugger is an <strong>AI cognitive engine</strong> that reads your
          thoughts on the screen and reveals what&apos;s underneath them: recurring
          themes, emotional signatures, and belief structures that keep you in place.
        </p>

        <p className="text-gray-700 text-lg leading-relaxed">
          When you see your pattern clearly, it stops being destiny.  
          It becomes something you can work with.
        </p>
      </section>

      {/* =============================== */}
      {/* 3D FLIP CARDS                   */}
      {/* =============================== */}
      <section id="features" className="py-24 px-6 bg-white/70 border-y border-indigo-100">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-12">
          What Mindset Debugger Does
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              frontTitle: "Emotional Analysis",
              frontDesc: "AI reads tone, intensity, and emotional shifts in your writing.",
              backTitle: "Your emotional fingerprint",
              backDesc:
                "See when you’re driven by fear, shame, guilt, pressure, or genuine excitement — and how that shapes your decisions.",
              Icon: Brain,
            },
            {
              frontTitle: "Pattern Detection",
              frontDesc: "Spot recurring loops and thinking patterns you fall back into.",
              backTitle: "Break your loops",
              backDesc:
                "Procrastination, overthinking, burnout cycles — understand not just that they happen, but how and why.",
              Icon: LineChart,
            },
            {
              frontTitle: "AI-Guided Roadmap",
              frontDesc: "Get concrete, personalized next steps based on your patterns.",
              backTitle: "From insight to action",
              backDesc:
                "Turn self-awareness into daily moves that shift your behavior, not just your thoughts.",
              Icon: Target,
            },
          ].map(({ frontTitle, frontDesc, backTitle, backDesc, Icon }) => (
            <div key={frontTitle} className="group [perspective:1200px]">
              <div
                className="
                  relative h-72 w-full rounded-2xl shadow-xl border border-indigo-100 
                  bg-gradient-to-br from-white to-indigo-50 transition-transform duration-700 
                  [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]
                "
              >
                {/* FRONT */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between [backface-visibility:hidden]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-indigo-100">
                      <Icon className="h-6 w-6 text-indigo-700" />
                    </div>
                    <h3 className="text-lg font-semibold">{frontTitle}</h3>
                  </div>
                  <p className="text-gray-700 text-sm mt-4">{frontDesc}</p>
                  <p className="text-xs text-gray-400 mt-4">Hover to flip →</p>
                </div>

                {/* BACK */}
                <div className="absolute inset-0 p-6 rounded-2xl bg-indigo-900 text-indigo-50 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{backTitle}</h3>
                    <p className="mt-3 text-sm text-indigo-100">{backDesc}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-indigo-200">
                    <Activity className="h-4 w-4" />
                    <span>Runs silently while you just write.</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =============================== */}
      {/* AI DEMO + TYPING EFFECT         */}
      {/* =============================== */}
      <section id="demo" className="py-24 px-6">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-10">
          Example: How AI interprets your writing
        </h2>

        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          <div className="p-6 bg-white rounded-xl shadow-lg border border-indigo-100">
            <h3 className="font-semibold text-indigo-700 mb-3">Your entry</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              “I feel like I’m stuck. Every time I try to start something important,
              I convince myself I&apos;m not ready. I tell myself I need more time,
              more research, more clarity. Meanwhile, days go by and I feel worse
              for not moving.”
            </p>
          </div>

          <div className="p-6 bg-indigo-900 rounded-xl shadow-lg border border-indigo-700 text-indigo-50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-200" />
              AI Insight (live preview)
            </h3>
            <p className="text-xs uppercase tracking-wide text-indigo-200 mb-2">
              Mindset Debugger interpretation
            </p>
            <p className="text-sm leading-relaxed font-mono text-indigo-50 min-h-[120px]">
              {typedInsight}
              <span className="inline-block w-1 h-4 bg-indigo-200 align-baseline animate-pulse ml-0.5" />
            </p>
            <p className="text-xs text-indigo-200 mt-4">
              This is an example. In the app, the insight is fully tailored to your patterns.
            </p>
          </div>
        </div>
      </section>

      {/* =============================== */}
      {/* TESTIMONIALS                    */}
      {/* =============================== */}
      <section
        id="testimonials"
        className="py-24 px-6 bg-indigo-950 text-indigo-50"
      >
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-4">
          Stories from early users
        </h2>
        <p className="text-center text-indigo-200 max-w-2xl mx-auto mb-12 text-sm">
          Testimonials are anonymized and paraphrased to protect privacy, but the
          patterns are real.
        </p>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              role: "Senior developer",
              quote:
                "I knew I procrastinated, but the app helped me see the exact emotional pattern behind it. That changed how I approach work.",
              tag: "Procrastination loop",
            },
            {
              role: "Freelancer & parent",
              quote:
                "I kept burning out every few months. Mindset Debugger showed me how much of my drive came from fear, not intention.",
              tag: "Burnout cycles",
            },
            {
              role: "Early-stage founder",
              quote:
                "It felt like a mirror I didn’t know I needed. The weekly summaries helped me actually see my inner progress.",
              tag: "Inner tracking",
            },
          ].map(({ role, quote, tag }) => (
            <div
              key={role}
              className="p-6 rounded-2xl bg-indigo-900/70 border border-indigo-700/70 shadow-md"
            >
              <Quote className="h-6 w-6 text-indigo-300 mb-3" />
              <p className="text-sm leading-relaxed mb-4 text-indigo-50">
                {quote}
              </p>
              <p className="text-xs text-indigo-200 font-medium">{role}</p>
              <p className="text-[11px] text-indigo-300 mt-1 italic">
                Focus: {tag}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =============================== */}
      {/* FEATURE GRID                    */}
      {/* =============================== */}
      <section className="py-24 px-6 bg-indigo-50/50">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-12">
          What you get with Mindset Debugger
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            [
              "Daily AI mood tracking",
              "See how your emotional profile shifts day by day based on your writing.",
            ],
            [
              "Belief mapping",
              "Identify invisible beliefs that drive your reactions and decisions.",
            ],
            [
              "Trigger detection",
              "Spot situations, topics, or people that repeatedly activate the same reaction.",
            ],
            [
              "Goal alignment",
              "See how aligned your daily actions are with what you say you want.",
            ],
            [
              "Weekly clarity report",
              "A clear summary of themes, emotional patterns, progress, and blocks.",
            ],
            [
              "Personal growth roadmap",
              "AI-generated steps to shift your mindset from where you are to where you want to be.",
            ],
          ].map(([title, desc]) => (
            <div
              key={title as string}
              className="p-7 rounded-2xl bg-white shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <BarChart3 className="h-7 w-7 text-indigo-700" />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =============================== */}
      {/* PRICING                         */}
      {/* =============================== */}
      <section
        id="pricing"
        className="py-24 px-6 bg-white border-t border-indigo-200"
      >
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-10">
          Simple pricing. No hidden tricks.
        </h2>

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Start with a 7-day free trial — no credit card required.
          If you feel real progress, upgrade to Pro and keep debugging your inner code.
        </p>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
          {/* FREE */}
          <div className="p-10 rounded-2xl bg-indigo-50 border border-indigo-200 shadow">
            <h3 className="text-2xl font-bold">Free Trial</h3>
            <p className="text-gray-600 mt-1 mb-4">7 days of full access.</p>

            <p className="text-4xl font-bold">0 €</p>
            <p className="text-sm text-gray-500 mb-6">no card required</p>

            <ul className="space-y-2 text-gray-700 text-sm">
              <li>
                <Check className="inline h-4 w-4 text-indigo-700" /> All features unlocked
              </li>
              <li>
                <Check className="inline h-4 w-4 text-indigo-700" /> Full AI analysis
              </li>
              <li>
                <Check className="inline h-4 w-4 text-indigo-700" /> Weekly summary report
              </li>
            </ul>

            <Link href="/auth">
              <Button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700">
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* PRO */}
          <div className="p-10 rounded-2xl bg-indigo-900 text-indigo-50 shadow-xl border border-indigo-700 scale-[1.02]">
            <h3 className="text-2xl font-bold">Pro</h3>
            <p className="text-indigo-200 mt-1 mb-4">
              For deep, long-term inner transformation.
            </p>

            <p className="text-4xl font-bold">11.99 €</p>
            <p className="text-sm text-indigo-200 mb-6">per month</p>

            <ul className="space-y-2 text-sm">
              <li>
                <Check className="inline h-4 w-4 text-indigo-300" /> Unlimited entries
              </li>
              <li>
                <Check className="inline h-4 w-4 text-indigo-300" /> Advanced pattern analysis
              </li>
              <li>
                <Check className="inline h-4 w-4 text-indigo-300" /> Long-term trends & charts
              </li>
              <li>
                <Check className="inline h-4 w-4 text-indigo-300" /> Weekly AI coaching summary
              </li>
              <li>
                <Check className="inline h-4 w-4 text-indigo-300" /> Priority new features
              </li>
            </ul>

            <Link href="/auth">
              <Button className="w-full mt-8 bg-white text-indigo-900 hover:bg-indigo-100">
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} Mindset Debugger — Understand your code. Upgrade your mind.
      </footer>
    </div>
  );
}
