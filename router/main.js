var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        'dictionary': dictionary,
        'filters': filters,
        'extrafilters': extrafilters,
    });
});

var extrafilters = [
    {'title': 'Activity', 'tag': 'extradata-activity'},
    {'title': 'Location', 'tag': 'extradata-location'},
    // {'title': 'Song', 'tag': 'extradata-song'},
];

var filters = [
    {'title': 'Categories', 'tag': 'category-filter', 'data': 'categories'},
    {'title': 'Attributes', 'tag': 'attribute-filter', 'data': 'attributes'},
    {'title': 'Concepts', 'tag': 'concept-filter', 'data': 'concepts'},
];

var dictionary = [
    'B', 'C', 'D', 'E',
    'F', 'G', 'H', 'I', 
    'J', 'K', 'L', 'M', 
    'N', 'O', 'P', 'Q', 
    'R', 'S', 'T', 'U', 
    'V', 'W', 'X', 'Y', 
    'Z'
];

module.exports = router;