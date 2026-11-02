"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BirdSummary } from "@/lib/types";
import BirdImage from "@/components/BirdImage";

interface BirdSearchProps {
  birds: BirdSummary[];
}

export default function BirdSearch({ birds }: BirdSearchProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return birds;
    const q = search.toLowerCase();
    return birds.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.locations.some((l) => l.toLowerCase().includes(q))
    );
  }, [birds, search]);

  return (
    <div className="mt-6">
      {/* Search bar + result count */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite" aria-atomic="true">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {filtered.length === birds.length
              ? `Showing all ${birds.length} species`
              : `${filtered.length} of ${birds.length} species`}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <label htmlFor="bird-search" className="sr-only">
            Search by species or location
          </label>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500 dark:text-stone-400 pointer-events-none"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            id="bird-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search species or location..."
            className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-900 placeholder-stone-500 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400 dark:focus:border-amber-500"
          />
        </div>
      </div>

      {/* Grid */}
      <ul className="mt-5 grid gap-4 sm:grid-cols-2" role="list">
        {filtered.map((bird) => (
          <li key={bird.slug}>
            <Link
              href={`/birds/${bird.slug}`}
              className="group flex overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700 dark:focus:ring-offset-stone-950 h-full"
            >
              <div className="relative w-28 shrink-0 overflow-hidden bg-stone-100 dark:bg-stone-800 sm:w-36">
                <BirdImage slug={bird.slug} name={bird.name} sizes="150px" />
              </div>
              <div className="flex flex-1 flex-col justify-center p-4">
                <h2 className="font-semibold text-stone-900 group-hover:text-amber-700 dark:text-stone-100 dark:group-hover:text-amber-400 transition-colors">
                  {bird.name}
                </h2>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400 line-clamp-1">
                  {bird.locations.join(" \u00b7 ")}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">
                    {bird.sightingCount} sighting{bird.sightingCount !== 1 ? "s" : ""}
                  </span>
                  <span className="text-stone-500 dark:text-stone-400">
                    {bird.yearFirst === bird.yearLast
                      ? bird.yearFirst
                      : `${bird.yearFirst}\u2013${bird.yearLast}`}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-stone-500 dark:text-stone-400">
          No species found matching &quot;{search}&quot;.
        </p>
      )}
    </div>
  );
}
