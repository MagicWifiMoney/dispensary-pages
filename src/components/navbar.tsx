"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">DispensaryPages</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {session ? (
              <>
                <Link
                  href="/generate"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Generator
                </Link>
                <Link
                  href="/library"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Library
                </Link>
                <Link
                  href="/settings"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Settings
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  size="sm"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/#pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
                <Link href="/login">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {session ? (
              <>
                <Link href="/generate" className="block py-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Generator</Link>
                <Link href="/library" className="block py-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Library</Link>
                <Link href="/settings" className="block py-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Settings</Link>
                <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })} size="sm" className="w-full justify-start">Sign Out</Button>
              </>
            ) : (
              <>
                <Link href="/#pricing" className="block py-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Pricing</Link>
                <Link href="/login" className="block" onClick={() => setMobileOpen(false)}><Button size="sm" className="w-full">Get Started</Button></Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
