$(window).load(function () {

    var tutorial = new com.eynon.tutorialEy({ lockPosition: true });
    var tutorialOriginalOffset = null;
    var settingsDialogOriginalOffset = null;
    var saveDialogOriginalOffset = null;

    // TIME RANGE 
    // ----------------------------------------------------------------------------
    var tutorials = [
        {
            Section: "Querying The Map",
            Contents: [
                {
                    title: "Quick Query",
                    body: "When Quick Query Mode is active, you can click anywhere on the map to perform a quick query. Lets try it. Click somewhere on the map and see what happens.",
                    pointTo: null,
                    advanceOptions: {
                        eventListeners: {
                            target: $("#map"),
                            action: "mapQuery"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                            com.capstone.mapController.setDrawingMode(false);
                        }
                    }
                },
                {
                    title: "Advanced Query Mode",
                    body: "Great. You should now be able to see the results on the map! You can also switch to advanced query mode by clicking the icon in the top left of the screen.",
                    pointTo: $("#quickSelect"),
                    advanceOptions: {
                        eventListeners: {
                            target: $("#quickSelect"),
                            action: "click"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                            com.capstone.mapController.setDrawingMode(false);
                        }
                    }
                },
                {
                    title: "Advanced Query: Rectangle Selection",
                    body: "Click the rectangle icon on the left and draw a query by clicking and dragging on the map.",
                    pointTo: function () { return $(".leaflet-draw-draw-rectangle"); },
                    advanceOptions: {
                        eventListeners: {
                            target: $("#map"),
                            action: "mapQuery"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                            com.capstone.mapController.setDrawingMode(true);
                        }
                    }
                },
                {
                    title: "Advanced Query: Circle Selection",
                    body: "Click the circle icon to select the circle query mode. Next, click and drag on the map to create a new circle query.",
                    pointTo: function () { return $(".leaflet-draw-draw-circle"); },
                    advanceOptions: {
                        eventListeners: {
                            target: $("#map"),
                            action: "mapQuery"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                            com.capstone.mapController.setDrawingMode(true);
                        }
                    }
                },
                {
                    title: "Advanced Query: Polygon Selection",
                    body: "The last query mode is the polygon query mode. To start, click the polygon icon. Then, click a starting point on the map. Continue clicking points until you have the area you want selected. To close the polygon and run the query, click on the first point you added.",
                    pointTo: function () { return $(".leaflet-draw-draw-polygon"); },
                    advanceOptions: {
                        eventListeners: {
                            target: $("#map"),
                            action: "mapQuery"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                            com.capstone.mapController.setDrawingMode(true);
                        }
                    }
                }
            ]
        },
        {
            Section: "Filter: Time Range",
            Contents: [
                {
                    title: "Open Date Time Menu",
                    body: "Click the clock icon to open the date time editor.",
                    pointTo: $("#timerange"),
                    advanceOptions: {
                        eventListeners: {
                            target: $("#timerange"),
                            action: "click"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                            com.capstone.UI.hideMenuForUIButton($("#timerange"), "timespan");
                        }
                    }
                },
                {
                    title: "Modify the From Date & Time",
                    body: "Click on the input to change the date and time.",
                    pointTo: $("#datestart"),
                    advanceOptions: {
                        eventListeners: {
                            target: $("#datestart"),
                            action: "change"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                            com.capstone.UI.showMenuForUIButton($("#timerange"), "timespan");
                        }
                    }
                },
                {
                    title: "Modify the To Date & Time",
                    body: "Click on the input to change the date and time.",
                    pointTo: $("#dateend"),
                    advanceOptions: {
                        eventListeners: {
                            target: $("#dateend"),
                            action: "change"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                            com.capstone.UI.showMenuForUIButton($("#timerange"), "timespan");
                        }
                    }
                },
                {
                    title: "Close Date Time Menu",
                    body: "Click the clock icon again to close the menu.",
                    pointTo: $("#timerange"),
                    advanceOptions: {
                        eventListeners: {
                            target: $("#timerange"),
                            action: "click"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                            com.capstone.UI.showMenuForUIButton($("#timerange"), "timespan");
                        }
                    }
                },
                {
                    title: "Summary",
                    body: "Congratulations! You've changed the time range. When you change the time range, you'll need to run new queries. Existing queries will not be affected by these changes.",
                    pointTo: null,
                    advanceOptions: {
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                        }
                    }
                }
            ]
        },
        {
            Section: "Filter: Pickups & Dropoffs",
            Contents: [
                {
                    title: "Open Pickup / Dropoff Menu",
                    body: "Click the circle / square icon to open the pickup / dropoff menu.",
                    pointTo: $("#selectmode"),
                    advanceOptions: {
                        eventListeners: {
                            target: $("#selectmode"),
                            action: "click"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                        }
                    }
                },
                {
                    title: "Change the Selection Type",
                    body: "Select the desired selection type from the dropdown menu.",
                    pointTo: $("#filterSelection"),
                    advanceOptions: {
                        eventListeners: {
                            target: $("#filterSelection"),
                            action: "change"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                            com.capstone.UI.showMenuForUIButton($("#selectmode"), "typeselect");
                        }
                    }
                },
                {
                    title: "Summary",
                    body: "Congratulations! You've changed the selection type. When you change query settings, you'll need to run new queries. Existing queries will not be affected by these changes.",
                    pointTo: null,
                    advanceOptions: {
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                        }
                    }
                }
            ]
        },
        {
            Section: "Filter: Area Selection Mode",
            Contents: [
                {
                    title: "Open Area Selection Mode Menu",
                    body: "Click the <b><u>S</u></b> icon to open the Area Selection Mode menu.",
                    pointTo: $("#selecttype"),
                    advanceOptions: {
                        eventListeners: {
                            target: $("#selecttype"),
                            action: "click"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                        }
                    }
                },
                {
                    title: "Change the Selection Mode",
                    body: "Select the desired selection type from the dropdown menu. A detailed explanation of each mode is below:<br />" +
                          "<ul>" +
                            "<li><b>Single</b> - At most one area query is allowed on the map. Adding a new query will clear the map first.</li>" +
                            "<li><b>Multi</b> - Allow multiple queries on the map.</li>" +
                            "<li><b>Trip</b> - The first selection will retreive a list of pickups. The second selection will show pickups in the first selection that had dropoffs in the second selection.</li>" +
                          "</ul>",
                    pointTo: $("#selectMode"),
                    advanceOptions: {
                        eventListeners: {
                            target: $("#selectMode"),
                            action: "change"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                            com.capstone.UI.showMenuForUIButton($("#selecttype"), "modeselect");
                        }
                    }
                },
                {
                    title: "Summary",
                    body: "Congratulations! You've changed the area selection mode. When you change query settings, you'll need to run new queries. Existing queries will not be affected by these changes.",
                    pointTo: null,
                    advanceOptions: {
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                        }
                    }
                }
            ]
        },
        {
            Section: "Playback",
            Contents: [
                {
                    title: "Run a Query",
                    body: "Create a new query on the map.",
                    pointTo: null,
                    advanceOptions: {
                        eventListeners: {
                            target: $("#map"),
                            action: "mapQuery"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                        }
                    }
                },
                {
                    title: "Open the Playback Menu",
                    body: "Click on the playback icon <span style=\"background: #162330; display: inline-block; padding:2px;\"><img src=\"/Content/images/playback.png\" /></span> to open the playback menu.",
                    pointTo: $("#playback"),
                    advanceOptions: {
                        eventListeners: {
                            target: $("#playback"),
                            action: "click"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                        }
                    }
                },
                {
                    title: "Start Playback",
                    body: "Click the <b><u>Play</u></b> button to begin playback.",
                    pointTo: $("#playbackBtn"),
                    advanceOptions: {
                        eventListeners: {
                            target: $("#playbackBtn"),
                            action: "click"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                            com.capstone.UI.showMenuForUIButton($("#playback"), "playbackhud");
                        }
                    }
                },
                {
                    title: "Pause Playback",
                    body: "Click the <b><u>Pause</u></b> button to stop playback.",
                    pointTo: $("#playbackBtn"),
                    advanceOptions: {
                        eventListeners: {
                            target: $("#playbackBtn"),
                            action: "click"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                            com.capstone.UI.showMenuForUIButton($("#playback"), "playbackhud");
                        }
                    }
                },
                {
                    title: "Scrub Playback",
                    body: "You can also use the slider bar to select a specific frame in the playback window. Click and drag the bar to put it to a specific frame.",
                    pointTo: $("#playbackScroller"),
                    advanceOptions: {
                        eventListeners: {
                            target: $("#playbackScroller"),
                            action: "change"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                            com.capstone.UI.showMenuForUIButton($("#playback"), "playbackhud");
                        }
                    }
                },
                {
                    title: "Summary",
                    body: "When you process new queries, if playback is paused, the query will show its full result (not the specific frame). You can drag the slider bar again to get the specific range.",
                    pointTo: null,
                    advanceOptions: {
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                            com.capstone.UI.showMenuForUIButton($("#playback"), "playbackhud");
                        }
                    }
                }
            ]
        },
        {
            Section: "Settings",
            Contents: [
                {
                    title: "Open Settings Menu",
                    body: "Click the settings icon to open the Settings menu.",
                    pointTo: $("#settings"),
                    advanceOptions: {
                        eventListeners: {
                            target: $("#settings"),
                            action: "click"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                        }
                    }
                },
                {
                    title: "Copy the Link",
                    body: "Copy the link located in the Save & Share menu and open another browser",
                    pointTo: $("#shareLink"),
                    advanceOptions: {
                        eventListeners: [{
                            target: $("#shareLink"),
                            action: "copy"
                        },
                        {
                            target: $("#shareLink"),
                            action: "cut"
                        }],
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.UI.showSettingsMenu($("#settings"), 'settingsMenu', 'settingsMenuTabs');
                            if (!settingsDialogOriginalOffset)
                                settingsDialogOriginalOffset = $(".settingsDialog").offset();

                            $(".settingsDialog").offset({ top: settingsDialogOriginalOffset.top - 150, left: settingsDialogOriginalOffset.left });
                            $(".tutorialEy").offset({ top: tutorialOriginalOffset.top + 195, left: tutorialOriginalOffset.left - 10 });
                        }
                    }
                },
                {
                    title: "Summary",
                    body: "Congratulations! You have saved your current map. Now paste the link to the saved map into a browser to gain access to your saved map.",
                    pointTo: null,
                    advanceOptions: {
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                        }
                    }
                }
            ]
        },
        {
            Section: "Save & Share",
            Contents: [
                {
                    title: "Open Save & Share Menu",
                    body: "Click the disk icon to open the Save & Share menu.",
                    pointTo: $("#share"),
                    advanceOptions: {
                        eventListeners: {
                            target: $("#share"),
                            action: "click"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                        }
                    }
                },
                {
                    title: "Copy the Link",
                    body: "Copy the link located in the Save & Share menu and open another browser",
                    pointTo: $("#shareLink"),
                    advanceOptions: {
                        eventListeners: [{
                            target: $("#shareLink"),
                            action: "copy"
                        },
                        {
                            target: $("#shareLink"),
                            action: "cut"
                        }],
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                            $("#share").trigger("click");
                            if (!saveDialogOriginalOffset)
                                saveDialogOriginalOffset = $(".saveDialog").offset();

                            $(".saveDialog").offset({ top: saveDialogOriginalOffset.top - 125, left: saveDialogOriginalOffset.left });
                            $(".tutorialEy").offset({ top: tutorialOriginalOffset.top + 180, left: tutorialOriginalOffset.left - 10 });
                        }
                    }
                },
                {
                    title: "Summary",
                    body: "Congratulations! You have saved your current map. Now paste the link to the saved map into a browser to gain access to your saved map.",
                    pointTo: null,
                    advanceOptions: {
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
                            com.capstone.mapController.closeUiDialogs(tutorialOriginalOffset);
                        }
                    }
                }
            ]
        }
    ];

    for (var i in tutorials) {
        var steps = [];
        for (var j in tutorials[i].Contents) {
            var data = tutorials[i].Contents[j];
            steps.push(new com.eynon.tutorialStep(data.pointTo, data.title, data.body, data.advanceOptions));
        }
        tutorial.addSection(tutorials[i].Section, steps);
    }

    var cookie = document.cookie.replace(/(?:(?:^|.*;\s*)tutorialMode\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (cookie != 1) {
        document.cookie = "tutorialMode=1; expires=Fri, 31 Dec 9999 23:59:59 GMT";
        tutorial.play();
    }

    $("#btnHelp").on("click", function () {
        tutorial.play();
        tutorialOriginalOffset = $(".tutorialEy").offset();
    });
});
