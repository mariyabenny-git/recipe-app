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
  lucide.createIcons();
});

/* HOME */
function goHome() {
  closePopup();
  closeScanner();
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
      <div class="heart">${favorites.includes(r.name) ? "❤️" : "🤍"}</div>
      <h4>${r.name}</h4>
    `;

    card.onclick = () => showRecipe(r.name);

    card.querySelector(".heart").onclick = (e) => {
      e.stopPropagation();
      toggleFav(r.name);
    };

    container.appendChild(card);
  });
}

/* FAVORITE */
function toggleFav(name) {
  if (favorites.includes(name))
    favorites = favorites.filter(f => f !== name);
  else
    favorites.push(name);

  localStorage.setItem("fav", JSON.stringify(favorites));
  render(data);
}

/* SEARCH */
document.getElementById("search").addEventListener("input", e => {
  render(data.filter(r =>
    r.name.toLowerCase().includes(e.target.value.toLowerCase())
  ));
});

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

  popup.innerHTML = `
    <button class="back-btn" onclick="closePopup()">←</button>
    <h2>${r.name}</h2>

    <h3>Ingredients</h3>
    <ul>${r.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>

    <h3>Steps</h3>
    <ol>${r.steps.map(s => `<li>${s}</li>`).join("")}</ol>
  `;

  popup.classList.remove("hidden");

  setTimeout(() => {
    popup.classList.add("show");
  }, 10);
}

/* CLOSE */
function closePopup() {
  let popup = document.getElementById("popup");
  popup.classList.remove("show");

  setTimeout(() => {
    popup.classList.add("hidden");
  }, 300);
}

/* SCANNER */
function startCamera() {
  let scanner = document.getElementById("scanner");

  if (!scanner.classList.contains("hidden")) {
    closeScanner();
    return;
  }

  scanner.innerHTML = `
    <button class="back-btn" onclick="closeScanner()">✕</button>
    <h3>Scan Ingredients</h3>
    <input id="scanInput" placeholder="tomato, onion...">
    <button onclick="scanNow()">Search</button>
  `;

  scanner.classList.remove("hidden");

  setTimeout(() => {
    scanner.classList.add("show");
  }, 10);
}

function closeScanner() {
  let scanner = document.getElementById("scanner");
  scanner.classList.remove("show");

  setTimeout(() => {
    scanner.classList.add("hidden");
  }, 300);
}

function scanNow() {
  let val = document.getElementById("scanInput").value.toLowerCase();

  render(data.filter(r =>
    r.ingredients.join(" ").toLowerCase().includes(val)
  ));

  closeScanner();
}

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
