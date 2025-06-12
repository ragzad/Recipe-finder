# Recipe Finder Project: Scope and UX Goals

## Project Overview
A dynamic, interactive recipe search application where users can input ingredients to find recipes that match their preferences. The app will include advanced search filters, provide feedback for invalid inputs, and display results dynamically. It will be user-friendly, responsive, and adhere to accessibility guidelines.

---

## Target Audience
- **Food Enthusiasts**: Individuals who love cooking and exploring new recipes.
- **Meal Preppers**: Users planning weekly meals based on available ingredients.
- **Health-Conscious Individuals**: People with dietary restrictions or specific meal preferences.

---

## Goals and Features

### Core Features
1. **Ingredient-Based Search**:
   - Users input ingredients they have, and recipes will be fetched dynamically.
   - Display key recipe information like title, image, and cooking time.

2. **Advanced Filters**:
   - Include filters for dietary restrictions (vegetarian, vegan, gluten-free).
   - Provide options to filter by meal type (breakfast, lunch, dinner).

3. **Error Handling**:
   - Clear feedback for invalid inputs ("Please enter at least one ingredient").
   - Graceful handling of API errors or empty results ("No recipes found").

---

## Accessibility and UX Standards

### Accessibility (WAI-ARIA Compliance)
- Use semantic HTML ( `<header>`, `<nav>`, `<main>`).
- Provide ARIA roles for interactive elements (buttons, search fields).
- Ensure all images have descriptive alt text.

### User Experience (UX) Principles
1. **Intuitive Navigation**:
   - Simple, minimalistic design.
   - Prominent search bar and clear filter options.
2. **Feedback Mechanisms**:
   - Immediate feedback for invalid inputs or API errors.
   - Clear visual indicators of loading and successful searches.
3. **Responsive Design**:
   - Mobile-first layout using CSS Grid/Flexbox.
   - Ensure usability across devices and screen sizes.

---

## Technical Requirements

### Tools and Technologies
- **Front-End**: HTML, CSS, JavaScript.
- **API**: Spoonacular API or similar for recipe data.
- **Testing**: Automated/manual testing
- **Version Control**: Git/GitHub for incremental development and deployment.

### Project Deployment
- Host the app on a cloud-based platform like GitHub Pages.
- Use Git for frequent commits with descriptive messages.

---

# Recipe Finder - Patch Notes  
**Version: 1.1**  
**Date: 29/01/2025**  

---

## Fixes and Improvements  

### 1. Fixed Recipe Count Issue  
- The app was pulling **more recipes than requested**, sometimes showing extra or missing results.  
- We made sure that it **always** returns the exact number you ask for by limiting the results with `.slice(0, recipeCount)`.  

---

### 2. Better Recipe Matching in Fallback Search  
- When no exact matches were found, the app used to **show random recipes** instead of prioritizing the closest ones.  
- Now, it **sorts recipes by how many ingredients match** and **removes bad matches**, so you get more relevant results.  

---

### 3. Removed Meal Type Filtering  
- The meal type filter wasn’t really affecting results, since the API doesn't support it well.  
- We decided to **remove it completely** to avoid confusion and keep the search cleaner.  

---

### 4. Improved Recipe Display with Scrolling  
- Instead of stacking recipes in a long list, they now **scroll horizontally** in a neat carousel.  
- This makes it **easier to browse** through multiple options.  

---

### 5. Improved Loading and Error Messages  
- Added `"Loading recipes..."` while fetching results.  
- If no exact matches are found, it now says `"No exact matches found. Showing closest recipes instead."`  
- Errors are now clearer so you know what went wrong.  

---

# Recipe Finder - Patch Notes  
**Version: 1.2 (Latest)**  
**Date: 29/01/2025**  

---

## Fixes and Improvements  

### 1. Improved Recipe Card Layout (Horizontal Scrolling)  
- Restored **horizontal scrolling** for recipe cards while keeping ingredients vertically stacked.  
- Adjusted **styling** to ensure a cleaner, more readable layout.  

#### Problem Faced:  
- Recipe cards were stacking **vertically**, making navigation less user-friendly.  

#### How We Fixed It:  
- Reverted to **horizontal scrolling** while ensuring **ingredients stack properly** within each card.  

---

### 2. Added a "See More" Button for Long Ingredient Lists  
- Limited the **default ingredient list to 7 items**.  
- Added a `"See More"` button when recipes contain more than 7 ingredients.  
- Clicking the button expands the full list, preventing large recipe cards.  

#### Problem Faced:  
- Recipes with **long ingredient lists** were making some cards too large, breaking the layout.  

#### How We Fixed It:  
- Implemented a **toggle feature** that expands or collapses the ingredient list dynamically.  

---

### 3. Improved Ingredient Matching (Fuzzy Search)  
- **Now detects partial ingredient matches** (e.g., `"egg"` matches `"hard boiled eggs"` or `"9 eggs"`).  
- Allows for more **flexible searching** and avoids missing valid matches.  

#### Problem Faced:  
- **Exact text matching** was preventing valid ingredient recognition.  
- `"egg"` and `"hard boiled eggs"` were treated as different items.  

#### How We Fixed It:  
- Updated ingredient comparison logic to use **partial string matching** with `.includes()`.  

---

### 4. Improved Nutrition Display  
- **Nutrition info (calories, protein, carbs, fats) now fits correctly inside recipe cards**.  
- Adjusted **text wrapping** to prevent overflow.  

#### Problem Faced:  
- Nutrition details were **overflowing the recipe card**, making some text unreadable.  

#### How We Fixed It:  
- Applied **CSS fixes** to properly stack macros inside each card.  
- Ensured **text wraps instead of overflowing**.  

### Test Plan

The following test cases were executed to assess the Recipe Finder application's core functionality, usability, and responsiveness.

#### 1. Functionality Tests

| Test Case Description | Input/Action | Expected Outcome | Actual Outcome / Status |
| :----------------------------------------------------- | :------------------------------------------------- | :------------------------------------------------------------------------------------ | :---------------------- |
| **Successful Recipe Search** | Enter valid ingredients (e.g., "chicken, rice") | Relevant recipes displayed, matching the selected count. | Passed |
| **"See More" Button Functionality** | Click "See More" on a recipe card | All ingredients for that recipe become visible; the "See More" button hides. | Passed |
| **Recipe Count Selection** | Select a different recipe count (e.g., "12" or "18") | The specified number of recipes is displayed in the results. | Passed |
| **Empty Input Handling** | Click "Search Recipes" with an empty input field | An alert message "Please enter at least one ingredient." appears. | Passed |
| **No Exact Matches (Fallback)** | Enter unusual ingredients unlikely to have exact matches (e.g., "starfruit, quinoa") | Message "No exact matches found. Showing the closest recipes instead." appears, followed by relevant fallback recipes. | Passed |
| **API Error Handling** | (Simulate API failure or network issue if possible) | Message "Failed to load recipes. Please try again." appears. | Passed |

#### 2. Usability Tests

| Test Case Description | Input/Action | Expected Outcome | Actual Outcome / Status |
| :----------------------------------------------------- | :------------------------------------------------- | :------------------------------------------------------------------------------------ | :---------------------- |
| **Intuitive Interface** | Navigate through the app | Search bar and filters are easily discoverable and understandable. | Passed |
| **Clear Feedback** | Perform a search; encounter an error | Loading messages, error messages, and search results are clear and timely. | Passed |
| **Interactive Elements** | Click buttons, type in input field | All interactive elements respond as expected (e.g., buttons change on hover). | Passed |
| **Legibility** | View text and images across the application | All text is clearly readable; images are of usable resolution and not pixelated. | Passed |

#### 3. Responsiveness Tests

| Test Case Description | Input/Action | Expected Outcome | Actual Outcome / Status |
| :----------------------------------------------------- | :------------------------------------------------- | :------------------------------------------------------------------------------------ | :---------------------- |
| **Mobile View (e.g., 375px width)** | Resize browser window to mobile dimensions | Recipe cards stack vertically; input field and button adjust size; no horizontal scrolling. | Passed |
| **Desktop View (e.g., 1200px width)** | View on a desktop screen | Layout is well-structured and utilizes screen space effectively; horizontal scrolling for recipes. | Passed |

---

**Screenshots:**

Screenshots demonstrating the application's functionality, responsiveness, and various states (e.g., initial load, search results, mobile view, expanded ingredient list) are located in the `screenshots/` directory within this repository.