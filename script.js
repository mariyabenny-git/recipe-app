let data = [];
let favorites = JSON.parse(localStorage.getItem("fav")) || [];

/* LOAD DATA */
fetch("recipes.json")
  .then(res => res.json())
  .then(res => {
    data = res;
    render(data);
    loadChips();
  });

/* 🔥 MAIN RENDER FUNCTION */
function render(arr) {
  const container = document.getElementById("recipes");
  container.innerHTML = "";

  arr.forEach(r => {
    container.appendChild(createCard(r));
  });
}

/* 🔥 SINGLE CARD CREATOR (NO DUPLICATION) */
function createCard(r) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    ${r.image ? `<img src="${r.image}">` : ""}
    
    <div class="heart" onclick="toggleFav('${r.name}', event)">
      ${favorites.includes(r.name) ? "❤️" : "🤍"}
    </div>

    <h4>${r.name}</h4>
  `;

  card.onclick = () => showRecipe(r.name);

  return card;
}

/* 🔍 SEARCH */
document.getElementById("search").addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  render(data.filter(r => r.name.toLowerCase().includes(value)));
});

/* ❤️ FAVORITES */
function toggleFav(name, e) {
  e.stopPropagation();

  if (favorites.includes(name)) {
    favorites = favorites.filter(f => f !== name);
  } else {
    favorites.push(name);
  }

  localStorage.setItem("fav", JSON.stringify(favorites));
  render(data);
}

function showFavorites() {
  render(data.filter(r => favorites.includes(r.name)));
}

/* 📂 CATEGORY */
function loadChips() {
  const chips = document.getElementById("chips");
  const categories = [...new Set(data.map(r => r.category))];

  categories.forEach(c => {
    const btn = document.createElement("button");
    btn.innerText = c;
    btn.onclick = () => render(data.filter(r => r.category === c));
    chips.appendChild(btn);
  });
}

/* 📖 SHOW RECIPE */
function showRecipe(name) {
  const r = data.find(x => x.name === name);
  const popup = document.getElementById("popup");

  history.pushState({}, "");

  popup.innerHTML = `
    <button class="close-btn" onclick="closePopup()">✕</button>

    ${r.image ? `<img src="${r.image}" style="width:100%;border-radius:15px;">` : ""}

    <h2>${r.name}</h2>
    <p>⏱ ${r.time || "N/A"} | 🔥 ${r.calories || "N/A"}</p>

    <h3>Ingredients</h3>
    <ul>${r.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>

    <h3>Steps</h3>
    <ol>${r.steps.map(s => `<li>${s}</li>`).join("")}</ol>
  `;

  popup.classList.remove("hidden");
}

/* ❌ CLOSE */
function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

/* 🔙 BACK BUTTON */
window.onpopstate = () => closePopup();

/* 📱 SWIPE CLOSE */
let startY = 0;
const popup = document.getElementById("popup");

popup.addEventListener("touchstart", e => startY = e.touches[0].clientY);

popup.addEventListener("touchend", e => {
  if (e.changedTouches[0].clientY - startY > 100) {
    closePopup();
  }
});

/* 🎵 MUSIC */
let playing = true;

function toggleMusic() {
  const btn = document.querySelector(".music-player button");
  playing = !playing;
  btn.innerText = playing ? "⏸" : "▶️";
}

/* 📷 SCANNER (UI VERSION) */
function startCamera() {
  const scanner = document.getElementById("scanner");

  scanner.innerHTML = `
    <h3>Find Recipes</h3>

    <input id="scanInput" placeholder="Enter ingredient"
      style="width:100%;padding:10px;border-radius:10px;border:none;margin-top:10px;">

    <button onclick="scanNow()" 
      style="margin-top:10px;width:100%;padding:10px;border:none;border-radius:15px;background:#66bb6a;color:white;">
      Search
    </button>

    <button onclick="closeScanner()" style="margin-top:10px;width:100%;">
      Cancel
    </button>
  `;

  scanner.classList.remove("hidden");
}

function scanNow() {
  const val = document.getElementById("scanInput").value.toLowerCase();

  render(
    data.filter(r =>
      r.ingredients.join(" ").toLowerCase().includes(val)
    )
  );

  closeScanner();
}

function closeScanner() {
  document.getElementById("scanner").classList.add("hidden");
}
