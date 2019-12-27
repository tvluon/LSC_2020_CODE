var addMouseTriggerOnResult = function (result) {
    result.mouseenter(function () {
        $(this).children(".action-button").css("display", "block");
    }).mouseleave(function () {
        $(this).children(".action-button").css("display", "none");
    });
}

var addMouseTriggerOnActionButton = function (actionButton) {
    actionButton.mouseenter(function () {
        $(this).css("background-color", "#f7f7f7")
    }).mouseleave(function () {
        $(this).css("background-color", "rgba(247, 247, 247, 0.5)")
    });

}

$(document).ready(function () {
    var results = $(".result div");
    var clicked = Array.from(results.map((_) => false));

    addMouseTriggerOnResult(results);

    addMouseTriggerOnActionButton($(".result .action-button"))

    $(".result .action-button").click(function () {
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
});