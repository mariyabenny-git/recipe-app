let data = [];
let favorites = JSON.parse(localStorage.getItem("fav")) || [];
let currentLang = "en";

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
    container.innerHTML += `
      <div class="card" onclick="showRecipe('${r.name}')">
        <img src="${r.image}">
        <div class="heart" onclick="toggleFav('${r.name}', event)">
          ${favorites.includes(r.name) ? "❤️" : "🤍"}
        </div>
        <h4>${r.name}</h4>
      </div>
    `;
  });
}

function showRecipe(name) {
  let r = data.find(x => x.name === name);
  let popup = document.getElementById("popup");

  popup.innerHTML = `
    <h2>${r.name}</h2>
    <img src="${r.image}" style="width:100%;border-radius:10px;">
    <h3>Ingredients</h3>
    <p>${r.ingredients.join(", ")}</p>
    <h3>Steps</h3>
    <p>${r.steps}</p>
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
      container.innerHTML += `
        <div class="card" onclick="showRecipe('${r.name}')">
          <img src="${r.image}">
          <h4>${r.name}</h4>
        </div>
      `;
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
    container.innerHTML += `
      <div class="card" onclick="showRecipe('${r.name}')">
        <img src="${r.image}">
        <h4>${r.name}</h4>
      </div>
    `;
  });
}

/* 🌙 DARK MODE */
document.getElementById("toggleDark").onclick = () => {
  document.body.classList.toggle("dark");
};

/* 🌍 LANGUAGE */
function toggleLang() {
  currentLang = currentLang === "en" ? "ta" : "en";
  alert(currentLang === "en" ? "English" : "தமிழ்");
}

/* 📷 CAMERA */
function startCamera() {
  let video = document.getElementById("camera");

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      alert("Camera not working");
    });
}
