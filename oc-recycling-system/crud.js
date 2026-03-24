// Form serialization, validation, and collection updates.

import { RELATIONSHIP_LIMIT } from "./relationships.js";

export function getNextId(characters) {
  return characters.reduce((max, character) => Math.max(max, character.id), 0) + 1;
}

export function serializeForm(form, parsePersonality) {
  const data = new FormData(form);
  const id = data.get("id");
  const personality = String(data.get("personality") || "").trim();
  const parsed = parsePersonality(personality);

  const relationships = String(data.get("relationships") || "")
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value, index, array) => Number.isInteger(value) && value > 0 && array.indexOf(value) === index)
    .slice(0, RELATIONSHIP_LIMIT);

  return {
    id: id ? Number(id) : null,
    name: String(data.get("name") || "").trim(),
    pronouns: String(data.get("pronouns") || "").trim(),
    personality,
    mbti: parsed.mbti,
    enneagram: parsed.enneagram,
    colorHex: String(data.get("colorHex") || "").trim(),
    colorName: String(data.get("colorName") || "").trim(),
    group: Number(data.get("group") || 0),
    excelStatus: data.get("excelStatus") === "on",
    discordStatus: data.get("discordStatus") === "on",
    tumblrStatus: data.get("tumblrStatus") === "on",
    ao3Status: data.get("ao3Status") === "on",
    backstory: String(data.get("backstory") || "").trim(),
    appearance: {
      height: String(data.get("height") || "").trim(),
      bodyType: String(data.get("bodyType") || "").trim(),
      hair: String(data.get("hair") || "").trim(),
      eyes: String(data.get("eyes") || "").trim(),
      skin: String(data.get("skin") || "").trim()
    },
    relationships
  };
}

export function validateCharacter(character) {
  const errors = [];

  for (const field of ["name", "pronouns", "personality", "colorHex", "colorName", "backstory"]) {
    if (!character[field]) errors.push(`${field} is required.`);
  }

  if (!/^#[\da-fA-F]{6}$/.test(character.colorHex)) {
    errors.push("colorHex must use the format #RRGGBB.");
  }

  if (character.group < 1 || character.group > 5) {
    errors.push("group must be between 1 and 5.");
  }

  if (!character.mbti || !character.enneagram) {
    errors.push("personality should follow the pattern '6w2 ENFP'.");
  }

  if (character.relationships.length > RELATIONSHIP_LIMIT) {
    errors.push(`Only ${RELATIONSHIP_LIMIT} relationships are allowed per character.`);
  }

  if (character.relationships.includes(character.id)) {
    errors.push("A character cannot relate to themself.");
  }

  return errors;
}

export function upsertCharacter(characters, character) {
  if (character.id) {
    return characters.map((item) => item.id === character.id ? character : item);
  }

  return [...characters, { ...character, id: getNextId(characters) }];
}

export function deleteCharacter(characters, id) {
  return characters
    .filter((character) => character.id !== id)
    .map((character) => ({
      ...character,
      relationships: character.relationships.filter((relationshipId) => relationshipId !== id)
    }));
}
