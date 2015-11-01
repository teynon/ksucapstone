$(window).load(function () {
    var tutorial = new com.eynon.tutorialEy({ lockPosition: false });
    var section = tutorial.addSection("Time Range", []);
    section.addStep(new com.eynon.tutorialStep($("#timerange"), "Open Date Time Menu", "Click the clock icon to open the date time editor.", {
        eventListeners: {
            target: $("#timerange"),
            action: "click"
        },
        onStep: function () {
            com.capstone.UI.closeOpenMenus();
            com.capstone.UI.hideMenuForUIButton($("#timerange"), "timespan");
        }
    }));

    section.addStep(new com.eynon.tutorialStep($("#datestart"), "Modify the From Date & Time", "Click on the input to change the date and time.", {
        eventListeners: {
            target: $("#datestart"),
            action: "change"
        },
        onStep: function () {
            com.capstone.UI.closeOpenMenus();
            com.capstone.UI.showMenuForUIButton($("#timerange"), "timespan");
        }
    }));

    section.addStep(new com.eynon.tutorialStep($("#dateend"), "Modify the To Date & Time", "Click on the input to change the date and time.", {
        eventListeners: {
            target: $("#dateend"),
            action: "change"
        },
        onStep: function () {
            com.capstone.UI.closeOpenMenus();
            com.capstone.UI.showMenuForUIButton($("#timerange"), "timespan");
        }
    }));

    section.addStep(new com.eynon.tutorialStep($("#timerange"), "Close Date Time Menu", "Click the clock icon again to close the menu.", {
        eventListeners: {
            target: $("#timerange"),
            action: "click"
        },
        onStep: function () {
            com.capstone.UI.closeOpenMenus();
            com.capstone.UI.showMenuForUIButton($("#timerange"), "timespan");
        }

    }));
    var section = tutorial.addSection("Filter: Pickups & Dropoffs", []);

    section.addStep(new com.eynon.tutorialStep($("#selectmode"), "Open Pickup / Dropoff Menu", "Click the circle / square icon to open the pickup / dropoff menu.", {
        eventListeners: {
            target: $("#selectmode"),
            action: "click"
        },
        onStep: function () {
            com.capstone.UI.closeOpenMenus();
        }
    }));

    section.addStep(new com.eynon.tutorialStep($("#filterSelection"), "Change the Selection Type", "Select the desired selection type from the dropdown menu.", {
        eventListeners: {
            target: $("#filterSelection"),
            action: "change"
        },
        onStep: function () {
            com.capstone.UI.closeOpenMenus();
            com.capstone.UI.showMenuForUIButton($("#selectmode"), "typeselect");
        }
    }));
    tutorial.play();

    $("#btnHelp").on("click", function () { tutorial.play(); });
});