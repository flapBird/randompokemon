import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/content/JsonLd";
import { publishedArticles } from "@/data/blog";
import { articleBodies } from "@/data/blog-content";
import { articleSchema, breadcrumbSchema, organizationSchema } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return publishedArticles.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = publishedArticles.find((entry) => entry.slug === slug);
  if (!article) return {};
  return { title: article.title, description: article.description, alternates: { canonical: `/blog/${slug}` }, openGraph: { type: "article", title: article.title, description: article.description, url: `/blog/${slug}`, publishedTime: article.date } };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = publishedArticles.find((entry) => entry.slug === slug);
  const body = article ? articleBodies[article.slug] : undefined;
  if (!article || !body) notFound();
  const path = `/blog/${article.slug}`;
  const dateLabel = new Date(`${article.date}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  return (
    <>
      <JsonLd data={[organizationSchema(), articleSchema({ title: article.title, path, description: article.description, datePublished: article.date }), breadcrumbSchema([["Home", "/"], ["Blog", "/blog"], [article.title, path]])]} />
      <article className="guide-article">
        <nav className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/blog">Blog</Link><span>/</span><span>{article.title}</span></nav>
        <header>
          <span className="eyebrow">TOOL GUIDE · {article.readTime.toUpperCase()}</span>
          <h1>{article.title}</h1>
          <p>{article.description}</p>
          <time dateTime={article.date}>Updated {dateLabel}</time>
        </header>
        {body}
      </article>
    </>
  );
}
