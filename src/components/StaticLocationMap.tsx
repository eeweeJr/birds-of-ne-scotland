"use client";

import { useState } from "react";
import { BirdSighting, LocationCoordinate } from "@/lib/types";

interface StaticLocationMapProps {
  sightings: BirdSighting[];
  locationCoordinates: Record<string, LocationCoordinate>;
}

const BOUNDS = {
  latMin: 56.9,
  latMax: 57.8,
  lngMin: -3.8,
  lngMax: -1.6,
};

const SVG_W = 1200;
const SVG_H = 910;

function mercatorY(lat: number): number {
  return Math.asinh(Math.tan((lat * Math.PI) / 180));
}

function isOnMap({ latitude, longitude }: LocationCoordinate): boolean {
  return (
    latitude >= BOUNDS.latMin &&
    latitude <= BOUNDS.latMax &&
    longitude >= BOUNDS.lngMin &&
    longitude <= BOUNDS.lngMax
  );
}

function project(lat: number, lng: number): { x: number; y: number } {
  const x =
    ((lng - BOUNDS.lngMin) / (BOUNDS.lngMax - BOUNDS.lngMin)) * SVG_W;
  const north = mercatorY(BOUNDS.latMax);
  const south = mercatorY(BOUNDS.latMin);
  const y = ((north - mercatorY(lat)) / (north - south)) * SVG_H;
  return { x, y };
}

interface Marker {
  location: string;
  count: number;
  x: number;
  y: number;
}

export default function StaticLocationMap({
  sightings,
  locationCoordinates,
}: StaticLocationMapProps) {
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  const locationCounts = new Map<string, number>();
  for (const sighting of sightings) {
    locationCounts.set(
      sighting.location,
      (locationCounts.get(sighting.location) ?? 0) + 1
    );
  }

  const markers: Marker[] = [...locationCounts.entries()]
    .map(([location, count]) => {
      const coordinate = locationCoordinates[location];
      if (!coordinate || !isOnMap(coordinate)) return null;
      return {
        location,
        count,
        ...project(coordinate.latitude, coordinate.longitude),
      };
    })
    .filter((marker): marker is Marker => marker !== null);

  const unmappedLocations = [...locationCounts.keys()].filter(
    (location) => !markers.some((marker) => marker.location === location)
  );
  const maxCount = Math.max(...markers.map((marker) => marker.count), 1);

  return (
    <div>
      <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
        Sighting Locations
      </h3>
      <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
        Recorded locations across North East Scotland
      </p>

      <div
        className="relative mt-4 overflow-hidden rounded-xl border border-stone-200 bg-stone-100 shadow-inner dark:border-stone-700 dark:bg-stone-800"
      >
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="list"
          aria-labelledby="location-map-title location-map-description"
        >
          <title id="location-map-title">Sighting locations</title>
          <desc id="location-map-description">
            Static map of North East Scotland with projected sighting markers.
            Focus a marker to hear its location and record count.
          </desc>
          <defs>
            <radialGradient id="staticMapMarkerGlow">
              <stop
                offset="0%"
                stopColor="var(--chart-bar)"
                stopOpacity={0.4}
              />
              <stop
                offset="100%"
                stopColor="var(--chart-bar)"
                stopOpacity={0}
              />
            </radialGradient>
            <filter
              id="staticMapMarkerShadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx="0"
                dy="3"
                stdDeviation="4"
                floodOpacity="0.3"
              />
            </filter>
          </defs>

          <image
            href="/images/maps/north-east-scotland.webp"
            width={SVG_W}
            height={SVG_H}
            preserveAspectRatio="none"
          />
          <rect
            width={SVG_W}
            height={SVG_H}
            className="fill-white/5 dark:fill-stone-950/25"
          />

          <g
            transform="translate(1145 62)"
            className="pointer-events-none"
            aria-hidden="true"
          >
            <path d="M 0 -26 L -8 -5 L 0 -9 L 8 -5 Z" className="fill-stone-800" />
            <text
              x="0"
              y="-33"
              textAnchor="middle"
              className="fill-stone-800"
              fontSize="18"
              fontWeight="700"
            >
              N
            </text>
          </g>

          {markers.map((marker) => {
            const radius = 15 + (marker.count / maxCount) * 11;
            const isActive = activeLocation === marker.location;
            const tooltipX = Math.max(
              113,
              Math.min(marker.x, SVG_W - 113)
            );
            const tooltipY = Math.max(35, marker.y - radius - 39);

            return (
              <g
                key={marker.location}
                onMouseEnter={() => setActiveLocation(marker.location)}
                onMouseLeave={() => setActiveLocation(null)}
                onFocus={() => setActiveLocation(marker.location)}
                onBlur={() => setActiveLocation(null)}
                tabIndex={0}
                role="listitem"
                aria-label={`${marker.location}: ${marker.count} sighting${
                  marker.count === 1 ? "" : "s"
                }`}
                className="cursor-default outline-none"
              >
                <title>
                  {marker.location}: {marker.count} sighting
                  {marker.count === 1 ? "" : "s"}
                </title>
                <circle
                  cx={marker.x}
                  cy={marker.y}
                  r={radius + 16}
                  fill="url(#staticMapMarkerGlow)"
                />
                <circle
                  cx={marker.x}
                  cy={marker.y}
                  r={radius + 6}
                  className="fill-white/90 stroke-amber-700 dark:fill-stone-900/90 dark:stroke-amber-400"
                  strokeWidth={isActive ? 5 : 3}
                  filter="url(#staticMapMarkerShadow)"
                />
                <circle
                  cx={marker.x}
                  cy={marker.y}
                  r={radius}
                  className="fill-amber-700 transition-transform duration-200 dark:fill-amber-500"
                  style={{
                    transform: isActive ? "scale(1.12)" : "scale(1)",
                    transformOrigin: `${marker.x}px ${marker.y}px`,
                  }}
                />
                <text
                  x={marker.x}
                  y={marker.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="pointer-events-none fill-white"
                  fontSize={18}
                  fontWeight={700}
                >
                  {marker.count}
                </text>

                {isActive && (
                  <g className="pointer-events-none">
                    <rect
                      x={tooltipX - 105}
                      y={tooltipY - 27}
                      width={210}
                      height={42}
                      rx={9}
                      className="fill-stone-950/90"
                    />
                    <text
                      x={tooltipX}
                      y={tooltipY}
                      textAnchor="middle"
                      className="fill-white"
                      fontSize={17}
                      fontWeight={600}
                    >
                      {marker.location}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        <p className="absolute bottom-1.5 right-2 rounded bg-white/85 px-1.5 py-0.5 text-[10px] text-stone-700 backdrop-blur-sm dark:bg-stone-900/80 dark:text-stone-300">
          Map data &copy;{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            className="underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenStreetMap contributors
          </a>
        </p>
      </div>

      {unmappedLocations.length > 0 && (
        <p className="mt-2 text-xs text-stone-600 dark:text-stone-400">
          Not shown on the map: {unmappedLocations.join(", ")}.
        </p>
      )}
    </div>
  );
}
