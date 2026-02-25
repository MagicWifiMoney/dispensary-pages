"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Save, Loader2, Store, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

const STATES = ["MN", "CO", "CA", "IL", "MI"];

const BRAND_VOICES = [
  { value: "professional", label: "Professional & Authoritative" },
  { value: "friendly", label: "Friendly & Approachable" },
  { value: "educational", label: "Educational & Informative" },
  { value: "luxury", label: "Premium & Luxury" },
  { value: "casual", label: "Casual & Conversational" },
];

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "MN",
    zipCode: "",
    phone: "",
    website: "",
    license: "",
    brandVoice: "professional",
  });

  useEffect(() => {
    if (session) {
      fetch("/api/dispensary")
        .then((r) => r.json())
        .then((data) => {
          if (data && data.id) {
            setForm({
              name: data.name || "",
              address: data.address || "",
              city: data.city || "",
              state: data.state || "MN",
              zipCode: data.zipCode || "",
              phone: data.phone || "",
              website: data.website || "",
              license: data.license || "",
              brandVoice: data.brandVoice || "professional",
            });
          }
          setLoading(false);
        });
    }
  }, [session]);

  if (status === "loading") return null;
  if (!session) redirect("/login");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/dispensary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Settings saved!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = async (plan: string) => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to start checkout");
      }
    } catch {
      toast.error("Failed to start checkout");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* Dispensary Details */}
      <Card className="bg-card border-border mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Dispensary Details
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            These details are used when generating pages to ensure accurate
            local SEO and compliance.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="name">Dispensary Name</Label>
              <Input
                id="name"
                placeholder="Green Leaf Dispensary"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                placeholder="123 Main St"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Minneapolis"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select
                  value={form.state}
                  onValueChange={(v) => setForm({ ...form, state: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  placeholder="55401"
                  value={form.zipCode}
                  onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="(612) 555-0123"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://greenleaf.com"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="license">License Number</Label>
              <Input
                id="license"
                placeholder="State cannabis license #"
                value={form.license}
                onChange={(e) => setForm({ ...form, license: e.target.value })}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Required for compliance. Included in generated page content.
              </p>
            </div>

            <Separator />

            <div>
              <Label htmlFor="brandVoice">Brand Voice</Label>
              <Select
                value={form.brandVoice}
                onValueChange={(v) => setForm({ ...form, brandVoice: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRAND_VOICES.map((bv) => (
                    <SelectItem key={bv.value} value={bv.value}>
                      {bv.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Controls the tone and style of generated content.
              </p>
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-medium">Current Plan</p>
                <p className="text-sm text-muted-foreground">Free tier</p>
              </div>
              <Badge variant="secondary">Free</Badge>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border">
                <h3 className="font-semibold">Starter - $49/mo</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  10 pages/month, full SEO features
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={() => handleUpgrade("starter")}
                >
                  Upgrade to Starter
                </Button>
              </div>
              <div className="p-4 rounded-lg border border-primary/50">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Pro - $99/mo</h3>
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    Popular
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Unlimited pages, priority support
                </p>
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() => handleUpgrade("pro")}
                >
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
