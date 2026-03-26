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
    lucide.createIcons();
  });

/* RECIPES */
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
      <div class="heart" onclick="toggleFav('${r.name}', event)">
        ${favorites.includes(r.name) ? "❤️" : "🤍"}
      </div>
      <h4>${r.name}</h4>
      <p>⏱️ ${r.time}</p>
    `;

    card.onclick = () => showRecipe(r.name);
    container.appendChild(card);
  });
}

/* SHOW */
function showRecipe(name) {
  let r = data.find(x => x.name === name);
  let popup = document.getElementById("popup");

  popup.innerHTML = `
    <button class="close-btn" onclick="closePopup()">←</button>
    <h2>${r.name}</h2>
    <p>⏱️ ${r.time}</p>
    <p><b>Ingredients:</b><br>${r.ingredients.join(", ")}</p>
    <p><b>Steps:</b><br>${r.steps}</p>
  `;

  popup.classList.remove("hidden");
  history.pushState({}, "");
}

/* CLOSE */
function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

window.onpopstate = () => closePopup();

/* FAVORITES */
function toggleFav(name, e) {
  e.stopPropagation();

  favorites = favorites.includes(name)
    ? favorites.filter(f => f !== name)
    : [...favorites, name];

  localStorage.setItem("fav", JSON.stringify(favorites));
  loadRecipes();
}

/* FAVORITES VIEW */
function showFavorites() {
  display(data.filter(r => favorites.includes(r.name)));
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
  let chips = document.getElementById("chips");
  chips.innerHTML = "";

  [...new Set(data.map(r => r.category))].forEach(c => {
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
    container.innerHTML += `
      <div class="card" onclick="showRecipe('${r.name}')">
        <h4>${r.name}</h4>
        <p>⏱️ ${r.time}</p>
      </div>
    `;
  });
}

/* SCANNER */
function startCamera() {
  let scan = document.getElementById("scanner");

  scan.innerHTML = `
    <button class="close-btn" onclick="closeScanner()">←</button>
    <h3>Enter Ingredients</h3>
    <input id="scanInput">
    <button onclick="scanSearch()">Find</button>
  `;

  scan.classList.remove("hidden");
}

function closeScanner() {
  document.getElementById("scanner").classList.add("hidden");
}

function scanSearch() {
  let val = document.getElementById("scanInput").value.toLowerCase();

  if (!val) return closeScanner();

  let result = data.filter(r =>
    val.split(" ").some(i =>
      r.ingredients.join(" ").toLowerCase().includes(i)
    )
  );

  display(result);
  closeScanner();
}

/* TIMER */
let timer, seconds = 0;

function startTimer() {
  if (timer) return;

  timer = setInterval(() => {
    seconds++;
    let m = String(Math.floor(seconds / 60)).padStart(2, '0');
    let s = String(seconds % 60).padStart(2, '0');
    document.getElementById("timeDisplay").innerText = `${m}:${s}`;
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  seconds = 0;
  document.getElementById("timeDisplay").innerText = "00:00";
}

/* MUSIC */
function toggleMusic() {
  const audio = document.getElementById("music");
  const btn = document.getElementById("musicBtn");

  if (!isPlaying) {
    audio.play().then(() => {
      isPlaying = true;
      btn.innerText = "⏸️";
    }).catch(() => alert("Tap again 🔊"));
  } else {
    audio.pause();
    isPlaying = false;
    btn.innerText = "▶️";
  }
}
