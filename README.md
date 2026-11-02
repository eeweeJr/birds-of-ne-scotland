# Rare Birds of North East Scotland

[![CI](https://github.com/eeweeJr/birds-of-ne-scotland/actions/workflows/ci.yml/badge.svg)](https://github.com/eeweeJr/birds-of-ne-scotland/actions/workflows/ci.yml)

A small [Next.js](https://nextjs.org/) website for browsing rare and notable
bird species in North East Scotland. Each species has a location map, a
timeline of sightings and a full sighting log.

> **The sightings are sample data.** Every record, observer name and note in
> `src/data/sightings.csv` is invented for illustration. None of them is a
> real or verified bird record.

The whole site is generated from two CSV files when it is built. There is no
database or server-side storage, and no visitor data is collected.

## Quick start

Requires [Node.js](https://nodejs.org/) 20.9 or newer.

```bash
npm install
npm run dev      # development server at http://localhost:3000
npm run check    # lint, type-check and production build, as CI does
```

## Running the demo on a new Mac

The Mac does not need Python, Git, Homebrew, or any developer tools. It only
needs Node.js, which includes the `npm` package installer used by this project.

### 1. Transfer the project

Copy the project ZIP to the new Mac and double-click it to extract the folder.
Keep the complete folder together; do not move individual files out of it.

### 2. Install Node.js

1. Visit [nodejs.org/en/download](https://nodejs.org/en/download).
2. Download the current **LTS** macOS Installer (`.pkg`).
3. Open the installer and accept its default options.

This is the only software that must be installed.

### 3. Start the website

Open the extracted folder and double-click:

```text
START_RARE_BIRDS.command
```

Every launch rebuilds the site from the code and sightings on this computer,
then:

1. Installs website packages the first time, and again if those packages change.
2. Builds the production website.
3. Starts it at [http://localhost:3000](http://localhost:3000).
4. Opens the site in the default browser.

The first run requires an internet connection and may take a few minutes.
Later launches still rebuild, so they take longer than simply opening a page,
but they do not need the internet unless the packages have changed.

Keep the Terminal window open while using the site. Press `Control-C` in that
window to stop it. Close that window before launching the site again, so the
new copy can use the same address.

## If macOS says the launcher is damaged

The launcher is a plain-text shell script, but macOS may quarantine executable
files that arrived in a downloaded ZIP. If it says
`START_RARE_BIRDS.command is damaged and can't be opened`, remove that
quarantine flag once:

1. Open **Terminal** from Applications → Utilities.
2. Copy and paste the following text, including the space at the end:

```bash
xattr -dr com.apple.quarantine 
```

3. Drag the entire extracted project folder from Finder into the
   Terminal window. Its path will be added after the command.
4. Press Return.
5. Double-click `START_RARE_BIRDS.command` again.

This only removes the downloaded-file quarantine flag from this project
folder. It does not disable Gatekeeper or change the Mac's security settings.

## Other launcher problems

If macOS says the file cannot be opened:

1. Control-click `START_RARE_BIRDS.command`.
2. Select **Open**.
3. Select **Open** again in the confirmation dialog.

If it reports a permissions error, open Terminal and run:

```bash
cd 
```

After typing `cd `, drag the extracted project folder into the Terminal window,
press Return, then run:

```bash
chmod +x START_RARE_BIRDS.command
./START_RARE_BIRDS.command
```

## Opening it on another device

The launcher prints one or more **On the same Wi-Fi** addresses, for example:

```text
http://192.168.1.20:3000
```

Enter that address in Safari on another computer, phone, or tablet connected
to the same Wi-Fi network. If macOS asks whether Node may accept incoming
connections, select **Allow**.

These local-network addresses are not accessible over the wider internet.

## Updating sightings

Sightings live in `src/data/sightings.csv`. Edit that file in Excel, Numbers,
or a text editor, then double-click `START_RARE_BIRDS.command` again. The
launcher reads the spreadsheet at that moment and rebuilds the site, so a new
bird or a new sighting appears after the rebuild finishes.

The first row must stay as the column names:

```text
bird,location,year,month,day,spotter,notes
```

`bird`, `location`, and `year` are required. `month`, `day`, `spotter`, and
`notes` can be left blank. `month` is a number from 1 to 12, or a month name
such as `October`. `day` is the day of that month, and it needs a month. When
both are filled in, the sighting log shows the full date. Save the file as
CSV. Spreadsheet apps add quotation marks around values that contain commas;
leave those in place.

The build stops with a message naming the row if it finds a mistake:

- a missing bird, location or year, or a month or day that does not exist;
- a sighting dated in the future;
- the same bird or location spelled two different ways (for example
  `Waxwing` and `waxwing`), which would otherwise split one species in two;
- two bird names that would share the same web address.

Never add sightings that reveal where a specially protected (Schedule 1)
species is breeding. Publishing nest sites can lead to disturbance, which is
an offence in Scotland.

Code changes are included in the same rebuild. After adding a chart, a page,
or any other change, launch the site again with the command file.

## Updating map locations

Map coordinates live in `src/data/locations.csv`. Its first row must stay:

```text
location,latitude,longitude
```

The location name must exactly match the location used in
`src/data/sightings.csv`. Latitude and longitude use decimal degrees; locations
in Scotland have a positive latitude and a negative longitude. For example:

```text
"Girdle Ness, Aberdeen",57.1394,-2.0466
```

Quotation marks are needed when a location name contains a comma. Add one row
for each new sighting location, save the CSV, and launch the site again. If a
sighting has no matching row, or its coordinates fall outside the map, the
species page lists that location as "Not shown on the map". The build also
prints a warning naming it.

## Troubleshooting

- **The browser says it cannot connect:** confirm the Terminal window is still
  open and shows that Next.js is ready.
- **Port 3000 is already in use:** close any other copy of the demo and launch
  it again.
- **A package download fails:** check the internet connection and run the
  launcher again.
- **Changes are not appearing:** close the previous Terminal window, confirm
  `src/data/sightings.csv` was saved, and double-click
  `START_RARE_BIRDS.command` again. Wait until the rebuild finishes.

## Development commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type check |
| `npm run build` | Production build, which also validates both CSV files |
| `npm run check` | All three of the above, as run by CI on every push |
| `npm run demo` | Install if needed, build, and serve on the local network |

## Licence and credits

The code is released under the [MIT licence](LICENSE).

Bird photographs come from Wikimedia Commons and iNaturalist and keep their
own Creative Commons licences. Authors and licences are listed in
[`public/images/birds/README.md`](public/images/birds/README.md), on each
species page and on the site's About page. Map data is ©
[OpenStreetMap contributors](https://www.openstreetmap.org/copyright),
available under the Open Database Licence.
