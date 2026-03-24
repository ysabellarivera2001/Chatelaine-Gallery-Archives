// Search and filter helpers for the archive.

export function getUniqueValues(characters, key) {
  return [...new Set(characters.map((character) => character[key]).filter(Boolean))].sort();
}

export function matchesStatusFilter(character, statusFilter) {
  if (!statusFilter) return true;

  const mapping = {
    excel: character.excelStatus,
    discord: character.discordStatus,
    tumblr: character.tumblrStatus,
    ao3: character.ao3Status
  };

  return Boolean(mapping[statusFilter]);
}

export function filterCharacters(characters, filters) {
  const query = String(filters.query || "").trim().toLowerCase();

  return characters.filter((character) => {
    const searchableText = [
      character.name,
      character.pronouns,
      character.personality,
      character.backstory,
      character.colorName
    ].join(" ").toLowerCase();

    return (!query || searchableText.includes(query)) &&
      (!filters.mbti || character.mbti === filters.mbti) &&
      (!filters.enneagram || character.enneagram === filters.enneagram) &&
      (!filters.group || Number(filters.group) === character.group) &&
      matchesStatusFilter(character, filters.status);
  });
}
