// Relationship lookups and radial SVG visualization.

export const RELATIONSHIP_LIMIT = 4;

export function getCharacterById(characters, id) {
  return characters.find((character) => character.id === Number(id));
}

export function getRelationshipCharacters(characters, character) {
  return character.relationships
    .map((relationshipId) => getCharacterById(characters, relationshipId))
    .filter(Boolean)
    .slice(0, RELATIONSHIP_LIMIT);
}

export function buildRelationshipSvg(character, relatedCharacters, escapeHtml) {
  const width = 640;
  const height = 360;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 118;

  const nodes = relatedCharacters.map((relatedCharacter, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(relatedCharacters.length, 1) - Math.PI / 2;
    return {
      ...relatedCharacter,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    };
  });

  const lines = nodes.map((node) => `
    <line
      x1="${centerX}"
      y1="${centerY}"
      x2="${node.x}"
      y2="${node.y}"
      stroke="${node.colorHex}"
      stroke-width="3"
      stroke-linecap="round"
      opacity="0.75"
    ></line>
  `).join("");

  const satellites = nodes.map((node) => `
    <a href="#profile/${node.id}">
      <circle cx="${node.x}" cy="${node.y}" r="28" fill="${node.colorHex}" opacity="0.95"></circle>
      <circle cx="${node.x}" cy="${node.y}" r="32" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"></circle>
      <text x="${node.x}" y="${node.y + 48}" text-anchor="middle">${escapeHtml(node.name)}</text>
    </a>
  `).join("");

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Relationship map for ${escapeHtml(character.name)}">
      <defs>
        <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${character.colorHex}" stop-opacity="0.45"></stop>
          <stop offset="100%" stop-color="${character.colorHex}" stop-opacity="0"></stop>
        </radialGradient>
      </defs>
      <circle cx="${centerX}" cy="${centerY}" r="110" fill="url(#core-glow)"></circle>
      ${lines}
      <circle cx="${centerX}" cy="${centerY}" r="42" fill="${character.colorHex}"></circle>
      <circle cx="${centerX}" cy="${centerY}" r="46" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="2"></circle>
      <text x="${centerX}" y="${centerY + 72}" text-anchor="middle">${escapeHtml(character.name)}</text>
      ${satellites}
    </svg>
  `;
}
