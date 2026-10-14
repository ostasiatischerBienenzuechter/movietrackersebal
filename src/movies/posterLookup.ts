interface WikiSearchResponse {
  query?: {
    pages?: Record<string, { index?: number; thumbnail?: { source?: string } }>;
  };
}

async function searchWikipedia(
  lang: "en" | "de",
  term: string,
): Promise<string | null> {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: term,
    gsrlimit: "1",
    prop: "pageimages",
    piprop: "thumbnail",
    pithumbsize: "200",
    pilicense: "any",
    format: "json",
    origin: "*",
  });
  const response = await fetch(
    `https://${lang}.wikipedia.org/w/api.php?${params.toString()}`,
  );
  if (!response.ok) return null;
  const data = (await response.json()) as WikiSearchResponse;
  const page = Object.values(data.query?.pages ?? {})[0];
  return page?.thumbnail?.source ?? null;
}

/** Best-effort poster lookup; wrong matches are accepted, failures yield null. */
export async function findPoster(title: string): Promise<string | null> {
  try {
    return (
      (await searchWikipedia("en", `${title.trim()} film`)) ??
      (await searchWikipedia("de", `${title.trim()} Film`))
    );
  } catch {
    return null;
  }
}
