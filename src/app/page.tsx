import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Zap,
  Shield,
  Search,
  FileCode,
  BarChart3,
  Check,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 sm:py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="max-w-5xl mx-auto text-center relative">
          <Badge variant="secondary" className="mb-6 text-primary border-primary/20">
            AI-Powered Cannabis SEO
          </Badge>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Rank #1 on Google.
            <br />
            <span className="text-primary">Without ads you can&apos;t run.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Generate SEO-optimized, state-compliant landing pages for your
            cannabis dispensary in minutes. LocalBusiness schema, FAQPage
            markup, and conversion-focused copy &mdash; all powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 h-12">
                Start Generating Pages
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="outline" className="text-lg px-8 h-12">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Everything you need to dominate local search
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Purpose-built for cannabis dispensaries. Every page is optimized for
            Google&apos;s local algorithm and compliant with your state&apos;s regulations.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: "Local SEO Optimized",
                desc: "City + state targeting, NAP consistency, and geo-specific content that Google loves.",
              },
              {
                icon: FileCode,
                title: "Schema Markup Built-In",
                desc: "LocalBusiness JSON-LD and FAQPage schema automatically generated for rich snippets.",
              },
              {
                icon: Shield,
                title: "State Compliant",
                desc: "MN, CO, CA, IL, MI compliance rules baked in. No health claims, age gates included.",
              },
              {
                icon: Zap,
                title: "AI-Powered Generation",
                desc: "Claude AI generates unique, high-quality content for every page. No templates.",
              },
              {
                icon: BarChart3,
                title: "5 Page Types",
                desc: "Location pages, strain guides, product categories, blog posts, and deals pages.",
              },
              {
                icon: Leaf,
                title: "Cannabis-Specific",
                desc: "Built by people who understand the industry. Terpene profiles, strain data, deals.",
              },
            ].map((feature) => (
              <Card key={feature.title} className="bg-card border-border">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Three steps to page one
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Enter your details",
                desc: "Dispensary name, city, target keyword, and page type. That's it.",
              },
              {
                step: "2",
                title: "AI generates your page",
                desc: "Claude crafts SEO-optimized, compliant content with schema markup in seconds.",
              },
              {
                step: "3",
                title: "Deploy & rank",
                desc: "Copy the HTML, download, or grab the markdown. Publish and watch your rankings climb.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            Start free. Upgrade when you&apos;re ready to scale.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Starter */}
            <Card className="bg-card border-border relative">
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "10 pages/month",
                    "SEO metadata generation",
                    "JSON-LD schema markup",
                    "HTML & Markdown export",
                    "Email support",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="block mt-6">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="bg-card border-primary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              </div>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Unlimited pages",
                    "SEO metadata generation",
                    "JSON-LD schema markup",
                    "HTML & Markdown export",
                    "Internal linking suggestions",
                    "Multi-dispensary support",
                    "Priority support",
                    "Custom brand voice",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="block mt-6">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-semibold">DispensaryPages.io</span>
          </div>
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} DispensaryPages.io. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
