var express = require('express')
var fs = require('fs')
var router = express.Router()

router.post('/', async (req, res)  =>  {
    var data = fs.readFileSync(__dirname + '/../mock_results/results.txt', 'utf-8');
    res.json(JSON.stringify(data.split('\n')));
});

module.exports = router;