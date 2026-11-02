import Link from "next/link";
import { getAllSightings, getBirdSummaries } from "@/lib/store";
import StatsPanel from "@/components/StatsPanel";
import BirdImage from "@/components/BirdImage";

export default function HomePage() {
  const sightings = getAllSightings();
  const birds = getBirdSummaries();
  const topBirds = [...birds]
    .sort((a, b) => b.sightingCount - a.sightingCount)
    .slice(0, 6);

  const featured = topBirds[0];
  const rest = topBirds.slice(1);

  return (
    <div>
      {/* Hero */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
      >
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
                North East Scotland
              </p>
              <h1
                id="hero-heading"
                className="mt-3 text-4xl font-semibold leading-[1.1] tracking-tight text-stone-900 sm:text-5xl lg:text-[3.5rem] dark:text-stone-50"
              >
                A record of rare
                <br />
                and notable birds
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-stone-500 dark:text-stone-400">
                Browse species recorded across Aberdeen and Aberdeenshire, from
                the coast to the Cairngorms. Explore sighting trends, locations,
                and observer notes.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/birds"
                  className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white dark:focus:ring-stone-100 dark:focus:ring-offset-stone-900"
                >
                  Browse species
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                    <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
                  </svg>
                </Link>
                <span className="text-sm text-stone-500 dark:text-stone-400">
                  {birds.length} species &middot; {sightings.length} sample
                  records
                </span>
              </div>
            </div>

            {featured && (
              <div className="lg:col-span-2">
                <Link
                  href={`/birds/${featured.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:border-stone-700 dark:bg-stone-800 dark:focus:ring-offset-stone-900"
                >
                  <div className="relative h-56 overflow-hidden bg-stone-200 dark:bg-stone-700">
                    <BirdImage slug={featured.slug} name={featured.name} priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-[11px] font-medium uppercase tracking-widest text-white/90">Most recorded</p>
                      <h3 className="mt-0.5 text-xl font-semibold text-white">
                        {featured.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm text-stone-500 dark:text-stone-400">
                      {featured.sightingCount} sightings &middot; {featured.locations.length} locations
                    </span>
                    <span className="text-xs font-medium text-amber-700 group-hover:text-amber-600 dark:text-amber-400 dark:group-hover:text-amber-300 transition-colors">
                      View &rarr;
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <StatsPanel sightings={sightings} />

        {rest.length > 0 && (
          <section aria-labelledby="top-heading" className="mt-16 pb-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2
                  id="top-heading"
                  className="text-lg font-semibold text-stone-900 dark:text-stone-100"
                >
                  Top species
                </h2>
                <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">
                  Other frequently recorded species.
                </p>
              </div>
              <Link
                href="/birds"
                className="text-sm font-medium text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {rest.slice(0, 2).map((bird) => (
                <Link
                  key={bird.slug}
                  href={`/birds/${bird.slug}`}
                  className="group lg:col-span-2 flex overflow-hidden rounded-xl border border-stone-200 bg-white transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-stone-950"
                >
                  <div className="relative w-1/3 min-h-[120px] overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <BirdImage slug={bird.slug} name={bird.name} />
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-4">
                    <h3 className="font-medium text-stone-900 group-hover:text-amber-700 dark:text-stone-100 dark:group-hover:text-amber-400 transition-colors">
                      {bird.name}
                    </h3>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                      {bird.sightingCount} sightings &middot; {bird.yearFirst}&ndash;{bird.yearLast}
                    </p>
                  </div>
                </Link>
              ))}

              {rest.slice(2).map((bird) => (
                <Link
                  key={bird.slug}
                  href={`/birds/${bird.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-stone-950"
                >
                  <div className="relative h-24 overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <BirdImage slug={bird.slug} name={bird.name} />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-stone-900 group-hover:text-amber-700 dark:text-stone-100 dark:group-hover:text-amber-400 transition-colors">
                      {bird.name}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-stone-500 dark:text-stone-400">
                      {bird.sightingCount} sightings
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
