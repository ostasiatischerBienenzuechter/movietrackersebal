import { describe, expect, it } from "vitest";
import {
  createListId,
  isValidListId,
  listIdFromHash,
  shareUrl,
} from "./listId";

describe("createListId", () => {
  it("creates long, valid, distinct IDs", () => {
    const a = createListId();
    const b = createListId();
    expect(a).toHaveLength(24);
    expect(isValidListId(a)).toBe(true);
    expect(a).not.toBe(b);
  });
});

describe("listIdFromHash", () => {
  const id = "abcdefghijklmnopqrstuvwx";

  it("reads the ID from a list hash", () => {
    expect(listIdFromHash(`#/l/${id}`)).toBe(id);
  });

  it("rejects missing, short or malformed IDs", () => {
    expect(listIdFromHash("")).toBeNull();
    expect(listIdFromHash("#/l/short")).toBeNull();
    expect(listIdFromHash(`#/l/${id}/x`)).toBeNull();
    expect(listIdFromHash(`#/l/${id}!`)).toBeNull();
  });
});

describe("shareUrl", () => {
  it("builds a link to the list on the current page", () => {
    expect(
      shareUrl({ origin: "https://me.github.io", pathname: "/gflist/" }, "abc"),
    ).toBe("https://me.github.io/gflist/#/l/abc");
  });
});
