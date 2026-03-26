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
      <img src="${r.image}">
      <div class="heart" onclick="toggleFav('${r.name}', event)">
        ${favorites.includes(r.name) ? "❤️" : "🤍"}
      </div>
      <h4>${r.name}</h4>
    `;

    container.appendChild(card);
  });
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
      container.innerHTML += `<div class="card">
        <img src="${r.image}">
        <h4>${r.name}</h4>
      </div>`;
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
      loadRecipes();
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
    container.innerHTML += `<div class="card">
      <img src="${r.image}">
      <h4>${r.name}</h4>
    </div>`;
  });
}

document.getElementById("toggleDark").onclick = () => {
  document.body.classList.toggle("dark");
};
