// Character seed data, normalization, and localStorage helpers.

import { RELATIONSHIP_LIMIT } from "./relationships.js";

export const STORAGE_KEY = "oc-recycling-system.characters.v1";

const seedCharacters = [
  { name: "Maya", pronouns: "she/her", personality: "6w2 ENFP", colorHex: "#cf7f81", colorName: "Dusty Pink", group: 5, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false },
  { name: "Madeline", pronouns: "she/her", personality: "2w8 ESFJ", colorHex: "#d62828", colorName: "Bright Strong Red", group: 5, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false },
  { name: "Niall", pronouns: "he/him", personality: "9w2 ESFJ", colorHex: "#6b7c5d", colorName: "Mosswood Green", group: 5, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false },
  { name: "Deirdre", pronouns: "she/her", personality: "8w4 INFJ", colorHex: "#c8981e", colorName: "Aged Gold", group: 5, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false },
  { name: "Linda", pronouns: "she/her", personality: "4w6 ISFP", colorHex: "#5f9e6e", colorName: "Muted Emerald", group: 4, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false },
  { name: "Radcliffe", pronouns: "he/they", personality: "8w1 ISTP", colorHex: "#4b006e", colorName: "Royal Purple", group: 4, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false },
  { name: "Zee", pronouns: "they/them", personality: "4w8 ISTP", colorHex: "#e0218a", colorName: "Barbie Magenta", group: 4, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false },
  { name: "Nik", pronouns: "he/him", personality: "2w4 ISFJ", colorHex: "#800020", colorName: "Maroon", group: 4, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false },
  { name: "Nesto", pronouns: "he/him", personality: "7w2 ESFP", colorHex: "#56633e", colorName: "Olive Green", group: 1, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false },
  { name: "Daeya", pronouns: "she/they", personality: "5w8 ISTJ", colorHex: "#576880", colorName: "Slate Blue", group: 1, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false },
  { name: "Aini", pronouns: "she/her", personality: "2w7 ENFJ", colorHex: "#e3f57f", colorName: "Sunny Pear", group: 1, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false },
  { name: "Shinji", pronouns: "they/them", personality: "9w7 ENFP", colorHex: "#4bd698", colorName: "Minty Teal", group: 1, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false },
  { name: "Harmony", pronouns: "she/her", personality: "3w2 ESFP", colorHex: "#d1783c", colorName: "Burnt Orange", group: 3, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false },
  { name: "Tonic", pronouns: "she/they", personality: "4w9 INFP", colorHex: "#605c29", colorName: "Plaid Green", group: 3, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false },
  { name: "Corey", pronouns: "she/her", personality: "8w3 ESTP", colorHex: "#722f37", colorName: "Wine Red", group: 3, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false },
  { name: "Elijah", pronouns: "they/them", personality: "7w4 ESFP", colorHex: "#c8a2c8", colorName: "Lilac", group: 3, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false },
  { name: "Patty", pronouns: "she/they", personality: "6w4 ISFJ", colorHex: "#aba39b", colorName: "Hearthstone Grey", group: 2, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false },
  { name: "Penny", pronouns: "she/her", personality: "3w6 ESFP", colorHex: "#673f79", colorName: "Plum Royale", group: 2, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false },
  { name: "Silas", pronouns: "he/him", personality: "4w8 ENTP", colorHex: "#c96f3d", colorName: "Molten Copper", group: 2, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false },
  { name: "Fiona", pronouns: "she/her", personality: "8w4 ENFJ", colorHex: "#7d1e3e", colorName: "Garnet Glare", group: 2, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false }
];

const relationshipSeeds = [
  ["Nesto", "Daeya"], ["Fiona", "Penny"], ["Harmony", "Tonic"], ["Elijah", "Radcliffe"],
  ["Niall", "Madeline"], ["Maya", "Harmony"], ["Linda", "Radcliffe"], ["Deirdre", "Niall"],
  ["Niall", "Maya"], ["Madeline", "Maya"], ["Aini", "Shinji"], ["Zee", "Nesto"],
  ["Zee", "Daeya"], ["Elijah", "Zee"]
];

export function parsePersonality(personality) {
  const [enneagram = "", mbti = ""] = String(personality || "").trim().split(/\s+/);
  return { enneagram, mbti };
}

function buildPlaceholderText(name, group) {
  return `${name} is archived in Group ${group}. This profile needs a fuller narrative pass, so this note marks where lore, timeline beats, and emotional stakes can be expanded later.`;
}

function buildAppearance(name, colorName) {
  return {
    height: "To be decided",
    bodyType: `Placeholder silhouette with ${colorName.toLowerCase()} styling cues`,
    hair: `${name}'s hair details still need a final note`,
    eyes: "Appearance notes pending",
    skin: "Complexion notes pending"
  };
}

export function normalizeCharacter(rawCharacter, index = 0) {
  const personality = rawCharacter.personality || `${rawCharacter.enneagram || ""} ${rawCharacter.mbti || ""}`.trim();
  const parsed = parsePersonality(personality);
  const appearance = rawCharacter.appearance || {};

  return {
    id: Number(rawCharacter.id) || index + 1,
    name: rawCharacter.name || "Untitled OC",
    pronouns: rawCharacter.pronouns || "unknown",
    personality,
    mbti: rawCharacter.mbti || parsed.mbti,
    enneagram: rawCharacter.enneagram || parsed.enneagram,
    colorHex: rawCharacter.colorHex || "#888888",
    colorName: rawCharacter.colorName || "Unsorted",
    group: Number(rawCharacter.group) || 1,
    excelStatus: Boolean(rawCharacter.excelStatus),
    discordStatus: Boolean(rawCharacter.discordStatus),
    tumblrStatus: Boolean(rawCharacter.tumblrStatus),
    ao3Status: Boolean(rawCharacter.ao3Status),
    backstory: rawCharacter.backstory || "Backstory note pending.",
    appearance: {
      height: appearance.height || "To be decided",
      bodyType: appearance.bodyType || "To be decided",
      hair: appearance.hair || "To be decided",
      eyes: appearance.eyes || "To be decided",
      skin: appearance.skin || "To be decided"
    },
    relationships: Array.isArray(rawCharacter.relationships)
      ? rawCharacter.relationships.map((value) => Number(value)).filter((value, idx, array) => Number.isInteger(value) && value > 0 && array.indexOf(value) === idx).slice(0, RELATIONSHIP_LIMIT)
      : []
  };
}

export function createSeedData() {
  const byName = new Map();
  const characters = seedCharacters.map((character, index) => {
    const parsed = parsePersonality(character.personality);
    const record = {
      id: index + 1,
      name: character.name,
      pronouns: character.pronouns,
      personality: character.personality,
      mbti: parsed.mbti,
      enneagram: parsed.enneagram,
      colorHex: character.colorHex,
      colorName: character.colorName,
      group: character.group,
      excelStatus: Boolean(character.excelStatus),
      discordStatus: Boolean(character.discordStatus),
      tumblrStatus: Boolean(character.tumblrStatus),
      ao3Status: Boolean(character.ao3Status),
      backstory: buildPlaceholderText(character.name, character.group),
      appearance: buildAppearance(character.name, character.colorName),
      relationships: []
    };
    byName.set(character.name, record.id);
    return record;
  });

  for (const [fromName, toName] of relationshipSeeds) {
    const fromId = byName.get(fromName);
    const toId = byName.get(toName);
    if (!fromId || !toId) continue;
    const fromCharacter = characters.find((item) => item.id === fromId);
    const toCharacter = characters.find((item) => item.id === toId);
    if (fromCharacter.relationships.length < RELATIONSHIP_LIMIT && !fromCharacter.relationships.includes(toId)) fromCharacter.relationships.push(toId);
    if (toCharacter.relationships.length < RELATIONSHIP_LIMIT && !toCharacter.relationships.includes(fromId)) toCharacter.relationships.push(fromId);
  }

  return characters;
}

export function loadCharacters() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return createSeedData();
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return createSeedData();
    return parsed.map(normalizeCharacter);
  } catch (error) {
    console.error("Failed to load characters from localStorage.", error);
    return createSeedData();
  }
}

export function saveCharacters(characters) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
}

export function exportCharacters(characters) {
  const payload = JSON.stringify(characters, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `oc-recycling-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function importCharacters(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "[]"));
        if (!Array.isArray(parsed)) return reject(new Error("The imported JSON must be an array of characters."));
        resolve(parsed.map(normalizeCharacter));
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error || new Error("Unable to read file."));
    reader.readAsText(file);
  });
}
