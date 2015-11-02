$(window).load(function () {
    var tutorial = new com.eynon.tutorialEy({ lockPosition: false });

    // TIME RANGE 
    // ----------------------------------------------------------------------------
    var tutorials = [
        {
            Section: "Filter: Time Range",
            Contents: [
                {
                    title: "Open Date Time Menu",
                    body: "Click the clock icon to open the date time editor.",
                    pointTo: $("#timerange"),
                    advanceOptions: {
                        eventListeners: {
                            target: $("#target"),
                            action: "click"
                        },
                        onStep: function () {
                            com.capstone.UI.closeOpenMenus();
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
                            com.capstone.UI.showMenuForUIButton($("#playback"), "playbackhud");
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

    tutorial.play();

    $("#btnHelp").on("click", function () { tutorial.play(); });
});