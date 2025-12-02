const countryMealTemplate = document.getElementById('country-meal-template')
const countryCuisine = document.querySelector('.country-cuisine')
const sidebarForm = document.getElementById('sidebar-form')
const sidebarOptionTemplate = document.getElementById('sidebar-option-template')
const countryCuisineContainer = document.querySelector('.country-cuisine-container')

async function getCountries() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
    const data = await response.json()
    
    renderCountryNames(data.meals)
    console.log('1')
}

getCountries()

function renderCountryNames(countries) {
    console.log('2')
    countries.forEach( (country, index) => {
        const sidebarClone = sidebarOptionTemplate.content.cloneNode(true)

        const inputEl = sidebarClone.querySelector('input[type="radio"]')
        const labelEl = sidebarClone.querySelector('label')
        
        inputEl.value = country.strArea
        inputEl.id = country.strArea.toLowerCase()

        if(index === 0){
            inputEl.setAttribute('checked', true)
        }

        labelEl.setAttribute('for', country.strArea.toLowerCase())
        labelEl.innerText = country.strArea

        sidebarForm.appendChild(sidebarClone)
    })


    sidebarForm.style.overflowY = 'auto'
    const allCheckboxes = document.querySelectorAll('input[type="radio"][name="country"]')
        allCheckboxes.forEach( checkbox => {
            if(checkbox.checked === true) getMealByArea(checkbox.value)
                console.log('3')
            checkbox.addEventListener('change', () => {
                const selectedCountry = Array.from(allCheckboxes)
                    .filter( item => item.checked === true)
                    .map(item => item.value)[0]
                getMealByArea(selectedCountry)
            })
    })
}


async function getMealByArea(country) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${country}`)
    const data = await response.json()
    renderAreaMeal(data.meals)
}

function renderAreaMeal(areaMeals) {
    countryCuisine.innerHTML = ''
    areaMeals.forEach( (meal, index) => {
        const templateClone = countryMealTemplate.content.cloneNode(true)
        
        const mealImg = templateClone.querySelector('.meal-card-img')
        const mealName = templateClone.querySelector('.country-meal-name')
        
        mealImg.setAttribute('src', meal.strMealThumb)
        mealName.innerText = meal.strMeal
        countryCuisine.appendChild(templateClone)
    })
}


