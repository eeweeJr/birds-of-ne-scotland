import { getBirdSummaries } from "@/lib/store";
import BirdSearch from "@/components/BirdSearch";

export default function BirdsPage() {
  const birds = getBirdSummaries();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
            All Species
          </h1>
          <p className="mt-1 text-stone-600 dark:text-stone-400">
            {birds.length} rare species recorded across North East Scotland.
          </p>
        </div>
      </div>
      <BirdSearch birds={birds} />
    </div>
  );
}
