"use strict";

const express = require('express');
const router = express.Router();
const imagesController = require('../database/controllers/images_controller');


router.post('/', async (req, res) => {
    res.send('abc xyz post data');
});

router.get('/', async (req, res) => {
    const imgId = req.query.imgId;
    // const clusterId = req.query.clusterid

    // console.log(imgId);
    const clusters = await imagesController.getAllImagesInCluster(imgId);
    // console.log(clusters)
    res.json(clusters);
});

const FAKE_CLUSTER = [
    'b00000005_21i6bq_20150306_045805e',
    'b00000007_21i6bq_20150306_050000e',
    'b00000012_21i6bq_20150306_050520e',
    'b00000016_21i6bq_20150306_050750e',
    'b00000008_21i6bq_20150306_050032e',
    'b00000005_21i6bq_20150306_045805e',
    'b00000007_21i6bq_20150306_050000e',
    'b00000012_21i6bq_20150306_050520e',
    'b00000016_21i6bq_20150306_050750e',
    'b00000008_21i6bq_20150306_050032e',
    'b00000005_21i6bq_20150306_045805e',
    'b00000007_21i6bq_20150306_050000e',
    'b00000016_21i6bq_20150306_050750e',
    'b00000008_21i6bq_20150306_050032e',
    'b00000005_21i6bq_20150306_045805e',
    'b00000007_21i6bq_20150306_050000e',
    'b00000012_21i6bq_20150306_050520e',
    'b00000016_21i6bq_20150306_050750e',
    'b00000008_21i6bq_20150306_050032e',
    'b00000005_21i6bq_20150306_045805e',
    'b00000007_21i6bq_20150306_050000e',
    'b00000012_21i6bq_20150306_050520e',
]

module.exports = router;