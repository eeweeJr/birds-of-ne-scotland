import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllLocationCoordinates,
  getAllSightings,
  getBirdBySlug,
  getBirdSummaries,
} from "@/lib/store";
import BirdImage from "@/components/BirdImage";
import SightingsTimeline from "@/components/SightingsTimeline";
import StaticLocationMap from "@/components/StaticLocationMap";
import { getSpeciesProfile } from "@/data/species";
import { getImageCredit } from "@/data/imageCredits";
import { formatSightingDate } from "@/lib/dates";

interface BirdDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getBirdSummaries().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: BirdDetailPageProps) {
  const { slug } = await params;
  const bird = getBirdBySlug(slug);
  if (!bird) return { title: "Species not found" };
  return {
    title: bird.name,
    description: `${bird.sightingCount} recorded sightings of ${bird.name} across ${bird.locations.length} locations in North East Scotland.`,
  };
}

export default async function BirdDetailPage({ params }: BirdDetailPageProps) {
  const { slug } = await params;
  const bird = getBirdBySlug(slug);

  if (!bird) notFound();

  const profile = getSpeciesProfile(slug);
  const photoCredit = getImageCredit(slug);
  const locationCoordinates = getAllLocationCoordinates();
  const recordedYears = getAllSightings().map((sighting) => sighting.year);
  const recordRange = {
    startYear: Math.min(...recordedYears),
    endYear: Math.max(...recordedYears),
  };
  const siteSummaries = bird.locations
    .map((location) => {
      const records = bird.sightings.filter(
        (sighting) => sighting.location === location
      );
      const years = records.map((record) => record.year);
      return {
        location,
        count: records.length,
        firstYear: Math.min(...years),
        lastYear: Math.max(...years),
      };
    })
    .sort((a, b) => a.location.localeCompare(b.location));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol
          className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400"
          role="list"
        >
          <li>
            <Link
              href="/birds"
              className="hover:text-amber-700 dark:hover:text-amber-400 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
            >
              All Species
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li
            aria-current="page"
            className="text-stone-900 dark:text-stone-100 font-medium"
          >
            {bird.name}
          </li>
        </ol>
      </nav>

      {/* Two-column: sidebar left, content right */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-20 space-y-5">
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <div className="relative h-56 overflow-hidden bg-stone-100 dark:bg-stone-800">
                <BirdImage
                  slug={bird.slug}
                  name={bird.name}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h1 className="text-2xl font-semibold text-white drop-shadow-md">
                    {bird.name}
                  </h1>
                  {profile && (
                    <p className="mt-0.5 font-serif text-sm italic text-white/80 drop-shadow">
                      {profile.scientificName}
                    </p>
                  )}
                </div>
              </div>
              {photoCredit && (
                <p className="border-b border-stone-100 px-4 py-2 text-[11px] leading-snug text-stone-500 dark:border-stone-800 dark:text-stone-400">
                  Photo:{" "}
                  <a
                    href={photoCredit.sourceUrl}
                    className="underline underline-offset-2 hover:text-amber-700 dark:hover:text-amber-400"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {photoCredit.author}
                  </a>
                  ,{" "}
                  {photoCredit.licenceUrl ? (
                    <a
                      href={photoCredit.licenceUrl}
                      className="underline underline-offset-2 hover:text-amber-700 dark:hover:text-amber-400"
                      target="_blank"
                      rel="noopener noreferrer license"
                    >
                      {photoCredit.licence}
                    </a>
                  ) : (
                    photoCredit.licence
                  )}
                  . Resized from the original.
                </p>
              )}
              <div className="p-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">
                    {bird.sightingCount} sighting
                    {bird.sightingCount !== 1 ? "s" : ""}
                  </span>
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                    {bird.locations.length} location
                    {bird.locations.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <dl className="divide-y divide-stone-100 dark:divide-stone-800 text-sm">
                  <div className="flex justify-between py-2.5">
                    <dt className="text-stone-500 dark:text-stone-400">
                      First recorded
                    </dt>
                    <dd className="font-semibold text-stone-900 dark:text-stone-100">
                      {bird.yearFirst}
                    </dd>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <dt className="text-stone-500 dark:text-stone-400">
                      Last recorded
                    </dt>
                    <dd className="font-semibold text-stone-900 dark:text-stone-100">
                      {bird.yearLast}
                    </dd>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <dt className="text-stone-500 dark:text-stone-400">
                      Locations
                    </dt>
                    <dd className="font-semibold text-stone-900 dark:text-stone-100 text-right max-w-[60%]">
                      {bird.locations.join(", ")}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <Link
              href="/birds"
              className="flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-stone-950 transition-colors w-full"
            >
              &larr; Back to all species
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {profile && (
            <section
              aria-labelledby="species-notes-heading"
              className="border-y border-stone-300 bg-[#fdfcf8] px-1 py-5 dark:border-stone-700 dark:bg-transparent"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800 dark:text-amber-400">
                Species notes
              </p>
              <h2
                id="species-notes-heading"
                className="mt-1 font-serif text-2xl font-semibold text-stone-900 dark:text-stone-100"
              >
                {bird.name}
                <span className="ml-2 text-base font-normal italic text-stone-500 dark:text-stone-400">
                  {profile.scientificName}
                </span>
              </h2>
              <p className="mt-3 max-w-2xl font-serif text-[15px] leading-7 text-stone-700 dark:text-stone-300">
                {profile.description}
              </p>
            </section>
          )}

          <section aria-labelledby="charts-heading">
            <h2 id="charts-heading" className="sr-only">
              Charts and Visualisations
            </h2>
            <div className="grid items-start gap-6 md:grid-cols-5">
              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm md:col-span-3 dark:border-stone-800 dark:bg-stone-900">
                <StaticLocationMap
                  sightings={bird.sightings}
                  locationCoordinates={locationCoordinates}
                />
              </div>
              <div className="space-y-6 md:col-span-2">
                <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
                  <SightingsTimeline
                    sightings={bird.sightings}
                    startYear={recordRange.startYear}
                    endYear={recordRange.endYear}
                  />
                </div>

                <section
                  aria-labelledby="sites-heading"
                  className="overflow-hidden rounded-xl border border-stone-300 bg-[#fdfcf8] shadow-sm dark:border-stone-700 dark:bg-stone-900"
                >
                  <div className="border-b border-stone-300 px-5 py-4 dark:border-stone-700">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800 dark:text-amber-400">
                      Site index
                    </p>
                    <h3
                      id="sites-heading"
                      className="mt-1 font-serif text-xl font-semibold text-stone-900 dark:text-stone-100"
                    >
                      All recorded sites
                    </h3>
                  </div>
                  <ol className="divide-y divide-stone-200 dark:divide-stone-800">
                    {siteSummaries.map((site, index) => (
                      <li
                        key={site.location}
                        className="grid grid-cols-[1.5rem_1fr_auto] gap-2 px-5 py-3"
                      >
                        <span
                          className="font-serif text-sm tabular-nums text-stone-500 dark:text-stone-400"
                          aria-hidden="true"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="font-serif text-sm font-semibold text-stone-900 dark:text-stone-100">
                            {site.location}
                          </p>
                          <p className="mt-0.5 text-[11px] tabular-nums text-stone-500 dark:text-stone-400">
                            {site.firstYear === site.lastYear
                              ? site.firstYear
                              : `${site.firstYear}\u2013${site.lastYear}`}
                          </p>
                        </div>
                        <span className="text-xs tabular-nums text-stone-500 dark:text-stone-400">
                          {site.count} record{site.count === 1 ? "" : "s"}
                        </span>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>
            </div>
          </section>

          <section aria-labelledby="log-heading">
            <div className="rounded-xl border border-stone-300 bg-[#fdfcf8] px-6 py-6 shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:px-8">
              <div className="border-b border-stone-800 pb-2 dark:border-stone-300">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800 dark:text-amber-400">
                  {bird.name}
                </p>
                <h2
                  id="log-heading"
                  className="mt-1 font-serif text-2xl font-semibold text-stone-900 dark:text-stone-100"
                >
                  All records
                </h2>
              </div>

              <ol
                className="mt-4 columns-1 gap-x-10 md:columns-2"
                aria-label={`All ${bird.sightingCount} recorded sightings of ${bird.name}`}
              >
                {bird.sightings.map((sighting, index) => (
                  <li
                    key={`${sighting.year}-${sighting.month ?? ""}-${sighting.day ?? ""}-${sighting.location}-${index}`}
                    className="mb-4 break-inside-avoid font-serif text-sm leading-snug text-stone-700 dark:text-stone-300"
                  >
                    <p>
                      <strong className="font-bold tabular-nums text-stone-950 dark:text-stone-50">
                        {formatSightingDate(sighting)}
                      </strong>{" "}
                      <strong className="font-semibold text-stone-950 dark:text-stone-50">
                        {sighting.location}
                      </strong>
                      {sighting.spotter && (
                        <span className="text-stone-500 dark:text-stone-400">
                          {" "}
                          ({sighting.spotter})
                        </span>
                      )}
                    </p>
                    {sighting.notes && (
                      <p className="mt-0.5 text-stone-600 dark:text-stone-400">
                        {sighting.notes}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
