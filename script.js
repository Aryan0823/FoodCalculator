document.addEventListener("DOMContentLoaded", function () {
    // Get references to HTML elements
    const categoryDropdown = document.getElementById("category");
    const foodItemDropdown = document.getElementById("foodItem");
    const gramInput = document.getElementById("gramInput");
    const calculateButton = document.getElementById("calculate");
    const totalButton = document.getElementById("total");
    const clearButton = document.getElementById("clear");
    const resultsTable = document.getElementById("resultsTable");
    const totalTable = document.getElementById("totalTable");

    // Store calculated results
    const calculatedResults = [];

    // Function to load JSON data from an external file
    async function loadJSON() {
        try {
            const response = await fetch("data.json"); // Replace with the correct path to your JSON file
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error loading JSON data:", error);
        }
    }

    // Populate the Category dropdown
    loadJSON().then((database) => {
        for (const category in database.Categories) {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryDropdown.appendChild(option);
        }
    });

    // Update Food Item dropdown based on selected category
    categoryDropdown.addEventListener("change", function () {
        const selectedCategory = categoryDropdown.value;
        foodItemDropdown.innerHTML = ""; // Clear previous options

        loadJSON().then((database) => {
            for (const foodItem in database.Categories[selectedCategory]) {
                const option = document.createElement("option");
                option.value = foodItem;
                option.textContent = foodItem;
                foodItemDropdown.appendChild(option);
            }
        });
    });

    // Calculate button click event
    calculateButton.addEventListener("click", function () {
        const selectedCategory = categoryDropdown.value;
        const selectedFoodItem = foodItemDropdown.value;
        const grams = parseFloat(gramInput.value);

        loadJSON().then((database) => {
            // Get food data
            const foodData = database.Categories[selectedCategory][selectedFoodItem];

            // Calculate parameters based on the entered grams
            const calculatedParameters = {
                "Grams": grams,
                "Energy": (foodData["Energy"] / 100) * grams,
                "Protein": (foodData["Protein"] / 100) * grams,
                "Fat": (foodData["Fat"] / 100) * grams,
                "Minerals": (foodData["Minerals"] / 100) * grams,
                "Fibre": (foodData["Fibre"] / 100) * grams,
                "Carbos": (foodData["Carbos"] / 100) * grams,
                "Calcium": (foodData["Calcium"] / 100) * grams,
                "Phosphorous": (foodData["Phosphorous"] / 100) * grams,
                "Iron": (foodData["Iron"] / 100) * grams
            };

            // Create a new table row and add it to the table
            const newRow = resultsTable.insertRow();
            const foodItemCell = newRow.insertCell(0);
            // Inside the "Calculate" button click event

            const categoryCell = newRow.insertCell(0); 
            // Add this line
            categoryCell.textContent= selectedCategory; 
            // Add this line


            // Display results in the table
            foodItemCell.textContent = selectedFoodItem;

            for (const nutrient in calculatedParameters) {
                const nutrientCell = newRow.insertCell(-1);
                nutrientCell.textContent = calculatedParameters[nutrient].toFixed(2);
            }

            // Add calculated results to the array
            calculatedResults.push(calculatedParameters);

            // Clear the input fields
            gramInput.value = "";
            
        });
    });

    // Total button click event
    totalButton.addEventListener("click", function () {
        // Calculate the sum of all parameters
        const totalParameters = {
            "Grams": 0,
            "Energy": 0,
            "Protein": 0,
            "Fat": 0,
            "Minerals": 0,
            "Fibre": 0,
            "Carbos": 0,
            "Calcium": 0,
            "Phosphorous": 0,
            "Iron": 0
        };

        for (const result of calculatedResults) {
            for (const nutrient in result) {
                totalParameters[nutrient] += result[nutrient];
            }
        }

        // Create a new table row for the total and add it to the table
        const newRow = totalTable.insertRow();
        const parameterCell = newRow.insertCell(0);
        // Inside the "Total" button click event
        const categoryTotalCell = newRow.insertCell(0); 
        // Add this line
        categoryTotalCell.textContent= "Total"; 
        // Add this line

        // Display the total results in the table
        parameterCell.textContent = "Total";

        for (const nutrient in totalParameters) {
            const nutrientCell = newRow.insertCell(-1);
            nutrientCell.textContent = totalParameters[nutrient].toFixed(2);
        }
    });

    // Clear button click event
    clearButton.addEventListener("click", function () {
        // Clear all data and tables
        calculatedResults.length = 0; // Clear calculated results array
        resultsTable.innerHTML = "<thead><tr><th>Food Item</th><th>Grams</th><th>Energy (kcal)</th><th>Protein (g)</th><th>Fat (g)</th><th>Minerals (g)</th><th>Fibre (g)</th><th>Carbos (g)</th><th>Calcium (mg)</th><th>Phosphorous (mg)</th><th>Iron (mg)</th></tr></thead><tbody></tbody>";
        totalTable.innerHTML = "<thead><tr><th>Parameter</th><th>Total Grams</th><th>Total Energy (kcal)</th><th>Total Protein (g)</th><th>Total Fat (g)</th><th>Total Minerals (g)</th><th>Total Fibre (g)</th><th>Total Carbos (g)</th><th>Total Calcium (mg)</th><th>Total Phosphorous (mg)</th><th>Total Iron (mg)</th></tr></thead><tbody></tbody>";
    });
});
