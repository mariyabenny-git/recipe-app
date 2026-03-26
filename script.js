let data = [];
let favorites = JSON.parse(localStorage.getItem("fav")) || [];
let isPlaying = false;

/* LOAD */
fetch("recipes.json")
  .then(res => res.json())
  .then(res => {
    data = res;
    loadRecipes();
    loadChips();
  });

/* LOAD RECIPES */
function loadRecipes(filter = "") {
 let card = document.createElement("div");
card.className = "card";

card.innerHTML = `
  <div class="heart" onclick="toggleFav('${r.name}', event)">
    ${favorites.includes(r.name) ? "❤️" : "🤍"}
  </div>

  <h4>${r.name || "Recipe"}</h4>
`;

card.onclick = () => showRecipe(r.name);

container.appendChild(card);
          </button>
          <h4>${r.name}</h4>
        </div>
      `;
    });
}

/* SHOW */
function showRecipe(name) {
  let r = data.find(x => x.name === name);
  let popup = document.getElementById("popup");

  popup.innerHTML = `
    <button class="close-btn" onclick="closePopup()">←</button>
    <h2>${r.name}</h2>
    <p><b>Ingredients:</b> ${r.ingredients.join(", ")}</p>
    <p><b>Steps:</b> ${r.steps}</p>
  `;

  popup.classList.remove("hidden");
  history.pushState({ page: "recipe" }, "");
}

/* CLOSE */
function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

window.onpopstate = () => closePopup();

/* FAVORITES */
function toggleFav(name, e) {
  e.stopPropagation();

  if (favorites.includes(name)) {
    favorites = favorites.filter(f => f !== name);
  } else {
    favorites.push(name);
  }

  localStorage.setItem("fav", JSON.stringify(favorites));
  loadRecipes();
}

/* FAVORITE VIEW */
function showFavorites() {
  let container = document.getElementById("recipes");
  container.innerHTML = "";

  data.filter(r => favorites.includes(r.name))
    .forEach(r => {
      container.innerHTML += `
        <div class="card" onclick="showRecipe('${r.name}')">
          <h4>${r.name}</h4>
        </div>
      `;
    });
}

/* HOME */
function goHome() {
  loadRecipes();
}

/* SEARCH */
document.getElementById("search").addEventListener("input", e => {
  loadRecipes(e.target.value);
});

/* CHIPS */
function loadChips() {
  let cats = [...new Set(data.map(r => r.category))];
  let chips = document.getElementById("chips");

  cats.forEach(c => {
    chips.innerHTML += `<button onclick="filterCat('${c}')">${c}</button>`;
  });
}

function filterCat(cat) {
  let filtered = data.filter(r => r.category === cat);
  display(filtered);
}

function display(arr) {
  let container = document.getElementById("recipes");
  container.innerHTML = "";

  arr.forEach(r => {
    container.innerHTML += `
      <div class="card" onclick="showRecipe('${r.name}')">
        <h4>${r.name}</h4>
      </div>
    `;
  });
}

/* SCANNER */
function openScanner() {
  let scan = document.getElementById("scanner");

  scan.innerHTML = `
    <button class="close-btn" onclick="closeScanner()">←</button>
    <h3>Scan Ingredients</h3>
    <input id="scanInput" placeholder="e.g rice egg">
    <button onclick="scanSearch()">Find Recipes</button>
  `;

  scan.classList.remove("hidden");
}

function closeScanner() {
  let scan = document.getElementById("scanner");
  scan.classList.add("hidden");
  scan.innerHTML = "";
}

/* SMART MATCH */
function scanSearch() {
  let val = document.getElementById("scanInput").value.toLowerCase();

  if (!val) {
    closeScanner();
    return;
  }

  let inputs = val.split(" ");

  let result = data.filter(r => {
    let ingredients = r.ingredients.map(i => i.toLowerCase());

    return inputs.some(input =>
      ingredients.some(i => i.includes(input))
    );
  });

  alert(result.length + " recipes found 🍽️");

  display(result);
  closeScanner();
}

/* MUSIC */
function toggleMusic() {
  const audio = document.getElementById("music");
  const btn = document.getElementById("musicBtn");

  if (!isPlaying) {
    audio.play().then(() => {
      btn.innerText = "⏸️";
      isPlaying = true;
    });
  } else {
    audio.pause();
    btn.innerText = "▶️";
    isPlaying = false;
  }
}

/* ENABLE MUSIC */
document.body.addEventListener("click", () => {
  const audio = document.getElementById("music");
  if (!isPlaying) audio.play().catch(()=>{});
}, { once: true });
lucide.createIcons();
