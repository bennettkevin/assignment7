"use strict";


// Get DOM references for use throughout the script.
const jokeSection = document.getElementById("jokes");
const categoryButton = document.getElementById("view-categories");
const newJoke = document.getElementById("add-joke-button");
const searchCategory = document.getElementById("search-category-button");

// Base url for requests to the server.
const MY_SERVER_BASEURL = "/jokebook";

/**
 * This function sends a GET request to retrieve a random joke from the server.
 * It then populates the joke section with the retrieved joke.
 */
async function randomJoke() {
    // Send GET request to the random endpoint.
    const randomJoke = await fetch(MY_SERVER_BASEURL + "/random");
    if (!randomJoke.ok) {
        throw new Error("Error recieving Joke: " + randomJoke.statusText);
    }
    
    const joke = await randomJoke.json();
    jokeSection.replaceChildren();

    const jokeHeader = document.createElement("h2");
    const jokeDiv = document.createElement("div");
    const jokeType = document.createElement("p");
    const jokeSetup = document.createElement("p");
    const jokeDelivery = document.createElement("p");

    jokeDiv.classList.add("joke-item");

    jokeHeader.textContent = "Random Joke";
    jokeType.textContent = "Type: " + joke.type;
    jokeSetup.textContent = "Setup: " + joke.setup;
    jokeDelivery.textContent = "Delivery: " + joke.delivery;

    jokeSection.appendChild(jokeHeader);
    jokeDiv.appendChild(jokeType);
    jokeDiv.appendChild(jokeSetup);
    jokeDiv.appendChild(jokeDelivery);

    jokeSection.appendChild(jokeDiv);
}
randomJoke();

/**
 * This function sends a GET request to retrieve jokes from a specified category.
 * It then populates the joke section with the retrieved jokes.
 * @param { string } category 
 */
async function getJokesByCategory(category) {
    // Send GET request to the category endpoint with specified category.
    const jokesByCategory = await fetch(MY_SERVER_BASEURL + "/category/" + category);
    if (!jokesByCategory.ok) {
        throw new Error("Error getting jokes by category: " + jokesByCategory.statusText);
    }

    const jokes = await jokesByCategory.json();
    if (jokes.length === 0) {
        alert("No jokes found for category: " + category);
        randomJoke();
        return;
    }
    jokeSection.replaceChildren();
    
    const jokeHeader = document.createElement("h2");
    jokeHeader.textContent = "Jokes in category: " + category;
    jokeSection.appendChild(jokeHeader);

    for (let joke of jokes) {
        const jokeDiv = document.createElement("div");
        const jokeSetup = document.createElement("p");
        const jokeDelivery = document.createElement("p");
        jokeDiv.classList.add("joke-item");

        jokeSetup.textContent = "Setup: " + joke.setup;
        jokeDelivery.textContent = "Delivery: " + joke.delivery;

        jokeDiv.appendChild(jokeSetup);
        jokeDiv.appendChild(jokeDelivery);

        jokeSection.appendChild(jokeDiv);
    }
}

/**
 * This function sends a GET request to retrieve all joke categories.
 * @returns The categories of jokes.
 */
async function getJokeCategories() {
    // Send GET request to the categories endpoint.
    const categories = await fetch(MY_SERVER_BASEURL + "/categories");
    if (!categories.ok) {
        throw new Error("Error getting categories: " + categories.statusText);
    }

    return categories.json();
}

/**
 * Event listener to search for jokes in a specific category.
 * Validates input before sending GEt request to retrieve jokes 
 * from the specified category.
 */
searchCategory.addEventListener("click", async function(event) {
    event.preventDefault();
    const params = new FormData(document.getElementById("search-category"));
    const inputValidation = JSON.parse(JSON.stringify(Object.fromEntries(params)));

    const searchBox = document.getElementById("category-to-search");
    searchBox.value = "";
    console.log(inputValidation.category);

    if(inputValidation.category === "") {
        alert("PLease enter a category to search.");
        return;
    }
    
    getJokesByCategory(inputValidation.category);
})

/**
 * Event listener for viewing joke categories.
 * Sends a GET request to retrieve all joke categories and displays 
 * them with buttons to view jokes from each category.
 */
categoryButton.addEventListener("click", async function() {
    const categoryList = await getJokeCategories();

    const categorySection = document.getElementById("categories");
    categorySection.replaceChildren();
    const categoryHeader = document.createElement("h2");

    const categoryListElement = document.createElement("ul");

    for (let category of categoryList) {
        const categoryItem = document.createElement("li");
        const viewJokesButton = document.createElement("button");
        
        viewJokesButton.id = "view-jokes-by-category";
        viewJokesButton.textContent = "View Jokes from this category";
        viewJokesButton.classList.add("category-button");
        categoryItem.textContent = category.type;

        viewJokesButton.addEventListener("click", async function () {
            getJokesByCategory(category.type);
        })

        categoryItem.appendChild(viewJokesButton);
        categoryListElement.appendChild(categoryItem);
    }

    categoryHeader.textContent = "Joke Categories";

    categorySection.appendChild(categoryHeader);
    categorySection.appendChild(categoryListElement);

});

/**
 * Event listener for adding a joke.
 * Validates the input fields before sending a POST request to add the new joke.
 * Displays all jokes from the added joke's category upon successful addition.
 */
newJoke.addEventListener("click", async function(event) {
    event.preventDefault();
    const params = new FormData(document.getElementById("add-joke-form"));
    const jsonBody = JSON.stringify(Object.fromEntries(params));
    const inputValidation = JSON.parse(jsonBody);
    

    if (inputValidation.category === "" || inputValidation.setup === "" || inputValidation.delivery === "" ) {
        alert("All fields are required to add a new joke.");
        return;
    }

    const newJokeResponse = await fetch(MY_SERVER_BASEURL + "/joke/add", {
        method: "POST",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            },
            body: jsonBody,
    });
    if(!newJokeResponse.ok) {
        randomJoke();
        throw new Error("Error adding joke: " + newJokeResponse.statusText);
    }
    else {
        console.log(newJokeResponse.json());
    }

    getJokesByCategory(inputValidation.category);
});