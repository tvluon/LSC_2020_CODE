"use strict";

const express = require('express');
const router = express.Router();
const activitiesController = require('../database/controllers/activities_controller');
const imagesController = require('../database/controllers/images_controller');
const redis = require('redis').createClient(6379, '127.0.0.1');

router.post('/', async (req, res) => {
    res.send('data posted');
});

router.get('/', async (req, res) => {
    const actionName = req.query.actionname;
    const actionPlace = req.query.actionplace;
    if (actionPlace != null && actionName != null) {
        const clusters = await activitiesController.getClustersOfAction(actionName, actionPlace);
        // console.log('run here hehe');
        const candidates = await imagesController.getCandidatesOfClusters(clusters);
        redis.set('query_results', JSON.stringify(candidates));
        res.json(clusters);
    }
    else {
        const actionTree = await activitiesController.getActionTree();
        res.json(actionTree);
    }
});

router.get('/update', async (req, res) => {
    const actionName = req.query.actionname;
    const actionPlace = req.query.actionplace;
    const imageIds = req.query.imageids.split(',');
    // const clusterIds = cl
    console.log(actionName);
    console.log(actionPlace);
    console.log(imageIds);

    await activitiesController.updateActionTree(actionPlace, actionName, imageIds);

    // if (actionPlace != null && actionName != null) {
    //     const clusters = await activitiesController.getClustersOfAction(actionName, actionPlace);
    //     // console.log('run here hehe');
    //     const candidates = await imagesController.getCandidatesOfClusters(clusters);
    //     redis.set('query_results', JSON.stringify(candidates));
    //     res.json(clusters);
    // }
    // else {
    //     const actionTree = await activitiesController.getActionTree();
    //     res.json(actionTree);
    // }
    res.json([]);
});

module.exports = router;