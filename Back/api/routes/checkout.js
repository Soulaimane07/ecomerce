const express = require("express");
const router = express.Router();

const stripe = require("stripe")(process.env.stripe_secret_key);

router.post('/', async (req, res, next) => {
    const product = req.body

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: product.title,
                        },
                        unit_amount: Number(product.price) * 100,
                    },
                    quantity: product.quantity
                }
            ],
            mode: 'payment',
            success_url: process.env.front_url + '?success=true',
            cancel_url: process.env.front_url + '?canceled=true'
        });

        res.json({ id: session.id });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
