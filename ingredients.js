const ingredientsContainer = document.querySelector('.ingredients')
const foodItemTemplate = document.getElementById('food-item-template')



async function getIngredients() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
    const data = await response.json()
    // console.log(data.meals)
    renderIngredients(data.meals)
}

getIngredients()

function renderIngredients(meals) {
    meals.forEach((element, index) => {
        
        if(index < 20) {
            const clone = foodItemTemplate.content.cloneNode(true)
            const cardImg = clone.querySelector('.card-food-img')
            const cardFoodName = clone.querySelector('.card-food-name')
            const cardFoodDesc = clone.querySelector('.card-food-description')

            cardImg.setAttribute('src', element.strThumb)
            cardFoodName.textContent = element.strIngredient
            cardFoodDesc.textContent = element.strDescription

            ingredientsContainer.appendChild(clone)
        }

    });
}