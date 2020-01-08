var addMouseTriggerOnResult = function (result) {
    result.mouseenter(function () {
        $(this).children(".action-button").css("display", "block");
    }).mouseleave(function () {
        $(this).children(".action-button").css("display", "none");
    });
};

var addMouseTriggerOnActionButton = function (actionButton) {
    actionButton.mouseenter(function () {
        $(this).css("background-color", "#f7f7f7")
    }).mouseleave(function () {
        $(this).css("background-color", "rgba(247, 247, 247, 0.5)")
    });
};

var handleResultTrigger = function () {
    var results = $(".result-holder div");
    var clicked = Array.from(results.map((_) => false));

    addMouseTriggerOnResult(results);

    addMouseTriggerOnActionButton($(".result-holder .action-button"))

    $(".result-holder .action-button").click(function () {
        result = $(this).parent();

        result_id = result.data("result-id");

        if (!clicked[result_id]) {
            clicked[result_id] = true;

            result.children("img").animate({
                width: "90%",
                padding: "+=10px",
            }, 500);
        }
        else {
            clicked[result_id] = false;

            result.children("img").animate({
                width: "100%",
                padding: "-=10px",
            }, 500);
        }
    });
};

var handleDropdownCustomTrigger = function () {
    $(".dropdown-menu").click(function (e) {
        e.stopPropagation();
    });

    $(".dropdown-custom>button").click(function () {
        $(this).parent().children(".dropdown-content").toggleClass("custom-show");
    });
};

var handleFiltersData = function (categories, attributes, concepts, activities, locations, songs) {
    // Sort array
    categories.sort((a, b) => a - b);
    attributes.sort((a, b) => a - b);
    concepts.sort((a, b) => a - b);
    activities.sort((a, b) => a - b);
    locations.sort((a, b) => a - b);
    songs.sort((a, b) => a - b);

    // Query element
    allCategories = $('.category-filter .all-data');
    allAttributes = $('.attribute-filter .all-data');
    allConcepts = $('.concept-filter .all-data');
    dictionary = $('.dictionary');
    categorySeachbar = $('.category-filter .search-bar input');
    attributeSeachbar = $('.attribute-filter .search-bar input');
    conceptSeachbar = $('.concept-filter .search-bar input');
    categoryResult = $('.category-filter .dropdown-content');
    attributeResult = $('.attribute-filter .dropdown-content');
    conceptResult = $('.concept-filter .dropdown-content');
    extradataActivity = $('.extradata-filter .extradata-activity');
    extradataLocation = $('.extradata-filter .extradata-location');
    extradataSong = $('.extradata-filter .extradata-song');

    // Handle event click
    dictionary.children('span').click(function () {
        var parent = $(this).parent();

        parent.children('span').removeClass('custom-selected');
        $(this).addClass('custom-selected');

        al = $(this).text()
        parent.parent().children('.all-data').children('span').each(function () {
            child = $(this);
            text = child.text();
            child.addClass('custom-hidden');
            if (text[0].toLowerCase() == al.toLowerCase()) {
                child.removeClass('custom-hidden');
            }
        });
    });

    categorySeachbar.keyup(function (e) {
        keyword = $(this).val();
        if (keyword.length == 0) {
            categoryResult.removeClass('custom-show');
            return;
        }

        categoryResult.empty();
        let results = categories.filter(category => category.toLowerCase().includes(keyword.toLowerCase()));
        if (results.length > 0) {
            categoryResult.addClass('custom-show');
            results.forEach(result => categoryResult.append(`<a href="#">${result}</a>`));
        }
        else {
            categoryResult.removeClass('custom-show');
        }
    });

    attributeSeachbar.keyup(function (e) {
        keyword = $(this).val();
        if (keyword.length == 0) {
            attributeResult.removeClass('custom-show');
            return;
        }

        attributeResult.empty();
        let results = attributes.filter(attribute => attribute.toLowerCase().includes(keyword.toLowerCase()));
        if (results.length > 0) {
            attributeResult.addClass('custom-show');
            results.forEach(result => attributeResult.append(`<a href="#">${result}</a>`));
        }
        else {
            attributeResult.removeClass('custom-show');
        }
    });

    conceptSeachbar.keyup(function (e) {
        keyword = $(this).val();
        if (keyword.length == 0) {
            conceptResult.removeClass('custom-show');
            return;
        }

        conceptResult.empty();
        let results = concepts.filter(concept => concept.toLowerCase().includes(keyword.toLowerCase()));
        if (results.length > 0) {
            conceptResult.addClass('custom-show');
            results.forEach(result => conceptResult.append(`<a href="#">${result}</a>`));
        }
        else {
            conceptResult.removeClass('custom-show');
        }
    });

    $('.dictionary span:first-child').trigger('click');

    extradataActivity.find('.dropdown-content input').keyup(function (e) {
        let textField = $(this);
        let keyword = textField.val();
        let allActivities = textField.parent().find('a');

        let results = activities.filter(activity => !activity.toLowerCase().includes(keyword.toLowerCase()));
        allActivities.removeClass('custom-hidden');
        if (results.length > 0) {
            allActivities.each(function () {
                let activity = $(this).text();
                if (results.findIndex(result => result == activity) != -1) {
                    $(this).addClass('custom-hidden');
                }
            });
        }
    });

    extradataLocation.find('.dropdown-content input').keyup(function (e) {
        let textField = $(this);
        let keyword = textField.val();
        let allLocations = textField.parent().find('a');

        let results = locations.filter(location => !location.toLowerCase().includes(keyword.toLowerCase()));
        allLocations.removeClass('custom-hidden');
        if (results.length > 0) {
            allLocations.each(function () {
                let location = $(this).text();
                if (results.findIndex(result => result == location) != -1) {
                    $(this).addClass('custom-hidden');
                }
            });
        }
    });

    extradataSong.find('.dropdown-content input').keyup(function (e) {
        let textField = $(this);
        let keyword = textField.val();
        let allSongs = textField.parent().children('a');

        let results = songs.filter(song => !song.toLowerCase().includes(keyword.toLowerCase()));
        allSongs.removeClass('custom-hidden');
        if (results.length > 0) {
            allSongs.each(function () {
                let song = $(this).text();
                if (results.findIndex(result => result == song) != -1) {
                    $(this).addClass('custom-hidden');
                }
            });
        }
    });

    allExtradata = $('.extradata-filter .dropdown-custom .dropdown-content a');
    allExtradata.click(function () {
        data = $(this).text();
        button = $(this).parent().parent().parent().children('button');
        button.text(data);
        $(this).parent().parent().removeClass('custom-show');
    });
}

var handleTagTrigger = function () {
    tagElRmBtns = $('.tag span i');

    tagElRmBtns.click(function () {
        $(this).parent().remove();
    });
}

var renderTemplate = function (categories, attributes, concepts, activities, locations, songs) {
    Handlebars.registerPartial(
        'createDataEl',
        `
        {{#each data}}
        <span class="custom-hidden">{{this}}</span>
        {{/each}}
        `
    );

    Handlebars.registerPartial(
        'createExtraDataEl',
        `
        {{#each data}}
        <a href="#">{{this}}</a>
        {{/each}}
        `
    )

    cateTemplate = Handlebars.compile($('.category-filter .all-data').text());
    actiTemplate = Handlebars.compile($('.extradata-activity .dropdown-content div').text());

    $('.category-filter .all-data').html(cateTemplate({ 'data': categories }));
    $('.attribute-filter .all-data').html(cateTemplate({ 'data': attributes }));
    $('.concept-filter .all-data').html(cateTemplate({ 'data': concepts }));
    $('.extradata-activity .dropdown-content div').html(actiTemplate({'data': activities}));
    $('.extradata-location .dropdown-content div').html(actiTemplate({'data': locations}));
    $('.extradata-song .dropdown-content div').html(actiTemplate({'data': songs}));
}

$(document).ready(async function () {
    handleResultTrigger();

    handleDropdownCustomTrigger();

    var activities = JSON.parse(await $.get("/data/activities"));

    var locations = JSON.parse(await $.get("/data/locations"));

    var songs = JSON.parse(await $.get("/data/songs"));

    var concepts = JSON.parse(await $.get("/data/concepts"));

    var attributes = JSON.parse(await $.get("/data/attributes"));

    var categories = JSON.parse(await $.get("/data/categories"));

    renderTemplate(categories, attributes, concepts, activities, locations, songs)

    handleFiltersData(categories, attributes, concepts, activities, locations, songs);

    handleTagTrigger();
});