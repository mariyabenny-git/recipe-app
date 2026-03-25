let recipes = [];
let lang = "en";

// LOAD DATA
fetch("recipes.json")
  .then(res => res.json())
  .then(data => {
    recipes = data;
    loadRecipes();
  });

function loadRecipes() {
  const container = document.getElementById("recipesContainer");
  container.innerHTML = "";

  recipes.forEach((r, i) => {
    container.innerHTML += `
      <div class="card" onclick="openRecipe(${i})">
        <img src="${r.image}">
        <div class="card-content">
          <span class="heart" onclick="fav(event)">❤️</span>
          <h3>${r.name[lang]}</h3>
        </div>
      </div>
    `;
  });
}

// FAVORITE + HAPTIC
function fav(e) {
  e.stopPropagation();
  navigator.vibrate(50);
}

// NAVIGATION
function showPage(id) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// DETAIL VIEW
function openRecipe(i) {
  const r = recipes[i];

  document.getElementById("recipeDetail").innerHTML = `
    <h2 class="sticky-title">${r.name[lang]}</h2>

    <h3>Ingredients</h3>
    ${r.ingredients[lang].map(i => `<label><input type="checkbox"> ${i}</label><br>`).join("")}

    <h3>Steps</h3>
    ${r.steps[lang].map((s,i)=> `<p>${i+1}. ${s}</p>`).join("")}
  `;

  showPage("recipeDetail");
}

// LANGUAGE TOGGLE
document.getElementById("langToggle").onclick = () => {
  lang = (lang === "en") ? "ml" : "en";
  loadRecipes();
};

// KEEP SCREEN ON
let wakeLock = null;
document.getElementById("startCooking").onclick = async () => {
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    alert("Screen will stay awake!");
  } catch (err) {
    console.log(err);
  }
};
