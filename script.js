let data = [];
let favorites = JSON.parse(localStorage.getItem("fav")) || [];

/* LOAD DATA */
fetch("recipes.json")
  .then(res => res.json())
  .then(res => {
    data = res;
    loadRecipes();
    loadChips();
  });

/* LOAD RECIPES */
function loadRecipes(filter = "") {
  let container = document.getElementById("recipes");
  container.innerHTML = "";

  let filtered = data.filter(r =>
    r.name.toLowerCase().includes(filter.toLowerCase())
  );

  filtered.forEach(r => {
    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${r.image || ''}" onerror="this.style.display='none'">
      <div class="heart" onclick="toggleFav('${r.name}', event)">
        ${favorites.includes(r.name) ? "❤️" : "🤍"}
      </div>
      <h4>${r.name}</h4>
    `;

    card.onclick = () => showRecipe(r.name);
    container.appendChild(card);
  });
}

/* SHOW RECIPE */
function showRecipe(name) {
  let r = data.find(x => x.name === name);
  let popup = document.getElementById("popup");

  history.pushState({}, "");

  popup.innerHTML = `
    <h2>${r.name}</h2>
    <p>⏱ ${r.time} | 🔥 ${r.calories}</p>

    <h3>Ingredients</h3>
    <ul>${r.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>

    <h3>Steps</h3>
    <ol>${r.steps.map(s => `<li>${s}</li>`).join("")}</ol>

    <button onclick="closePopup()">Close</button>
  `;

  popup.classList.remove("hidden");
}

/* CLOSE */
function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

/* BACK BUTTON */
window.onpopstate = () => closePopup();

/* SWIPE */
let startY = 0;
popup = document.getElementById("popup");

popup.addEventListener("touchstart", e => startY = e.touches[0].clientY);
popup.addEventListener("touchend", e => {
  if (e.changedTouches[0].clientY - startY > 100) closePopup();
});

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

function showFavorites() {
  display(data.filter(r => favorites.includes(r.name)));
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
    let btn = document.createElement("button");
    btn.innerText = c;
    btn.onclick = () => display(data.filter(r => r.category === c));
    chips.appendChild(btn);
  });
}

function display(arr) {
  let container = document.getElementById("recipes");
  container.innerHTML = "";
  arr.forEach(r => {
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<img src="${r.image}"><h4>${r.name}</h4>`;
    card.onclick = () => showRecipe(r.name);
    container.appendChild(card);
  });
}

/* MUSIC */
let playing = true;
function toggleMusic() {
  let btn = document.querySelector(".music-player button");
  playing = !playing;
  btn.innerText = playing ? "⏸" : "▶️";
}

/* SCANNER UI */
function startCamera() {
  let scanner = document.getElementById("scanner");

  scanner.innerHTML = `
    <h3>Find Recipes</h3>
    <input id="scanInput" placeholder="Enter ingredient">
    <button onclick="scanNow()">Search</button>
    <button onclick="closeScanner()">Cancel</button>
  `;

  scanner.classList.remove("hidden");
}

function scanNow() {
  let val = document.getElementById("scanInput").value.toLowerCase();
  display(data.filter(r =>
    r.ingredients.join(" ").toLowerCase().includes(val)
  ));
  closeScanner();
}

function closeScanner() {
  document.getElementById("scanner").classList.add("hidden");
}
