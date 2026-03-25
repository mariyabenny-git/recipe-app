let recipes = [];
let lang = "en";
let currentCategory = "All";

// LOAD
fetch("recipes.json")
.then(res => res.json())
.then(data => {
  recipes = data;
  loadRecipes();
});

// LOAD RECIPES
function loadRecipes() {
  const container = document.getElementById("recipesContainer");
  const search = document.getElementById("search").value.toLowerCase();

  container.innerHTML = "";

  recipes
    .filter(r =>
      (currentCategory === "All" || r.category === currentCategory) &&
      r.name[lang].toLowerCase().includes(search)
    )
    .forEach((r, i) => {
      container.innerHTML += `
        <div class="card" onclick="openRecipe(${i})">
          <img src="${r.image}">
          <span class="heart" onclick="fav(event)">❤️</span>
          <div class="card-content">
            <h3>${r.name[lang]}</h3>
          </div>
        </div>
      `;
    });
}

// CATEGORY
document.querySelectorAll(".chip").forEach(chip => {
  chip.onclick = () => {
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    currentCategory = chip.innerText;
    loadRecipes();
  };
});

// SEARCH
document.getElementById("search").oninput = loadRecipes;

// FAVORITE
function fav(e) {
  e.stopPropagation();
  e.target.classList.toggle("active");
  navigator.vibrate(50);
}

// NAV
function showPage(id, el) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".bottom-nav button").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
}

// DETAIL
function openRecipe(i) {
  const r = recipes[i];

  document.getElementById("recipeDetail").innerHTML = `
    <h2 class="sticky-title">${r.name[lang]}</h2>

    <h3>Ingredients</h3>
    ${r.ingredients[lang].map(i => `<p>☐ ${i}</p>`).join("")}

    <h3>Steps</h3>
    ${r.steps[lang].map((s,i)=> `<p>${i+1}. ${s}</p>`).join("")}
  `;

  showPage("recipeDetail", document.querySelectorAll(".bottom-nav button")[1]);
}

// LANGUAGE
document.getElementById("langToggle").onclick = () => {
  lang = lang === "en" ? "ml" : "en";
  loadRecipes();
};

// SCREEN WAKE
document.getElementById("startCooking").onclick = async () => {
  try {
    await navigator.wakeLock.request("screen");
    alert("Screen will stay ON while cooking 🍳");
  } catch {}
};
