const API_KEY = "a26317bf98e741c39ca8ed2d1b4d414c"; // Spoonacular API key
const searchButton = document.getElementById("search-btn");
const inputField = document.getElementById("ingredient-input");
const recipesContainer = document.getElementById("recipes-container");

// Trigger search on button click
searchButton.addEventListener("click", () => {
    const ingredients = inputField.value.trim(); // Get input value

    if (ingredients === "") {
        alert("Please enter at least one ingredient."); // Alert if input is empty
        return;
    }

    fetchRecipes(ingredients); // Fetch recipes from API
});

async function fetchRecipes(ingredients) {
    recipesContainer.innerHTML = "<p>Loading recipes...</p>";
    
    const recipeCount = document.getElementById("recipe-count").value; // Get user-selected number of recipes

    let url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=${recipeCount}&ranking=2&apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch recipes");

        let data = await response.json();
        let filteredRecipes = data.filter(recipe => recipe.missedIngredientCount === 0).slice(0, recipeCount); // Ensure exact count

        // If no exact matches, retry but prioritize closest matches
        if (filteredRecipes.length === 0) {
            console.log("No exact matches found. Retrying with closest matches...");

            let fallbackUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=20&ranking=1&apiKey=${API_KEY}`;
            const fallbackResponse = await fetch(fallbackUrl);
            const fallbackData = await fallbackResponse.json();

            // Sort recipes by how many ingredients they match
            fallbackData.sort((a, b) => b.usedIngredientCount - a.usedIngredientCount);

            // Only keep recipes that use at least half of the provided ingredients, then slice to requested count
            const minMatch = Math.ceil(ingredients.split(",").length / 2);
            filteredRecipes = fallbackData
                .filter(recipe => recipe.usedIngredientCount >= minMatch)
                .slice(0, recipeCount);

            recipesContainer.innerHTML = "<p>No exact matches found. Showing the closest recipes instead.</p>";
        }

        displayRecipes(filteredRecipes);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        recipesContainer.innerHTML = "<p>Failed to load recipes. Please try again.</p>";
    }
}

// Fetch Nutrition data
async function fetchNutrition(recipeId) {
    const url = `https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch nutrition data");

        const data = await response.json();

        // Extract specific macro nutrients
        const nutrients = data.nutrients || [];
        const getNutrient = (name) => {
            const nutrient = nutrients.find(n => n.name.toLowerCase().includes(name));
            return nutrient ? `${nutrient.amount} ${nutrient.unit}` : "N/A";
        };

        return {
            calories: getNutrient("calories"),
            protein: getNutrient("protein"),
            carbs: getNutrient("carbohydrates"),
            fats: getNutrient("fat"),
        };
    } catch (error) {
        console.error("Error fetching nutrition data:", error);
        return { calories: "N/A", protein: "N/A", carbs: "N/A", fats: "N/A" };
    }
}



// Display fetched recipes
async function displayRecipes(recipes) {
    recipesContainer.innerHTML = ""; // Clear previous results
    const userIngredients = inputField.value.toLowerCase().split(",").map(ing => ing.trim());

    if (recipes.length === 0) {
        recipesContainer.innerHTML = "<p>No recipes found. Try different ingredients.</p>";
        return;
    }

    for (let recipe of recipes) {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");

        // Fetch full recipe details to get nutrition data
        const nutritionData = await fetchNutrition(recipe.id);

        // Get all ingredients from API response (both used and missed)
        const allIngredients = [...recipe.usedIngredients, ...recipe.missedIngredients];

        // Limit ingredients displayed initially to 7
        let displayedIngredients = allIngredients.slice(0, 7).map(ingredient => 
            `<li>${userIngredients.some(userIng => ingredient.name.toLowerCase().includes(userIng)) ? "✅" : "❌"} ${ingredient.original}</li>`
        ).join("");

        let hiddenIngredients = allIngredients.slice(7).map(ingredient => 
            `<li class="hidden-ingredient">${userIngredients.some(userIng => ingredient.name.toLowerCase().includes(userIng)) ? "✅" : "❌"} ${ingredient.original}</li>`
        ).join("");

        let seeMoreButton = allIngredients.length > 7 ? `<button class="see-more-btn">See More</button>` : "";

        // Populate the recipe card
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p><strong>Ingredients:</strong></p>
            <ul class="ingredient-list">
                ${displayedIngredients}
                <span class="hidden-ingredients" style="display: none;">${hiddenIngredients}</span>
            </ul>
            ${seeMoreButton}
            <div class="nutrition-container">
                <p><strong>Calories:</strong> ${nutritionData.calories}</p>
                <p><strong>Protein:</strong> ${nutritionData.protein}</p>
                <p><strong>Carbs:</strong> ${nutritionData.carbs}</p>
                <p><strong>Fats:</strong> ${nutritionData.fats}</p>
            </div>
            <a href="https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, "-")}-${recipe.id}" target="_blank">View Recipe</a>
        `;

        recipesContainer.appendChild(recipeCard);
    }

    // Attach event listeners for "See More" buttons
    document.querySelectorAll(".see-more-btn").forEach(button => {
        button.addEventListener("click", function() {
            let parentCard = this.parentElement;
            let hiddenSection = parentCard.querySelector(".hidden-ingredients");
            hiddenSection.style.display = "block";
            this.style.display = "none"; // Hide the "See More" button after expanding
        });
    });
}



