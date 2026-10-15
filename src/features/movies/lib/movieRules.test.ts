import { describe, expect, it } from "vitest";
import { findDuplicate, moviesForView, titleKey } from "./movieRules";
import type { Movie } from "../types";

function movie(
  id: string,
  title: string,
  createdAt: number,
  watchedAt: number | null = null,
): Movie {
  return {
    id,
    title,
    posterUrl: null,
    addedBy: { id: "p", name: "Anna", emoji: "🦊" },
    createdAt,
    watchedAt,
  };
}

describe("titleKey", () => {
  it("ignores case and surrounding whitespace only", () => {
    expect(titleKey("  Inception ")).toBe("inception");
    expect(titleKey("The  Matrix")).toBe("the  matrix");
  });
});

describe("findDuplicate", () => {
  const movies = [movie("1", "Inception", 1), movie("2", "Up", 2, 5)];

  it("finds matches across both lists", () => {
    expect(findDuplicate(movies, " inception")?.id).toBe("1");
    expect(findDuplicate(movies, "UP")?.id).toBe("2");
  });

  it("requires an otherwise exact match", () => {
    expect(findDuplicate(movies, "Inception 2")).toBeUndefined();
  });

  it("ignores the movie being edited", () => {
    expect(findDuplicate(movies, "inception", "1")).toBeUndefined();
  });
});

describe("moviesForView", () => {
  const movies = [
    movie("a", "Alpha", 3),
    movie("b", "Beta", 1),
    movie("c", "Gamma", 2, 10),
    movie("d", "Delta", 4, 20),
  ];

  it("orders the watchlist oldest first", () => {
    expect(moviesForView(movies, "watchlist", "").map((m) => m.id)).toEqual([
      "b",
      "a",
    ]);
  });

  it("orders watched by most recently watched", () => {
    expect(moviesForView(movies, "watched", "").map((m) => m.id)).toEqual([
      "d",
      "c",
    ]);
  });

  it("filters by title", () => {
    expect(moviesForView(movies, "watchlist", "alp").map((m) => m.id)).toEqual([
      "a",
    ]);
  });
});
