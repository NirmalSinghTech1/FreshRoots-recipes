// DOM Variables
const heroFoodName = document.querySelector('.hero-food-name')
const foodRecipeInstruction = document.querySelector('.food-recipe-instruction')
const heroIngredientsList = document.querySelector('.hero-ingredients-list')
const heroFoodImage = document.querySelector('.hero-food-image')
const watchLink = document.querySelector('.watch-link')
const searchField = document.getElementById('home-search-field')
const searchInput = document.getElementById('search-input')
const mealCardTemplate = document.getElementById('meal-card-template')
// Popup window variables
const popupWindowBackdrop = document.querySelector('.popup-backdrop')
const popupWindow = document.getElementById('popup-window')
const closeBtn = document.querySelector('.close-icon')
const popupImage = document.getElementById('popup-image')
const popupWatchLink = document.querySelector('.popup-watch-link')
const foodRecipe = document.getElementById('food-recipe')
const foodName = document.getElementById('food-name')
// Search results variables
const searchResults = document.getElementById('search-results')
const filteredMealsContainer = document.querySelector('.filtered-meals-container')
const heroFilteredMeals = document.querySelector('.hero-filtered-meals')
const recipesCount = document.querySelector('.results-recipes-count')
const searchFor = document.querySelector('.search-for')

const ingredientsList = document.querySelector('.popup-ingredients-list')
const noRecipeFoundMsg = document.querySelector('.no-recipe-found-message')
const closeMessage = document.querySelector('.no-recipe-found-message .close-message')
const hamburger = document.getElementById('hamburger')
const navbarContainer = document.getElementById('nav-bar-container')

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

// Fetch random meal from API on page load
async function getRandomMeal() {
    try {
        let response = await fetch(`${API_BASE_URL}/random.php`)
        let data = await response.json()
        
        renderRandomMeal(data.meals[0])   
    } catch(error) {
        console.error('Error fetching data: ', error)
    }
}
getRandomMeal()

// Display fetched random meal on home page
function renderRandomMeal(randomMeal) {
    heroFoodName.innerText = randomMeal.strMeal
    foodRecipeInstruction.innerText = randomMeal.strInstructions
    heroFoodImage.setAttribute('src', `${randomMeal.strMealThumb}/medium`)
    heroFoodImage.setAttribute('alt', `${randomMeal.strMeal} Image`)
    watchLink.setAttribute('href', `${randomMeal.strYoutube}`)

    // Get ingredients list and render it on the page
    heroIngredientsList.appendChild(createIngredientListItems(randomMeal))
}

// Create Ingredients list items
function createIngredientListItems(meal) {
    const fragment = document.createDocumentFragment()

    for(let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`]
        const measure = meal[`strMeasure${i}`]
    
        if(ingredient && ingredient.trim()) {
            const li = document.createElement('li')

            li.textContent = `${ingredient} ${measure ? `(${measure})` : ''}`
            fragment.appendChild(li)
        }
    }
    return fragment
}

// Handle search field query
searchField.addEventListener('submit', (e) => {
    e.preventDefault()
    if(searchInput.value){
        const query = searchInput.value
        searchFor.innerText = query
        getMatchingMeals(query)
    }

    searchField.reset()
})

let timer;
// Fetch meals from the API as per the search query
async function getMatchingMeals(meal) {
    const response = await fetch(`${API_BASE_URL}/search.php?s=${meal}`)
    const data = await response.json()
    
    // Check if there are any meals match the search query
    if(data.meals !== null) {
        renderMatchedMeals(data.meals)
        heroFilteredMeals.style.display = 'block'
        recipesCount.innerText = `${data.meals.length} recipes found for `
        
        if(heroFilteredMeals.style.display === 'block'){
            searchResults.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    } else {
        // If not, then display message and hide search results section
        heroFilteredMeals.style.display = 'none'
        noRecipeFoundMsg.style.transform = 'translateX(0%)'
        
        timer = setTimeout(() => {
            noRecipeFoundMsg.style.transform = 'translateX(110%)'
        }, 4000)
    }
}

// Display meals in the search results if they match the query
function renderMatchedMeals(meals) {
    filteredMealsContainer.innerHTML = ''

    meals.forEach( meal => {
        const {idMeal, strMeal, strMealThumb} = meal
        const templateClone = mealCardTemplate.content.cloneNode(true)
        const mealCard = templateClone.querySelector('.meal-card')
        const mealImg = templateClone.querySelector('.meal-card-img')
        const mealName = templateClone.querySelector('.meal-card-name')

        mealCard.setAttribute('data-card', idMeal)
        mealImg.setAttribute('data-card', idMeal)
        mealName.setAttribute('data-card', idMeal)

        mealImg.src = `${strMealThumb}/medium`
        mealImg.alt = `${strMeal} Image`
        mealName.innerText = strMeal

        filteredMealsContainer.appendChild(templateClone)
    })
}

// Close no result found message
closeMessage.addEventListener('click', () => {
    noRecipeFoundMsg.style.transform = 'translateX(110%)'
    clearTimeout(timer)
})

// Hamburger 
hamburger.addEventListener('click', () => {
   navbarContainer.classList.toggle('show')
})


// POPUP WINDOW FUNCTIONALITY
// Get the ID of the clicked meal item
document.addEventListener('click', (e) => {
    e.target.dataset.card && getMealById(e.target.dataset.card)
})

// Close popup window 
closeBtn.addEventListener('click', () => {
    popupWindowBackdrop.style.display = 'none'
})

// Fetch particular meal by ID from the API
async function getMealById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`)
        const data = await response.json()

        showMealRecipe(data.meals[0])
    } catch(error) {
        console.error("Error found: ", error)
    }
}

// Show meal detailed recipe on the popup window
function showMealRecipe(meal) {
    const {strMealThumb, strMeal, strInstructions, strYoutube} = meal
    
    popupWindowBackdrop.style.display = 'block'
    popupWindowBackdrop.setAttribute('data-hidden', 'false')
    popupImage.src = ''
    popupWatchLink.href = ''
    foodName.innerText = ''
    foodRecipe.innerText = ''
    
    popupImage.src = `${strMealThumb}/medium`
    popupImage.alt = `${strMeal} image`
    popupWatchLink.setAttribute('href', strYoutube)
    foodName.innerText = strMeal
    foodRecipe.innerText = strInstructions

    ingredientsList.innerHTML = ''
    ingredientsList.appendChild(createIngredientListItems(meal))
}

// Prevent clicks on the page when the popup window is displayed
popupWindowBackdrop.addEventListener('click', (e) => {
    if(!e.target.closest('#popup-window')){
        popupWindowBackdrop.style.display = 'none'
    }
})