const { execSync } = require("child_process");

const ports = [3000, 3031];

for (const port of ports) {
  try {
    const pids = execSync(`lsof -ti :${port}`, { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim()
      .split("\n")
      .filter(Boolean);

    if (pids.length === 0) {
      continue;
    }

    execSync(`kill -9 ${pids.join(" ")}`);
    console.log(`Freed port ${port} (pid ${pids.join(", ")})`);
  } catch {
    // Port was already free
  }
}
