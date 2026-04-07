import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary } from "@/lib/locale-data";
import { getSiteLocale } from "@/lib/locale-server";

export default async function NotFound() {
  const locale = await getSiteLocale();
  const t = getDictionary(locale);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-20 text-center sm:px-8">
      <span className="rounded-full border border-brand/20 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-deep">
        404
      </span>
      <h1 className="mt-6 font-display text-4xl text-brand-deep sm:text-5xl">
        {t.notFound.title}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-8 text-muted sm:text-base">
        {t.notFound.description}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className={buttonVariants({ variant: "primary", size: "lg" })}>
          {t.notFound.homeAction}
        </Link>
        <Link
          href="/products"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          {t.notFound.browseAction}
        </Link>
      </div>
    </main>
  );
}
