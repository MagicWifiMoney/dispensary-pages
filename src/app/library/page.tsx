"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  FileCode,
  Eye,
  Copy,
  Download,
  Trash2,
  Check,
  Library,
  Plus,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

interface PageData {
  id: string;
  title: string;
  pageType: string;
  keyword: string;
  city: string;
  state: string;
  htmlContent: string;
  seoTitle: string;
  seoMeta: string;
  ogTitle: string;
  ogDescription: string;
  jsonLd: string;
  internalLinks: string;
  createdAt: string;
}

const PAGE_TYPE_LABELS: Record<string, string> = {
  location: "Location",
  strain: "Strain",
  "product-category": "Product Category",
  blog: "Blog",
  deals: "Deals",
};

export default function LibraryPage() {
  const { data: session, status } = useSession();
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PageData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (session) {
      fetch("/api/pages")
        .then((r) => r.json())
        .then((data) => {
          setPages(data);
          setLoading(false);
        });
    }
  }, [session]);

  if (status === "loading") return null;
  if (!session) redirect("/login");

  const deletePage = async (id: string) => {
    if (!confirm("Delete this page?")) return;
    await fetch(`/api/pages/${id}`, { method: "DELETE" });
    setPages(pages.filter((p) => p.id !== id));
    setSelected(null);
    toast.success("Page deleted");
  };

  const copyHtml = async (html: string) => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    toast.success("HTML copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPage = (page: PageData) => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${page.seoTitle}</title>
<meta name="description" content="${page.seoMeta}">
<script src="https://cdn.tailwindcss.com"></script>
<script type="application/ld+json">${page.jsonLd}</script>
</head>
<body class="bg-gray-900 text-white">
${page.htmlContent}
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${page.keyword.replace(/\s+/g, "-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Page Library</h1>
          <p className="text-muted-foreground mt-1">
            All your generated pages in one place.
          </p>
        </div>
        <Link href="/generate">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Generate New
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">
          Loading...
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-20">
          <Library className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-lg font-medium">No pages yet</p>
          <p className="text-muted-foreground text-sm mb-4">
            Generate your first SEO page to see it here.
          </p>
          <Link href="/generate">
            <Button>Generate Your First Page</Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Card
              key={page.id}
              className="bg-card border-border cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setSelected(page)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {PAGE_TYPE_LABELS[page.pageType] || page.pageType}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePage(page.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-base leading-tight mt-2">
                  {page.seoTitle || page.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" />
                  {page.city}, {page.state}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {page.seoMeta}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(page.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.seoTitle || selected.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">
                    {PAGE_TYPE_LABELS[selected.pageType] || selected.pageType}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {selected.city}, {selected.state}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    &middot; {selected.keyword}
                  </span>
                </div>
              </DialogHeader>

              <div className="flex gap-2 my-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyHtml(selected.htmlContent)}
                >
                  {copied ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  Copy HTML
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadPage(selected)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => deletePage(selected.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>

              <Separator />

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
                    className="prose prose-invert max-w-none bg-gray-900 rounded-lg p-6 border border-border overflow-auto max-h-[400px]"
                    dangerouslySetInnerHTML={{
                      __html: selected.htmlContent,
                    }}
                  />
                </TabsContent>
                <TabsContent value="html" className="mt-4">
                  <pre className="bg-gray-900 rounded-lg p-4 border border-border overflow-auto max-h-[400px] text-xs font-mono">
                    <code>{selected.htmlContent}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="jsonld" className="mt-4">
                  <pre className="bg-gray-900 rounded-lg p-4 border border-border overflow-auto max-h-[400px] text-xs font-mono">
                    <code>
                      {(() => {
                        try {
                          return JSON.stringify(
                            JSON.parse(selected.jsonLd || "{}"),
                            null,
                            2
                          );
                        } catch {
                          return selected.jsonLd || "{}";
                        }
                      })()}
                    </code>
                  </pre>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
