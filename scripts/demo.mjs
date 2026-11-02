import { existsSync, statSync } from "node:fs";
import { networkInterfaces } from "node:os";
import { spawn, spawnSync } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";

function fail(message) {
  console.error(`\n${message}\n`);
  process.exit(1);
}

function run(command, args, label) {
  console.log(`\n${label}\n`);
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
  });

  if (result.error) fail(`${label} failed: ${result.error.message}`);
  if (result.status !== 0) fail(`${label} failed with exit code ${result.status}.`);
}

const [major, minor] = process.versions.node.split(".").map(Number);
if (major < 20 || (major === 20 && minor < 9)) {
  fail(
    `Node.js 20.9 or newer is required. You currently have ${process.versions.node}.\n` +
      "Download the current LTS release from https://nodejs.org/"
  );
}

function needsInstall() {
  const installedLock = "node_modules/.package-lock.json";
  if (!existsSync("node_modules/next/package.json") || !existsSync(installedLock)) {
    return true;
  }

  const installedTime = statSync(installedLock).mtimeMs;
  return ["package.json", "package-lock.json"].some(
    (file) => existsSync(file) && statSync(file).mtimeMs > installedTime
  );
}

if (needsInstall()) {
  const firstInstall = !existsSync("node_modules/next/package.json");
  run(
    npm,
    existsSync("package-lock.json") ? ["ci", "--include=dev"] : ["install", "--include=dev"],
    firstInstall
      ? "First-time setup: installing website packages..."
      : "Updating website packages..."
  );
}

run(
  npm,
  ["run", "build"],
  "Rebuilding the website from the latest code and sightings..."
);

const addresses = Object.values(networkInterfaces())
  .flat()
  .filter(
    (address) =>
      address &&
      address.family === "IPv4" &&
      !address.internal &&
      !address.address.startsWith("169.254.")
  )
  .map((address) => address.address);

console.log("\nRare Birds demo is starting.\n");
console.log("On this computer: http://localhost:3000");
for (const address of addresses) {
  console.log(`On the same Wi-Fi: http://${address}:3000`);
}
console.log("\nKeep this window open. Press Ctrl+C to stop the website.\n");

const server = spawn(
  npm,
  ["run", "start", "--", "--hostname", "0.0.0.0", "--port", "3000"],
  {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
  }
);

if (process.platform === "darwin") {
  setTimeout(() => {
    const browser = spawn("open", ["http://localhost:3000"], {
      detached: true,
      stdio: "ignore",
    });
    browser.unref();
  }, 1800);
}

server.on("error", (error) => fail(`The website could not start: ${error.message}`));
server.on("exit", (code) => process.exit(code ?? 0));

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.kill(signal);
  });
}
