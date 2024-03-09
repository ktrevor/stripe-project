// This is your test secret API key.
const stripe = require('stripe')('sk_test_51Op1zXB7W69yANae03pdzxuFf2Fd2M2v77BeMxKoqSeRkFfsCKlE9xX5GZmctHO2JVZbrnmgCpLo05BYrd5yWisl00B2NWq2g7');
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:4242';

let inventory = 100;

app.post('/create-checkout-session', async (req, res) => {

if (inventory <= 0) {
    res.redirect(303, `${YOUR_DOMAIN}/error.html`);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types:['card'],
    billing_address_collection: "required",
    line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: 5000,
          product_data: {
            name: 'National Parks',
            description: 'A book about National Parks',
            images: ['https://images.booksense.com/images/711/691/9781800691711.jpg'],
          },
        },
        adjustable_quantity: {
            enabled: true,
            minimum: 1,
            maximum: inventory,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
      });
      res.redirect(303, session.url);
});

app.get('/order-info', async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    inventory -= session.amount_total/5000;

    res.json({
      session: session,
      customer: session.customer_details,
    });
});

app.get('/charges', async (req, res) => {
    const charges = await stripe.charges.list({ limit: 100 });
    res.json(charges.data);
});

app.listen(4242, () => console.log('Running on port 4242'));