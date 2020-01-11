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

var addResultsTrigger = function(results) {
    var deletedResultHolder = $(".deleted-result-holder");
    // var clicked = Array.from(results.map((_) => false));

    // addMouseTriggerOnResult(results);

    // addMouseTriggerOnActionButton($(".result-holder .action-button"))

    // $(".result-holder .action-button").click(function () {
    //     result = $(this).parent();

    //     result_id = result.data("result-id");

    //     if (!clicked[result_id]) {
    //         clicked[result_id] = true;

    //         result.children("img").animate({
    //             width: "90%",
    //             padding: "+=10px",
    //         }, 500);
    //     }
    //     else {
    //         clicked[result_id] = false;

    //         result.children("img").animate({
    //             width: "100%",
    //             padding: "-=10px",
    //         }, 500);
    //     }
    // });

    results.click(function() {
        $(".deleted-result-holder").append($(this).clone());
        $(this).remove();
        console.log($(".deleted-result-holder>div:last"));
        addDeleteResultsTrigger($(".deleted-result-holder>div:last"));
    });
};

var addDeleteResultsTrigger = function(deletedResults) { 
    deletedResults.click(function() {
        $(".result-holder:first").append($(this).clone());
        $(this).remove();
        addResultsTrigger($(".result-holder:first>div:last"));
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
};

var handleTagTrigger = function () {
    // Remove tags
    var tagElRmBtns = $('.tag span i');

    var removeTagFunc = function () {
        var tag = $(this).parent().text();
        $(this).parent().remove();
        
        console.log(tag);
        masterTagHolder = $('.container-fluid>.tag');
        masterTagHolder.children('span').each(function () {
            console.log(`current tag ${$(this).text()}`);
            if ($(this).text() == tag) {
                $(this).remove();
            }
        });
    }

    var removeMasterTagFunc = function() {
        var tag = $(this).parent().text();
        $(this).parent().remove();
        
        console.log(tag);
        tagHolder = $('.filter-holder .dropdown-menu .tag');
        tagHolder.children('span').each(function () {
            if ($(this).text() == tag) {
                $(this).remove();
            }
        });  
    }

    tagElRmBtns.click(removeTagFunc);

    //Add tag
    var allTags = $('.filter-holder .all-data span');

    allTags.click(function () {
        var tag = $(this).text();
        var dropdownMenu = $(this).closest('.dropdown-menu');
        var tagHolder = dropdownMenu.children('.tag');
        var masterTagHolder = $('.container-fluid>.tag');
        
        var selectedTags = tagHolder.children('span').map(function () {
            return $(this).text();
        }).toArray();

        var isSelected = selectedTags.filter((v) => v.includes(tag)).length > 0;
        if (isSelected) {
            return;
        }

        var tagEl = `
        <span class="bg-light border tag-item">${tag}
            <i class="fa fa-times"></i>
        </span>
        `;

        tagHolder.append(tagEl);
        masterTagHolder.append(tagEl);

        tagHolder.find('span:last i').click(removeTagFunc);
        masterTagHolder.find('span:last i').click(removeMasterTagFunc);
    });
};

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

    cateTemplate = Handlebars.compile(`{{>createDataEl}}`);
    actiTemplate = Handlebars.compile(`{{>createExtraDataEl}}`);

    $('.category-filter .all-data').html(cateTemplate({ 'data': categories }));
    $('.attribute-filter .all-data').html(cateTemplate({ 'data': attributes }));
    $('.concept-filter .all-data').html(cateTemplate({ 'data': concepts }));
    $('.extradata-activity .dropdown-content div').html(actiTemplate({ 'data': activities }));
    $('.extradata-location .dropdown-content div').html(actiTemplate({ 'data': locations }));
    $('.extradata-song .dropdown-content div').html(actiTemplate({ 'data': songs }));
};

var sendQuery = function(query) {
    var onSuccess = function(data) {
        resultsTemplate = Handlebars.compile(`
        {{#each results}}
        <div class="col-md-2 result" data-result-id="{{this}}">
            <div class="action-button"></div>
            <img src="./mock_dataset/{{this}}" alt="result">
        </div>
        {{/each}}
        `);

        $('.result-holder:first').html(resultsTemplate({'results': JSON.parse(data)}));

        addResultsTrigger($(".result-holder:first>div"));
    };

    $.ajax({
        type: "POST",
        url: "/search",
        data: "",
        success: onSuccess,
    });
};

$(document).ready(async function () {
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

    $('header .search-bar i:last').click(function () {
        var query = $('header .search-bar input').val();
        sendQuery(query);
    });
});