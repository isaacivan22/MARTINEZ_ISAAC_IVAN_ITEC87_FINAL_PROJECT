function updateTotalAmount() {
    var total = 0;
    var selectedItems = document.querySelectorAll('input[type="checkbox"]:checked');
    var orderSummary = ""; // Initialize the order summary string

    selectedItems.forEach(function(checkbox) {
        if (checkbox.parentNode.querySelector('.stock') !== null) {
            var itemName = checkbox.parentNode.innerText.trim().split("-")[0].trim(); // Get only the item name
            var quantityInput = document.getElementById("quantity_" + checkbox.id);
            var quantity = parseInt(quantityInput.value);
            var itemPrice = parseFloat(checkbox.value);
            total += itemPrice * quantity;
            orderSummary += itemName + " - Quantity: " + quantity + "<button onclick=\"cancelItem('" + checkbox.id + "')\">Cancel</button><br>"; // Append item name, quantity, and cancel button to summary

            var stockElement = checkbox.parentElement.querySelector('.stock');
            var currentStock = parseInt(stockElement.textContent.split(":")[1].trim()); // Extract current stock value
            if (quantity > currentStock) {
                Swal.fire('Out of Stock!', 'You have selected more items than available stock.', 'warning');
                return; // Stop further processing if out of stock
            }
        }
    });

    document.getElementById('totalAmount').innerHTML = 'Total: P' + total.toFixed(2) + "<br><br>Orders Summary:<br>" + orderSummary;
}

function cancelItem(itemId) {
    var checkbox = document.getElementById(itemId);
    checkbox.checked = false; // Uncheck the checkbox

    // Update the total amount
    updateTotalAmount();

   
}

function calculateTotal() {
    updateTotalAmount();
    var totalAmount = parseFloat(document.getElementById('totalAmount').textContent.split("P")[1]);
    var discountTypeApplied = "";
    var discountPercent = 0;
    var discountedPrice = 0;

    Swal.fire({
        title: 'Select Discount Type',
        input: 'select',
        inputOptions: {
            'None': 'None',
            'Senior': 'Senior - 20%',
            'PWD': 'PWD - 30%',
            'Student': 'Student - 10%'
        },
        inputPlaceholder: 'Select a discount type',
        showCancelButton: true,
        confirmButtonText: 'Apply Discount',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            var discountType = result.value;
            var discount = 0;

            if (discountType === 'Senior') {
                discount = 0.20;
            } else if (discountType === 'PWD') {
                discount = 0.30;
            } else if (discountType === 'Student') {
                discount = 0.10;
            }

            discountTypeApplied = discountType;
            discountPercent = discount * 100; // Convert discount to percentage
            discountedPrice = totalAmount * (1 - discount);

            Swal.fire({
                title: 'Enter Payment Amount',
                html: 'Discount Type: ' + discountTypeApplied + ' (' + discountPercent + '%)<br>' +
                    'Total after discount: P' + discountedPrice.toFixed(2) + '<br>' +
                    'Enter the amount you will pay:',
                input: 'number',
                inputAttributes: {
                    min: "0",
                    step: "0.01"
                },
                showCancelButton: true,
                confirmButtonText: 'Pay',
                cancelButtonText: 'Cancel',
                showLoaderOnConfirm: true,
                preConfirm: (paymentAmount) => {
                    if (isNaN(paymentAmount) || paymentAmount < discountedPrice) {
                        Swal.showValidationMessage('Payment amount must be equal to or greater than the total amount.');
                    }
                    return paymentAmount;
                },
                allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
                if (result.isConfirmed) {
                    var paymentAmount = parseFloat(result.value);
                    var change = paymentAmount - discountedPrice;
                    var paymentMessage = 'Payment: P' + paymentAmount.toFixed(2);
                    if (change > 0) {
                        paymentMessage += '<br>Change: P' + change.toFixed(2);
                    }

                    Swal.fire('Payment Successful!', paymentMessage, 'success');

                    // Deduct stock for each selected item
                    var selectedItems = document.querySelectorAll('input[type="checkbox"]:checked');
                    selectedItems.forEach(function(checkbox) {
                        if (checkbox.parentNode.querySelector('.stock') !== null) {
                            var quantityInput = document.getElementById("quantity_" + checkbox.id);
                            var quantity = parseInt(quantityInput.value);
                            var stockElement = checkbox.parentElement.querySelector('.stock');
                            var currentStock = parseInt(stockElement.textContent.split(":")[1].trim()); // Extract current stock value
                            var newStock = currentStock - quantity;
                            if (newStock < 0) {
                                Swal.fire('Out of Stock!', 'You have selected more items than available stock.', 'warning');
                                return; // Stop further processing if out of stock
                            }
                            stockElement.textContent = 'Stock: ' + newStock;
                        }
                    });

                    // Display discount type, discount percent, discounted price, and change
                    document.getElementById('totalAmount').innerHTML += '<br>Discount Type: ' + discountTypeApplied + ' (' + discountPercent + '%)<br>' +
                        'Discounted Price: P' + discountedPrice.toFixed(2) + '<br>' +
                        'Change: P' + change.toFixed(2);
                }
            });
        }
    });
}


function manageStock() {
    var stockManagementHtml = '<div class="stock-management">';
    
    // Get all sections
    var sections = document.querySelectorAll('section');
    sections.forEach(function(section) {
        var category = section.querySelector('h2').innerText;
        stockManagementHtml += '<h3>' + category + '</h3>';

        // Get all items within the section
        var items = section.querySelectorAll('.item');
        items.forEach(function(item) {
            var itemName = item.querySelector('label').innerText.split("-")[0].trim();
            var stockElement = item.querySelector('.stock');
            var currentStock = parseInt(stockElement.textContent.split(":")[1].trim());
            var itemId = item.querySelector('input[type="checkbox"]').id;
            
            stockManagementHtml += '<div class="stock-item">';
            stockManagementHtml += itemName + ' -  Stock: <span id="stock_' + itemId + '">' + currentStock + '</span><br>';
            stockManagementHtml += '<button onclick="updateStock(\'' + itemId + '\', 1)">+</button>';
            stockManagementHtml += '<button onclick="updateStock(\'' + itemId + '\', -1)">-</button>';
            stockManagementHtml += '</div><br>';
        });
    });

    stockManagementHtml += '</div>';

    Swal.fire({
        title: 'Stock Management',
        html: stockManagementHtml,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Done',
        cancelButtonText: 'Cancel'
    });
}


function updateStock(itemId, change) {
    var stockElement = document.querySelector('#stock_' + itemId);
    var currentStock = parseInt(stockElement.textContent);
    var newStock = currentStock + change;
    
    if (newStock < 0) {
        Swal.fire('Error', 'Stock cannot be negative.', 'error');
        return;
    }
    
    stockElement.textContent = newStock;

    // Update the main stock display
    var mainStockElement = document.querySelector('#' + itemId).parentNode.querySelector('.stock');
    mainStockElement.textContent = 'Stock: ' + newStock;
}

