let data = [];
let favorites = JSON.parse(localStorage.getItem("fav")) || [];

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
      <img src="${r.image}" 
        onerror="this.src='https://via.placeholder.com/300x200?text=Food'" />

      <div class="heart" onclick="toggleFav('${r.name}', event)">
        ${favorites.includes(r.name) ? "❤️" : "🤍"}
      </div>

      <h4>${r.name || "Recipe"}</h4>
    `;

    card.onclick = () => showRecipe(r.name);

    container.appendChild(card);
  });
}

function showRecipe(name) {
  let r = data.find(x => x.name === name);

  let popup = document.getElementById("popup");

  popup.innerHTML = `
    <h2>${r.name}</h2>
    <img src="${r.image}" style="width:100%;border-radius:10px;">

    <p>⏱️ ${r.time || "N/A"} | 🔥 ${r.calories || "N/A"}</p>

    <h3>Ingredients</h3>
    <ul>${r.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>

    <h3>Steps</h3>
    <ol>${r.steps.map(s => `<li>${s}</li>`).join("")}</ol>

    <button onclick="closePopup()">Close</button>
  `;

  popup.classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

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
  let container = document.getElementById("recipes");
  container.innerHTML = "";

  data.filter(r => favorites.includes(r.name))
    .forEach(r => {
      let card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${r.image}">
        <h4>${r.name}</h4>
      `;

      card.onclick = () => showRecipe(r.name);
      container.appendChild(card);
    });
}

document.getElementById("search").addEventListener("input", (e) => {
  loadRecipes(e.target.value);
});

function loadChips() {
  let cats = [...new Set(data.map(r => r.category))];
  let chips = document.getElementById("chips");

  cats.forEach(c => {
    let btn = document.createElement("button");
    btn.innerText = c;

    btn.onclick = () => {
      let filtered = data.filter(r => r.category === c);
      display(filtered);
    };

    chips.appendChild(btn);
  });
}

function display(arr) {
  let container = document.getElementById("recipes");
  container.innerHTML = "";

  arr.forEach(r => {
    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${r.image}">
      <h4>${r.name}</h4>
    `;

    card.onclick = () => showRecipe(r.name);
    container.appendChild(card);
  });
}

/* Fake AI */
function startCamera() {
  let input = prompt("Enter ingredient (rice, egg, etc):");

  if (!input) return;

  let results = data.filter(r =>
    r.ingredients.join(" ").toLowerCase().includes(input.toLowerCase())
  );

  display(results);
}

/* Dark mode */
document.getElementById("toggleDark").onclick = () => {
  document.body.classList.toggle("dark");
};

/* Language */
function toggleLang() {
  alert("Language feature demo");
}
