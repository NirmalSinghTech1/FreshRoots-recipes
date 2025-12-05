const ingredientsContainer = document.querySelector('.ingredients')
const foodItemTemplate = document.getElementById('food-item-template')
const ingredientMealsList = document.getElementById('ingredient-meals-list')

const popupWindow = document.getElementById('popup-window')
const closeBtn = document.querySelector('.close-icon')
const popupImage = document.getElementById('popup-image')
const popupWatchLink = document.querySelector('.popup-watch-link')
const foodName = document.getElementById('food-name')
const foodRecipe = document.getElementById('food-recipe')
const ingredientsList = document.querySelector('.ingredients-list')

async function getIngredients() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
    const data = await response.json()
    renderIngredientCards(data.meals)
}

getIngredients()

function renderIngredientCards(meals) {
    const p = document.createElement('p')
    p.classList.add('ingredient-message')
    p.innerText = 'Choose an ingredient to filter recipes containing it.'
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
            cardImg.src = element.strThumb
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

document.addEventListener('click', (e) => {
    e.target.dataset.ingredient && getMealByIngredient(e.target.dataset.ingredient)
})

async function getMealByIngredient(ingredient) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    const data = await response.json()

    renderMealsByIngredient(data.meals)
}

function renderMealsByIngredient(meals) {
    ingredientMealsList.innerHTML = ''

    meals.forEach( meal => {
        const li = document.createElement('li')
        li.innerText = meal.strMeal
        li.setAttribute('data-meal', meal.idMeal)

        ingredientMealsList.appendChild(li)
    })
}


// Display the detailed recipe for the selected meal
document.addEventListener('click', (e) => {
    e.target.dataset.meal && getMealById(e.target.dataset.meal)
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
    console.log(meal)
    let ingredientMeasure = []
    ingredientsList.innerHTML = ''

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