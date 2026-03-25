let recipes = [];
let lang = "en";
let current = [];

// LOAD
fetch("recipes.json")
.then(r => r.json())
.then(data => {
  recipes = data;
  loadRecipes(recipes);
  loadQuick();
});

// DISPLAY
function loadRecipes(data) {
  const c = document.getElementById("recipesContainer");
  c.innerHTML = "";

  data.forEach((r,i)=>{
    c.innerHTML += `
      <div class="card" onclick="openRecipe(${i})">
        <img src="${r.image}">
        <h3>${r.name[lang]}</h3>
      </div>
    `;
  });
}

// QUICK
function loadQuick() {
  loadRecipes(recipes.filter(r => r.time <= 15));
}

// FILTER
function filterCat(cat){
  loadRecipes(recipes.filter(r => r.category === cat));
}

// PANTRY SCAN (SIMULATED AI)
function scanPantry(){
  let input = prompt("Enter ingredients you have:");
  let items = input.toLowerCase().split(",");

  let result = recipes.filter(r =>
    r.ingredients.en.some(i =>
      items.some(x => i.toLowerCase().includes(x.trim()))
    )
  );

  loadRecipes(result);
}

// DETAIL + SCALING
function openRecipe(i){
  let r = recipes[i];

  document.getElementById("recipeDetail").innerHTML = `
    <h2>${r.name[lang]}</h2>

    <label>👥 Servings:
      <input type="range" min="1" max="6" value="2" onchange="scale(${i}, this.value)">
    </label>

    <div id="ingredients"></div>

    <h3>Steps</h3>
    ${r.steps[lang].map((s,i)=> `<p>${i+1}. ${s}</p>`).join("")}
  `;

  scale(i,2);
  showPage("recipeDetail");
}

// SCALE
function scale(i, n){
  let r = recipes[i];
  document.getElementById("ingredients").innerHTML =
    r.ingredients[lang].map(x=> `<p>${x} x${n}</p>`).join("");
}

// NAV
function showPage(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// VOICE COOK MODE
document.getElementById("cookMode").onclick = () => {
  const speech = new SpeechSynthesisUtterance("Cooking mode activated");
  speechSynthesis.speak(speech);
};

// LANGUAGE
document.getElementById("langToggle").onclick = ()=>{
  lang = lang === "en" ? "ml" : "en";
  loadRecipes(recipes);
};
