const blacklist = new Set<string>();

export function isBlacklisted(pair: string): boolean {
  return blacklist.has(pair);
}

export function blacklistPair(pair: string) {
  blacklist.add(pair);
  console.log(`🛑 Pair blacklisted: ${pair}`);
}
