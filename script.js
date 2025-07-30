const searchBox = document.querySelector('.searchbox');
const searchButton = document.querySelector('.searchbutton');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContainer = document.querySelector('.recipe-details-content');
const recipeDetails = document.querySelector('.recipe-details');
const recipeCloseButton = document.querySelector('.recipe-close-button');

// Fetch recipes from API
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching recipes...</h2>";
    

    
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        
    const response = await data.json();

    recipeContainer.innerHTML = ""; // Clear previous results

    if (!response.meals) {
        recipeContainer.innerHTML = `<p>No results found for "${query}"</p>`;
        return;
    }

    response.meals.forEach(meal => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> Dish</p>
            <p>Belongs to <span>${meal.strCategory}</span> Category</p>`;

        const button = document.createElement('button');
        button.textContent = "View Recipe";
        recipeDiv.appendChild(button);

        button.addEventListener('click', () => {
            openRecipePopup(meal);
        });

        recipeContainer.appendChild(recipeDiv);
    });
};

// Generate ingredients list
const fetchIngredients = (meal) => {
    let ingredientslist = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {
            ingredientslist += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientslist;
};

// Open recipe popup with details
const openRecipePopup = (meal) => {
    recipeDetailsContainer.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h4>Ingredients:</h4>
        <ul class="ingredientslists">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h4>Instructions:</h4>
            <p>${meal.strInstructions}</p>
            
            <br>
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;

    recipeDetails.style.display = "block";
};

// Close popup
recipeCloseButton.addEventListener('click', () => {
    recipeDetails.style.display = "none";
});

// Handle search button click
searchButton.addEventListener('click', (e) => {

    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
        recipeContainer.innerHTML=`<h2>Type the meal in the search box.</h2>`
        return;
    }
        fetchRecipes(searchInput);
    
});