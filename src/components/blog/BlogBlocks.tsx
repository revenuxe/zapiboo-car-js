import { Link } from "@tanstack/react-router";
import { ArrowRight, Info, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Block } from "@/lib/blog";

export function BlogBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="text-[17px] leading-8 text-foreground/85">{block.text}</p>;
    case "h2":
      return (
        <h2
          id={block.id}
          className="scroll-mt-28 border-t border-border pt-8 text-2xl font-bold tracking-tight sm:text-3xl"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return <h3 className="text-lg font-bold sm:text-xl">{block.text}</h3>;
    case "ul":
      return (
        <ul className="space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-[17px] leading-8 text-foreground/85">
              <span className="mt-3 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-[17px] leading-8 text-foreground/85">
              <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote className="rounded-2xl border-l-4 border-primary bg-muted/50 p-6">
          <p className="text-lg font-medium italic leading-8">&ldquo;{block.text}&rdquo;</p>
          {block.cite && (
            <footer className="mt-3 text-sm text-muted-foreground">— {block.cite}</footer>
          )}
        </blockquote>
      );
    case "callout": {
      const warn = block.tone === "warn";
      const Icon = warn ? TriangleAlert : Info;
      return (
        <aside
          className={`rounded-2xl border p-5 ${
            warn ? "border-destructive/30 bg-destructive/5" : "border-primary/25 bg-primary/5"
          }`}
        >
          <p className="flex items-center gap-2 font-bold">
            <Icon className={`size-4 ${warn ? "text-destructive" : "text-primary"}`} />
            {block.title}
          </p>
          <p className="mt-2 leading-7 text-foreground/85">{block.text}</p>
        </aside>
      );
    }
    case "table":
      return (
        <figure className="overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/60">
                <tr>
                  {block.head.map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i} className="border-t border-border">
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`px-4 py-3 ${j === 0 ? "font-medium" : "text-muted-foreground"}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <figcaption className="border-t border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "cta":
      return (
        <div className="rounded-3xl bg-gradient-navy p-6 text-navy-foreground sm:p-8">
          <h3 className="text-xl font-bold sm:text-2xl">{block.title}</h3>
          <p className="mt-2 max-w-xl text-navy-foreground/80">{block.text}</p>
          <Button asChild size="lg" variant="hero" className="mt-5">
            <Link to={block.to}>
              {block.label}
              <ArrowRight />
            </Link>
          </Button>
        </div>
      );
    case "faq":
      return (
        <div className="space-y-3">
          {block.items.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <summary className="cursor-pointer list-none font-semibold marker:hidden">
                {item.question}
              </summary>
              <p className="mt-3 leading-7 text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      );
    default:
      return null;
  }
}
