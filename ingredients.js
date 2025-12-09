// DOM varialbes
const ingredientsContainer = document.querySelector('.ingredients')
const foodItemTemplate = document.getElementById('food-item-template')
const ingredientMealsList = document.getElementById('ingredient-meals-list')
const ingredientsSearchField = document.querySelector('.ingredient-search-field')
const searchInput = document.querySelector('.search-input')
const ingredientAsideContainer = document.getElementById('ingredient-aside-container')
const asideMeals = document.querySelector('.aside-container-header p')
// Popup window variabled
const popupWindowBackdrop = document.querySelector('.popup-backdrop')
const popupWindow = document.getElementById('popup-window')
const closeBtn = document.querySelector('.close-icon')
const popupImage = document.getElementById('popup-image')
const popupWatchLink = document.querySelector('.popup-watch-link')
const foodName = document.getElementById('food-name')
const foodRecipe = document.getElementById('food-recipe')
const ingredientsList = document.querySelector('.popup-ingredients-list')
const hamburger = document.getElementById('hamburger')
const navbarContainer = document.getElementById('nav-bar-container')
const sidebarEl = document.querySelector('.aside-container')
const collapseBtn = document.getElementById('collapse-btn')

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

// Fetch ingredients list from the API
async function getIngredients() {
    try {
        const response = await fetch(`${API_BASE_URL}/list.php?i=list`)
        const data = await response.json()

        // Display ingredients on the page
        renderIngredientCards(data.meals)
    } catch(error) {
        console.error('Error found: ',error)
    }
}

getIngredients()

// Display ingredients on the page
function renderIngredientCards(meals) {
    // Show message in the aside container on first render
    const p = document.createElement('p')
    p.classList.add('ingredient-message')
    p.textContent = 'Choose an ingredient to filter recipes containing it.'
    ingredientMealsList.appendChild(p)

    meals.forEach((element, index) => {
        if(index < 24) {
            const clone = foodItemTemplate.content.cloneNode(true)
            const cardImg = clone.querySelector('.card-food-img')
            const cardFoodName = clone.querySelector('.card-food-name')
            const cardFoodDesc = clone.querySelector('.card-food-description')
            const foodItemCard = clone.querySelector('.food-item-card')
            const likeBtn = clone.getElementById('like-btn')

            foodItemCard.setAttribute('data-ingredient', element.strIngredient)
            cardImg.src = `${element.strThumb.slice(0, -4)}-small.png`
            cardFoodName.textContent = element.strIngredient
            cardFoodName.setAttribute('data-ingredient', element.strIngredient)
            cardFoodDesc.textContent = element.strDescription

            ingredientsContainer.appendChild(clone)
            likeBtn.addEventListener('click', () => {
                likeBtn.classList.toggle('liked')
            })
        }
    });
}

// Handle search query 
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase()
    filterDisplayedIngredients(query)
})

// Filter displayed ingredients based on query
function filterDisplayedIngredients(query) {
    const allIngredients = document.querySelectorAll('.card-food-name')
    
    if(!allIngredients) return
    if(query) {
        Array.from(allIngredients).forEach( item => {
            const ingredientName = item.textContent.toLowerCase()
            const card = item.closest('.food-item-card')
            // toggle visibility based on match
            card.style.display = ingredientName.includes(query) ? '' : 'none'
        })
    }
}

// Get selected ingredient id
document.addEventListener('click', (e) => {
    e.target.dataset.ingredient && getMealByIngredient(e.target.dataset.ingredient)
})

// Fetch meals from the API using chosen ingredient
async function getMealByIngredient(ingredient) {
    try {
        const response = await fetch(`${API_BASE_URL}/filter.php?i=${ingredient}`)
        const data = await response.json()
    
        // Create meals list based on ingredient selected
        createMealsList(data.meals)
        sidebarEl.classList.add('show-aside-container')

        if(sidebarEl.classList.contains('show-aside-container')) {
            ingredientAsideContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
        
    } catch(error) {
        console.error('Error found: ', error)
    }
}

// Create meals list items and 
function createMealsList(meals) {
    const fragment = document.createDocumentFragment()
    ingredientMealsList.innerHTML = ''

    meals.forEach( meal => {
        const li = document.createElement('li')
        li.textContent = meal.strMeal
        li.setAttribute('data-meal', meal.idMeal)

        fragment.appendChild(li)
    })
    ingredientMealsList.appendChild(fragment)
    asideMeals.style.opacity = '1'
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
// Get the ID of the clicked meal item
document.addEventListener('click', (e) => {
    e.target.dataset.meal && getMealById(e.target.dataset.meal)
})

// Close popup window 
closeBtn.addEventListener('click', () => {
    popupWindowBackdrop.style.display = 'none'
    // document.body.style.pointerEvents  = 'auto'
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

    // renderIngredients(meal)
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
