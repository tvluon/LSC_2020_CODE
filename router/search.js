var express = require('express')
var fs = require('fs')
var router = express.Router()

router.post('/', async (req, res)  =>  {
    var data = fs.readFileSync(__dirname + '/../mock_results/results.txt', 'utf-8');
    res.json(JSON.stringify(data.split('\n')));
});

router.get('/annotation', (req, res) => {
    var filenames = readFilenamesInDir(__dirname + '/../mock_results/annotation');
    var list_filenames = []
    filenames.forEach(filename => {
        var data = fs.readFileSync(__dirname + '/../mock_results/annotation/' + filename, 'utf-8');
        list_filenames.push({
            'dir': filename.split('.')[0],
            'filenames': data.split('\n').sort(),
        });
    });
    res.json(JSON.stringify(list_filenames));
});

var readFilenamesInDir = function (dir) {
    var filenames = fs.readdirSync(dir);
    return filenames;
}

module.exports = router;