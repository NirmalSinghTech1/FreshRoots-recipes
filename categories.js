// DOM VARIABLES
const countryMealTemplate = document.getElementById('country-meal-template')
const countryCuisine = document.querySelector('.country-cuisine')
const sidebar = document.querySelector('.sidebar')
const sidebarForm = document.getElementById('sidebar-form')
const sidebarOptionTemplate = document.getElementById('sidebar-option-template')
const countryCuisineContainer = document.querySelector('.country-cuisine-container')
const searchForm = document.getElementById('categories-search-field')
const categoriesSearchInput = document.getElementById('categories-search-input')
// Popup window variables
const popupWindow = document.getElementById('popup-window')
const popupWindowBackdrop = document.querySelector('.popup-backdrop')
const closeBtn = document.querySelector('.close-icon')
const popupImage = document.getElementById('popup-image')
const popupWatchLink = document.querySelector('.popup-watch-link')
const foodName = document.getElementById('food-name')
const foodRecipe = document.getElementById('food-recipe')
const ingredientsList = document.querySelector('.popup-ingredients-list')
const hamburger = document.getElementById('hamburger')
const navbarContainer = document.getElementById('nav-bar-container')
const collapseBtn = document.getElementById('collapse-btn')

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

// Handle search query
categoriesSearchInput.addEventListener('input', () => {
    const query = categoriesSearchInput.value.toLowerCase()
    filterDisplayedMeals(query)
})

// Filter displayed meals based on query
function filterDisplayedMeals(query) {
    const allMealNames = document.querySelectorAll('.country-meal-card .country-meal-name')
    if(!allMealNames) return
    
    if(query){
        Array.from(allMealNames).forEach( item => {
            const meals = item.textContent.toLowerCase()
            const card = item.closest('.country-meal-card')
            // Toggle visibility based on match
            card.style.display = meals.includes(query) ? '' : 'none'
        })
    }
}

// Fetch all categories from the API
async function getCountries() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories.php`)
        const data = await response.json()
    
        // Render sidebar options (country names)
        renderSidebarOptions(data.categories)
    } catch(error) {    
        console.error('Error found: ', error)
    }
}

getCountries()

// Handle sidebar options UI
function renderSidebarOptions(categories) {
    categories.forEach( (category, index) => {
        
        // Clone sidebar template to create new input and label
        const sidebarClone = sidebarOptionTemplate.content.cloneNode(true)

        const inputEl = sidebarClone.querySelector('input[type="radio"]')
        const labelEl = sidebarClone.querySelector('label')
        
        inputEl.value = category.strCategory
        inputEl.id = category.strCategory.toLowerCase()

        // Set the first country as default
        if(index === 0){
            inputEl.checked = 'true'
        }

        labelEl.setAttribute('for', category.strCategory.toLowerCase())
        labelEl.innerText = category.strCategory

        sidebarForm.appendChild(sidebarClone)
    })
    // Get the currently selected category from the sidebar filter
    const selectedOption = document.querySelector('input[name="category"]:checked').value
    getMealByCategory(selectedOption)
}

// Get selected category
sidebarForm.addEventListener('change', (e) => {
    if(e.target.matches('input[type="radio"]')) {
        const selectedCategory = e.target.value

        getMealByCategory(selectedCategory)
    }
})

// Fetch selected category details from the API
async function getMealByCategory(category) {
    try {
        const response = await fetch(`${API_BASE_URL}/filter.php?c=${category}`)
        const data = await response.json()
    
        // Display all meals for the selected category
        renderMealCards(data.meals)
    } catch(error) {
        console.error('Error found', error)
    }
}

// Render selected Category meals on the page 
function renderMealCards(categoryMeals) {
    countryCuisine.innerHTML = ''
    categoryMeals.forEach( (meal, index) => {
        const templateClone = countryMealTemplate.content.cloneNode(true)
        const mealImg = templateClone.querySelector('.meal-card-img')
        const mealName = templateClone.querySelector('.country-meal-name')
        const countryMealCard = templateClone.querySelector('.country-meal-card')
        
        if(index < 4) {
            mealImg.setAttribute('loading', 'eager')
        } else {
            mealImg.setAttribute('loading', 'lazy')
        }
        
        // Set image and meal name 
        countryMealCard.setAttribute('data-card', meal.idMeal)
        mealImg.setAttribute('data-card', meal.idMeal)
        mealName.setAttribute('data-card', meal.idMeal)
        mealImg.setAttribute('src', `${meal.strMealThumb}/small`)
        mealName.innerText = meal.strMeal

        countryCuisine.appendChild(templateClone)
    })
    
}

// Hamburger 
hamburger.addEventListener('click', () => {
   navbarContainer.classList.toggle('show')
})

collapseBtn.addEventListener('click', () => {
    sidebar.classList.toggle('show-sidebar')
    collapseBtn.classList.toggle('rotate-svg')
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
        console.error('Error found: ', error)
    }
}

// Show meal recipe on the page
function showMealRecipe(meal) {
    const {strMealThumb, strMeal, strInstructions, strYoutube} = meal
    
    popupWindowBackdrop.style.display = 'block'
    popupWindowBackdrop.setAttribute('data-hidden', 'false')
    popupImage.src = ''
    popupWatchLink.href = ''
    foodName.innerText = ''
    foodRecipe.innerText = ''
    
    popupImage.src = `${strMealThumb}/medium`
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
