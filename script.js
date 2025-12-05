// DOM Variables
const foodName = document.querySelector('.food-name')
const foodRecipeInstruction = document.querySelector('.food-recipe-instruction')
const ingredientsList = document.querySelector('.ingredients-list')
const heroFoodImage = document.querySelector('.hero-food-image')
const watchLink = document.querySelector('.watch-link')
const searchField = document.getElementById('home-search-field')
const searchInput = document.getElementById('search-input')
const filteredMealsContainer = document.querySelector('.filtered-meals-container')
const mealCardTemplate = document.getElementById('meal-card-template')


// Get random meal
async function getRandomMeal() {
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    let data = await response.json()
    
    renderRandomMeal(data.meals[0])   
}
getRandomMeal()

// Handle home page random meal UI
function renderRandomMeal(randomMeal) {
    // Meal name and Instructions
    foodName.innerText = randomMeal.strMeal
    foodRecipeInstruction.innerText = randomMeal.strInstructions
    // Ingredients
    renderIngredients(randomMeal)

    heroFoodImage.setAttribute('src', `${randomMeal.strMealThumb}/medium`)
    heroFoodImage.setAttribute('alt', `${randomMeal.strMeal} Image`)
    watchLink.setAttribute('href', `${randomMeal.strYoutube}`)
}

// Handle ingredients and ingredients quantity UI
function renderIngredients(meal) {
    let ingredientMeasure = []

    // render ingredients
    for(const [key, value] of Object.entries(meal)){
        if(key.startsWith('strIngredient') && value){
            const li = document.createElement('li')
            li.classList.add('ingredient')

            li.innerText = value
            ingredientsList.appendChild(li)
        }

        if(key.startsWith('strMeasure') && value !== " "){
            ingredientMeasure.push(value)
        }
    }

    // render ingredients' measures
    document.querySelectorAll('.ingredient').forEach(( item, index ) => {
        if(index <= ingredientMeasure.length){
            item.innerText += ` (${ingredientMeasure[index]})`
        }
    })
}

// Search field
searchField.addEventListener('submit', (e) => {
    e.preventDefault()
    const query = searchInput.value
    getMatchingMeals(query)

    searchField.reset()
})

async function getMatchingMeals(meal) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`)
    const data = await response.json()
    
    renderMatchedMeals(data.meals)
}

function renderMatchedMeals(meals) {
    filteredMealsContainer.innerHTML = ''


    meals.forEach( meal => {
        const {idMeal, strMeal, strCategory, strMealThumb} = meal
        const templateClone = mealCardTemplate.content.cloneNode(true)
        
        const mealCard = templateClone.querySelector('.meal-card')
        const mealImg = templateClone.querySelector('.meal-card-img')
        const mealName = templateClone.querySelector('.meal-card-name')

        mealImg.src = `${strMealThumb}/medium`
        mealName.innerText = strMeal

        filteredMealsContainer.appendChild(templateClone)
    })
}

// Popup Window functionality


// Display the detailed recipe for the selected meal
document.addEventListener('click', (e) => {
    e.target.dataset.card && getMealById(e.target.dataset.card)
})

// Close popup window 
closeBtn.addEventListener('click', () => {
    popupWindow.style.display = 'none'
    document.body.style.pointerEvents  = 'auto'
})

// Fetch particular meal by ID from the API
async function getMealById(id) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    const data = await response.json()
    showMealRecipe(data.meals[0])
}

// Show meal recipe on the page
function showMealRecipe(meal) {
    const {strMealThumb, strMeal, strInstructions, strYoutube} = meal
    console.log("meal", meal)
    
    popupWindow.style.display = 'block'
    popupImage.src = ''
    popupWatchLink.href = ''
    foodName.innerText = ''
    foodRecipe.innerText = ''
    
    popupImage.src = `${strMealThumb}/medium`
    popupWatchLink.setAttribute('href', strYoutube)
    foodName.innerText = strMeal
    foodRecipe.innerText = strInstructions
    renderIngredients(meal)

    // Prevent clicks on the page when the popup windows is displayed
    document.addEventListener('click', (e) => {
        if(popupWindow.style.display !== 'none' && !e.target.closest('#popup-window')){
            document.body.style.pointerEvents  = 'none'
            popupWindow.style.pointerEvents = 'auto'
        }
    })
}

// Handle ingredients and ingredients quantity UI
function renderIngredients(meal) {
    let ingredientMeasure = []
    ingredientsList.innerHTML = ''
    console.log(meal)
    // render ingredients
    for(const [key, value] of Object.entries(meal)){
        if(key.startsWith('strIngredient') && value){
            const li = document.createElement('li')
            li.classList.add('ingredient')

            li.innerText = value
            ingredientsList.appendChild(li)
        }

        if(key.startsWith('strMeasure') && value !== " "){
            ingredientMeasure.push(value)
        }
    }

    // render ingredients' measures
    document.querySelectorAll('.ingredient').forEach(( item, index ) => {
        if(index <= ingredientMeasure.length){
            item.innerText += ` (${ingredientMeasure[index]})`
        }
    })
}