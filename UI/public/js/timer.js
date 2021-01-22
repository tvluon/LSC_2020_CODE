
function handleCountdownTimerUI() {
    // Set the date we're counting down to
    var DEFAULT_TIME = 5 * 60;

    var distance = DEFAULT_TIME;

    var pause = true;

    var timer = function () {
        if (pause) {
            return;
        }

        distance--;

        setTimer(distance);

        // If the count down is over, write some text 
        if (distance < 0) {
            $('.timer-holder>i:first').trigger('click');
            $('#countdown-timer').val('0');
        }
    }

    var setTimer = function (distance) {
        // Time calculations for days, hours, minutes and seconds
        var minutes = Math.floor(distance / 60);
        var seconds = Math.floor(distance % 60);

        // Output the result in an element with id="demo"
        $('#countdown-timer').val(minutes + "m " + seconds + "s");
    };

    setTimer(DEFAULT_TIME);

    // Update the count down every 1 second
    setInterval(timer, 1000);

    $('.timer-holder>i:first').click(function () {
        if (pause) {
            $(this).removeClass('fa-play').addClass('fa-pause');
            pause = false;
            return;
        }
        $(this).removeClass('fa-pause').addClass('fa-play');
        pause = true;
    });

    $('.timer-holder>i:last').click(function () {
        pause = true;
        $('.timer-holder>i:first').removeClass('fa-pause').addClass('fa-play');
        distance = DEFAULT_TIME;
        setTimer(distance);
    });

    $('#countdown-timer').focus(function () {
        pause = true;
        $('.timer-holder>i:first').removeClass('fa-pause').addClass('fa-play');
    });

    $('#countdown-timer').keyup(function (e) {
        if (e.which == 13) {
            if (parseInt($(this).val()) != 0) {
                DEFAULT_TIME = parseInt($(this).val())
            }
            distance = DEFAULT_TIME;
            setTimer(distance);
        }
    });
}

export {handleCountdownTimerUI}