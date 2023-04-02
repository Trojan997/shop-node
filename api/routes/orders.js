const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');


router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Fetched all orders'
    });
});

router.post('/', (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });
    order.save()
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            error: err;
        });
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    if (id === 'special') {
        res.status(200).json({
            message: 'You discovered the special order id',
            id: id
        });
    } else {
        res.status(200).json({
            message: "You hit the normal order id",
            id:id
        });
    }
});

router.patch('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated Order'
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted Order'
    });
});

module.exports = router;