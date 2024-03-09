document.addEventListener('DOMContentLoaded', async () => {
    const chargeDetails = document.getElementById('chargesData');
    const response = await fetch('/charges');
    const charges = await response.json();

    charges.forEach(charge => {
        const chargeInfo = document.createElement('div');
        chargeInfo.innerHTML = `
            <h2>Name: ${charge.billing_details.name}</h2>
            <p>Email: ${charge.billing_details.email}</p>
            <p>Address: ${charge.billing_details.address.line1}, ${charge.billing_details.address.city}, ${charge.billing_details.address.state} ${charge.billing_details.address.postal_code}, ${charge.billing_details.address.country}</p>
            <p>Amount: ${charge.amount}</p>
            <h3>Card Information:</h3>
            <p>Card Brand: ${charge.payment_method_details.card.brand}</p>
            <p>Card Last 4 Digits: ${charge.payment_method_details.card.last4}</p>
            <p>Expiry Month: ${charge.payment_method_details.card.exp_month}</p>
            <p>Expiry Year: ${charge.payment_method_details.card.exp_year}</p>
            <hr>
        `;
        chargeDetails.appendChild(chargeInfo);
    });
});