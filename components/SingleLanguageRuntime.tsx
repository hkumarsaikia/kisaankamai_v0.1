export function SingleLanguageRuntime() {
  // Shared public surfaces now render explicit localized strings at source.
  // Avoid mutating the live DOM after first paint, which caused mixed-language flashes.
  return null;
}
