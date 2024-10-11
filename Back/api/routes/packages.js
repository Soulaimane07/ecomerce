const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Package = require('../models/package');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/packages');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const upload = multer({ storage });





router.get('/', async (req, res) => {
    try {
        const packages = await Package.find()
            .select('_id image title description price products')
            .populate('products')
            .exec();
        res.status(200).json(packages);
    } catch (err) {
        handleError(res, err);
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const package = new Package({
            _id: new mongoose.Types.ObjectId(),
            image: req?.file?.path || req.body.image,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            products: req.body.products
        });

        const result = await package.save();
        res.status(201).json(result);
    } catch (err) {
        handleError(res, err);
    }
});

// GET a package by ID with populated fournisseurs
router.get('/:packageId', async (req, res) => {
    try {
        // Find the package
        const package = await Package.findById(req.params.packageId)
            .select('_id image title description price products')
            .populate('products')
            .exec();

        if (!package) {
            return res.status(404).json({ message: "Package not found" });
        }

        res.status(200).json(package);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:packageId', upload.single('image'), async (req, res) => {
    try {
        const updatedData = {
            ...req.body,
            image: req?.file?.path || req.body.image
        };

        const updatedPackage = await Package.findByIdAndUpdate(req.params.packageId, { $set: updatedData }, { new: true }).exec();

        if (!updatedPackage) {
            return res.status(404).json({ message: "Package not found" });
        }

        res.status(200).json(updatedPackage);
    } catch (err) {
        handleError(res, err);
    }
});

router.delete('/:packageId', async (req, res) => {
    try {
        const package = await Package.findById(req.params.packageId).exec();

        if (!package) {
            return res.status(404).json({ message: "Package not found" });
        }

        const imagePath = package.image;
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await Package.findByIdAndDelete(req.params.packageId).exec();

        res.status(200).json({ message: "Package and image deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/', async (req, res) => {
    try {
        const result = await Package.deleteMany().exec();
        res.status(200).json({ message: "All packages deleted successfully", result });
    } catch (err) {
        handleError(res, err);
    }
});

module.exports = router;
