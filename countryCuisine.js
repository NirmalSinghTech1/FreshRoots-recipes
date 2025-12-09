// DOM Variables
const countryMealTemplate = document.getElementById('country-meal-template')
const countryCuisine = document.querySelector('.country-cuisine')
const sidebarForm = document.getElementById('sidebar-form')
const sidebarOptionTemplate = document.getElementById('sidebar-option-template')
const countryCuisineContainer = document.querySelector('.country-cuisine-container')
const countrySearchInput = document.getElementById('search-input')
const hamburger = document.getElementById('hamburger')
const navbarContainer = document.getElementById('nav-bar-container')
const sidebarEl = document.querySelector('.sidebar')
const collapseBtn = document.getElementById('collapse-btn')
// Popup window variables
const popupWindowBackdrop = document.querySelector('.popup-backdrop')
const popupWindow = document.getElementById('popup-window')
const closeBtn = document.querySelector('.close-icon')
const popupImage = document.getElementById('popup-image')
const popupWatchLink = document.querySelector('.popup-watch-link')
const foodName = document.getElementById('food-name')
const foodRecipe = document.getElementById('food-recipe')
const ingredientsList = document.querySelector('.popup-ingredients-list')

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

// Handle search query
countrySearchInput.addEventListener('input', () => {
    const query = countrySearchInput.value.toLowerCase()
    filterDisplayedCuisine(query)
})

// Filter displayed cuisine based on query
function filterDisplayedCuisine(query) {
    const allMeals = document.querySelectorAll('.country-meal-name')

    if(!allMeals) return
    
    if(query) {
        Array.from(allMeals).forEach( item => {
            const countryFoodName = item.textContent.toLowerCase()
            const card = item.closest('.country-meal-card')
            // Toggle visibility based on match
            card.style.display = countryFoodName.includes(query) ? '' : 'none'
        })
    }
}

// Fetch all country names from the API
async function getCountries() {
    try {
        const response = await fetch(`${API_BASE_URL}/list.php?a=list`)
        const data = await response.json()
        
        // Render sidebar options (country names)
        renderSidebarOptions(data.meals)
    } catch(error) {
        console.error('Error found: ', error)
    }
}

getCountries()

// Handle sidebar options UI
function renderSidebarOptions(countries) {
    countries.forEach( (country, index) => {
        // Clone sidebar template to create new input and label
        const sidebarClone = sidebarOptionTemplate.content.cloneNode(true)

        const inputEl = sidebarClone.querySelector('input[type="radio"]')
        const labelEl = sidebarClone.querySelector('label')
        
        inputEl.value = country.strArea
        inputEl.id = country.strArea.toLowerCase()

        // Set the first country as default
        if(index === 0){
            inputEl.checked = 'true'
        }

        labelEl.setAttribute('for', inputEl.id)
        labelEl.innerText = country.strArea

        sidebarForm.appendChild(sidebarClone)
    })
    // Get the currently selected country from the sidebar filter
    const selectedCountry = document.querySelector('input[name="country"]:checked').value
    getMealByArea(selectedCountry)
}

// Get selected country
sidebarForm.addEventListener('change', (e) => {
    if(e.target.matches('input[name="country"]')){
        const selectedCountry = e.target.value
        
        getMealByArea(selectedCountry)
    }
})

// Fetch selected country details from the API
async function getMealByArea(country) {
    try {
        const response = await fetch(`${API_BASE_URL}/filter.php?a=${country}`)
        const data = await response.json()

        // Display all meals for the selected country
        renderMealCards(data.meals)
    } catch(error) {
        console.error('Error found: ', error)
    }
}

// Render selected Country meals on the page 
function renderMealCards(areaMeals) {
    countryCuisine.innerHTML = ''
    areaMeals.forEach( (meal, index) => {
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
    sidebarEl.classList.toggle('show-aside-container')
    collapseBtn.classList.toggle('rotate-svg')
})

// POPUP WINDOW FUNCTIONALITY
// Get the ID of the clicked cuisine item
document.addEventListener('click', (e) => {
    e.target.dataset.card && getMealById(e.target.dataset.card)
})

// Close popup window 
closeBtn.addEventListener('click', () => {
    popupWindowBackdrop.style.display = 'none'
})

// Fetch particular cuisine by ID from the API
async function getMealById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`)
        const data = await response.json()

        // Display cuisine recipe on the popup window
        showMealRecipe(data.meals[0])
    } catch(error) {
        console.error('Error found: ', error)
    }
}

// Show meal recipe on the popup window
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
