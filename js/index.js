//! HTML Elements
const searchNameInput = document.getElementById("searchNameInput");
const searchLatterInput = document.getElementById("searchLatterInput");
const defaultContainer = document.querySelector(".meals-display-container");
const infoMealsContainer = document.querySelector(".info-meals-container");
const searchSection = document.querySelector(".search-section");
const infoMeals = document.querySelector(".information-meals");
const asideSections = Array.from(document.querySelectorAll("aside ul li"));
const categorySection = document.querySelector(".category-section");
const categoryContainer = document.querySelector(".category-container");
const catItems = document.querySelector(".catItems");
const contactSection = document.querySelector(".contact-section");
const areaItems = document.querySelector(".area-items");
const areaContainer = document.querySelector(".area-container");
const ingContainer = document.querySelector(".ing-container");
const ingItems = document.querySelector(".ing-items");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userPassword = document.getElementById("userPassword");
const userConfirmPassword = document.getElementById("UserConfirmPassword");
const userPhone = document.getElementById("userPhone");
const userAge = document.getElementById("userAge");
const passwordAlert = document.getElementById("passwordAlert");
const emptyAlert = document.getElementById("emptyAlert");
const trickyContainer = document.querySelector(".trickyContainer");
const allInputs = document.querySelectorAll("form input");

//* Global Variables
let emptyMealName = "";
let mealsArr = [];
let q = "s";
let nameOfCatMeal = "";
let nameOfArea = "";
let nameOfIng = "";
let apiTricks;
let nameOfTricky = "";
let ric = "";
let ingredients = [];

// Regex Validation
const nameRegex = /^[A-Z]{1}[a-z]{3,}$/;
const emailRegex = /^[a-zA-Z-0-9]{5,}@[a-z]{4,8}\.[a-z]{2,5}$/;
const passwordRegex = /^[0-9]{6}$/;
const phoneRegex = /^01(0|1|2|5)[0-9]{8}$/;
const ageRegex = /^(1[89]|[2-9]\d)$/;
// Regex Validation

// Regex Check
for (let i = 0; i < allInputs.length; i++) {
    allInputs[i].addEventListener("blur", function () {
        if (checkAllEmptyInput() == false) {
            emptyAlert.classList.remove("d-none");
        } else {
            emptyAlert.classList.add("d-none");
            if (
                inputsValidation(nameRegex, userName) &&
                inputsValidation(emailRegex, userEmail) &&
                inputsValidation(passwordRegex, userPassword) &&
                inputsValidation(phoneRegex, userPhone) &&
                inputsValidation(ageRegex, userAge)
            ) {
                $(".form-btn").removeAttr("disabled");
            } else if (checkingPasswordEquals() != true) {
                passwordAlert.classList.remove("d-none");
            } else {
                passwordAlert.classList.add("d-none");
            }
        }
    });
}
// Regex Check

//? functions

//!Search Functions
let addAndDeleteActiveLink = () => {
    //TODO active link
    const asideLinks = $("aside ul li");
    $(".header-btn").on("click", () => {
        $(".hidden-btn").removeClass("active");
        $(".search-link").addClass("active");
    });
    for (let i = 0; i < asideLinks.length; i++) {
        asideLinks.eq(i).on("click", () => {
            const activeLink = document.querySelector(".active");
            activeLink.classList.remove("active");
            asideLinks.eq(i).addClass("active");
        });
    }
};
addAndDeleteActiveLink();
async function getApiData(emptyMealName, q) {
    let res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?${q}=${emptyMealName}`
    );
    let finalRes = await res.json();
    mealsArr = await finalRes.meals;
    let ourMeals = mealsArr.slice(0, 20);
    displayMeals(ourMeals);
}
getApiData(emptyMealName, q);
function displayMeals(arr) {
    let htmlStorage = "";
    for (let i = 0; i < arr.length; i++) {
        htmlStorage += `
        <div class=" col-md-6 special-cap inner-parent col-lg-4 col-xl-3 ">
        <div
            class="inner special-inner tr-700 overflow-hidden rounded-4 h-100 position-relative "
        >
            <img
                src="${arr[i].strMealThumb}"
                alt="ready to eat"
                class="w-100 special-cap" 
            />

            <div
                class="caption special-cap  fw-bold ps-3 position-absolute d-flex justify-content-start align-items-center"
            >
                <h2 class="mb-0 special-cap">${arr[i].strMeal}</h2>
            </div>
        </div>
    </div>
        `;
    }
    defaultContainer.innerHTML = htmlStorage;
    const allMealsParent = Array.from(
        document.querySelectorAll(".inner-parent")
    );

    displayMealsInfo(allMealsParent, arr);
}
function getRecipes(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (
            arr[i][`strIngredient${i}`] != "" &&
            arr[i][`strIngredient${i}`] != undefined &&
            arr[i][`strIngredient${i}`] != " "
        ) {
            ingredients.push(
                `${arr[i][`strMeasure${i}`]} of ${arr[i][`strIngredient${i}`]}`
            );
            ric = `
<span>${ingredients
                .map(
                    (ing) => `<span class=" btn  btn-warning m-2">${ing}</span>`
                )
                .join("")}</span>
`;
        }
    }
}
function displayMealsInfo(allMealsParent, arr) {
    getRecipes(arr);
    for (let i = 0; i < arr.length; i++) {
        allMealsParent[i].addEventListener("click", function () {
            showMealsInfo();
            showSearchSection();
            infoMealsContainer.innerHTML = `
            <div class="col-lg-6 col-xl-4">
                <div class="inner-info">
                    <img
                        src="${arr[i].strMealThumb}"
                        class="w-100"
                        alt="ready to eat"
                    />
                    <h2>${arr[i].strMeal}</h2>
                </div>
            </div>
            <div class="col-lg-6 col-xl-8">
                <div class="inner-info-caption">
                    <h3>Instructions</h3>
                    <p>${arr[i].strInstructions}</p>
                    <h3>
                        <span>Area :</span> <span class="fs-5 fw-normal">${
                            arr[i].strArea
                        }</span>
                    </h3>
                    <h3>
                        <span>Category :</span> <span class="fs-5 fw-normal">${
                            arr[i].strCategory
                        }</span>
                    </h3>
                    <h3>Recipes : <span>${ric}</span></h3>
                    <h3 class="d-block">Tags : <span class="fs-5 fw-normal">${
                        arr[i].strTags || "Not Available Now"
                    }</span></h3>
                    <a target="_blank" class="btn btn-success" href="${
                        arr[i].strSource
                    }">Source</a>
                    <a target="_blank" class="btn btn-danger" href="${
                        arr[i].strYoutube
                    }">Youtube</a>
                </div>
        </div>
            `;
        });
    }
}
//!Search Functions

//!Category functions
async function getCategoryData() {
    showLoadingAndHideScroll();

    let catRes = await fetch(
        `https://www.themealdb.com/api/json/v1/1/categories.php`
    );
    let finalCatRes = await catRes.json();
    const catArr = finalCatRes.categories;
    displayCategory(catArr);
    disableLoadingAndShowScroll();
}
getCategoryData();
async function getCategoryMeals(nameOfCatMeal) {
    showLoadingAndHideScroll();

    let catMealsRes = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${nameOfCatMeal}`
    );
    let finalCatMealsRes = await catMealsRes.json();
    const catArr = finalCatMealsRes.meals;
    displayCatMeals(catArr);
    disableLoadingAndShowScroll();
}
function displayCategory(arr) {
    let catStorage = "";
    for (let i = 0; i < arr.length; i++) {
        catStorage += `
        <div class="col-lg-4 inner-parent-category" data-ca="${
            arr[i].strCategory
        }">
            <div"
                class="inner-category rounded-4  overflow-hidden position-relative d-flex flex-column justify-content-center align-items-center"
            >
                <div class="category-img">
                    <img
                        src="${arr[i].strCategoryThumb}"
                        alt="ready to eat"
                        class="w-100"
                    />
                </div>
                <div
                    class="category-caption position-absolute d-flex flex-column justify-content-end px-4"
                >
                    <p ">
                      ${arr[i].strCategoryDescription.slice(0, 90) + " ..."}
                    </p>
                    <h2 " class="h4 mb-5">
                        ${arr[i].strCategory}
                        <i
                            class="fa-solid fa-angle-right fs-5"
                        ></i>
                    </h2>
                </div>
            </div>
        </div>`;
    }
    categoryContainer.innerHTML = catStorage;
    const innerParentCategory = Array.from(
        document.querySelectorAll(".inner-parent-category")
    );
    for (let i = 0; i < innerParentCategory.length; i++) {
        innerParentCategory[i].addEventListener("click", function () {
            nameOfCatMeal = this.getAttribute("data-ca");
            showCatMeals();
            getCategoryMeals(nameOfCatMeal);
        });
    }
}
function displayCatMeals(arr) {
    let CatMealsStorage = "";
    for (let i = 0; i < arr.length; i++) {
        CatMealsStorage += `
        <div  class=" col-md-6 special-cap inner-parent col-lg-4 col-xl-3" da-str-name="${arr[i].strMeal}">
        <div
            class="inner special-inner tr-700 overflow-hidden rounded-4 h-100 position-relative "
        >
            <img
                src="${arr[i].strMealThumb}"
                alt="ready to eat"
                class="w-100 special-cap"
            />
            <div
                class="caption special-cap  fw-bold ps-3 position-absolute d-flex justify-content-start align-items-center"
            >
                <h2 class="mb-0 special-cap">${arr[i].strMeal}</h2>
            </div>
        </div>
    </div>
        `;
    }
    catItems.innerHTML = CatMealsStorage;
    apiTricks = Array.from(document.querySelectorAll(".inner-parent"));
    getTrickyName();
}
//!Category functions

//!Area functions
async function getAreaData() {
    showLoadingAndHideScroll();

    let catRes = await fetch(
        `https://www.themealdb.com/api/json/v1/1/list.php?a=amrican`
    );
    let finalCatRes = await catRes.json();
    const catArr = finalCatRes.meals;
    displayAreaNames(catArr);
    disableLoadingAndShowScroll();
}
getAreaData();
async function getAreaMeals(nameOfAreaMeals) {
    showLoadingAndHideScroll();

    let catMealsRes = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${nameOfAreaMeals}`
    );
    let finalCatMealsRes = await catMealsRes.json();
    const catArr = finalCatMealsRes.meals;
    displayAreaMeals(catArr);
    disableLoadingAndShowScroll();
}

function displayAreaNames(arr) {
    let AreaStorage = "";
    for (let i = 0; i < arr.length; i++) {
        AreaStorage += `
        <div  class="col-md-4 inner-area " da-area="${arr[i].strArea}" >
        <div  class=" d-flex flex-column justify-content-center align-items-center"   >
            <i class="fa-solid fa-house-laptop"></i>
            <h2>${arr[i].strArea}</h2>
        </div>
    </div>
        `;
    }
    areaContainer.innerHTML = AreaStorage;
    const innerAreaParent = Array.from(
        document.querySelectorAll(".inner-area")
    );
    for (let i = 0; i < innerAreaParent.length; i++) {
        innerAreaParent[i].addEventListener("click", function () {
            nameOfArea = this.getAttribute("da-area");
            getAreaMeals(nameOfArea);
            showAreaMeals();
        });
    }
}
function displayAreaMeals(arr) {
    let areaMealsStorage = "";
    for (let i = 0; i < arr.length; i++) {
        areaMealsStorage += `
        <div  class=" col-md-6 special-cap inner-parent col-lg-4 col-xl-3" da-str-name="${arr[i].strMeal}">
        <div
            class="inner special-inner tr-700 overflow-hidden rounded-4 h-100 position-relative "
        >
            <img
                src="${arr[i].strMealThumb}"
                alt="ready to eat"
                class="w-100 special-cap"
            />
            <div
                class="caption special-cap  fw-bold ps-3 position-absolute d-flex justify-content-start align-items-center"
            >
                <h2 class="mb-0 special-cap">${arr[i].strMeal}</h2>
            </div>
        </div>
    </div>
        `;
    }
    areaItems.innerHTML = areaMealsStorage;
    apiTricks = Array.from(document.querySelectorAll(".inner-parent"));
    getTrickyName();
}
//!Area functions

//!Ingredients functions
async function getIngData() {
    showLoadingAndHideScroll();

    let catRes = await fetch(
        `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
    );
    let finalCatRes = await catRes.json();
    const catArr = finalCatRes.meals;
    const newArr = catArr.slice(0, 20);
    displayIngNames(newArr);
    disableLoadingAndShowScroll();
}
getIngData();
async function getIngMeals(nameOfIng) {
    showLoadingAndHideScroll();

    let catMealsRes = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${nameOfIng}`
    );
    let finalIngMealsRes = await catMealsRes.json();
    const ingArr = finalIngMealsRes.meals;
    displayIngMeals(ingArr);
    disableLoadingAndShowScroll();
}
function displayIngNames(arr) {
    let ingStorage = "";
    for (let i = 0; i < arr.length; i++) {
        ingStorage += `
        <div  class="col-md-6 col-lg-4 col-xl-3 inner-Ing" da-ing="${
            arr[i].strIngredient
        }" >
        <div  class=" d-flex flex-column justify-content-center align-items-center"   >
        <img class="w-75" src="https://www.themealdb.com/images/ingredients/${
            arr[i].strIngredient
        }.png">
            
            <h2>${arr[i].strIngredient}</h2>
            <p class="px-5 text-center">${
                arr[i].strDescription.slice(0, 100) + " ..."
            }</p>
        </div>
    </div>
        `;
    }
    ingContainer.innerHTML = ingStorage;
    const innerIng = Array.from(document.querySelectorAll(".inner-Ing"));
    for (let i = 0; i < innerIng.length; i++) {
        innerIng[i].addEventListener("click", function () {
            nameOfIng = this.getAttribute("da-ing");
            getIngMeals(nameOfIng);
            showIngMeals();
        });
    }
}
function displayIngMeals(arr) {
    let ingMealsStorage = "";
    for (let i = 0; i < arr.length; i++) {
        ingMealsStorage += `
        <div  class=" col-md-6 special-cap inner-parent col-lg-4 col-xl-3" da-str-name="${arr[i].strMeal}">
        <div
            class="inner special-inner tr-700 overflow-hidden rounded-4 h-100 position-relative "
        >
            <img
                src="${arr[i].strMealThumb}"
                alt="ready to eat"
                class="w-100 special-cap"
            />
            <div
                class="caption special-cap  fw-bold ps-3 position-absolute d-flex justify-content-start align-items-center"
            >
                <h2 class="mb-0 special-cap">${arr[i].strMeal}</h2>
            </div>
        </div>
    </div>
        `;
    }
    ingItems.innerHTML = ingMealsStorage;
    apiTricks = Array.from(document.querySelectorAll(".inner-parent"));
    getTrickyName();
}
//!Ingredients functions

// Show and display
function showSearchSection() {
    asideSections[0].addEventListener("click", () => {
        searchSection.classList.replace("d-none", "d-block");
        categorySection.classList.replace("d-block", "d-none");
        infoMeals.classList.replace("d-block", "d-none");
        catItems.classList.replace("d-flex", "d-none");
        areaContainer.classList.replace("d-flex", "d-none");
        areaItems.classList.add("d-none");
        ingContainer.classList.replace("d-flex", "d-none");
        ingItems.classList.add("d-none");
        contactSection.classList.add("d-none");
        trickyContainer.classList.add("d-none");
    });
}
function showCategorySection() {
    asideSections[1].addEventListener("click", () => {
        categorySection.classList.replace("d-none", "d-block");
        searchSection.classList.add("d-none");
        infoMeals.classList.add("d-none");
        catItems.classList.replace("d-flex", "d-none");
        areaContainer.classList.replace("d-flex", "d-none");
        areaItems.classList.add("d-none");
        ingContainer.classList.replace("d-flex", "d-none");
        ingItems.classList.add("d-none");
        contactSection.classList.add("d-none");
        trickyContainer.classList.add("d-none");
    });
}
function showAreaSection() {
    asideSections[2].addEventListener("click", () => {
        categorySection.classList.add("d-none");
        searchSection.classList.add("d-none");
        infoMeals.classList.replace("d-block", "d-none");
        catItems.classList.replace("d-flex", "d-none");
        areaContainer.classList.replace("d-none", "d-flex");
        areaItems.classList.add("d-none");
        ingContainer.classList.replace("d-flex", "d-none");
        ingItems.classList.add("d-none");
        contactSection.classList.add("d-none");
        trickyContainer.classList.add("d-none");
    });
}
function showIngSection() {
    asideSections[3].addEventListener("click", () => {
        categorySection.classList.add("d-none");
        searchSection.classList.add("d-none");
        infoMeals.classList.replace("d-block", "d-none");
        catItems.classList.replace("d-flex", "d-none");
        areaContainer.classList.replace("d-flex", "d-none");
        areaItems.classList.add("d-none");
        ingContainer.classList.replace("d-none", "d-flex");
        ingItems.classList.add("d-none");
        contactSection.classList.add("d-none");
        trickyContainer.classList.add("d-none");
    });
}
function showContactSection() {
    asideSections[4].addEventListener("click", () => {
        contactSection.classList.replace("d-none", "d-block");
        categorySection.classList.add("d-none");
        searchSection.classList.add("d-none");
        infoMeals.classList.replace("d-block", "d-none");
        catItems.classList.replace("d-flex", "d-none");
        areaContainer.classList.replace("d-flex", "d-none");
        areaItems.classList.add("d-none");
        ingContainer.classList.replace("d-flex", "d-none");
        ingItems.classList.add("d-none");
        trickyContainer.classList.add("d-none");
    });
}

showSearchSection();
showCategorySection();
showAreaSection();
showIngSection();
showContactSection();

function showMealsInfo() {
    searchSection.classList.add("d-none");
    infoMeals.classList.add("d-block");
    infoMeals.classList.remove("d-none");
    catItems.classList.replace("d-flex", "d-none");
    areaContainer.classList.replace("d-flex", "d-none");
    areaItems.classList.add("d-none");
    ingContainer.classList.replace("d-flex", "d-none");
    ingItems.classList.add("d-none");
    trickyContainer.classList.add("d-none");
}
function showCatMeals() {
    searchSection.classList.add("d-none");
    infoMeals.classList.replace("d-block", "d-none");
    categorySection.classList.replace("d-block", "d-none");
    catItems.classList.add("d-flex");
    catItems.classList.remove("d-none");
    areaItems.classList.add("d-none");
    ingContainer.classList.replace("d-flex", "d-none");
    ingItems.classList.add("d-none");
    trickyContainer.classList.add("d-none");
}
function showAreaMeals() {
    areaItems.classList.replace("d-none", "d-flex");
    areaContainer.classList.add("d-none");
    ingContainer.classList.replace("d-flex", "d-none");
    ingItems.classList.add("d-none");
    trickyContainer.classList.add("d-none");
}
function showIngMeals() {
    ingItems.classList.replace("d-none", "d-flex");
    areaContainer.classList.add("d-none");
    ingContainer.classList.replace("d-flex", "d-none");
    trickyContainer.classList.add("d-none");
}
// Show and display

function searchByNameAndByLetter(inputName) {
    inputName.addEventListener("input", function () {
        if (this == searchLatterInput) {
            q = "f";
            if (inputName.value != "") {
                getApiData(this.value, q);
            } else {
                q = "s";
                getApiData(emptyMealName, q);
            }
        } else {
            if (inputName.value != "") {
                getApiData(this.value, q);
            } else {
                getApiData(emptyMealName, q);
            }
        }
    });
}
searchByNameAndByLetter(searchNameInput);
searchByNameAndByLetter(searchLatterInput);

// Regex
//& checkAllEmptyInput
function checkAllEmptyInput() {
    if (
        userName.value == "" ||
        userEmail.value == "" ||
        userPassword.value == "" ||
        userConfirmPassword.value == "" ||
        userPhone.value == "" ||
        userAge.value == ""
    ) {
        return false;
    }
}

//& Checking Password equals or not
function checkingPasswordEquals() {
    if (userPassword.value == userConfirmPassword.value) {
        return true;
    }
}
//

//& Regex Function
function inputsValidation(regexName, inputName) {
    if (regexName.test(inputName.value)) {
        inputName.nextElementSibling.classList.add("d-none");
        return true;
    } else {
        inputName.nextElementSibling.classList.remove("d-none");
        return false;
    }
}
// Regex

//Display loader
function showLoadingAndHideScroll() {
    document.querySelector(".loading").classList.replace("d-none", "d-flex");
    document.body.classList.add("overflow-hidden");
}
function disableLoadingAndShowScroll() {
    setTimeout(() => {
        document
            .querySelector(".loading")
            .classList.replace("d-flex", "d-none");
        document.body.classList.remove("overflow-hidden");
    }, 300);
}
//Display loader

//^ Tricky Functions
async function getTrickyData(nameOfTricky) {
    showLoadingAndHideScroll();
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${nameOfTricky}`
    );
    let fRes = await res.json();
    let malesArr = fRes.meals;
    displayTrickyInfo(malesArr);
    disableLoadingAndShowScroll();
}
function getTrickyName() {
    for (let i = 0; i < apiTricks.length; i++) {
        apiTricks[i].addEventListener("click", function () {
            nameOfTricky = this.getAttribute("da-str-name");
            getTrickyData(nameOfTricky);
            showTrickyInfo();
        });
    }
}
function displayTrickyInfo(arr) {
    for (let i = 0; i < arr.length; i++) {
        trickyContainer.innerHTML = `
    <div class="col-lg-6 col-xl-4">
        <div class="inner-info">
            <img
                src="${arr[i].strMealThumb}"
                class="w-100"
                alt="ready to eat"
            />
            <h2>${arr[i].strMeal}</h2>
        </div>
    </div>
    <div class="col-lg-6 col-xl-8">
        <div class="inner-info-caption">
            <h3>Instructions</h3>
            <p>${arr[i].strInstructions}</p>
            <h3>
                <span>Area :</span> <span class="fs-5 fw-normal">${
                    arr[i].strArea
                }</span>
            </h3>
            <h3>
                <span>Category :</span> <span class="fs-5 fw-normal">${
                    arr[i].strCategory
                }</span>
            </h3>
            <h3>Recipes : <span>${ric || "Not Available"}</span></h3>
            <h3 class="d-block">Tags : <span class="fs-5 fw-normal">${
                arr[i].strTags || "Not Available Now"
            }</span></h3>
            <a target="_blank" class="btn btn-success" href="${
                arr[i].strSource
            }">Source</a>
            <a target="_blank" class="btn btn-danger" href="${
                arr[i].strYoutube
            }">Youtube</a>
        </div>
</div>
    `;
    }
}
function showTrickyInfo() {
    searchSection.classList.add("d-none");
    infoMeals.classList.add("d-none");
    catItems.classList.replace("d-flex", "d-none");
    areaContainer.classList.replace("d-flex", "d-none");
    areaItems.classList.add("d-none");
    ingContainer.classList.replace("d-flex", "d-none");
    ingItems.classList.add("d-none");
    trickyContainer.classList.replace("d-none", "d-flex");
}
//^ Tricky Functions

//~ Events
$(".aside-btn , aside ul li").on("click", () => {
    $("aside").toggleClass("aside-movement"); //Show and hide aside
    $(".aside-btn").toggleClass("arrow-rotate"); //change arrow direction
    $("aside ul li").toggleClass("li-movement"); //control aside li animation
});

$(".change-mood").on("click", () => {
    $("body").toggleClass("dark-mode-colors"); //turn on and turn off => night mood
});
