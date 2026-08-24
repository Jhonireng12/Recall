const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const searchInput = document.getElementById("search");
const saveButton = document.getElementById("save");

const notesContainer = document.getElementById("notes");
const emptyState = document.getElementById("empty");
const counter = document.getElementById("counter");

const STORAGE_KEY = "recall_memories";

let memories = loadMemories();

function loadMemories() {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    ) || [];
  } catch (error) {
    console.error("Could not load memories:", error);
    return [];
  }
}

function saveMemories() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(memories)
  );
}

function createMemory() {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert("Please enter a title and your memory.");
    return;
  }

  const memory = {
    id: crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString(),

    title,
    content,

    createdAt: new Date().toISOString()
  };

  memories.unshift(memory);

  saveMemories();

  titleInput.value = "";
  contentInput.value = "";

  renderMemories();
}

function deleteMemory(id) {
  const confirmed = confirm(
    "Delete this memory?"
  );

  if (!confirmed) return;

  memories = memories.filter(
    memory => memory.id !== id
  );

  saveMemories();

  renderMemories();
}

function formatDate(date) {
  return new Date(date).toLocaleString(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  );
}

function escapeHTML(text) {
  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

function renderMemories() {
  const query = searchInput.value
    .trim()
    .toLowerCase();

  const filtered = memories.filter(memory => {
    return (
      memory.title
        .toLowerCase()
        .includes(query) ||

      memory.content
        .toLowerCase()
        .includes(query)
    );
  });

  notesContainer.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  counter.textContent =
    `${filtered.length} ${
      filtered.length === 1
        ? "memory"
        : "memories"
    }`;

  filtered.forEach(memory => {
    const article =
      document.createElement("article");

    article.className = "note";

    article.innerHTML = `
      <button
        class="delete"
        aria-label="Delete memory"
        data-id="${memory.id}"
      >
        Delete
      </button>

      <h3>
        ${escapeHTML(memory.title)}
      </h3>

      <p>
        ${escapeHTML(memory.content)}
      </p>

      <small>
        ${formatDate(memory.createdAt)}
      </small>
    `;

    article
      .querySelector(".delete")
      .addEventListener(
        "click",
        () => deleteMemory(memory.id)
      );

    notesContainer.appendChild(article);
  });
}

saveButton.addEventListener(
  "click",
  createMemory
);

searchInput.addEventListener(
  "input",
  renderMemories
);

contentInput.addEventListener(
  "keydown",
  event => {
    if (
      event.ctrlKey &&
      event.key === "Enter"
    ) {
      createMemory();
    }
  }
);

renderMemories();
