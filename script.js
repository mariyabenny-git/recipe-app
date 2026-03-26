let data = [];
let favorites = JSON.parse(localStorage.getItem("fav")) || [];
let music = document.getElementById("music");
let playing = false;

/* LOAD */
fetch("recipes.json")
.then(res => res.json())
.then(res => {
  data = res;
  render(data);
  loadChips();
  lucide.createIcons(); // 🔥 ICON INIT
});

/* HOME FIX */
function goHome() {
  closePopup();
  document.getElementById("search").value = "";
  render(data);
}

/* ACTIVE NAV */
function setActive(id) {
  document.querySelectorAll(".bottom-nav button")
    .forEach(btn => btn.classList.remove("active"));

  document.getElementById(id)?.classList.add("active");
}

/* RENDER */
function render(arr) {
  let container = document.getElementById("recipes");
  container.innerHTML = "";

  arr.forEach(r => {
    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="heart" onclick="toggleFav('${r.name}', event)">
        ${favorites.includes(r.name) ? "❤️" : "🤍"}
      </div>
      <h4>${r.name}</h4>
    `;

    card.onclick = () => showRecipe(r.name);
    container.appendChild(card);
  });
}

/* SEARCH */
document.getElementById("search").addEventListener("input", e => {
  render(data.filter(r =>
    r.name.toLowerCase().includes(e.target.value.toLowerCase())
  ));
});

/* FAVORITES */
function toggleFav(name, e) {
  e.stopPropagation();

  if (favorites.includes(name))
    favorites = favorites.filter(f => f !== name);
  else
    favorites.push(name);

  localStorage.setItem("fav", JSON.stringify(favorites));
  render(data);
}

/* SHOW FAVORITES */
function showFavorites() {
  render(data.filter(r => favorites.includes(r.name)));
}

/* CATEGORY */
function loadChips() {
  let cats = [...new Set(data.map(r => r.category))];
  let chips = document.getElementById("chips");

  cats.forEach(c => {
    let btn = document.createElement("button");
    btn.innerText = c;
    btn.onclick = () => render(data.filter(r => r.category === c));
    chips.appendChild(btn);
  });
}

/* POPUP */
function showRecipe(name) {
  let r = data.find(x => x.name === name);
  let popup = document.getElementById("popup");

  history.pushState({}, "");

  popup.innerHTML = `
    <button class="close-btn" onclick="closePopup()">←</button>
    <h2>${r.name}</h2>

    <h3>Ingredients</h3>
    <ul>${r.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>

    <h3>Steps</h3>
    <ol>${r.steps.map(s => `<li>${s}</li>`).join("")}</ol>
  `;

  popup.classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

window.onpopstate = closePopup;

/* MUSIC */
function toggleMusic() {
  let btn = document.querySelector(".music-player button");

  if (playing) {
    music.pause();
    btn.innerText = "▶️";
  } else {
    music.volume = 0.3;
    music.play();
    btn.innerText = "⏸";
  }

  playing = !playing;
}

/* SCANNER */
function startCamera() {
  let scanner = document.getElementById("scanner");

  scanner.innerHTML = `
    <h3>Enter Ingredient</h3>
    <input id="scanInput" placeholder="tomato, onion...">
    <button onclick="scanNow()">Search</button>
    <button onclick="closeScanner()">Cancel</button>
  `;

  scanner.classList.remove("hidden");
}

function scanNow() {
  let val = document.getElementById("scanInput").value.toLowerCase();

  render(data.filter(r =>
    r.ingredients.join(" ").toLowerCase().includes(val)
  ));

  closeScanner();
}

function closeScanner() {
  document.getElementById("scanner").classList.add("hidden");
}
