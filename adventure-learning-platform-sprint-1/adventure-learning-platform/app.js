
const STORAGE_KEY = "adventure_learning_library_v1";

const seedLibrary = [
  {
    id: crypto.randomUUID(),
    title: "Garbage in the Road",
    summary: "Respond calmly and safely when debris blocks the road.",
    status: "draft",
    domain: "Driver Confidence Guide",
    tags: ["safety", "hazards"],
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    version: 1,
    data: {}
  }
];

let library = loadLibrary();
let pendingDeleteId = null;

const elements = {
  grid: document.getElementById("adventureGrid"),
  empty: document.getElementById("emptyState"),
  stats: document.getElementById("libraryStats"),
  search: document.getElementById("searchInput"),
  filter: document.getElementById("statusFilter"),
  dialog: document.getElementById("adventureDialog"),
  form: document.getElementById("adventureForm"),
  dialogTitle: document.getElementById("dialogTitle"),
  id: document.getElementById("adventureId"),
  title: document.getElementById("titleInput"),
  summary: document.getElementById("summaryInput"),
  status: document.getElementById("statusInput"),
  domain: document.getElementById("domainInput"),
  tags: document.getElementById("tagsInput"),
  confirmDialog: document.getElementById("confirmDialog"),
  confirmMessage: document.getElementById("confirmMessage"),
  importFile: document.getElementById("importFile"),
  toast: document.getElementById("toast")
};

function loadLibrary() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedLibrary));
    return seedLibrary;
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : seedLibrary;
  } catch {
    return seedLibrary;
  }
}

function saveLibrary() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[ch]));
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString();
}

function render() {
  const term = elements.search.value.trim().toLowerCase();
  const status = elements.filter.value;

  const filtered = library
    .filter(a => status === "all" || a.status === status)
    .filter(a => {
      const haystack = [a.title, a.summary, a.domain, ...(a.tags || [])].join(" ").toLowerCase();
      return haystack.includes(term);
    })
    .sort((a, b) => new Date(b.updated) - new Date(a.updated));

  elements.grid.innerHTML = "";
  elements.empty.hidden = filtered.length !== 0;

  for (const adventure of filtered) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <span class="badge status-${escapeHtml(adventure.status)}">${escapeHtml(adventure.status)}</span>
      <h3>${escapeHtml(adventure.title)}</h3>
      <p>${escapeHtml(adventure.summary || "No summary yet.")}</p>
      <div class="card-meta">
        ${adventure.domain ? `<span class="badge">${escapeHtml(adventure.domain)}</span>` : ""}
        ${(adventure.tags || []).map(tag => `<span class="badge">${escapeHtml(tag)}</span>`).join("")}
      </div>
      <p class="updated">Updated ${escapeHtml(formatDate(adventure.updated))}</p>
      <div class="card-actions">
        <button data-action="open" data-id="${adventure.id}" class="primary">Open</button>
        <button data-action="duplicate" data-id="${adventure.id}">Duplicate</button>
        <button data-action="delete" data-id="${adventure.id}">Delete</button>
      </div>
    `;
    elements.grid.appendChild(card);
  }

  const counts = {
    all: library.length,
    draft: library.filter(a => a.status === "draft").length,
    complete: library.filter(a => a.status === "complete").length,
    published: library.filter(a => a.status === "published").length
  };

  elements.stats.innerHTML = `
    <div class="stat"><span>Total</span><strong>${counts.all}</strong></div>
    <div class="stat"><span>Draft</span><strong>${counts.draft}</strong></div>
    <div class="stat"><span>Complete</span><strong>${counts.complete}</strong></div>
    <div class="stat"><span>Published</span><strong>${counts.published}</strong></div>
  `;
}

function openDialog(adventure = null) {
  elements.form.reset();
  elements.id.value = "";
  elements.dialogTitle.textContent = adventure ? "Edit Adventure" : "New Adventure";

  if (adventure) {
    elements.id.value = adventure.id;
    elements.title.value = adventure.title || "";
    elements.summary.value = adventure.summary || "";
    elements.status.value = adventure.status || "draft";
    elements.domain.value = adventure.domain || "";
    elements.tags.value = (adventure.tags || []).join(", ");
  }

  elements.dialog.showModal();
  setTimeout(() => elements.title.focus(), 0);
}

function persistForm(event) {
  event.preventDefault();

  const title = elements.title.value.trim();
  if (!title) return;

  const now = new Date().toISOString();
  const tags = elements.tags.value
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);

  const existing = library.find(a => a.id === elements.id.value);

  if (existing) {
    existing.title = title;
    existing.summary = elements.summary.value.trim();
    existing.status = elements.status.value;
    existing.domain = elements.domain.value.trim();
    existing.tags = tags;
    existing.updated = now;
    existing.version = (existing.version || 1) + 1;
    showToast("Adventure updated");
  } else {
    library.push({
      id: crypto.randomUUID(),
      title,
      summary: elements.summary.value.trim(),
      status: elements.status.value,
      domain: elements.domain.value.trim(),
      tags,
      created: now,
      updated: now,
      version: 1,
      data: {}
    });
    showToast("Adventure created");
  }

  saveLibrary();
  elements.dialog.close();
  render();
}

function duplicateAdventure(id) {
  const source = library.find(a => a.id === id);
  if (!source) return;

  const copy = structuredClone(source);
  copy.id = crypto.randomUUID();
  copy.title = `${source.title} — Copy`;
  copy.status = "draft";
  copy.created = new Date().toISOString();
  copy.updated = copy.created;
  copy.version = 1;
  library.push(copy);

  saveLibrary();
  render();
  showToast("Adventure duplicated");
}

function requestDelete(id) {
  const adventure = library.find(a => a.id === id);
  if (!adventure) return;
  pendingDeleteId = id;
  elements.confirmMessage.textContent = `“${adventure.title}” will be removed from this browser.`;
  elements.confirmDialog.showModal();
}

function deleteAdventure() {
  library = library.filter(a => a.id !== pendingDeleteId);
  pendingDeleteId = null;
  saveLibrary();
  render();
  showToast("Adventure deleted");
}

function exportLibrary() {
  const blob = new Blob([JSON.stringify(library, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "adventure-learning-library.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

function importLibrary(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!Array.isArray(parsed)) throw new Error("Expected an array.");
      library = parsed;
      saveLibrary();
      render();
      showToast("Library imported");
    } catch {
      showToast("Invalid library file");
    }
  };
  reader.readAsText(file);
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  setTimeout(() => elements.toast.classList.remove("show"), 1500);
}

document.getElementById("newAdventureBtn").addEventListener("click", () => openDialog());
document.getElementById("emptyNewBtn").addEventListener("click", () => openDialog());
document.getElementById("exportBtn").addEventListener("click", exportLibrary);
document.getElementById("importBtn").addEventListener("click", () => elements.importFile.click());
document.getElementById("confirmDeleteBtn").addEventListener("click", deleteAdventure);
elements.form.addEventListener("submit", persistForm);
elements.search.addEventListener("input", render);
elements.filter.addEventListener("change", render);
elements.importFile.addEventListener("change", event => {
  const file = event.target.files[0];
  if (file) importLibrary(file);
  event.target.value = "";
});

elements.grid.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const { action, id } = button.dataset;
  const adventure = library.find(a => a.id === id);

  if (action === "open") openDialog(adventure);
  if (action === "duplicate") duplicateAdventure(id);
  if (action === "delete") requestDelete(id);
});

render();
