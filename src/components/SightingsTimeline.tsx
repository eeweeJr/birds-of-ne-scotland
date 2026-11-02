"use client";

import { useState } from "react";
import { BirdSighting } from "@/lib/types";
import { formatChartDate, formatSightingDate, sightingTime } from "@/lib/dates";

interface SightingsTimelineProps {
  sightings: BirdSighting[];
  startYear: number;
  endYear: number;
}

interface ChartPoint {
  key: string;
  time: number;
  count: number;
  label: string;
  detail: string;
  locations: string[];
}

const WIDTH = 640;
const HEIGHT = 228;
const PAD_X = 18;
const BASELINE = 148;
const BAR_WIDTH = 9;
const BAR_HEIGHT = 58;

function formatGap(milliseconds: number): string {
  const days = Math.max(1, Math.round(milliseconds / 86_400_000));
  if (days < 45) return `${days} day${days === 1 ? "" : "s"}`;

  const months = Math.max(1, Math.round(days / 30.437));
  if (months < 24) return `${months} month${months === 1 ? "" : "s"}`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const yearLabel = `${years} year${years === 1 ? "" : "s"}`;
  if (remainingMonths === 0) return yearLabel;
  return `${yearLabel} ${remainingMonths} month${remainingMonths === 1 ? "" : "s"}`;
}

function buildPoints(sightings: BirdSighting[]): ChartPoint[] {
  const grouped = new Map<number, BirdSighting[]>();
  for (const sighting of sightings) {
    const time = sightingTime(sighting);
    const existing = grouped.get(time);
    if (existing) existing.push(sighting);
    else grouped.set(time, [sighting]);
  }

  return [...grouped.entries()]
    .sort(([timeA], [timeB]) => timeA - timeB)
    .map(([time, records]) => {
      const first = records[0];
      return {
        key: `${time}-${first.location}`,
        time,
        count: records.length,
        label: formatChartDate(first),
        detail: formatSightingDate(first),
        locations: [...new Set(records.map((record) => record.location))],
      };
    });
}

export default function SightingsTimeline({
  sightings,
  startYear,
  endYear,
}: SightingsTimelineProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const points = buildPoints(sightings);
  const rangeStart = Date.UTC(startYear, 0, 1);
  const rangeEnd = Date.UTC(endYear, 11, 31, 23, 59, 59);
  const plotWidth = WIDTH - PAD_X * 2;

  const xFor = (time: number) =>
    PAD_X + ((time - rangeStart) / (rangeEnd - rangeStart)) * plotWidth;

  const yearCount = endYear - startYear + 1;
  const yearStep = plotWidth / yearCount >= 52 ? 1 : 2;
  const years = [];
  for (let year = startYear; year <= endYear; year += yearStep) years.push(year);
  if (years[years.length - 1] !== endYear) years.push(endYear);

  const labelRows: number[] = [];
  points.forEach((point) => {
    const x = xFor(point.time);
    const row = labelRows.some(
      (used, index) => used === 0 && Math.abs(xFor(points[index].time) - x) < 62
    )
      ? 1
      : 0;
    labelRows.push(row);
  });

  const ordered = [...sightings].sort((a, b) => sightingTime(a) - sightingTime(b));
  const first = ordered[0];
  const last = ordered[ordered.length - 1];
  let longestGap = 0;
  for (let index = 1; index < ordered.length; index++) {
    longestGap = Math.max(
      longestGap,
      sightingTime(ordered[index]) - sightingTime(ordered[index - 1])
    );
  }

  const active = points.find((point) => point.key === activeKey);
  const dateList = points.map((point) => point.detail).join(", ");

  return (
    <div>
      <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
        Sightings over time
      </h3>
      <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
        Each bar sits on the record&apos;s date, across {startYear}&ndash;{endYear}
      </p>

      <dl className="mt-4 grid grid-cols-3 divide-x divide-stone-200 border-y border-stone-200 py-3 dark:divide-stone-700 dark:border-stone-700">
        <div className="pr-2">
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Records
          </dt>
          <dd className="mt-0.5 text-lg font-semibold tabular-nums text-stone-900 dark:text-stone-100">
            {sightings.length}
          </dd>
        </div>
        <div className="px-3">
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Span
          </dt>
          <dd className="mt-0.5 text-sm font-semibold leading-5 text-stone-900 dark:text-stone-100">
            {ordered.length < 2 ? "One record" : formatGap(sightingTime(last) - sightingTime(first))}
          </dd>
        </div>
        <div className="pl-3">
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Longest gap
          </dt>
          <dd className="mt-0.5 text-sm font-semibold leading-5 text-stone-900 dark:text-stone-100">
            {ordered.length < 2 ? "\u2014" : formatGap(longestGap)}
          </dd>
        </div>
      </dl>

      <div className="relative mt-4">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full"
          role="img"
          aria-label={`${sightings.length} sightings plotted by date from ${startYear} to ${endYear}: ${dateList}`}
        >
          <line
            x1={PAD_X}
            y1={BASELINE}
            x2={WIDTH - PAD_X}
            y2={BASELINE}
            stroke="var(--chart-grid)"
            strokeWidth={1.5}
          />

          {years.map((year) => {
            const x = xFor(Date.UTC(year, 0, 1));
            return (
              <g key={year}>
                <line
                  x1={x}
                  y1={BASELINE}
                  x2={x}
                  y2={BASELINE + 6}
                  stroke="var(--chart-grid)"
                  strokeWidth={1}
                />
                <text
                  x={x}
                  y={BASELINE + 22}
                  textAnchor="middle"
                  fill="var(--chart-text)"
                  fontSize={11}
                >
                  {year}
                </text>
              </g>
            );
          })}

          {points.map((point, index) => {
            const x = xFor(point.time);
            const isActive = activeKey === point.key;
            return (
              <g
                key={point.key}
                tabIndex={0}
                aria-label={`${point.detail}, ${point.locations.join(", ")}`}
                className="cursor-default outline-none"
                onMouseEnter={() => setActiveKey(point.key)}
                onMouseLeave={() => setActiveKey(null)}
                onFocus={() => setActiveKey(point.key)}
                onBlur={() => setActiveKey(null)}
              >
                <rect
                  x={x - 16}
                  y={BASELINE - BAR_HEIGHT - 28}
                  width={32}
                  height={BAR_HEIGHT + 28}
                  fill="transparent"
                />
                <rect
                  x={x - BAR_WIDTH / 2}
                  y={BASELINE - BAR_HEIGHT}
                  width={BAR_WIDTH}
                  height={BAR_HEIGHT}
                  rx={3}
                  fill="var(--chart-bar)"
                  opacity={isActive ? 1 : 0.88}
                />
                <text
                  x={x}
                  y={BASELINE - BAR_HEIGHT - 8 - labelRows[index] * 14}
                  textAnchor="middle"
                  fill="var(--chart-text)"
                  fontSize={11}
                  fontWeight={isActive ? 700 : 500}
                >
                  {point.label}
                </text>
                {point.count > 1 && (
                  <text
                    x={x}
                    y={BASELINE - BAR_HEIGHT / 2 + 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize={11}
                    fontWeight={700}
                  >
                    {point.count}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {active && (
          <div
            className="pointer-events-none absolute top-0 z-10 w-44 -translate-x-1/2 rounded-md border border-stone-200 bg-white px-2.5 py-2 shadow-lg dark:border-stone-700 dark:bg-stone-800"
            style={{ left: `${(xFor(active.time) / WIDTH) * 100}%` }}
          >
            <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
              {active.detail}
            </p>
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              {active.locations.join(", ")}
            </p>
            <p className="text-[11px] tabular-nums text-stone-500 dark:text-stone-400">
              {active.count} sighting{active.count === 1 ? "" : "s"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
