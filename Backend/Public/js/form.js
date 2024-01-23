// Existing JavaScript code

// Function to add product rows dynamically
document.getElementById('addProductBtn').addEventListener('click', function () {
  const productData = document.querySelector('.product-data');
  const productRow = document.createElement('div');
  productRow.classList.add('product-row');

  const inputs = ['Product', 'Quantity', 'Price'];
  inputs.forEach(inputPlaceholder => {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = inputPlaceholder;
    input.classList.add(inputPlaceholder.toLowerCase());
    productRow.appendChild(input);
  });

  const removeBtn = document.createElement('button');
  removeBtn.classList.add('remove-product-btn');
  // Change text content to an "X" icon
  removeBtn.innerHTML = '<i class="fa fa-close"></i>';
  removeBtn.addEventListener('click', function () {
    removeProductRow(productRow);
  });

  productRow.appendChild(removeBtn);
  productData.insertBefore(productRow, document.getElementById('actions'));
});

// Function to remove a product row.heade
function removeProductRow(row) {
  const productData = document.querySelector('.product-data');
  productData.removeChild(row);
}


// Function to send data to the backend
function sendDataToBackend() {
  const recipientName = document.getElementById('recipientName').value;
  const isGST=document.getElementById('isGST').checked;
  const recipientPhone = document.getElementById('recipientPhone').value;
  const recipientGSTNo = document.getElementById('recipientGSTNo').value;

//  console.log(xxxx);
  // Array to hold product data
  const products = [];

  const productRows = document.querySelectorAll('.product-row');
  var datepicker = document.getElementById("datepicker");
  var selectedDate = new Date(datepicker.value);
  var day = selectedDate.getDate().toString().padStart(2, '0');
  var month = (selectedDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  var year = selectedDate.getFullYear();

  var issueDate = day + '/' + month + '/' + year;
  // console.log(issueDate);

  productRows.forEach(row => {
    const name = row.querySelector('.product').value;

    const quantity = parseFloat(row.querySelector('.quantity').value);
    const price = parseFloat(row.querySelector('.price').value);
    const total_amount = parseFloat((quantity * price)).toFixed(2);

    if (name !== '')
      products.push({ name, quantity, price, total_amount });
  });

  // Prepare data object to send to the backend
  const dataToSend = {
    recipient: {
      name: recipientName,
      contact_no: recipientPhone,
      gst_no: recipientGSTNo
    },
    invoiceDate: issueDate,
    isGST: isGST,
    products,
  };
  // console.log(dataToSend)
  // Send data to the backend
  fetch(`${window.location.protocol}//${window.location.host}/submitInvoiceData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataToSend),
  })
    .then(response => {
      if (response.ok) {
        // Handle success here (e.g., show a success message)
      } else {
        console.error('Failed to send data');
        // Handle failure here (e.g., show an error message)
      }
      return response.json();
    }).then((data) => {
      if (data.status === "success" ) {
        window.location.href = `${window.location.protocol}//${window.location.host}/getBillData/${data.billData._id}?isGST=${isGST}`

      }
    }).catch(error => {
      console.error('Error:', error);
      // Handle error here
    });
}

// Your existing JavaScript code

// Add an event listener to the "Download PDF" button to send data to the backend before generating PDF
document.getElementById('downloadPDF').addEventListener('click', function () {
  console.log("calling");
  sendDataToBackend(); // Call the function to send data before PDF generation

  // Rest of your PDF generation code
  // ...
});
