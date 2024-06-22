document.querySelectorAll('img').forEach((image, index) => {
    image.addEventListener("click", function() {
        var checkbox = document.getElementById("checkbox" + index);
        checkbox.checked = !checkbox.checked; // Toggle the checked state
    });
});

function calculateTotal() {
    var total = 0;
    var orders = [];

    // Loop through each checkbox
    var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(function(checkbox) {
        // Get the value of the checkbox
        var value = checkbox.value;
        var index = checkbox.id.replace('checkbox', '');
        var quantity = document.getElementById("quantity" + index).value || 1;
        quantity = parseInt(quantity);

        // Add the price based on the value using a switch statement
        switch (value) {
            case "bulalo":
                total += 750 * quantity;
                orders.push("Bulalo (P750) x" + quantity);
                break;
            case "sinigang":
                total += 400 * quantity;
                orders.push("Sinigang na Bangus (P400) x" + quantity);
                break;
            case "caldereta":
                total += 300 * quantity;
                orders.push("Beef Caldereta (P300) x" + quantity);
                break;
            case "inasal":
                total += 150 * quantity;
                orders.push("Chicken Inasal (P150) x" + quantity);
                break;
            case "sisig":
                total += 150 * quantity;
                orders.push("Sizzling Sisig (P150) x" + quantity);
                break;
            case "chopsuey":
                total += 150 * quantity;
                orders.push("Chopsuey (P150) x" + quantity);
                break;
            case "pinakbet":
                total += 120 * quantity;
                orders.push("Pinakbet (P120) x" + quantity);
                break;
            case "tortang-talong":
                total += 80 * quantity;
                orders.push("Tortang Talong (P80) x" + quantity);
                break;
            case "leche-flan":
                total += 150 * quantity;
                orders.push("Leche Flan (P150) x" + quantity);
                break;
            case "halo-halo":
                total += 100 * quantity;
                orders.push("Halo-Halo (P100) x" + quantity);
                break;
            case "mango-tapioca":
                total += 100 * quantity;
                orders.push("Mango Tapioca (P100) x" + quantity);
                break;
            case "red-horse":
                total += 70 * quantity;
                orders.push("Red Horse (P70) x" + quantity);
                break;
            case "coca-cola":
                total += 60 * quantity;
                orders.push("Coca-Cola (P60) x" + quantity);
                break;
            case "iced-tea":
                total += 50 * quantity;
                orders.push("Iced Tea (P50) x" + quantity);
                break;
            case "shawarma":
                total += 95 * quantity;
                orders.push("Shawarma (P95) x" + quantity);
                break;
            case "calamares":
                total += 70 * quantity;
                orders.push("Calamares (P70) x" + quantity);
                break;
            case "french-fries":
                total += 50 * quantity;
                orders.push("French Fries (P50) x" + quantity);
                break;
            default:
                break;
        }
    });

    // Display the total amount and orders using SweetAlert
    var message = "<p>Your Orders:</p><ul>";

    orders.forEach(function(order) {
        message += "<li>" + order + "</li>";
    });
    message += "</ul>";
    message += "<p>Total amount: P" + total + "</p>";

    Swal.fire({
        title: 'Order Summary',
        html: message,
        icon: 'info'
    });
}

// Add an event listener to the Calculate Total label
document.getElementById("calculateTotalLabel").addEventListener("click", calculateTotal);

