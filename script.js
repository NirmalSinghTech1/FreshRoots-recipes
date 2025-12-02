// DOM Variables
const foodName = document.querySelector('.food-name')
const foodRecipeInstruction = document.querySelector('.food-recipe-instruction')
const ingredientsList = document.querySelector('.ingredients-list')
const heroFoodImage = document.querySelector('.hero-food-image')
const watchLink = document.querySelector('.watch-link')


// Get random meal
async function getRandomMeal() {
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    let data = await response.json()
    
    renderRandomMeal(data.meals[0])   
}
getRandomMeal()

// Handle home page random meal UI
function renderRandomMeal(randomMeal) {
    console.log(randomMeal)
    // Meal name and Instructions
    foodName.innerText = randomMeal.strMeal
    foodRecipeInstruction.innerText = randomMeal.strInstructions
    // Ingredients
    renderIngredients(randomMeal)

    heroFoodImage.setAttribute('src', `${randomMeal.strMealThumb}`)
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
