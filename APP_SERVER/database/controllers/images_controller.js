const db = require('../models');
// const { and } = require('sequelize/types');
const images = db.Images;
const clusters = db.Clusters;
const activities = db.Activities;

const getTimeFromImgId = (imgId) => {
    if (imgId[0] == '2') {
        var date = imgId.substring(0, 4) + '-' + imgId.substring(4, 6) + '-' + imgId.substring(6, 8);
        var time = imgId.substring(9, 11) + ':' + imgId.substring(11, 13) + ':' + imgId.substring(13, 15);
        return date + ' ' + time;
    }
    var date = imgId.substring(17, 21) + '-' + imgId.substring(21, 23) + '-' + imgId.substring(23, 25);
    var time = imgId.substring(26, 28) + ':' + imgId.substring(28, 30) + ':' + imgId.substring(30, 32);
    return date + ' ' + time;
}

const getWeekdayFromId = (imgId) => {
    const date = getTimeFromImgId(imgId).split(' ')[0];
    const weekday = new Date(date).getDay();
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][weekday];
}

exports.getDateTimeFromImageId = getTimeFromImgId;

exports.getAllImagesInCluster = async (imageId) => {
    const data = await images.findOne({ where: { 'imageId': imageId } });
    if (data == null) {
        return [];
    }

    image = data;
    const clusterData = await images.findAll({ where: { 'clusterId': image['clusterId'] }, attributes: ['imageId'] });
    clusterImages = JSON.parse(JSON.stringify(clusterData));

    const ans = clusterImages.map(value => value['imageId']);

    ans.sort((a, b) => getTimeFromImgId(a) >= getTimeFromImgId(b) ? 1 : -1);
    return ans;
}

exports.getData = async (imageId) => {
    const data = await images.findOne({ where: { 'imageId': imageId } });
    if (data == null) {
        return {
            'Time': getTimeFromImgId(imageId),
        };
    }

    const image = data;
    // console.log(JSON.parse(JSON.stringify(image)));
    // const clusterData = await images.findAll({where: {'clusterId': image['clusterId']}, attributes: ['imageId']});

    const imageData = {
        'Time': getTimeFromImgId(imageId),
        'Caption': image['caption'],
        'Objects': image['objects'].split(',').slice(0, 5),
    }

    const clusterPlace = await clusters.findOne({ where: { 'clusterId': image['clusterId'] }, attributes: ['clusterPlace'] });

    if (clusterPlace != null) {
        imageData['Place'] = clusterPlace['clusterPlace'].split('_').join(' ');
    }

    return imageData;
}

exports.getAllImagesHaveObjects = async (listObjects) => {
    const listClusters = await clusters.findAll({ attributes: ['candidate'] });

    const candidates = listClusters.map(value => value['candidate']);

    const listImages = await images.findAll({ attributes: ['imageId', 'objects'], where: { 'imageId': candidates } });
    // const listImages = JSON.parse(JSON.stringify(data));

    filteredImages = listImages.filter(image => image['objects'].split(',').filter(v => listObjects.includes(v)).length >= 1);

    // console.log(filteredImages.slice(0, 10))

    return filteredImages.map(image => image['imageId']);
}

exports.getAllImagesAndCaptionsOfClusters = async (listCandidates) => {
    const listClusters = await clusters.findAll({ attributes: ['clusterId', 'clusterPlace'], where: {'candidate': listCandidates} });

    const clusterIds = listClusters.map(value => value['clusterId']);

    const listImages = await images.findAll({attributes: ['imageId', 'clusterId', 'caption'], where: {'clusterId': clusterIds}});

    listImages.sort((a, b) => getTimeFromImgId(a['imageId']) >= getTimeFromImgId(b['imageId']) ? 1 : -1);

    const listActi = await activities.findAll({ attributes: ['activityName', 'activityPlace', 'clusters'] });

    // listActiClusters = listActi.map((value) => value['clusters'].split(','));

    // console.log(listActiClusters);

    const ans = [];
    listImages.forEach((image) => {
        var place = listClusters.filter(value => value['clusterId'] == image['clusterId']);
        place = place[0]['clusterPlace'].split('_').join(' ');
        var time = getTimeFromImgId(image['imageId'])
        image['caption'] = image['caption'] + ' in ' + place + ' on ' + time.split(' ')[0] + ' at ' + time.split(' ')[1];
        var acti = listActi.filter((value) => value['clusters'].split(',').includes(image['clusterId']));
        acti = acti.map((value) => value['activityName']);
        // acti = acti.length > 0 ? acti[0]['activityName'] : '';
        acti = acti.length > 1 ? acti.reduce((total, value) => total + ',' + value) : acti.length == 1 ? acti[0] : '';
        // image['activity'] = acti;

        ans.push({
            'imageId': image['imageId'],
            'caption': image['caption'],
            'activity': acti,
            'place': place,
            'time': time,
        });
    })

    console.log(ans.slice(0, 2));

    // console.log(listImages.slice(0, 10));

    return ans;
}

exports.getAllActivitiesOfClusters = async (listCandidates) => {
    const listClusters = await clusters.findAll({ attributes: ['clusterId', 'clusterPlace'], where: {'candidate': listCandidates} });

    const clusterIds = listClusters.map(value => value['clusterId']);

    const listActi = await activities.findAll({ attributes: ['activityName', 'activityPlace', 'clusters'] });

    // listActiClusters = listActi.map((value) => value['clusters'].split(','));

    // console.log(listActiClusters);

    // const listImages = await images.findAll({attributes: ['imageId', 'clusterId', 'caption'], where: {'clusterId': clusterIds}});

    // listImages.forEach((image) => {
    //     var place = listClusters.filter(value => value['clusterId'] == image['clusterId']);
    //     place = place[0]['clusterPlace'];
    //     var time = getTimeFromImgId(image['imageId'])
    //     image['caption'] = image['caption'] + ' in ' + place + ' on ' + time.split(' ')[0] + ' at ' + time.split(' ')[1];
    // })

    // console.log(listImages.slice(0, 10));

    return '';
}

exports.getAllCandidates = async () => {
    const listClusters = await clusters.findAll({ attributes: ['candidate'] });

    return listClusters.map(value => value['candidate']);
}

exports.getCandidatesOfClusters = async (clusterIds) => {
    const listClusters = await clusters.findAll({ attributes: ['candidate'], where: {'clusterId': clusterIds}});

    return listClusters.map(value => value['candidate']);
}

exports.getAllImagesInPlaces = async (places) => {
    places = places.map(place => place.split(' ').join('_'));

    const listClusters = await clusters.findAll({ attributes: ['candidate'], where: { 'clusterPlace': places } });

    // const clusterIds = listClusters.map(value => value['clusterId']);

    // const listImages = await images.findAll({ attributes: ['imageId'], where: { 'clusterId': clusterIds } });

    // return listImages.map(image => image['imageId']);
    return listClusters.map(value => value['candidate']);
}

exports.getAllImagesInTimes = async (times) => {
    const timeFilter = {};
    times.forEach(value => {
        timeFilter[value.split(':')[0]] = value.replace(value.split(':')[0] + ':', '');
    });
    // timeFilter['Start time'] = timeFilter['Start time'].split(':').map(x => x.length == 1 ? '0' + x : x).join(':');
    // timeFilter['Start date'] = timeFilter['Start date'].split('-').map(x => x.length == 1 ? '0' + x : x).join('-');
    // timeFilter['End time'] = timeFilter['End time'].split(':').map(x => x.length == 1 ? '0' + x : x).join(':');
    // timeFilter['End date'] = timeFilter['End date'].split('-').map(x => x.length == 1 ? '0' + x : x).join('-');
    // console.log(timeFilter);

    const listClusters = await clusters.findAll({ attributes: ['candidate'] });

    const candidates =  listClusters.map(value => value['candidate']);

    var filteredImages = candidates;

    if (timeFilter['Start date'] != null) {
        filteredImages = filteredImages.filter(id => getTimeFromImgId(id).split(' ')[0] >= timeFilter['Start date']);
    }

    if (timeFilter['End date'] != null) {
        filteredImages = filteredImages.filter(id => getTimeFromImgId(id).split(' ')[0] <= timeFilter['End date']);
    }

    if (timeFilter['Start time'] != null) {
        filteredImages = filteredImages.filter(id => getTimeFromImgId(id).split(' ')[1] >= timeFilter['Start time']);
    }

    if (timeFilter['End time'] != null) {
        filteredImages = filteredImages.filter(id => getTimeFromImgId(id).split(' ')[1] <= timeFilter['End time']);
    }

    if (timeFilter['Weekday'] != null) {
        filteredImages = filteredImages.filter(id => getWeekdayFromId(id) == timeFilter['Weekday']);
    }

    return filteredImages;
}

// exports.getActionTree = async () => {
//     const data = await activities.findAll({ attributes: ['activityName', 'activityPlace'] });
//     var rawTree = Array.from(JSON.parse(JSON.stringify(data)));
//     rawTree = rawTree.map(value => {
//         value['activityPlace'] = value['activityPlace'].split('_').join(' ');
//         return value;
//     });
//     const places = new Set(rawTree.map((value) => value['activityPlace']));
//     const actionTree = new Map();
//     places.forEach(place => {
//         actionTree[place] = rawTree.filter(value => value['activityPlace'] == place).map(value => value['activityName']);
//     });
//     return actionTree;
// }