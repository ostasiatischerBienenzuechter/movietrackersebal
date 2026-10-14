const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/** Crypto-random ID from [A-Za-z0-9]. Works without a secure context, unlike `crypto.randomUUID`. */
export function randomId(length: number): string {
  // Largest multiple of the alphabet size below 256, so every character is equally likely.
  const limit = 256 - (256 % ALPHABET.length);
  let id = "";
  while (id.length < length) {
    for (const byte of crypto.getRandomValues(new Uint8Array(length * 2))) {
      if (byte < limit && id.length < length)
        id += ALPHABET[byte % ALPHABET.length];
    }
  }
  return id;
}
