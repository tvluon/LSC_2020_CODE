function onApplySuccess(data) {
    var resultsTemplate = Handlebars.compile(`
    {{#each results}}
    <div class="row">
        {{#each this}}
        <div class="col-md-3 result" data-result-id="{{id}}">
            <div class="date">{{weekday}} {{date}} {{time}}</div>
            <img src="./dataset/{{date}}/{{id}}.{{ext}}" alt="result">
        </div>
        {{/each}}
    </div>
    {{/each}}
    `);

    $('.result-holder').html(resultsTemplate({
        'results': stackList(JSON.parse(data)['imageids'].map((value) => {
            var date = parseInt(value[0]) ? value.split('_')[0] : value.split('_')[2];
            var time = parseInt(value[0]) ? value.split('_')[1] : value.split('_')[3];
            var ext = date.substring(0, 4) == '2018' ? 'JPG' : 'jpg';
            var date = date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6);
            var time = time.substring(0, 2) + ':' + time.substring(2, 4) + ':' + time.substring(4, 6);
            return {
                'id': value,
                'date': date,
                'ext': ext,
                'semantic': 'None',
                'time': time,
                'weekday': getWeekday(date)
            }
        }))
    }));

    $('.loader-wrapper').addClass('custom-hidden');

    $('.result-holder>div>div').click(onResultClick);
}

function onQuerySuccess(data) {
    var resultsTemplate = Handlebars.compile(`
    {{#each results}}
    <div class="row">
        {{#each this}}
        <div class="col-md-3 result" data-result-id="{{id}}">
            <div class="date">{{weekday}} {{date}} {{time}}</div>
            <img src="./dataset/{{date}}/{{id}}.{{ext}}" alt="result">
        </div>
        {{/each}}
    </div>
    {{/each}}
    `);

    console.log(JSON.parse(data)['filters'])
    var filters = JSON.parse(data)['filters'];

    filters.forEach(function (id) {
        if (id.includes('text-location')) {
            $('#text-value-holder').append(`
            <div class="bg-light border mb-1 px-2 d-flex justify-content-between align-items-center" data-tag-id="${id}">
                <span>${id.replace('text-location-', '').split('-').join(' ')}</span>
                <i class="fa fa-times" aria-hidden="true"></i>
            </div>
            `);
        }
        else if (id.includes('start-time')) {
            $('#start-time-picker>input').val(id.replace('start-time-', ''));
            $('#start-time-picker>input').trigger('change');
        }
        else if (id.includes('end-time')) {
            $('#end-time-picker>input').val(id.replace('end-time-', ''));
            $('#end-time-picker>input').trigger('change');
        }
        else if (id.includes('date')) {
            var value = id.replace('date-', '');
            var tagEl = `
            <span class="bg-light border tag-item" id="date-${value}" data-tag-id="date-${value}">${value}
                <i class="fa fa-times"></i>
            </span>
            `;
            $('#tag-holder').append(tagEl);
            $('#tag-holder span:last').click(function () {
                $(this).remove();
            })
        } else {
            $(`#${id.split('/').join('-')}`).trigger('click');
        }
    });

    $('.result-holder').html(resultsTemplate({
        'results': stackList(JSON.parse(data)['imageids'].map((value) => {
            var date = parseInt(value[0]) ? value.split('_')[0] : value.split('_')[2];
            var time = parseInt(value[0]) ? value.split('_')[1] : value.split('_')[3];
            var ext = date.substring(0, 4) == '2018' ? 'JPG' : 'jpg';
            var date = date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6);
            var time = time.substring(0, 2) + ':' + time.substring(2, 4) + ':' + time.substring(4, 6);
            return {
                'id': value,
                'date': date,
                'ext': ext,
                'semantic': 'None',
                'time': time,
                'weekday': getWeekday(date)
            }
        }))
    }));

    $('.loader-wrapper').addClass('custom-hidden');

    $('.result-holder>div>div').click(onResultClick);
    $('#text-value-holder>div').click(function () {
        $(this).remove();
    });
};

var onResultClick = function () {
    $('#result-detail-modal').modal('show');
    $('#result-detail-modal').addClass('d-flex');

    $('#result-detail-holder>div:first').html(
        `<img class="w-100 h-100"
                            src="${$(this).children('img').attr('src')}" alt="result"></img>`
    );

    var resultId = $(this).data('result-id');

    $('#result-detail-holder>div:first').data('result-id', resultId);

    $.post("http://localhost:5000/cluster", { 'id': resultId })
        .done(function (data) {
            var resultsTemplate = Handlebars.compile(`
                {{#each results}}
                <div class="col-md-2 px-2" data-result-id="{{id}}">
                    <img class="w-100 h-100"
                        src="./dataset/{{date}}/{{id}}.{{ext}}" alt="result">
                </div>
                {{/each}}
            `);

            $('#cluster-holder').html(resultsTemplate({
                'results': JSON.parse(data).map((value) => {
                    var date = parseInt(value[0]) ? value.split('_')[0] : value.split('_')[2];
                    var ext = date.substring(0, 4) == '2018' ? 'JPG' : 'jpg';
                    var date = date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6);
                    return {
                        'id': value,
                        'date': date,
                        'ext': ext,
                    }
                })
            }));

            $('#cluster-holder>div').click(function () {
                // console.log($(this).data('result-id'));
                var resultId = $(this).data('result-id');
                var newResultId = $('#result-detail-holder>div:first').data('result-id');
                var newSrc = $('#result-detail-holder>div:first>img').attr('src');

                $('#result-detail-holder>div:first').html(
                    `<img class="w-100 h-100"
                                        src="${$(this).children('img').attr('src')}" alt="result"></img>`
                );
                $('#result-detail-holder>div:first').data('result-id', resultId);

                $(this).data('result-id', newResultId);
                $(this).children('img').attr('src', newSrc);
                // console.log($(this).data('result-id'));
            });
        })
        .fail((xhr, status, error) => {
            alert('Load cluster failed!\n');
            $('#cluster-holder').html('');
            console.log(JSON.stringify(xhr));
            console.log(status);
            console.log(error);
        });

    $.post("http://localhost:5000/detail", { 'id': resultId })
        .done(function (data) {
            // data = ['abc', 'def'];
            $('#result-detail-holder>div:last').html('');
            $('#result-detail-holder>div:last').append(`
                <div class="w-75 text-left font-weight-bold"> Details: </div>
            `);
            JSON.parse(data).forEach(function(detail) {
                $('#result-detail-holder>div:last').append(`
                    <div class="w-75 text-left">${detail}</div>
                `);
            });
        })
        .fail((xhr, status, error) => {
            alert('Load image detail failed!\n');
            $('#cluster-holder').html('');
            console.log(JSON.stringify(xhr));
            console.log(status);
            console.log(error);
        });
}

var stackList = function (lst, num = 4) {
    var ans = [];
    var i = 0;
    var chdLst = [];
    lst.forEach((el) => {
        i += 1;
        chdLst.push(el);
        if (i == num) {
            ans.push(chdLst);
            chdLst = [];
            i = 0;
        }
    });

    if (i != 0) {
        ans.push(chdLst);
    }

    return ans;
}

var getWeekday = function (date) {
    switch (new Date(date).getDay()) {
        case 0:
            return "Sun";
        case 1:
            return "Mon";
        case 2:
            return "Tue";
        case 3:
            return "Wed";
        case 4:
            return "Thu";
        case 5:
            return "Fri";
        default:
            return "Sat";
    }
}



export { onQuerySuccess, onApplySuccess }