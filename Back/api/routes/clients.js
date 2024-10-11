const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Client = require('../models/client');

router.get('/', async (req, res) => {
    try {
        const clients = await Client.find()
            .select('_id email tel')
            .exec();
        res.status(200).json(clients);
    } catch (err) {
        handleError(res, err);
    }
});

router.post('/', async (req, res) => {
    try {
        const client = new Client({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            tel: req.body.tel
        });

        const result = await client.save();
        res.status(201).json(result);
    } catch (err) {
        handleError(res, err);
    }
});

// GET a client by ID with populated fournisseurs
router.get('/:clientId', async (req, res) => {
    try {
        // Find the client
        const client = await Client.findById(req.params.clientId)
            .select('_id email tel')
            .exec();

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.status(200).json(client);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:clientId', async (req, res) => {
    try {
        const updatedData = {
            ...req.body,
        };

        const updatedClient = await Client.findByIdAndUpdate(req.params.clientId, { $set: updatedData }, { new: true }).exec();

        if (!updatedClient) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.status(200).json(updatedClient);
    } catch (err) {
        handleError(res, err);
    }
});

router.delete('/:clientId', async (req, res) => {
    try {
        const result = await Client.findByIdAndDelete(req.params.clientId).exec();

        if (!result) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.status(200).json({ message: "Client deleted successfully" });
    } catch (err) {
        handleError(res, err);
    }
});

router.delete('/', async (req, res) => {
    try {
        const result = await Client.deleteMany().exec();
        res.status(200).json({ message: "All clients deleted successfully", result });
    } catch (err) {
        handleError(res, err);
    }
});

module.exports = router;
