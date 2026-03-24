const HEX_PATTERN = /^#[\da-fA-F]{6}$/;

export function validateCharacter(character, validIds = []) {
  const errors = [];
  const relationships = Array.isArray(character.relationships) ? character.relationships.map(Number) : [];

  ["name", "pronouns", "personality", "colorHex", "colorName", "backstory"].forEach((field) => {
    if (!String(character[field] ?? "").trim()) {
      errors.push(`${field} is required.`);
    }
  });

  if (!HEX_PATTERN.test(String(character.colorHex ?? "").trim())) {
    errors.push("colorHex must match #RRGGBB.");
  }

  const group = Number(character.group);
  if (!Number.isInteger(group) || group < 1 || group > 5) {
    errors.push("group must be a number between 1 and 5.");
  }

  const [enneagram = "", mbti = ""] = String(character.personality ?? "").trim().split(/\s+/);
  if (!enneagram || !mbti) {
    errors.push('personality must include enneagram and MBTI, for example "6w2 ENFP".');
  }

  if (relationships.length > 4) {
    errors.push("relationships cannot have more than 4 IDs.");
  }

  if (relationships.includes(Number(character.id))) {
    errors.push("relationships cannot include the character's own ID.");
  }

  if (validIds.length && relationships.some((id) => !validIds.includes(id))) {
    errors.push("relationships must only include existing IDs.");
  }

  return errors;
}
