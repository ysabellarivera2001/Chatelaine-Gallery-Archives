export function filterBySearch(characters, query) {
  if (!query) return characters;

  const lowered = query.toLowerCase();
  return characters.filter((character) =>
    [character.name, character.pronouns, character.personality, character.backstory, character.colorName]
      .join(" ")
      .toLowerCase()
      .includes(lowered)
  );
}

export function filterByMBTI(characters, mbti) {
  if (!mbti) return characters;
  return characters.filter((character) => character.mbti === mbti);
}

export function filterByEnneagram(characters, enneagram) {
  if (!enneagram) return characters;
  return characters.filter((character) => character.enneagram === enneagram);
}

export function filterByGroup(characters, group) {
  if (!group) return characters;
  return characters.filter((character) => character.group === Number(group));
}

export function filterByStatus(characters, statusFlag) {
  if (!statusFlag) return characters;
  const field = `${statusFlag}Status`;
  return characters.filter((character) => Boolean(character[field]));
}

export function getUniqueMBTIs(characters) {
  return [...new Set(characters.map((character) => character.mbti).filter(Boolean))].sort();
}

export function getUniqueEnneagrams(characters) {
  return [...new Set(characters.map((character) => character.enneagram).filter(Boolean))].sort();
}
