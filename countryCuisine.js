const countryMealTemplate = document.getElementById('country-meal-template')
const countryCuisine = document.querySelector('.country-cuisine')
const sidebarForm = document.getElementById('sidebar-form')
const sidebarOptionTemplate = document.getElementById('sidebar-option-template')
const countryCuisineContainer = document.querySelector('.country-cuisine-container')
const popupWindow = document.getElementById('popup-window')
const closeBtn = document.querySelector('.close-icon')
const popupImage = document.getElementById('popup-image')
const popupWatchLink = document.querySelector('.popup-watch-link')
const foodName = document.getElementById('food-name')
const foodRecipe = document.getElementById('food-recipe')
const ingredientsList = document.querySelector('.ingredients-list')
const countrySearchInput = document.getElementById('country-search-input')


// Fetch all country names from the API
async function getCountries() {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    const data = await response.json()
    
    // Render sidebar options (country names)
    renderSidebarOptions(data.meals)
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
    getSelectedOption()
}

// Get selected country
function getSelectedOption () {
    const allCheckboxes = document.querySelectorAll('input[type="radio"][name="country"]')
        allCheckboxes.forEach( checkbox => {
            if(checkbox.checked === true) getMealByArea(checkbox.value)

            // Fire event when selected option change
            checkbox.addEventListener('change', () => {
                const selectedCountry = Array.from(allCheckboxes)
                    .filter( item => item.checked === true)
                    .map(item => item.value)[0]
                // Fetch country details from the API of the selected country
                getMealByArea(selectedCountry)
            })
    })
}

// Fetch selected country details from the API
async function getMealByArea(country) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${country}`)
    const data = await response.json()

    // Display all means for the selected country
    renderMealCards(data.meals)
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

    matchQuery()
}

function matchQuery() {
    countrySearchInput.addEventListener('input', () => {
        const allMeals = document.querySelectorAll('.country-meal-name')
        const query = countrySearchInput.value.toLowerCase()

        if(allMeals && query) {
            Array.from(allMeals).forEach( item => {
                const countryFoodName = item.textContent.toLowerCase()
                const card = item.closest('.country-meal-card')

                card.style.display = countryFoodName.includes(query) ? '' : 'none'
            })
        }
    })
}

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