const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/products');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const upload = multer({ storage });





router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
            .select('_id image title description price')
            .exec();
        res.status(200).json(products);
    } catch (err) {
        handleError(res, err);
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            image: req?.file?.path || req.body.image,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price
        });

        const result = await product.save();
        res.status(201).json(result);
    } catch (err) {
        handleError(res, err);
    }
});

// GET a product by ID with populated fournisseurs
router.get('/:productId', async (req, res) => {
    try {
        // Find the product
        const product = await Product.findById(req.params.productId)
            .select('_id image title description price')
            .exec();

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:productId', upload.single('image'), async (req, res) => {
    try {
        const updatedData = {
            ...req.body,
            image: req?.file?.path || req.body.image
        };

        const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, { $set: updatedData }, { new: true }).exec();

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        handleError(res, err);
    }
});

router.delete('/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId).exec();

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const imagePath = product.image;
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await Product.findByIdAndDelete(req.params.productId).exec();

        res.status(200).json({ message: "Product and image deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/', async (req, res) => {
    try {
        const result = await Product.deleteMany().exec();
        res.status(200).json({ message: "All products deleted successfully", result });
    } catch (err) {
        handleError(res, err);
    }
});

module.exports = router;
