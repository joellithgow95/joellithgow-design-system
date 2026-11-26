// Light/dark scheme preference: "system" follows the OS, "light"/"dark" force it.
// The choice is stored in localStorage and applied as data-scheme on <html>,
// which base.css maps to color-scheme. No attribute means "system".

export const SCHEMES = ["system", "light", "dark"] as const;
export type Scheme = (typeof SCHEMES)[number];

export const SCHEME_STORAGE_KEY = "jrl-scheme";
export const SCHEME_CHANGE_EVENT = "jrl-scheme-change";

/**
 * Inline this in <head>, before any stylesheet, so a stored choice applies
 * before first paint. Without it a static page flashes the OS scheme first.
 *
 * Astro: <script is:inline set:html={SCHEME_INIT_SCRIPT} />
 */
export const SCHEME_INIT_SCRIPT = `try{var s=localStorage.getItem("${SCHEME_STORAGE_KEY}");if(s==="light"||s==="dark")document.documentElement.dataset.scheme=s}catch(e){}`;

function isScheme(value: string | null): value is Scheme {
  return SCHEMES.includes(value as Scheme);
}

export function getScheme(): Scheme {
  try {
    const stored = localStorage.getItem(SCHEME_STORAGE_KEY);
    return isScheme(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

export function setScheme(scheme: Scheme): void {
  const root = document.documentElement;

  if (scheme === "system") {
    delete root.dataset.scheme;
  } else {
    root.dataset.scheme = scheme;
  }

  try {
    localStorage.setItem(SCHEME_STORAGE_KEY, scheme);
  } catch {
    // Private mode or blocked storage: the choice lasts for this page only.
  }

  window.dispatchEvent(new CustomEvent<Scheme>(SCHEME_CHANGE_EVENT, { detail: scheme }));
}
