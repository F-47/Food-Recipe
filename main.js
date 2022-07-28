let form = document.querySelector("form")
let allMeals = document.querySelector(".the-recipet")



function getMealList() {
    let inputValue = document.querySelector(".search").value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${inputValue}`)
        .then(response => response.json())
        .then(data => {
            let html = ""
            if (data.meals && inputValue) {
                data.meals.forEach(meal => {
                    html += `
            <div class="meal col-lg-3 col-md-6 mb-4 d-flex justify-content-center align-items-center" >
                <div class="card" data-id=${meal.idMeal} style="width: 18rem">
                    <img src=${meal.strMealThumb} alt="" />
                    <div class="card-body d-flex justify-content-center align-items-center flex-column" >
                        <h5 class="card-title text-center" style="min-height:48px;">${meal.strMeal}</h5>
                        <button type="button" class="btn btn-primary get-reciepts-btn" data-bs-toggle="modal" data-bs-target="#modal${meal.idMeal}">
                            Get Reciepts
                        </button>
                        <!-- Modal -->
                        <div class="modal fade" id="modal${meal.idMeal}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-xl">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title fw-bold fs-2 text-warning" id="exampleModalLabel">${meal.strMeal}</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
                });
                allMeals.innerHTML = html;
            } else {
                html = `<div class="fs-1 text-warning text-center fw-bold" >Sorry, we didn't find any meals!</div>`
                allMeals.innerHTML = html;
            }
        })
}

//get Meal Recipe
allMeals.addEventListener("click",getMealRecipe)
function getMealRecipe(e) {
    if (e.target.classList.contains("get-reciepts-btn")) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.getAttribute("data-id")}`)
            .then(response => response.json())
            .then(data => {
                data=data.meals[0]
                console.log(data)
                // Start Ingredient Word in the modal
                let ingredientElement = document.createElement("div")
                let ingredientText = document.createTextNode("Ingredients:")
                ingredientElement.classList.add("fs-3", "fw-bold","text-black","text-center", "mt-1","mb-2")
                ingredientElement.appendChild(ingredientText)
                // End Ingredient Word in the modal

                // Start adding Ingredients to modal
                let ingredientList0 = []
                let measureList0 = []
                for(let i=1;i<21;i++){
                    let x = `strIngredient${i}`
                    let y = `strMeasure${i}`
                    ingredientList0.push(data[x])
                    measureList0.push(data[y])
                }
                let ingredientList1 = ingredientList0.filter(n => n)
                let measureList1 = measureList0.filter(m => m)
                let OL = document.createElement("ol")
                for(let i=1;i<ingredientList1.length;i++){
                    let LI = document.createElement("li")
                    OL.appendChild(LI)
                    let ingredient = document.createTextNode(`${ingredientList1[i]}(${measureList1[i]})`)
                    LI.appendChild(ingredient)
                }
                OL.classList.add("fs-4", "mt-1","mb-2")
                
                // End adding Ingredients to modal 

                let id = e.target.getAttribute("data-bs-target")  
                let modalBody = document.querySelector(`${id} .modal-body`)
                let html = `
                    <div class="fs-3 fw-bold text-black text-center mb-2">Instructions:</div>
                    <div class="instructions fs-4 ">
                        ${data.strInstructions.replaceAll("\r\n", "<br>")} 
                    </div>    
                    <div class="recipe-meal-img d-flex justify-content-center align-items-center mt-4 mb-3">
                        <img src="${data.strMealThumb}" width=100px class="rounded-circle">  
                    </div>
                    <div class="linkVideo fw-bold d-flex justify-content-center align-items-center fs-3 mt-3 mb-3">
                        <a href="${data.strYoutube}" target="_blank">Watch Video</a>
                    </div>  
                    `
                modalBody.innerHTML = html
                modalBody.prepend(OL)
                modalBody.prepend(ingredientElement)
            })  
    }
}

function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);
