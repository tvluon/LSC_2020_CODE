"use strict";

const express = require('express');
const request = require('request-promise');
const redis = require('redis').createClient(6379, '127.0.0.1');
const router = express.Router();
const imagesController = require('../database/controllers/images_controller');

var convert_img_id_to_url = (img_id) => {
  var url = 'http://localhost:3000/';

  var date = img_id[0] == '2' ? img_id.split('_')[0] : img_id.split('_')[2];
  var ext = date.substring(0, 4) == '2018' ? 'JPG' : 'jpg';
  ext = '.' + ext
  var folder = date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6)+ '/'

  url = url + folder + img_id + ext

  return url
}

router.post('/', async (req, res) => {
    console.log('Got query');

    // Parse data
    const data = JSON.parse(req.body);
    const text = data['text'];
    const samples = data['samples'];
    const tags = data['tags'];
    const isnew = data['isnew'];
    console.log(isnew);
    if (isnew) {
        redis.del('query_results');
    }

    console.log(tags);

    // Delegate query to core server
    const query = {}
    const coreUrl = 'http://localhost:5000';
    var resultsFromCore = []
    if (text.length != 0 || samples.length != 0) {
        try {
            var resultsFromTextCore = []
            if (text.length > 0) {
                query['text'] = text;
                resultsFromTextCore = await request.post('http://localhost:8000', {formData: query, json: true});
                samples.push(resultsFromTextCore[0]);

                console.log('result from text core');
                console.log(resultsFromTextCore);
                console.log(convert_img_id_to_url(resultsFromTextCore[0]));
            }

            if (samples.length > 0) {
                query['samples'] = samples;
                resultsFromCore = await request.post(coreUrl, { formData: query, json: true });
            }

            resultsFromCore = [...resultsFromTextCore, ...resultsFromCore]
        }
        catch (err) {
            resultsFromCore = []
            console.log(err);
        }
    }
    // console.log(resultsFromCore);

    // Get all image in cluster
    // resultsFromCore = await imagesController.getAllImagesInClusterOf(resultsFromCore);

    // Add to cache
    redis.get('query_results', async (_, data) => {
        var results = resultsFromCore;

        if (data != null) {
            var oldResults = JSON.parse(data);
            results = Array.from(new Set([...oldResults, ...results]));
        }

        redis.set('query_results', JSON.stringify(results));

        console.log(results);

        // Apply filters (tags)
        var filteredImages = [...results];
        // var filteredImages = await imagesController.getAllImages();

        if (tags['concept'].length > 0) {
            const objectFilteredImages = await imagesController.getAllImagesHaveObjects(tags['concept']);
            filteredImages = filteredImages.filter(id => objectFilteredImages.includes(id));

            console.log('Concepts Filter');
        }

        if (tags['category'].length > 0) {
            const placeFilteredImages = await imagesController.getAllImagesInPlaces(tags['category']);
            filteredImages = filteredImages.filter(id => placeFilteredImages.includes(id));

            console.log('Place Filter');
        }

        if (tags['time'].length > 0) {
            const timeFilterdImages = await imagesController.getAllImagesInTimes(tags['time']);
            filteredImages = filteredImages.filter(id => timeFilterdImages.includes(id));

            console.log('Time Filter');
        }

        // Merge with all dataset filter
        filteredImages.sort((a, b) => imagesController.getDateTimeFromImageId(a) >= imagesController.getDateTimeFromImageId(b) ? 1 : -1);
        res.json(filteredImages);
    });
});

router.get('/', (req, res) => {
    res.send('abc xyz 3');
});

module.exports = router;