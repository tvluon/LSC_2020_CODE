"use strict";

const express = require('express');
const router = express.Router();
const imagesController = require('../database/controllers/images_controller');

router.post('/', async (req, res) => {
    res.send('abc xyz post data');
});

router.get('/', async (req, res) => {
    const imgId = req.query.imgId;

    // console.log(imgId);
    const data = await imagesController.getData(imgId);

    res.json(data);
});

const FAKE_DATA = {
    category: 'home',
    activity: 'sleeping',
    time: '20-03-2018',
    concepts: [
        'cup',
        'television',
        'laptop',
        'mouse',
    ] 
}

module.exports = router;