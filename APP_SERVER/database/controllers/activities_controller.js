const db = require('../models');
const activities = db.Activities;
const clusters = db.Clusters;
const images = db.Images;

exports.getClustersOfAction = async (actionName, actionPlace) => {
    const data = await activities.findOne({ where: { 'activityName': actionName, 'activityPlace': actionPlace.split(' ').join('_') }, attributes: ['clusters'] });
    var clusters = data['clusters'].split(',');
    // console.log(clusters);
    return clusters;
}


exports.getCandidatesOfAction = async (actionName, actionPlace) => {
    const data = await activities.findOne({ where: { 'activityName': actionName, 'activityPlace': actionPlace.split(' ').join('_') }, attributes: ['clusters'] });
    var clusterIds = data['clusters'].split(',');

    const listClusters = await clusters.findAll({ attributes: ['candidate'], where: {'clusterId': clusterIds}});

    return listClusters.map(value => value['candidate']);
}

exports.getActionTree = async () => {
    const data = await activities.findAll({ attributes: ['activityName', 'activityPlace'] });
    var rawTree = Array.from(JSON.parse(JSON.stringify(data)));
    rawTree = rawTree.map(value => {
        value['activityPlace'] = value['activityPlace'].split('_').join(' ');
        return value;
    });
    const places = new Set(rawTree.map((value) => value['activityPlace']));
    const actionTree = new Map();
    places.forEach(place => {
        actionTree[place] = rawTree.filter(value => value['activityPlace'] == place).map(value => value['activityName']);
    });
    return actionTree;
}

exports.updateActionTree = async (actionPlace, actionName, imageIds) => {
    var clusterIds = await images.findAll({attributes: ['clusterId'], where: {'imageId': imageIds}});
    clusterIds = clusterIds.map(value => value['clusterId']);

    await activities.upsert({
        'activityPlace': actionPlace.split(' ').join('_'),
        'activityName': actionName,
        'clusters': clusterIds.join(','),
    });

    // const tmp = await activities.findOne({where: {'activityPlace': actionPlace, 'activityName': actionName}});
    // console.log(tmp);
}