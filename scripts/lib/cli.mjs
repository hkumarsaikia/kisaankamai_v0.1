export function parseArgs(argv = process.argv.slice(2)) {
  const options = { _: [] };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith("--")) {
      options._.push(token);
      continue;
    }

    if (token === "--help" || token === "-h") {
      options.help = true;
      continue;
    }

    if (token.startsWith("--no-")) {
      options[token.slice(5)] = false;
      continue;
    }

    const trimmed = token.slice(2);
    const equalsIndex = trimmed.indexOf("=");

    if (equalsIndex >= 0) {
      const key = trimmed.slice(0, equalsIndex);
      const value = trimmed.slice(equalsIndex + 1);
      assignOption(options, key, value);
      continue;
    }

    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      assignOption(options, trimmed, next);
      index += 1;
      continue;
    }

    assignOption(options, trimmed, true);
  }

  return options;
}

function assignOption(options, key, value) {
  const current = options[key];
  if (current === undefined) {
    options[key] = value;
    return;
  }

  if (Array.isArray(current)) {
    current.push(value);
    return;
  }

  options[key] = [current, value];
}

export function getStringOption(options, key, fallback = "") {
  const value = options[key];
  if (Array.isArray(value)) {
    return value[value.length - 1] ?? fallback;
  }
  if (value === undefined || value === true || value === false) {
    return fallback;
  }
  return String(value);
}

export function getStringArrayOption(options, key) {
  const value = options[key];
  if (value === undefined) {
    return [];
  }
  return (Array.isArray(value) ? value : [value]).map((entry) => String(entry));
}

export function getBooleanOption(options, key, fallback = false) {
  const value = options[key];
  if (value === undefined) {
    return fallback;
  }
  if (typeof value === "boolean") {
    return value;
  }
  const normalized = String(Array.isArray(value) ? value[value.length - 1] : value).toLowerCase();
  return !["0", "false", "no", "off"].includes(normalized);
}

export function getNumberOption(options, key, fallback = 0) {
  const value = Number.parseFloat(getStringOption(options, key, ""));
  return Number.isFinite(value) ? value : fallback;
}

export function printUsage(lines) {
  console.log(lines.join("\n"));
}
