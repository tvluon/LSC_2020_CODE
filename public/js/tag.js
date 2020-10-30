
var onTagClick = function () {
    var tagId = $(this).attr('id');
    if ($(this).attr('value').includes('/')) {
        tagId = $(this).attr('value');
    }
    var tagName = $(this).data('tag-name');
    if (this.checked) {
        console.log(tagId);

        var tagEl = `
        <span class="bg-light border tag-item" data-tag-id="${tagId}">${tagId.substring(0,3) + ':' + tagName}
            <i class="fa fa-times"></i>
        </span>
        `;

        $('#tag-holder').append(tagEl);

        var tagItem = this;

        $('#tag-holder span:last').click(function () {
            $(this).remove();
            tagItem.checked = false;
        });
    }
    else {
        $('#tag-holder span').each(function () {
            if ($(this).data('tag-id') == tagId) {
                $(this).remove();
            }
        });
    }
}

var onDateTagChange = function () {
    var dateValue = $(this).val();
    var tagId = $(this).data('tag-id');
    // console.log(dateValue);
    if (dateValue == '') {
        $(this).val('');
        $(`#tag-holder #${tagId}`).remove();
    }
    else {
        var tagEl = `
        <span class="bg-light border tag-item" id="${tagId}" data-tag-id="${tagId+'-'+dateValue}">${tagId}: ${dateValue}
            <i class="fa fa-times"></i>
        </span>
        `;

        $(`#tag-holder #${tagId}`).remove();

        $('#tag-holder').append(tagEl);

        var tagItem = this;

        $('#tag-holder span:last').click(function () {
            $(this).remove();
            $(tagItem).val('');
        });
    }
}

var onTimeTagChange = function () {
    var timeValue = $(this).val();
    var tagId = $(this).data('tag-id');
    // console.log(dateValue);
    if (timeValue == '') {
        $(this).val('');
        $(`#tag-holder #${tagId}`).remove();
    }
    else {
        var tagEl = `
        <span class="bg-light border tag-item" id="${tagId}" data-tag-id="${tagId+'-'+timeValue}">${tagId}: ${timeValue}
            <i class="fa fa-times"></i>
        </span>
        `;

        $(`#tag-holder #${tagId}`).remove();

        $('#tag-holder').append(tagEl);

        var tagItem = this;

        $('#tag-holder span:last').click(function () {
            $(this).remove();
            $(tagItem).val('');
        });
    }
}

var onDateSelectTagChange = function () {
    var value = $(this).val();
    var tagId = $(this).data('tag-id');
    var text = $(this).children('option:selected').text();
    console.log(value);
    if (value == 'any') {
        // $(this).val('any');
        $(`#tag-holder #${tagId}`).remove();
    }
    else {
        var tagEl = `
        <span class="bg-light border tag-item" id="${tagId}" data-tag-id="${tagId+'-'+value}">${tagId}: ${text}
            <i class="fa fa-times"></i>
        </span>
        `;

        $(`#tag-holder #${tagId}`).remove();

        $('#tag-holder').append(tagEl);

        var tagItem = this;

        $('#tag-holder span:last').click(function () {
            $(this).remove();
            $(tagItem).val('any');
        });
    }
}

function handleTagTrigger() {
    var allTags = $('.value-holder>div>input[type="checkbox"]');

    var allTimeTags = $('.checkbox-time-filter-value-holder>div>input[type="checkbox"]');

    allTags.click(onTagClick);
    allTimeTags.click(onTagClick);

    var dateTag = $('.date-picker>input[type="date"]');
    dateTag.change(onDateTagChange);

    var timeTag = $('.time-picker>input[type="time"]');
    timeTag.change(onTimeTagChange);

    var dateSelectTag = $('.date-select-picker>select');
    dateSelectTag.change(onDateSelectTagChange);
    // $('#object-value-holder>div:first>input[type="checkbox"]').trigger('click');
};

export { handleTagTrigger }