"use strict";

const express = require('express');
const redis = require('redis').createClient(6379, '127.0.0.1');
const router = express.Router();
const request = require('request-promise');
const activitiesController = require('../database/controllers/activities_controller');
const imagesController = require('../database/controllers/images_controller');

router.get('/', async (req, res) => {
    var type = req.query.type;
    // redis.get('query_results',  (_, data) => {
    //     if (data == null || data == '') {
    //         res.json('No data to process');
    //         return;
    //     }
    //     var results = JSON.parse(data);
    //     console.log(results)
    if (type == 'chart') {
        // res.json('Exported chart');
        const actionName = req.query.actionname;
        const actionPlace = req.query.actionplace;

        const listCandidates = await activitiesController.getCandidatesOfAction(actionName, actionPlace);

        res.json(listCandidates);
    }
    else {
        const clusterIds = req.query.clusterids.split(',');
        // redis.get('query_results', async (_, data) => {
        //     if (data == null || data == '') {
        //         res.json('No data to process');
        //         return;
        //     }
        //     var results = JSON.parse(data);
        // console.log(results)
        const listImages = await imagesController.getAllImagesAndCaptionsOfClusters(clusterIds);
        // const listActivities = await imagesController.getAllActivitiesOfClusters(clusterIds);
        const query = {};
        query['images'] = JSON.stringify(listImages);
        // query['activites'] = JSON.stringify(listActivities);
        const videoUrl = 'http://localhost:7000';
        if (listImages.length > 0) {
            try {
                var resultsFromVideoServer = await request.post(videoUrl, { formData: query, json: true });
            }
            catch (err) {
                // resultsFromCore = []
                console.log(err);
            }
        }

        res.json('Exported video');
        // });
    }
});

module.exports = router;