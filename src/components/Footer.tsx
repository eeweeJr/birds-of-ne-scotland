import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
            Rare Birds of North East Scotland
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Sightings are illustrative sample data, not real records.{" "}
            <Link
              href="/about#credits"
              className="underline underline-offset-2 hover:text-amber-700 dark:hover:text-amber-400"
            >
              Photo and map credits
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
