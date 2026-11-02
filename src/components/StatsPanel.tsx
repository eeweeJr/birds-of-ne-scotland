import { BirdSighting } from "@/lib/types";

interface StatsPanelProps {
  sightings: BirdSighting[];
}

export default function StatsPanel({ sightings }: StatsPanelProps) {
  const totalSightings = sightings.length;
  const uniqueSpecies = new Set(sightings.map((s) => s.bird)).size;
  const years = sightings.map((s) => s.year);
  const yearMin = years.length > 0 ? Math.min(...years) : 0;
  const yearMax = years.length > 0 ? Math.max(...years) : 0;
  const uniqueLocations = new Set(sightings.map((s) => s.location)).size;

  const stats = [
    { label: "Sightings", value: totalSightings },
    { label: "Species", value: uniqueSpecies },
    { label: "Locations", value: uniqueLocations },
    {
      label: "Years",
      value: totalSightings > 0 ? `${yearMin}\u2013${yearMax}` : "\u2014",
    },
  ];

  return (
    <section aria-label="Sighting statistics" className="mt-10">
      <h2 className="sr-only">Statistics</h2>
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-stone-200 bg-stone-200 sm:grid-cols-4 dark:border-stone-800 dark:bg-stone-800">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col-reverse bg-white px-5 py-6 text-center dark:bg-stone-900"
          >
            <dt className="mt-1 text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-400">
              {label}
            </dt>
            <dd className="text-3xl font-semibold tracking-tight tabular-nums text-stone-900 dark:text-stone-50">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
