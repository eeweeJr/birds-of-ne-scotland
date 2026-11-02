import { readFileSync } from "node:fs";
import path from "node:path";
import { BirdSighting, BirdSummary, LocationCoordinate } from "./types";

const SIGHTINGS_PATH = path.join(process.cwd(), "src/data/sightings.csv");
const LOCATIONS_PATH = path.join(process.cwd(), "src/data/locations.csv");
const COLUMNS = ["bird", "location", "year", "month", "day", "spotter", "notes"] as const;
const MONTH_NAMES: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const pushRow = () => {
    row.push(field);
    if (row.some((cell) => cell.trim() !== "")) rows.push(row);
    row = [];
    field = "";
  };

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      pushRow();
    } else {
      field += char;
    }
  }

  if (inQuotes) {
    throw new Error("A quoted value was left open. Check for a missing closing quote.");
  }

  if (field.length > 0 || row.length > 0) pushRow();
  return rows;
}

function cell(row: string[], index: Map<string, number>, name: string): string {
  const column = index.get(name);
  if (column === undefined) return "";
  return (row[column] ?? "").trim();
}

function parseMonth(filePath: string, line: number, monthText: string): number | undefined {
  if (!monthText) return undefined;

  const namedMonth = MONTH_NAMES[monthText.toLowerCase()];
  const month = namedMonth ?? (/^\d+$/.test(monthText) ? Number(monthText) : NaN);
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error(
      `${filePath}, row ${line}: month must be 1–12 or a month name, received "${monthText}".`
    );
  }
  return month;
}

function parseDay(
  filePath: string,
  line: number,
  dayText: string,
  year: number,
  month: number | undefined
): number | undefined {
  if (!dayText) return undefined;
  if (!month) {
    throw new Error(`${filePath}, row ${line}: day requires a month.`);
  }
  if (!/^\d+$/.test(dayText)) {
    throw new Error(
      `${filePath}, row ${line}: day must be a whole number, received "${dayText}".`
    );
  }

  const day = Number(dayText);
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day < 1 || day > lastDay) {
    throw new Error(
      `${filePath}, row ${line}: ${day} is not a valid day for that month.`
    );
  }
  return day;
}

function dateValue(sighting: { year: number; month?: number; day?: number }): number {
  return sighting.year * 10000 + (sighting.month ?? 0) * 100 + (sighting.day ?? 0);
}

function todayValue(): number {
  const now = new Date();
  return dateValue({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  });
}

function spellingKey(name: string): string {
  return name.toLowerCase().replace(/\s+/g, " ");
}

function checkSpelling(
  seen: Map<string, string>,
  filePath: string,
  line: number,
  column: string,
  value: string
) {
  const key = spellingKey(value);
  const previous = seen.get(key);
  if (previous === undefined) {
    seen.set(key, value);
  } else if (previous !== value) {
    throw new Error(
      `${filePath}, row ${line}: ${column} "${value}" is spelled differently from "${previous}" in an earlier row. Use one spelling so they are grouped together.`
    );
  }
}

function loadSightings(filePath: string): BirdSighting[] {
  let text: string;
  try {
    text = readFileSync(filePath, "utf8");
  } catch {
    throw new Error(
      `Could not read sightings from ${filePath}. Add that CSV file and launch the site again.`
    );
  }

  const rows = parseCsv(text.replace(/^\uFEFF/, ""));
  if (rows.length === 0) {
    throw new Error(
      `${filePath} is empty. The first row must be: bird,location,year,month,day,spotter,notes`
    );
  }

  const header = rows[0].map((name) => name.trim().toLowerCase());
  const index = new Map<string, number>();
  header.forEach((name, position) => {
    if (!name) return;
    if (index.has(name)) {
      throw new Error(`${filePath} repeats the "${name}" column.`);
    }
    index.set(name, position);
  });

  for (const name of ["bird", "location", "year", "month", "day"] as const) {
    if (!index.has(name)) {
      throw new Error(`${filePath} is missing the "${name}" column.`);
    }
  }

  const unknown = [...index.keys()].filter(
    (name) => !COLUMNS.includes(name as (typeof COLUMNS)[number])
  );
  if (unknown.length > 0) {
    throw new Error(
      `${filePath} has unexpected columns: ${unknown.join(", ")}. Use ${COLUMNS.join(", ")}.`
    );
  }

  const sightings: BirdSighting[] = [];
  const birdSpellings = new Map<string, string>();
  const locationSpellings = new Map<string, string>();
  const today = todayValue();

  for (let rowNumber = 1; rowNumber < rows.length; rowNumber++) {
    const row = rows[rowNumber];
    const line = rowNumber + 1;
    const bird = cell(row, index, "bird");
    const location = cell(row, index, "location");
    const yearText = cell(row, index, "year");
    const monthText = cell(row, index, "month");
    const dayText = cell(row, index, "day");
    const spotter = cell(row, index, "spotter");
    const notes = cell(row, index, "notes");

    if (!bird && !location && !yearText && !monthText && !dayText && !spotter && !notes) {
      continue;
    }
    if (!bird) throw new Error(`${filePath}, row ${line}: bird is required.`);
    if (!location) throw new Error(`${filePath}, row ${line}: location is required.`);
    if (!slugify(bird)) {
      throw new Error(
        `${filePath}, row ${line}: bird "${bird}" needs at least one letter or number.`
      );
    }
    checkSpelling(birdSpellings, filePath, line, "bird", bird);
    checkSpelling(locationSpellings, filePath, line, "location", location);
    if (!/^\d+$/.test(yearText)) {
      throw new Error(
        `${filePath}, row ${line}: year must be a whole number, received "${yearText}".`
      );
    }

    const year = Number(yearText);
    if (year < 1800) {
      throw new Error(`${filePath}, row ${line}: year ${year} is before 1800.`);
    }

    const month = parseMonth(filePath, line, monthText);
    const day = parseDay(filePath, line, dayText, year, month);
    if (dateValue({ year, month, day }) > today) {
      throw new Error(`${filePath}, row ${line}: the sighting date is in the future.`);
    }

    const sighting: BirdSighting = { bird, location, year };
    if (month) sighting.month = month;
    if (day) sighting.day = day;
    if (spotter) sighting.spotter = spotter;
    if (notes) sighting.notes = notes;
    sightings.push(sighting);
  }

  if (sightings.length === 0) {
    throw new Error(`${filePath} has a header but no sightings.`);
  }

  const slugOwners = new Map<string, string>();
  for (const bird of birdSpellings.values()) {
    const slug = slugify(bird);
    const owner = slugOwners.get(slug);
    if (owner) {
      throw new Error(
        `${filePath}: "${owner}" and "${bird}" would share the page /birds/${slug}. Rename one of them.`
      );
    }
    slugOwners.set(slug, bird);
  }

  return sightings;
}

function loadLocationCoordinates(
  filePath: string
): Record<string, LocationCoordinate> {
  let text: string;
  try {
    text = readFileSync(filePath, "utf8");
  } catch {
    throw new Error(
      `Could not read map locations from ${filePath}. Add that CSV file and launch the site again.`
    );
  }

  const rows = parseCsv(text.replace(/^\uFEFF/, ""));
  if (rows.length === 0) {
    throw new Error(
      `${filePath} is empty. The first row must be: location,latitude,longitude`
    );
  }

  const header = rows[0].map((name) => name.trim().toLowerCase());
  const index = new Map<string, number>();
  header.forEach((name, position) => {
    if (!name) return;
    if (index.has(name)) {
      throw new Error(`${filePath} repeats the "${name}" column.`);
    }
    index.set(name, position);
  });

  for (const name of ["location", "latitude", "longitude"] as const) {
    if (!index.has(name)) {
      throw new Error(`${filePath} is missing the "${name}" column.`);
    }
  }

  const unknown = [...index.keys()].filter(
    (name) => !["location", "latitude", "longitude"].includes(name)
  );
  if (unknown.length > 0) {
    throw new Error(
      `${filePath} has unexpected columns: ${unknown.join(", ")}. Use location, latitude, longitude.`
    );
  }

  const coordinates: Record<string, LocationCoordinate> = {};
  for (let rowNumber = 1; rowNumber < rows.length; rowNumber++) {
    const row = rows[rowNumber];
    const line = rowNumber + 1;
    const location = cell(row, index, "location");
    const latitudeText = cell(row, index, "latitude");
    const longitudeText = cell(row, index, "longitude");

    if (!location && !latitudeText && !longitudeText) continue;
    if (!location) {
      throw new Error(`${filePath}, row ${line}: location is required.`);
    }
    if (coordinates[location]) {
      throw new Error(`${filePath}, row ${line}: "${location}" is listed more than once.`);
    }

    const latitude = Number(latitudeText);
    const longitude = Number(longitudeText);
    if (!latitudeText || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      throw new Error(
        `${filePath}, row ${line}: latitude must be a number from -90 to 90.`
      );
    }
    if (
      !longitudeText ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new Error(
        `${filePath}, row ${line}: longitude must be a number from -180 to 180.`
      );
    }

    coordinates[location] = { latitude, longitude };
  }

  return coordinates;
}

const sightings: BirdSighting[] = loadSightings(SIGHTINGS_PATH);
const locationCoordinates = loadLocationCoordinates(LOCATIONS_PATH);

const missingCoordinates = [...new Set(sightings.map((s) => s.location))].filter(
  (location) => !locationCoordinates[location]
);
if (missingCoordinates.length > 0) {
  console.warn(
    `These sighting locations have no row in ${LOCATIONS_PATH}, so they are left off the map: ${missingCoordinates.join(", ")}`
  );
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getAllSightings(): BirdSighting[] {
  return sightings;
}

export function getAllLocationCoordinates(): Record<string, LocationCoordinate> {
  return locationCoordinates;
}

export function getBirdSummaries(): BirdSummary[] {
  const map = new Map<string, BirdSighting[]>();

  for (const s of sightings) {
    const existing = map.get(s.bird);
    if (existing) {
      existing.push(s);
    } else {
      map.set(s.bird, [s]);
    }
  }

  const summaries: BirdSummary[] = [];

  for (const [name, birdSightings] of map) {
    const years = birdSightings.map((s) => s.year);
    const locations = [...new Set(birdSightings.map((s) => s.location))];

    summaries.push({
      name,
      slug: slugify(name),
      sightingCount: birdSightings.length,
      locations,
      yearFirst: Math.min(...years),
      yearLast: Math.max(...years),
      sightings: birdSightings.sort((a, b) => dateValue(b) - dateValue(a)),
    });
  }

  return summaries.sort((a, b) => a.name.localeCompare(b.name));
}

export function getBirdBySlug(slug: string): BirdSummary | undefined {
  return getBirdSummaries().find((b) => b.slug === slug);
}
