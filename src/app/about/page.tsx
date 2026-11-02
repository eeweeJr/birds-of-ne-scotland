import Link from "next/link";
import { getBirdSummaries } from "@/lib/store";
import { getAllImageCredits } from "@/data/imageCredits";

export const metadata = { title: "About" };

const REPO_URL = "https://github.com/eeweeJr/birds-of-ne-scotland";

const linkClass =
  "text-amber-700 underline underline-offset-2 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300";

export default function AboutPage() {
  const birdNames = new Map(getBirdSummaries().map((bird) => [bird.slug, bird.name]));
  const credits = getAllImageCredits().sort(([a], [b]) =>
    (birdNames.get(a) ?? a).localeCompare(birdNames.get(b) ?? b)
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-50">
        About This Project
      </h1>

      <div className="mt-8 space-y-10">
        <section
          aria-labelledby="about-data"
          className="rounded-xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/40"
        >
          <h2 id="about-data" className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Sample data
          </h2>
          <p className="mt-3 leading-relaxed text-stone-700 dark:text-stone-300">
            This is a demonstration website. Every sighting, observer name and
            note on it is invented for illustration. None of it is a real or
            verified bird record, and it should not be cited or submitted to
            any recording scheme. For genuine records in the region, contact
            the local bird recorder through the{" "}
            <a
              href="https://www.the-soc.org.uk/"
              className={linkClass}
              target="_blank"
              rel="noopener noreferrer"
            >
              Scottish Ornithologists&apos; Club
            </a>
            .
          </p>
          <p className="mt-3 leading-relaxed text-stone-700 dark:text-stone-300">
            The species descriptions are general natural-history notes. Sites
            used by specially protected (Schedule 1) species while breeding are
            deliberately left out of the sample data, and should never be
            published on a site like this.
          </p>
        </section>

        <section aria-labelledby="about-region">
          <h2 id="about-region" className="text-xl font-bold text-stone-900 dark:text-stone-100">
            North East Scotland
          </h2>
          <p className="mt-3 leading-relaxed text-stone-700 dark:text-stone-300">
            The north-east corner of Scotland is one of the finest birding
            regions in Britain. From the sea-cliffs at Fowlsheugh and the
            dune systems at Rattray Head, to the Caledonian pinewood of Glen
            Tanar and the wetlands of Loch of Strathbeg, the area attracts
            passage migrants from Scandinavia, Siberia and beyond.
          </p>
          <p className="mt-3 leading-relaxed text-stone-700 dark:text-stone-300">
            The sample data uses well-known places such as Girdle Ness
            (Aberdeen), Collieston, the Ythan Estuary, Bennachie, Glen Tanar
            and the Lochnagar plateau.
          </p>
        </section>

        <section aria-labelledby="about-site">
          <h2 id="about-site" className="text-xl font-bold text-stone-900 dark:text-stone-100">
            How It Works
          </h2>
          <ul className="mt-3 space-y-3 text-stone-700 dark:text-stone-300">
            <li className="flex gap-3">
              <span aria-hidden="true" className="mt-0.5 text-amber-600 dark:text-amber-400">●</span>
              <span>
                <strong className="text-stone-900 dark:text-stone-100">Browse species</strong> &mdash; View every species on the{" "}
                <Link href="/birds" className={linkClass}>
                  Birds page
                </Link>
                , and search by species or location.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="mt-0.5 text-amber-600 dark:text-amber-400">●</span>
              <span>
                <strong className="text-stone-900 dark:text-stone-100">Explore a species</strong> &mdash; Select any bird to see
                its sighting map, timeline and full sighting log with
                observer notes.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="mt-0.5 text-amber-600 dark:text-amber-400">●</span>
              <span>
                <strong className="text-stone-900 dark:text-stone-100">Data</strong> &mdash; Sightings and map locations are kept in
                two spreadsheet (CSV) files. The site checks them for mistakes
                every time it is rebuilt.
              </span>
            </li>
          </ul>
        </section>

        <section aria-labelledby="about-accessibility">
          <h2 id="about-accessibility" className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Accessibility
          </h2>
          <p className="mt-3 leading-relaxed text-stone-700 dark:text-stone-300">
            This site aims to meet WCAG 2.2 level AA. It uses semantic HTML and
            a logical heading structure, a skip link, keyboard-accessible map
            markers and timeline bars, visible focus indicators, text colours
            chosen for AA contrast in both light and dark mode, and it respects
            reduced-motion settings. If something doesn&apos;t work for you,
            please{" "}
            <a
              href={`${REPO_URL}/issues`}
              className={linkClass}
              target="_blank"
              rel="noopener noreferrer"
            >
              open an issue
            </a>
            .
          </p>
        </section>

        <section aria-labelledby="credits-heading" id="credits" className="scroll-mt-20">
          <h2 id="credits-heading" className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Credits
          </h2>
          <p className="mt-3 leading-relaxed text-stone-700 dark:text-stone-300">
            Bird photographs come from Wikimedia Commons and iNaturalist. Each
            remains under its original licence and has been resized for this
            site. Photos licensed CC BY-SA may be reused only under the same
            licence.
          </p>
          <ul className="mt-4 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white text-sm dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
            {credits.map(([slug, credit]) => (
              <li key={slug} className="flex flex-wrap justify-between gap-x-4 gap-y-1 px-4 py-2.5">
                <span className="font-medium text-stone-900 dark:text-stone-100">
                  {birdNames.get(slug) ?? slug}
                </span>
                <span className="text-stone-600 dark:text-stone-400">
                  <a href={credit.sourceUrl} className={linkClass} target="_blank" rel="noopener noreferrer">
                    {credit.author}
                  </a>
                  {" \u00b7 "}
                  {credit.licenceUrl ? (
                    <a href={credit.licenceUrl} className={linkClass} target="_blank" rel="noopener noreferrer license">
                      {credit.licence}
                    </a>
                  ) : (
                    credit.licence
                  )}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 leading-relaxed text-stone-700 dark:text-stone-300">
            Map data &copy;{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              className={linkClass}
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenStreetMap contributors
            </a>
            , available under the Open Database Licence. The website code is{" "}
            <a href={REPO_URL} className={linkClass} target="_blank" rel="noopener noreferrer">
              open source
            </a>{" "}
            under the MIT licence.
          </p>
        </section>
      </div>
    </div>
  );
}
