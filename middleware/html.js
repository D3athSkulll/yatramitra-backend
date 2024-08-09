const generateHTML = (data, payment) => {
    var html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f8f8;">
        <div style="max-width: 800px; margin: 50px auto; padding: 20px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="display: block; width: 100%;">
                <img src="https://i.imgur.com/Cce2iXH.png" alt="YatraMitra Logo" style="max-width: 150px; display: inline-block;">
                <div style="font-size: 24px; font-weight: bold; text-align: right; display: inline-block; float: right;">
                    Invoice<br>Invoice Number - ${data.pnr}
                </div>
            </div>
            <div style="margin-top: 20px;">
                <div style="display: table; width: 100%;">
                    <div style="display: table-cell; width: 50%; padding-right: 10px; vertical-align: top;">
                        <p>Invoiced To:<br>${payment.billingAddress.billing_details.name}<br>${payment.billingAddress.billing_details.address.line1}<br>${payment.billingAddress.billing_details.address.line2 ? `${payment.billingAddress.billing_details.address.line2}<br>` : ""}${payment.billingAddress.billing_details.address.postal_code} India</p>
                    </div>
                   <div style="display: table-cell; width: 50%; vertical-align: top; text-align: right;">
                        <p>Pay To:<br>YatraMitra<br>ABV IIITM <br>Gwalior, 474015</p>
                    </div>
                </div>
                <p>Payment Method: ${payment.billingAddress.card.brand.toUpperCase()}</p>
                <p>Booking Date: 07/11/2020</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f2f2f2;">Flight Details</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f2f2f2;">Base Fare</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f2f2f2;">Taxes & Fee</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f2f2f2;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 10px;">${data.departureflightID} - ${data.source} to ${data.destination}<br>Travel Date - ${data.departure.toLocaleDateString('en-IN')}, ${data.departureTime}<br>${data.passengers.map(p => p.name).join(", ")}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">₹${data.arrivalflightID?data.departurePrice:payment.amount}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">0</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">₹${data.arrivalflightID?data.departurePrice:payment.amount}</td>
                    </tr>`
                    if(data.arrivalflightID){
                       html+= `
                        <tr>
                             <td style="border: 1px solid #ddd; padding: 10px;">${data.arrivalflightID} - ${data.destination} to ${data.source}<br>Travel Date - ${data.arrival.toLocaleDateString('en-IN')}, ${data.arrivalTime}<br>${data.passengers.map(p => p.name).join(", ")}</td>
                            <td style="border: 1px solid #ddd; padding: 10px;">₹${data.arrivalPrice}</td>
                            <td style="border: 1px solid #ddd; padding: 10px;">0</td>
                            <td style="border: 1px solid #ddd; padding: 10px;">₹${data.arrivalPrice}</td>
                        </tr>`
                    }
                      
                  html+= `
                </tbody>
            </table>
            <div style="margin-top: 20px; clear: both;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f2f2f2;">Transaction Date</th>
                            <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f2f2f2;">Gateway</th>
                            <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f2f2f2;">Transaction ID</th>
                            <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f2f2f2;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 10px;">${new Date().toLocaleDateString('en-IN')}</td>
                            <td style="border: 1px solid #ddd; padding: 10px;">Credit Card</td>
                            <td style="border: 1px solid #ddd; padding: 10px;">${payment.billingAddress.id}</td>
                            <td style="border: 1px solid #ddd; padding: 10px;">₹${payment.amount}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #888;">NOTE: This is a computer-generated receipt and does not require a physical signature.</p>
        </div>
    </body>
    </html>
    `;
    return html;
}

module.exports = generateHTML;
