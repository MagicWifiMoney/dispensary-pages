"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Copy,
  Download,
  Check,
  FileCode,
  Eye,
  Link as LinkIcon,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";

const PAGE_TYPES = [
  { value: "location", label: "Location Page" },
  { value: "strain", label: "Strain Guide" },
  { value: "product-category", label: "Product Category" },
  { value: "blog", label: "Blog Post" },
  { value: "deals", label: "Deals & Promotions" },
];

const STATES = ["MN", "CO", "CA", "IL", "MI"];

export default function GeneratePage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    htmlContent: string;
    seoTitle: string;
    seoMeta: string;
    ogTitle: string;
    ogDescription: string;
    jsonLd: string;
    internalLinks: string[];
  } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const [form, setForm] = useState({
    dispensaryName: "",
    city: "",
    state: "MN",
    keyword: "",
    pageType: "location",
  });

  if (status === "loading") return null;
  if (!session) redirect("/login");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const data = await res.json();
      setResult(data);
      toast.success("Page generated successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadHtml = () => {
    if (!result) return;
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${result.seoTitle}</title>
  <meta name="description" content="${result.seoMeta}">
  <meta property="og:title" content="${result.ogTitle}">
  <meta property="og:description" content="${result.ogDescription}">
  <script src="https://cdn.tailwindcss.com"></script>
  <script type="application/ld+json">${result.jsonLd}</script>
</head>
<body class="bg-gray-900 text-white">
${result.htmlContent}
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.keyword.replace(/\s+/g, "-").toLowerCase()}-${form.city.toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const htmlToMarkdown = (html: string): string => {
    return html
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n")
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n")
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n")
      .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")
      .replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
      .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Page Generator</h1>
        <p className="text-muted-foreground mt-1">
          Generate SEO-optimized, state-compliant pages for your dispensary.
        </p>
      </div>

      <div className="grid lg:grid-cols-[400px_1fr] gap-8">
        {/* Form */}
        <Card className="bg-card border-border h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Page Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <Label htmlFor="dispensaryName">Dispensary Name</Label>
                <Input
                  id="dispensaryName"
                  placeholder="Green Leaf Dispensary"
                  value={form.dispensaryName}
                  onChange={(e) =>
                    setForm({ ...form, dispensaryName: e.target.value })
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Minneapolis"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
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
              </div>

              <div>
                <Label htmlFor="keyword">Target Keyword</Label>
                <Input
                  id="keyword"
                  placeholder="dispensary near me Minneapolis"
                  value={form.keyword}
                  onChange={(e) =>
                    setForm({ ...form, keyword: e.target.value })
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="pageType">Page Type</Label>
                <Select
                  value={form.pageType}
                  onValueChange={(v) => setForm({ ...form, pageType: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_TYPES.map((pt) => (
                      <SelectItem key={pt.value} value={pt.value}>
                        {pt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating with Claude AI...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Page
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Output */}
        <div className="min-w-0">
          {!result && !loading && (
            <div className="flex items-center justify-center h-96 border border-dashed border-border rounded-lg">
              <div className="text-center text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No page generated yet</p>
                <p className="text-sm">
                  Fill out the form and click Generate to create your page.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center h-96 border border-dashed border-border rounded-lg">
              <div className="text-center">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                <p className="text-lg font-medium">
                  Generating your page...
                </p>
                <p className="text-sm text-muted-foreground">
                  Claude AI is crafting SEO-optimized, compliant content.
                </p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* SEO Metadata */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    SEO Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Title Tag</p>
                    <p className="text-sm font-medium text-blue-400">{result.seoTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Meta Description</p>
                    <p className="text-sm text-muted-foreground">{result.seoMeta}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">OG Title</p>
                      <p className="text-sm">{result.ogTitle}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">OG Description</p>
                      <p className="text-sm">{result.ogDescription}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Internal Links */}
              {result.internalLinks && result.internalLinks.length > 0 && (
                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <LinkIcon className="h-5 w-5 text-primary" />
                      Internal Linking Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.internalLinks.map((link, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {link}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Content Tabs */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Generated Content</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(result.htmlContent, "HTML")
                        }
                      >
                        {copied === "HTML" ? (
                          <Check className="h-4 w-4 mr-1" />
                        ) : (
                          <Copy className="h-4 w-4 mr-1" />
                        )}
                        Copy HTML
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(
                            htmlToMarkdown(result.htmlContent),
                            "Markdown"
                          )
                        }
                      >
                        {copied === "Markdown" ? (
                          <Check className="h-4 w-4 mr-1" />
                        ) : (
                          <Copy className="h-4 w-4 mr-1" />
                        )}
                        Copy Markdown
                      </Button>
                      <Button size="sm" variant="outline" onClick={downloadHtml}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <Tabs defaultValue="preview">
                    <TabsList>
                      <TabsTrigger value="preview" className="gap-1">
                        <Eye className="h-4 w-4" /> Preview
                      </TabsTrigger>
                      <TabsTrigger value="html" className="gap-1">
                        <FileCode className="h-4 w-4" /> HTML
                      </TabsTrigger>
                      <TabsTrigger value="jsonld" className="gap-1">
                        <FileCode className="h-4 w-4" /> JSON-LD
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview" className="mt-4">
                      <div
                        className="prose prose-invert max-w-none bg-gray-900 rounded-lg p-6 border border-border overflow-auto max-h-[600px]"
                        dangerouslySetInnerHTML={{
                          __html: result.htmlContent,
                        }}
                      />
                    </TabsContent>
                    <TabsContent value="html" className="mt-4">
                      <pre className="bg-gray-900 rounded-lg p-4 border border-border overflow-auto max-h-[600px] text-xs font-mono">
                        <code>{result.htmlContent}</code>
                      </pre>
                    </TabsContent>
                    <TabsContent value="jsonld" className="mt-4">
                      <pre className="bg-gray-900 rounded-lg p-4 border border-border overflow-auto max-h-[600px] text-xs font-mono">
                        <code>
                          {JSON.stringify(JSON.parse(result.jsonLd || "{}"), null, 2)}
                        </code>
                      </pre>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Zap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
