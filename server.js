// server.js
// This is your secure, server-side code.

const express = require('express');
const { Client, Environment } = require('square');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
app.use(express.json());

// IMPORTANT: Configure CORS to only allow your website's domain in production
// For development, you can be more open, but for production, lock it down.
// const whitelist = ['https://your-website-domain.com']; 
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// };
// app.use(cors(corsOptions));

// For now, let's keep it open for easy setup.
app.use(cors());


// Initialize the Square Client using environment variables
const squareClient = new Client({
  environment: Environment.Production, // Change to Environment.Sandbox for testing
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

// API endpoint to create a payment link
app.post('/api/create-payment-link', async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (!amount || amount <= 0 || !description) {
      return res.status(400).json({ error: 'Invalid payment details provided.' });
    }

    const response = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey: uuidv4(),
      description: description,
      order: {
        locationId: process.env.SQUARE_LOCATION_ID,
        lineItems: [
          {
            name: description,
            quantity: '1',
            basePriceMoney: {
              amount: amount, // Amount in cents
              currency: 'USD',
            },
          },
        ],
      },
      checkoutOptions: {
        redirectUrl: 'https://yourwebsite.com/thank-you', // Optional: A page to send users after payment
      },
    });

    res.status(200).json({
      url: response.result.paymentLink.url,
    });

  } catch (error) {
    console.error('Square API Error:', error);
    res.status(500).json({ error: 'Failed to create payment link.' });
  }
});

// This makes the Express app compatible with Vercel's serverless environment
module.exports = app;
