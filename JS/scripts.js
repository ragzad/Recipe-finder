// js/scripts.js

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

// Fetch recipes from Spoonacular API
async function fetchRecipes(ingredients) {
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=6&apiKey=${API_KEY}`;
    
    try {
        const response = await fetch(url); // Send request
        if (!response.ok) throw new Error("Failed to fetch recipes");

        const recipes = await response.json(); // Convert response to JSON
        displayRecipes(recipes); // Display recipes on page
    } catch (error) {
        console.error("Error fetching recipes:", error);
        alert("Error fetching recipes. Please try again."); // Error handling
    }
}

// Display fetched recipes
function displayRecipes(recipes) {
    recipesContainer.innerHTML = ""; // Clear previous results

    if (recipes.length === 0) {
        recipesContainer.innerHTML = "<p>No recipes found. Try different ingredients.</p>";
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = document.createElement("div"); // Create recipe card
        recipeCard.classList.add("recipe-card");

        // Populate recipe card
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <a href="https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, "-")}-${recipe.id}" target="_blank">View Recipe</a>
        `;

        recipesContainer.appendChild(recipeCard); // Append card to container
    });
}
