let currentLang = localStorage.getItem("lang") || "en";

class RecipeController {
  constructor(data) {
    this.allRecipes = data;
    this.filtered = data;
    this.page = 0;
    this.limit = 5;
    this.likes = JSON.parse(localStorage.getItem("likes")) || [];
  }

  search(query) {
    this.filtered = this.allRecipes.filter(r =>
      r.title.toLowerCase().includes(query.toLowerCase())
    );
    this.page = 0;
    this.render();
  }

  toggleLike(id) {
    if (this.likes.includes(id)) {
      this.likes = this.likes.filter(l => l !== id);
    } else {
      this.likes.push(id);
    }
    localStorage.setItem("likes", JSON.stringify(this.likes));
    this.render();
  }

  loadMore() {
    if ((this.page + 1) * this.limit < this.filtered.length) {
      this.page++;
      this.render();
    }
  }

  render() {
    const feed = document.getElementById("feed");
    feed.innerHTML = "";

    const items = this.filtered.slice(0, (this.page + 1) * this.limit);

    items.forEach(recipe => {
      const liked = this.likes.includes(recipe.id);

      const title = currentLang === "ml" ? recipe.title_ml : recipe.title;
      const desc = currentLang === "ml" ? recipe.description_ml : recipe.description;
      const steps = currentLang === "ml" ? recipe.steps_ml : recipe.steps;

      const div = document.createElement("div");
      div.className = "recipe";

      div.innerHTML = `
        <div class="actions">
          <button class="action-btn like-btn" data-id="${recipe.id}">
            ${liked ? "❤️" : "🤍"}
          </button>
          <button class="action-btn" onclick="generateGrocery()">🛒</button>
          <button class="action-btn" onclick="startVoice()">🎤</button>
        </div>

        <h2>${title}</h2>
        <p>${desc}</p>

        <div class="steps">
          ${steps.map(step => `
            <label><input type="checkbox"> ${step}</label>
          `).join("")}
        </div>
      `;

      feed.appendChild(div);
    });

    document.querySelectorAll(".like-btn").forEach(btn => {
      btn.onclick = () => this.toggleLike(parseInt(btn.dataset.id));
    });
  }
}

let controller;

async function init() {
  const res = await fetch("recipes.json");
  const data = await res.json();
  controller = new RecipeController(data);
  controller.render();

  document.getElementById("langBtn").textContent =
    currentLang === "en" ? "EN" : "മലയാളം";
}

/* LANGUAGE TOGGLE */
document.getElementById("langBtn").addEventListener("click", () => {
  currentLang = currentLang === "en" ? "ml" : "en";
  localStorage.setItem("lang", currentLang);

  document.getElementById("langBtn").textContent =
    currentLang === "en" ? "EN" : "മലയാളം";

  controller.render();
});

/* SEARCH */
document.getElementById("search").addEventListener("input", e => {
  controller.search(e.target.value);
});

/* SCROLL */
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
    controller.loadMore();
  }
});

/* DARK MODE */
document.getElementById("darkToggle").addEventListener("change", () => {
  document.body.classList.toggle("light");
});

/* VOICE */
function startVoice() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Voice not supported");
    return;
  }
  const r = new webkitSpeechRecognition();
  r.start();
  r.onresult = e => alert("You said: " + e.results[0][0].transcript);
}

/* AI SUGGEST */
function suggestRecipe() {
  const hour = new Date().getHours();
  let type = hour < 12 ? "Breakfast" : hour < 18 ? "Lunch" : "Dinner";
  controller.filtered = controller.allRecipes.filter(r =>
    r.tags.includes(type)
  );
  controller.page = 0;
  controller.render();
}

/* GROCERY */
function generateGrocery() {
  let items = new Set();
  controller.filtered.forEach(r => r.ingredients.forEach(i => items.add(i)));
  alert("🛒 Grocery List:\n\n" + [...items].join("\n"));
}

init();