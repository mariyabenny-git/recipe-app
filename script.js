let data = [];
let favorites = JSON.parse(localStorage.getItem("fav")) || [];

/* Load theme */
window.onload = () => {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
  }
};

fetch("recipes.json")
  .then(res => res.json())
  .then(res => {
    data = res;
    loadRecipes();
    loadChips();
  });

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
      <img src="${r.image}" onerror="this.src='https://via.placeholder.com/300x200?text=Food'">
      <div class="heart" onclick="toggleFav('${r.name}', event)">
        ${favorites.includes(r.name) ? "❤️" : "🤍"}
      </div>
      <h4>${r.name}</h4>
    `;

    card.onclick = () => showRecipe(r.name);
    container.appendChild(card);
  });
}

/* Recipe popup */
function showRecipe(name) {
  let r = data.find(x => x.name === name);
  let popup = document.getElementById("popup");

  history.pushState({ popup: true }, "");

  popup.innerHTML = `
    <div style="width:40px;height:5px;background:#888;margin:auto;border-radius:10px;"></div>
    <img src="${r.image}" style="width:100%;border-radius:15px;">
    <h2>${r.name}</h2>
    <p>⏱ ${r.time} | 🔥 ${r.calories}</p>

    <h3>Ingredients</h3>
    <ul>${r.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>

    <h3>Steps</h3>
    <ol>${r.steps.map(s => `<li>${s}</li>`).join("")}</ol>

    <button onclick="closePopup()">Close</button>
  `;

  popup.classList.remove("hidden");
  popup.classList.add("active");
}

function closePopup() {
  let popup = document.getElementById("popup");
  popup.classList.add("hidden");
  popup.classList.remove("active");
}

/* Back button */
window.onpopstate = () => {
  closePopup();
};

/* Swipe */
let startY = 0;
popup = document.getElementById("popup");

popup.addEventListener("touchstart", e => startY = e.touches[0].clientY);
popup.addEventListener("touchend", e => {
  if (e.changedTouches[0].clientY - startY > 100) closePopup();
});

/* Favorites */
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

/* Search */
document.getElementById("search").addEventListener("input", e => {
  loadRecipes(e.target.value);
});

/* Chips */
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

/* Theme */
function toggleTheme() {
  document.body.classList.toggle("light");
  localStorage.setItem("theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
}

/* Fake AI */
function startCamera() {
  let input = prompt("Enter ingredient:");
  if (!input) return;
  display(data.filter(r =>
    r.ingredients.join(" ").toLowerCase().includes(input.toLowerCase())
  ));
}
