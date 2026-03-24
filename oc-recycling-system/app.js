// Main app state, routing, rendering, and event wiring.

import { deleteCharacter, getNextId, serializeForm, upsertCharacter, validateCharacter } from "./crud.js";
import { exportCharacters, importCharacters, loadCharacters, parsePersonality, saveCharacters } from "./data.js";
import { renderDashboard, renderList, renderManage, renderNav, renderProfile, renderRelationships, renderTracker } from "./components.js";
import { filterCharacters } from "./filters.js";
import { getCharacterById } from "./relationships.js";

const appElement = document.getElementById("app");
const navElement = document.getElementById("sidebar-nav");

const state = {
  characters: loadCharacters(),
  filters: { query: "", mbti: "", enneagram: "", group: "", status: "" },
  selectedManageId: null,
  selectedRelationshipId: null,
  notice: "Seed data loaded. Unknown status fields start as false until you fill them in.",
  helpers: { getCharacterById }
};

function getRoute() {
  const hash = window.location.hash || "#dashboard";
  const [base, id] = hash.split("/");
  return { base, id: id ? Number(id) : null };
}

function persistCharacters() {
  saveCharacters(state.characters);
}

function setNotice(message) {
  state.notice = message;
}

function updateSelections() {
  if (!state.selectedRelationshipId || !getCharacterById(state.characters, state.selectedRelationshipId)) {
    state.selectedRelationshipId = state.characters[0]?.id || null;
  }

  if (!state.selectedManageId || !getCharacterById(state.characters, state.selectedManageId)) {
    state.selectedManageId = state.characters[0]?.id || null;
  }
}

function getStatusCounts(characters) {
  return {
    excel: characters.filter((item) => item.excelStatus).length,
    discord: characters.filter((item) => item.discordStatus).length,
    tumblr: characters.filter((item) => item.tumblrStatus).length,
    ao3: characters.filter((item) => item.ao3Status).length
  };
}

function render() {
  updateSelections();
  const route = getRoute();
  const filteredCharacters = filterCharacters(state.characters, state.filters);

  renderNav(route.base, navElement);

  if (route.base === "#list") return void (appElement.innerHTML = renderList(state, filteredCharacters));
  if (route.base === "#profile") return void (appElement.innerHTML = renderProfile(state, getCharacterById(state.characters, route.id)));
  if (route.base === "#relationships") return void (appElement.innerHTML = renderRelationships(state));
  if (route.base === "#tracker") return void (appElement.innerHTML = renderTracker(state));
  if (route.base === "#manage") return void (appElement.innerHTML = renderManage(state));

  appElement.innerHTML = renderDashboard(state, { getStatusCounts });
}

function clearFilters() {
  state.filters = { query: "", mbti: "", enneagram: "", group: "", status: "" };
  setNotice("Filters cleared.");
  render();
}

function handleFilterInput(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
  if (!target.name || !(target.name in state.filters)) return;
  state.filters[target.name] = target.value;
  render();
}

async function handleImportFile(input) {
  const file = input.files?.[0];
  if (!file) return;

  try {
    state.characters = await importCharacters(file);
    persistCharacters();
    setNotice(`Imported ${state.characters.length} characters from backup JSON.`);
    state.selectedManageId = state.characters[0]?.id || null;
    state.selectedRelationshipId = state.characters[0]?.id || null;
    render();
  } catch (error) {
    console.error(error);
    window.alert("Import failed. Check that the file contains a valid JSON array of characters.");
  } finally {
    input.value = "";
  }
}

function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!(form instanceof HTMLFormElement)) return;

  const serialized = serializeForm(form, parsePersonality);
  if (!serialized.id) serialized.id = getNextId(state.characters);

  const errors = validateCharacter(serialized);
  if (errors.length) return void window.alert(errors.join("\n"));

  state.characters = upsertCharacter(state.characters, serialized);
  persistCharacters();
  state.selectedManageId = serialized.id;
  state.selectedRelationshipId = serialized.id;
  setNotice(`${serialized.name} saved to localStorage.`);
  window.location.hash = `#profile/${serialized.id}`;
  render();
}

function handleActionClick(target) {
  const actionTarget = target.closest("[data-action]");
  if (!actionTarget) return;

  const action = actionTarget.getAttribute("data-action");
  const id = Number(actionTarget.getAttribute("data-id"));

  if (action === "clear-filters") clearFilters();
  if (action === "new-character") {
    state.selectedManageId = null;
    setNotice("New character form ready.");
    render();
  }
  if (action === "edit-character" && id) {
    state.selectedManageId = id;
    render();
  }
  if (action === "export-json") {
    exportCharacters(state.characters);
    setNotice("Backup JSON exported.");
    render();
  }
  if (action === "reset-form") render();

  if (action === "delete-character" && id) {
    const targetCharacter = getCharacterById(state.characters, id);
    if (!targetCharacter) return;
    if (!window.confirm(`Delete ${targetCharacter.name} from the local archive? This cannot be undone without a backup.`)) return;
    state.characters = deleteCharacter(state.characters, id);
    persistCharacters();
    state.selectedManageId = state.characters[0]?.id || null;
    state.selectedRelationshipId = state.characters[0]?.id || null;
    setNotice(`${targetCharacter.name} deleted from localStorage.`);
    render();
  }
}

document.addEventListener("input", handleFilterInput);

document.addEventListener("change", (event) => {
  const target = event.target;
  if (target instanceof HTMLSelectElement && target.dataset.action === "select-relationship") {
    state.selectedRelationshipId = Number(target.value);
    render();
  }
  if (target instanceof HTMLInputElement && target.dataset.action === "import-json") {
    handleImportFile(target);
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const manageLink = target.closest("[data-manage-id]");
  if (manageLink) state.selectedManageId = Number(manageLink.getAttribute("data-manage-id"));

  handleActionClick(target);
});

document.addEventListener("submit", (event) => {
  const target = event.target;
  if (target instanceof HTMLFormElement && target.id === "character-form") {
    handleFormSubmit(event);
  }
});

window.addEventListener("hashchange", render);
render();
