var express = require('express')
var fs = require('fs')
var router = express.Router()

router.get('/activities', (req, res) => {
    res.json(JSON.stringify(activities));
});

router.get('/locations', (req, res) => {
    res.json(JSON.stringify(locations));
});

router.get('/songs', (req, res) => {
    res.json(JSON.stringify(songs));
});

router.get('/concepts', (req, res) => {
    res.json(JSON.stringify(concepts));
});

router.get('/attributes', (req, res) => {
    res.json(JSON.stringify(attributes));
});

router.get('/categories', (req, res) => {
    var data = fs.readFileSync(__dirname + '/categories.txt', 'utf-8');
    var categories = data.split('\n').map(function(value){
        return value.split(' ')[0].substring(3);
    });
    res.json(JSON.stringify(categories));
});

var timezones = ['Local Time', 'UTC Time'];

var timebases = ['Any', 'Asia - Shanghai', 'Europe - Berlin', 'Europe - Dublin', 'Europe - Istanbul', 'Europe - London'];

var activities = [
    'Play football',
    'Play video game',
    'Listen to music',
    'Sing a song',
    'Running',
    'Walking',
    'Reading book',
    'Drink coffee',
    'Talking',
    'Sleeping',
    'Go to sleep',
    'Driving car'
];

var locations = [
    'School',
    'House',
    'Office',
    'Outdoor',
    'Indoor',
    'Restauran',
    'Stadium',
    'Toy store',
    'Coffee shop',
    'Beach'
];

var songs = [
    'Thinkin Bout You',
    'Get Well Soon',
    'Downhill Lullaby',
    'Flyin',
    'What’s the Move',
    'Seventeen',
    'The Greatest',
    'Bags'
];

var attributes = [
    'A attribute 1',
    'A attribute 2',
    'A attribute 3',
    'A attribute 4',
    'A attribute 5',
    'A attribute 6',
    'A attribute 7',
    'A attribute 8',
    'A attribute 9',
    'A attribute 10',
    'A attribute 11',
    'A attribute 12',
    'A attribute 13',
    'A attribute 14',
    'A attribute 15',
    'B attribute 11',
    'B attribute 12',
    'B attribute 13',
    'C attribute 11',
    'C attribute 12',
    'C attribute 13',
    'C attribute 14',
    'C attribute 15',
    'C attribute 16'
];

var concepts = [
    'A concept 1',
    'A concept 2',
    'A concept 3',
    'A concept 4',
    'A concept 5',
    'A concept 6',
    'A concept 7',
    'A concept 8',
    'A concept 9',
    'A concept 10',
    'A concept 11',
    'A concept 12',
    'A concept 13',
    'A concept 14',
    'A concept 15',
    'B concept 11',
    'B concept 12',
    'B concept 13',
    'A concept 16',
    'A concept 17',
    'A concept 18',
    'A concept 19',
    'A concept 20',
    'A concept 21'
];

var categories = [
    'A category 1',
    'A category 2',
    'A category 3',
    'A category 4',
    'A category 5',
    'A category 6',
    'A category 7',
    'A category 8',
    'A category 9',
    'A category 10',
    'A category 11',
    'B category 12',
    'B category 13',
    'B category 14',
    'B category 15',
    'B category 11',
    'B category 12',
    'B category 13',
    'B category 11',
    'C category 12',
    'C category 13',
    'C category 14',
    'C category 15',
    'C category 16'
];

module.exports = router;