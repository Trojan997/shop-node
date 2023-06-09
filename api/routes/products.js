const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map( doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http:localhost:3000/products/' + doc._id
                        }
                    }

                })
            }
            
            // console.log(docs);
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.send(500).json({error: err});
        });

});

router.post('/', (req, res, next) => {
    
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Created Product Successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http:localhost:3000/products/' + result._id
                }
            }
    
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

    
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: 'http:localhost:3000/products'

                }
            });
        
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'No Valid Entry found for provided ID'});
        })
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                product: result,
                message: "Product Updated Successfully",
                request: {
                    type: 'GET',
                    url: 'http:localhost:3000/products/' + id
                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });

});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findOneAndRemove({ _id: id })
        .exec()
        .then(result => {
            console.log(res);
            res.status(200).json({
                message: "Product Deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: { name: 'String', price: 'Number' }
                }
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: err});
        })

});

module.exports = router;