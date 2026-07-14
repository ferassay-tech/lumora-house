import type { ReactNode } from "react";
import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-ivory">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

/** Shared page-header band for interior pages (About, Books, FAQ, etc.) */
export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-beige bg-cream/40 px-6 pb-16 pt-16 lg:px-10 lg:pt-24">
      <div className="mx-auto max-w-4xl text-center">
        {eyebrow && (
          <p className="text-sm uppercase tracking-[0.25em] text-gold">{eyebrow}</p>
        )}
        <h1 className="mt-4 text-balance font-display text-4xl leading-tight text-ink md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-5 max-w-2xl text-balance leading-loose text-ink-soft">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

