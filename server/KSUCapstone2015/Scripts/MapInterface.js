var com = com || {};
com.capstone = {};
com.capstone.mapStateOpen = true;

$(document).ready(function () {
    $('#btnReport').on("click", function () {
        var width = "100%";
        if (com.capstone.mapStateOpen) {
            width = "50%";
        }
        com.capstone.mapStateOpen = !com.capstone.mapStateOpen;
        console.log(width);
        $('#map').animate({ "width" : width }, 1000);
    });
});