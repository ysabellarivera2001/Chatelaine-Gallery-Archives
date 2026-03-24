import { validateCharacter } from "../utils/validation";

export const STORAGE_KEY = "oc-recycling-system-v1";
export const MAX_RELATIONSHIPS = 4;

const characterRows = [
  ["Maya", "she/her", "6w2 ENFP", "#cf7f81", "Dusty Pink", 5],
  ["Madeline", "she/her", "2w8 ESFJ", "#d62828", "Bright Strong Red", 5],
  ["Niall", "he/him", "9w2 ESFJ", "#6b7c5d", "Mosswood Green", 5],
  ["Deirdre", "she/her", "8w4 INFJ", "#c8981e", "Aged Gold", 5],
  ["Linda", "she/her", "4w6 ISFP", "#5f9e6e", "Muted Emerald Green", 4],
  ["Radcliffe", "he/they", "8w1 ISTP", "#4b006e", "Royal Purple", 4],
  ["Zee", "they/them", "4w8 ISTP", "#e0218a", "Barbie Magenta", 4],
  ["Nik", "he/him", "2w4 ISFJ", "#800020", "Maroon", 4],
  ["Nesto", "he/him", "7w2 ESFP", "#56633e", "Olive Green", 1],
  ["Daeya", "she/they", "5w8 ISTJ", "#576880", "Slate Blue", 1],
  ["Aini", "she/her", "2w7 ENFJ", "#e3f57f", "Sunny Pear", 1],
  ["Shinji", "they/them", "9w7 ENFP", "#4bd698", "Minty Teal", 1],
  ["Harmony", "she/her", "3w2 ESFP", "#d1783c", "Burnt Orange", 3],
  ["Tonic", "she/they", "4w9 INFP", "#605c29", "Plaid Green", 3],
  ["Corey", "she/her", "8w3 ESTP", "#722f37", "Wine Red", 3],
  ["Elijah", "they/them", "7w4 ESFP", "#c8a2c8", "Lilac", 3],
  ["Patty", "she/they", "6w4 ISFJ", "#aba39b", "Hearthstone Grey", 2],
  ["Penny", "she/her", "3w6 ESFP", "#673f79", "Plum Royale", 2],
  ["Silas", "he/him", "4w8 ENTP", "#c96f3d", "Molten Copper", 2],
  ["Fiona", "she/her", "8w4 ENFJ", "#7d1e3e", "Garnet Glare", 2]
];

const relationshipPairs = [
  ["Nesto", "Daeya"],
  ["Fiona", "Penny"],
  ["Harmony", "Tonic"],
  ["Elijah", "Radcliffe"],
  ["Niall", "Madeline"],
  ["Maya", "Harmony"],
  ["Linda", "Radcliffe"],
  ["Deirdre", "Niall"],
  ["Niall", "Maya"],
  ["Madeline", "Maya"],
  ["Aini", "Shinji"],
  ["Zee", "Nesto"],
  ["Zee", "Daeya"],
  ["Elijah", "Zee"],
  ["Silas", "Fiona"]
];

export function parsePersonality(personality) {
  const [enneagram = "", mbti = ""] = String(personality).trim().split(/\s+/);
  return { enneagram, mbti };
}

function buildBackstory(name, group, colorName) {
  return `${name} is a Group ${group} character with ${colorName} vibes. Full backstory pending.`;
}

function buildAppearance() {
  return {
    height: "To be decided",
    bodyType: "To be decided",
    hair: "To be decided",
    eyes: "To be decided",
    skin: "To be decided"
  };
}

function buildRelationshipMap(rows, pairs) {
  const nameToId = new Map(rows.map((row, index) => [row[0], index + 1]));
  const map = new Map(rows.map((_, index) => [index + 1, []]));

  pairs.forEach(([left, right]) => {
    const leftId = nameToId.get(left);
    const rightId = nameToId.get(right);
    if (!leftId || !rightId) return;

    if (map.get(leftId).length < MAX_RELATIONSHIPS && !map.get(leftId).includes(rightId)) {
      map.get(leftId).push(rightId);
    }
    if (map.get(rightId).length < MAX_RELATIONSHIPS && !map.get(rightId).includes(leftId)) {
      map.get(rightId).push(leftId);
    }
  });

  return map;
}

export function createSeedCharacters() {
  const relationshipMap = buildRelationshipMap(characterRows, relationshipPairs);

  return characterRows.map(([name, pronouns, personality, colorHex, colorName, group], index) => {
    const { mbti, enneagram } = parsePersonality(personality);

    return {
      id: index + 1,
      name,
      pronouns,
      personality,
      mbti,
      enneagram,
      colorHex,
      colorName,
      group,
      excelStatus: false,
      discordStatus: false,
      tumblrStatus: false,
      ao3Status: false,
      backstory: buildBackstory(name, group, colorName),
      appearance: buildAppearance(),
      relationships: relationshipMap.get(index + 1) ?? []
    };
  });
}

export function sanitizeCharacter(character) {
  const { mbti, enneagram } = parsePersonality(character.personality);

  return {
    id: Number(character.id),
    name: String(character.name ?? "").trim(),
    pronouns: String(character.pronouns ?? "").trim(),
    personality: String(character.personality ?? "").trim(),
    mbti,
    enneagram,
    colorHex: String(character.colorHex ?? "").trim(),
    colorName: String(character.colorName ?? "").trim(),
    group: Number(character.group),
    excelStatus: Boolean(character.excelStatus),
    discordStatus: Boolean(character.discordStatus),
    tumblrStatus: Boolean(character.tumblrStatus),
    ao3Status: Boolean(character.ao3Status),
    backstory: String(character.backstory ?? "").trim(),
    appearance: {
      height: String(character.appearance?.height ?? "").trim(),
      bodyType: String(character.appearance?.bodyType ?? "").trim(),
      hair: String(character.appearance?.hair ?? "").trim(),
      eyes: String(character.appearance?.eyes ?? "").trim(),
      skin: String(character.appearance?.skin ?? "").trim()
    },
    relationships: Array.isArray(character.relationships)
      ? character.relationships.map(Number).filter((value) => Number.isInteger(value))
      : []
  };
}

export function normalizeCharacters(characters) {
  if (!Array.isArray(characters)) {
    throw new Error("Imported data must be an array of characters.");
  }

  const normalized = characters.map(sanitizeCharacter);
  const validIds = normalized.map((character) => character.id);
  const allErrors = normalized.flatMap((character) => validateCharacter(character, validIds));

  if (allErrors.length) {
    throw new Error(allErrors.join("\n"));
  }

  return normalized;
}

export function loadCharacters() {
  if (typeof window === "undefined") {
    return createSeedCharacters();
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    const seed = createSeedCharacters();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }

  try {
    return normalizeCharacters(JSON.parse(saved));
  } catch (error) {
    console.error("Failed to load local data, falling back to seed characters.", error);
    const seed = createSeedCharacters();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
}

export function saveCharacters(characters) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
}
