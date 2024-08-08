const generateHTML = (data, payment)=>{
    /*

    */
   var html = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f8f8;
        }
        .invoice {
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .invoice-header img {
            max-width: 150px;
        }
        .invoice-title {
            font-size: 24px;
            font-weight: bold;
            text-align: right;
        }
        .invoice-details, .invoice-summary {
            margin-top: 20px;
        }
        .invoice-details p, .invoice-summary p {
            margin: 5px 0;
        }
        .invoice-details .column {
            width: 45%;
        }
        .invoice-details .reciever {
            text-align: right;
        }
        .invoice-details .column p {
            line-height: 1.6;
        }
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .invoice-table th, .invoice-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        .invoice-table th {
            background-color: #f2f2f2;
        }
        .invoice-total {
            float: right;
            width: 40%;
        }
        .invoice-total .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .invoice-note {
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="invoice">
        <div class="invoice-header">
            <img src="https://i.imgur.com/Cce2iXH.png" alt="YatraMitra Logo">
            <div class="invoice-title">Invoice<br>Invoice Number - ${data.pnr}</div>
        </div>
        <div class="invoice-details">
            <div style="display: flex; justify-content: space-between;">
                <div class="column">
                    <p>Invoiced To:<br>${payment.billingAddress.billing_details.address.name}<br>${payment.billingAddress.billing_details.address.line1}<br>${payment.billingAddress.billing_details.address.line2?`<br>${payment.billingAddress.billing_details.address.line2}<br>`:""},${payment.billingAddress.billing_details.address.postal_code} India</p>
                </div>
                <div class="column reciever">
                    <p>Pay To:<br>YatraMitra<br>ABV IIITM <br>Gwalior, 474015</p>
                </div>
            </div>
            <p>Payment Method: ${payment.billingAddress.card.brand}</p>
            <p>Booking Date: 07/11/2020</p>
        </div>
        <table class="invoice-table">
            <thead>
                <tr>
                    <th>Flight Details</th>
                    <th>Base Fare</th>
                    <th>Taxes & Fee</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${data.departureflightID} - ${data.source} to ${data.destination}<br>Travel Date - ${data.departure.toLocaleDateString('en-IN')}, ${data.departureTime}<br>${data.passengers.map(p => p.name).join(", ")}</td>
                    <td>₹${payment.amount}</td>
                    <td>0</td>
                    <td>₹${payment.amount}</td>
                </tr>`
            if(data.arrivalflightID){
               html+= `
                <tr>
                     <td>${data.arrivalflightID} - ${data.destination} to ${data.source}<br>Travel Date - ${data.arrival.toLocaleDateString('en-IN')}, ${data.arrivalTime}<br>${data.passengers.map(p => p.name).join(", ")}</td>
                    <td>₹${payment.amount}</td>
                    <td>0</td>
                    <td>₹${payment.amount}</td>
                </tr>
                `
            }
                
              html+=  `
            </tbody>
        </table>
        
        <div class="invoice-details" style="clear: both;">
            <table class="invoice-table">
                <thead>
                    <tr>
                        <th>Transaction Date</th>
                        <th>Gateway</th>
                        <th>Transaction ID</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${new Date().toLocaleDateString('en-IN')}</td>
                        <td>Credit Card</td>
                        <td>XXXXX${payment.billingAddress.card.last4}</td>
                        <td>₹${payment.amount}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p class="invoice-note">NOTE: This is a computer generated receipt and does not require physical signature.</p>
    </div>
</body>
</html>
   `
   return html;
}
module.exports = generateHTML;