// View rendering helpers for every route.

import { getUniqueValues } from "./filters.js";
import { buildRelationshipSvg, getRelationshipCharacters, RELATIONSHIP_LIMIT } from "./relationships.js";

export const navItems = [
  { hash: "#dashboard", label: "Dashboard", meta: "Home" },
  { hash: "#list", label: "Master List", meta: "Search + filters" },
  { hash: "#relationships", label: "Relationships", meta: "Connections" },
  { hash: "#tracker", label: "Progress Tracker", meta: "Excel / Discord / Tumblr / AO3" },
  { hash: "#manage", label: "Manage Archive", meta: "CRUD + backup" }
];

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderNav(currentBase, navElement) {
  navElement.innerHTML = navItems.map((item) => `
    <a class="nav-link ${item.hash === currentBase ? "active" : ""}" href="${item.hash}">
      <span>${item.label}</span>
      <span class="meta-label">${item.meta}</span>
    </a>
  `).join("");
}

export function renderStatusBadge(label, enabled, accent) {
  return `<span class="status-badge ${enabled ? "on" : ""}" style="--accent:${accent};">${label}</span>`;
}

export function renderCharacterCard(character) {
  return `
    <article class="character-card" style="--accent:${character.colorHex};">
      <div class="name-row">
        <span class="swatch" style="background:${character.colorHex};"></span>
        <strong>${escapeHtml(character.name)}</strong>
      </div>
      <p class="helper-text">${escapeHtml(character.pronouns)} · ${escapeHtml(character.personality)}</p>
      <div class="tag-cloud">
        <span class="tag">Group ${character.group}</span>
        <span class="tag">${escapeHtml(character.colorName)}</span>
      </div>
      <div class="button-row" style="margin-top:14px;">
        <a class="small-button" href="#profile/${character.id}">Open Profile</a>
      </div>
    </article>
  `;
}

function renderStatCards(characters, getStatusCounts) {
  const statusCounts = getStatusCounts(characters);
  const groupCounts = [1, 2, 3, 4, 5].map((group) => ({
    group,
    count: characters.filter((character) => character.group === group).length
  }));

  return `
    <div class="stats-grid">
      <article class="stat-card" style="--accent:var(--pink-primary);"><div class="meta-label">Total OCs</div><div class="value">${characters.length}</div><p class="helper-text">The full archive currently seeded into the browser.</p></article>
      <article class="stat-card" style="--accent:var(--yellow-primary);"><div class="meta-label">Excel Ready</div><div class="value">${statusCounts.excel}</div><p class="helper-text">Profiles marked as reflected in your spreadsheet.</p></article>
      <article class="stat-card" style="--accent:#7fb6f5;"><div class="meta-label">Discord Ready</div><div class="value">${statusCounts.discord}</div><p class="helper-text">Characters with Discord-side notes or setup tracked.</p></article>
      <article class="stat-card" style="--accent:#f997a7;"><div class="meta-label">AO3 Ready</div><div class="value">${statusCounts.ao3}</div><p class="helper-text">Draftable or posted archive notes tagged for writing.</p></article>
    </div>
    <div class="mini-grid">
      ${groupCounts.map(({ group, count }) => `<article class="card"><div class="card-title">Group ${group}</div><div class="value mini-value">${count}</div><p class="helper-text">Characters currently assigned to this cluster.</p></article>`).join("")}
    </div>
  `;
}

export function renderDashboard(state, helpers) {
  const recentCharacters = [...state.characters].sort((a, b) => a.group - b.group || a.name.localeCompare(b.name)).slice(0, 6);
  return `
    <section class="view-header"><div><h2 class="view-title">Dashboard</h2><p>Your archive snapshot, group balance, and quick jumps into the character collection.</p></div><div class="status-pill">${escapeHtml(state.notice)}</div></section>
    ${renderStatCards(state.characters, helpers.getStatusCounts)}
    <section class="dashboard-grid" style="margin-top:18px;"><article class="card"><div class="card-header"><div><div class="section-heading">Archive Pulse</div><div class="helper-text">A quick read on what exists and what still needs filling out.</div></div></div><div class="detail-grid"><div class="notice">The seed import includes all 20 OCs plus the requested relationships. Status flags were not provided in the reference table, so they begin unchecked.</div><div class="notice">Use <a href="#manage">Manage Archive</a> to expand backstories, refine appearance notes, and track progress as you go.</div></div></article><article class="card"><div class="card-header"><div><div class="section-heading">Quick Profiles</div><div class="helper-text">Fast access to a few seeded records.</div></div></div><div class="character-grid">${recentCharacters.map(renderCharacterCard).join("")}</div></article></section>
  `;
}

export function renderList(state, filteredCharacters) {
  const mbtiOptions = getUniqueValues(state.characters, "mbti");
  const enneagramOptions = getUniqueValues(state.characters, "enneagram");
  return `
    <section class="table-card"><div class="table-header"><div><h2 class="view-title list-title">Master List</h2><p class="helper-text">Search across names and lore fragments, then narrow by type, group, or status flag.</p></div><div class="status-pill">${filteredCharacters.length} visible</div></div><div class="filters-grid"><div class="search-field"><label for="filter-query">Search archive</label><input id="filter-query" name="query" type="search" placeholder="Name, backstory, color, pronouns..." value="${escapeHtml(state.filters.query)}"></div><div class="search-field"><label for="filter-mbti">MBTI</label><select id="filter-mbti" name="mbti"><option value="">All MBTI</option>${mbtiOptions.map((value) => `<option value="${value}" ${state.filters.mbti === value ? "selected" : ""}>${value}</option>`).join("")}</select></div><div class="search-field"><label for="filter-enneagram">Enneagram</label><select id="filter-enneagram" name="enneagram"><option value="">All Enneagram</option>${enneagramOptions.map((value) => `<option value="${value}" ${state.filters.enneagram === value ? "selected" : ""}>${value}</option>`).join("")}</select></div><div class="search-field"><label for="filter-group">Group</label><select id="filter-group" name="group"><option value="">All Groups</option>${[1, 2, 3, 4, 5].map((group) => `<option value="${group}" ${String(state.filters.group) === String(group) ? "selected" : ""}>Group ${group}</option>`).join("")}</select></div><div class="search-field"><label for="filter-status">Status Flag</label><select id="filter-status" name="status"><option value="">Any status</option><option value="excel" ${state.filters.status === "excel" ? "selected" : ""}>Excel ready</option><option value="discord" ${state.filters.status === "discord" ? "selected" : ""}>Discord ready</option><option value="tumblr" ${state.filters.status === "tumblr" ? "selected" : ""}>Tumblr ready</option><option value="ao3" ${state.filters.status === "ao3" ? "selected" : ""}>AO3 ready</option></select></div></div><div class="button-row" style="margin-bottom:18px;"><button class="ghost-button" type="button" data-action="clear-filters">Clear Filters</button></div><div class="table-wrap"><table><thead><tr><th>Character</th><th>Pronouns</th><th>Personality</th><th>Group</th><th>Color</th><th>Status</th><th>Profile</th></tr></thead><tbody>${filteredCharacters.map((character) => `<tr><td><div class="name-row"><span class="swatch" style="background:${character.colorHex};"></span><strong>${escapeHtml(character.name)}</strong></div></td><td>${escapeHtml(character.pronouns)}</td><td>${escapeHtml(character.personality)}</td><td>Group ${character.group}</td><td>${escapeHtml(character.colorName)}<br><span class="meta-label">${escapeHtml(character.colorHex)}</span></td><td><div class="status-row">${renderStatusBadge("XLS", character.excelStatus, character.colorHex)}${renderStatusBadge("DIS", character.discordStatus, character.colorHex)}${renderStatusBadge("TBLR", character.tumblrStatus, character.colorHex)}${renderStatusBadge("AO3", character.ao3Status, character.colorHex)}</div></td><td><a class="small-button" href="#profile/${character.id}">Open</a></td></tr>`).join("")}</tbody></table></div></section>
    <section style="margin-top:18px;"><div class="character-grid">${filteredCharacters.map(renderCharacterCard).join("") || `<div class="empty-state">No characters match the current filter set.</div>`}</div></section>
  `;
}

export function renderProfile(state, character) {
  if (!character) return `<section class="view-header"><div><h2 class="view-title">Profile Missing</h2><p>The requested character could not be found in the current archive.</p></div></section><div class="notice">Try returning to the <a href="#list">Master List</a> or restore a backup JSON file.</div>`;
  const relatedCharacters = getRelationshipCharacters(state.characters, character);
  return `
    <section class="view-header"><div><h2 class="view-title">Profile Archive</h2><p>Full detail page for one OC, using their personal color as the anchor accent.</p></div><a class="ghost-button" href="#manage" data-manage-id="${character.id}">Edit This Character</a></section>
    <section class="profile-hero" style="border-left:6px solid ${character.colorHex};"><div class="name-row"><span class="swatch large-swatch" style="background:${character.colorHex};"></span><span class="group-chip">Group ${character.group}</span></div><h2>${escapeHtml(character.name)}</h2><div class="profile-summary"><span class="tag">${escapeHtml(character.pronouns)}</span><span class="tag">${escapeHtml(character.personality)}</span><span class="tag">${escapeHtml(character.colorName)}</span><span class="tag">${escapeHtml(character.colorHex)}</span></div><p>${escapeHtml(character.backstory)}</p></section>
    <section class="profile-grid" style="margin-top:18px;"><article class="profile-panel" style="--accent:${character.colorHex};"><div class="card-header"><div><div class="section-heading">Appearance Archive</div><div class="helper-text">Placeholder fields ready for refinement.</div></div></div><div class="appearance-grid"><div><div class="meta-label">Height</div><div>${escapeHtml(character.appearance.height)}</div></div><div><div class="meta-label">Body Type</div><div>${escapeHtml(character.appearance.bodyType)}</div></div><div><div class="meta-label">Hair</div><div>${escapeHtml(character.appearance.hair)}</div></div><div><div class="meta-label">Eyes</div><div>${escapeHtml(character.appearance.eyes)}</div></div><div><div class="meta-label">Skin</div><div>${escapeHtml(character.appearance.skin)}</div></div></div></article><article class="profile-panel" style="--accent:${character.colorHex};"><div class="card-header"><div><div class="section-heading">Progress Flags</div><div class="helper-text">Quick tracker across your current toolset.</div></div></div><div class="tag-cloud">${renderStatusBadge("Excel", character.excelStatus, character.colorHex)}${renderStatusBadge("Discord", character.discordStatus, character.colorHex)}${renderStatusBadge("Tumblr", character.tumblrStatus, character.colorHex)}${renderStatusBadge("AO3", character.ao3Status, character.colorHex)}</div></article></section>
    <section class="card" style="margin-top:18px;"><div class="card-header"><div><div class="section-heading">Connections</div><div class="helper-text">Each profile can hold up to ${RELATIONSHIP_LIMIT} linked character IDs.</div></div></div>${relatedCharacters.length ? `<div class="connection-list">${relatedCharacters.map((relatedCharacter) => `<article class="connection-card" style="--accent:${relatedCharacter.colorHex};"><div class="name-row"><span class="swatch" style="background:${relatedCharacter.colorHex};"></span><strong>${escapeHtml(relatedCharacter.name)}</strong></div><p class="helper-text">${escapeHtml(relatedCharacter.personality)} · Group ${relatedCharacter.group}</p><a class="small-button" href="#profile/${relatedCharacter.id}">Jump to Profile</a></article>`).join("")}</div>` : `<div class="empty-state">No relationships have been defined for this character yet.</div>`}</section>
  `;
}

export function renderRelationships(state) {
  const selectedCharacter = state.helpers.getCharacterById(state.characters, state.selectedRelationshipId) || state.characters[0];
  const relatedCharacters = selectedCharacter ? getRelationshipCharacters(state.characters, selectedCharacter) : [];
  return `
    <section class="view-header"><div><h2 class="view-title">Relationship Visualizer</h2><p>Select a character to inspect their capped relationship map and quick-access connection cards.</p></div><div class="status-pill">Up to ${RELATIONSHIP_LIMIT} links per character</div></section>
    <section class="relationship-grid"><article class="card"><div class="card-header"><div><div class="section-heading">Character Focus</div><div class="helper-text">Change the node in focus without leaving the page.</div></div></div><div class="field"><label for="relationship-select">Select character</label><select id="relationship-select" data-action="select-relationship">${state.characters.map((character) => `<option value="${character.id}" ${character.id === selectedCharacter?.id ? "selected" : ""}>${escapeHtml(character.name)} · Group ${character.group}</option>`).join("")}</select></div><p class="notice" style="margin-top:18px;">This visual keeps the archive readable: one center character plus up to four color-coded linked nodes.</p></article><article class="card"><div class="relationship-map">${selectedCharacter ? buildRelationshipSvg(selectedCharacter, relatedCharacters, escapeHtml) : `<div class="empty-state">No characters available.</div>`}</div></article></section>
    <section class="card" style="margin-top:18px;"><div class="card-header"><div><div class="section-heading">Connection Cards</div><div class="helper-text">A readable fallback view for the same relationship data.</div></div></div>${selectedCharacter ? `<div class="connection-list"><article class="connection-card" style="--accent:${selectedCharacter.colorHex};"><div class="name-row"><span class="swatch" style="background:${selectedCharacter.colorHex};"></span><strong>${escapeHtml(selectedCharacter.name)}</strong></div><p class="helper-text">Anchor node · ${escapeHtml(selectedCharacter.personality)} · ${escapeHtml(selectedCharacter.colorName)}</p></article>${relatedCharacters.map((relatedCharacter) => `<article class="connection-card" style="--accent:${relatedCharacter.colorHex};"><div class="name-row"><span class="swatch" style="background:${relatedCharacter.colorHex};"></span><strong>${escapeHtml(relatedCharacter.name)}</strong></div><p class="helper-text">${escapeHtml(relatedCharacter.pronouns)} · ${escapeHtml(relatedCharacter.personality)}</p><a class="small-button" href="#profile/${relatedCharacter.id}">Open Profile</a></article>`).join("") || `<div class="empty-state">No linked characters yet.</div>`}</div>` : `<div class="empty-state">No characters available.</div>`}</section>
  `;
}

export function renderTracker(state) {
  const columns = [{ key: "excelStatus", label: "Excel" }, { key: "discordStatus", label: "Discord" }, { key: "tumblrStatus", label: "Tumblr" }, { key: "ao3Status", label: "AO3" }];
  return `<section class="view-header"><div><h2 class="view-title">Progress Tracker</h2><p>A kanban-like status board showing which profiles have been handled in each archive space.</p></div><a class="ghost-button" href="#manage">Update Flags</a></section><section class="tracker-grid">${columns.map((column) => { const ready = state.characters.filter((character) => character[column.key]); return `<article class="status-column"><div class="status-header"><div><div class="section-heading">${column.label}</div><div class="helper-text">${ready.length} marked ready</div></div></div><div class="manage-list">${ready.length ? ready.map(renderCharacterCard).join("") : `<div class="empty-state">Nothing marked yet.</div>`}</div></article>`; }).join("")}</section>`;
}

export function renderManage(state) {
  const selectedCharacter = state.helpers.getCharacterById(state.characters, state.selectedManageId);
  const character = selectedCharacter || { id: "", name: "", pronouns: "", personality: "", colorHex: "#888888", colorName: "", group: 1, excelStatus: false, discordStatus: false, tumblrStatus: false, ao3Status: false, backstory: "", appearance: { height: "", bodyType: "", hair: "", eyes: "", skin: "" }, relationships: [] };
  return `<section class="view-header"><div><h2 class="view-title">Manage Archive</h2><p>Add new OCs, edit existing entries, delete records, and import or export the whole collection as JSON.</p></div><div class="status-pill">${state.characters.length} stored locally</div></section><section class="manage-layout"><article class="card"><div class="card-header"><div><div class="section-heading">Character Index</div><div class="helper-text">Pick a record to edit or start a fresh one.</div></div></div><div class="button-row" style="margin-bottom:18px;"><button class="button" type="button" data-action="new-character">New Character</button><button class="ghost-button" type="button" data-action="export-json">Export JSON</button></div><div class="field"><label for="import-json">Restore from JSON</label><input id="import-json" type="file" accept="application/json" data-action="import-json"></div><div class="manage-list" style="margin-top:18px;">${state.characters.map((item) => `<button class="manage-item ${item.id === state.selectedManageId ? "active" : ""}" type="button" data-action="edit-character" data-id="${item.id}"><div class="name-row"><span class="swatch" style="background:${item.colorHex};"></span><strong>${escapeHtml(item.name)}</strong></div><div class="helper-text">${escapeHtml(item.personality)} · Group ${item.group}</div></button>`).join("")}</div></article><article class="card"><div class="form-header"><div><div class="section-heading">${character.id ? "Edit Character" : "New Character"}</div><div class="helper-text">Relationship IDs are comma-separated and capped at ${RELATIONSHIP_LIMIT}.</div></div>${character.id ? `<button class="danger-button" type="button" data-action="delete-character" data-id="${character.id}">Delete</button>` : ""}</div><form id="character-form"><input type="hidden" name="id" value="${character.id}"><div class="form-grid"><div class="field"><label for="name">Name</label><input id="name" name="name" required value="${escapeHtml(character.name)}"></div><div class="field"><label for="pronouns">Pronouns</label><input id="pronouns" name="pronouns" required value="${escapeHtml(character.pronouns)}"></div><div class="field"><label for="personality">Personality</label><input id="personality" name="personality" required placeholder="6w2 ENFP" value="${escapeHtml(character.personality)}"></div><div class="field"><label for="group">Group</label><select id="group" name="group">${[1, 2, 3, 4, 5].map((group) => `<option value="${group}" ${group === character.group ? "selected" : ""}>Group ${group}</option>`).join("")}</select></div><div class="field"><label for="colorHex">Color Hex</label><input id="colorHex" name="colorHex" required placeholder="#cf7f81" value="${escapeHtml(character.colorHex)}"></div><div class="field"><label for="colorName">Color Name</label><input id="colorName" name="colorName" required value="${escapeHtml(character.colorName)}"></div><div class="field full-span"><label for="backstory">Backstory</label><textarea id="backstory" name="backstory" required>${escapeHtml(character.backstory)}</textarea></div></div><div class="card inset-card"><div class="section-heading">Appearance</div><div class="form-grid"><div class="field"><label for="height">Height</label><input id="height" name="height" value="${escapeHtml(character.appearance.height)}"></div><div class="field"><label for="bodyType">Body Type</label><input id="bodyType" name="bodyType" value="${escapeHtml(character.appearance.bodyType)}"></div><div class="field"><label for="hair">Hair</label><input id="hair" name="hair" value="${escapeHtml(character.appearance.hair)}"></div><div class="field"><label for="eyes">Eyes</label><input id="eyes" name="eyes" value="${escapeHtml(character.appearance.eyes)}"></div><div class="field"><label for="skin">Skin</label><input id="skin" name="skin" value="${escapeHtml(character.appearance.skin)}"></div><div class="field"><label for="relationships">Relationships (IDs)</label><input id="relationships" name="relationships" placeholder="2, 4, 7" value="${escapeHtml(character.relationships.join(", "))}"></div></div></div><div class="card inset-card"><div class="section-heading">Status Flags</div><div class="form-grid"><div class="field-checkbox"><input id="excelStatus" name="excelStatus" type="checkbox" ${character.excelStatus ? "checked" : ""}><label for="excelStatus">Excel complete</label></div><div class="field-checkbox"><input id="discordStatus" name="discordStatus" type="checkbox" ${character.discordStatus ? "checked" : ""}><label for="discordStatus">Discord complete</label></div><div class="field-checkbox"><input id="tumblrStatus" name="tumblrStatus" type="checkbox" ${character.tumblrStatus ? "checked" : ""}><label for="tumblrStatus">Tumblr complete</label></div><div class="field-checkbox"><input id="ao3Status" name="ao3Status" type="checkbox" ${character.ao3Status ? "checked" : ""}><label for="ao3Status">AO3 complete</label></div></div></div><div class="button-row" style="margin-top:20px;"><button class="button" type="submit">${character.id ? "Save Changes" : "Create Character"}</button><button class="ghost-button" type="button" data-action="reset-form">Reset Form</button></div></form><p class="footer-note">Importing JSON replaces the current in-browser archive. Export before large edits if you want a rollback point.</p></article></section>`;
}
