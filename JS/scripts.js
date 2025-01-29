const API_KEY = "dd3d443ac15c443d8d9dc8d5d838001f"; // Spoonacular API key
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



// Display fetched recipes
function displayRecipes(recipes) {
    recipesContainer.innerHTML = ""; // Clear previous results

    if (recipes.length === 0) {
        recipesContainer.innerHTML = "<p>No recipes found. Try different ingredients.</p>";
        return;
    }

    // Create a wrapper for horizontal scrolling
    const scrollWrapper = document.createElement("div");
    scrollWrapper.classList.add("scroll-container");

    recipes.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");

        // Populate the recipe card
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <a href="https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, "-")}-${recipe.id}" target="_blank">View Recipe</a>
        `;

        scrollWrapper.appendChild(recipeCard); // Add each card to the scroll container
    });

    recipesContainer.appendChild(scrollWrapper); // Add the scroll container to the page
}

