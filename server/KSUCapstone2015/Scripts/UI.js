var com = com || {};
com.capstone = com.capstone || {};

com.capstone.UI = {
    mapUpdateTimeout : null,
    openMenus: [],
    queryColorIndex : 0,
    queryColorList: [
        "#FF0000",
        "#00FF00",
        "#0000FF",
        "#FFFF00",
        "#FF00FF",
        "#00FFFF"
    ],

    hexToRgba : function(hex, opacity) {
        
        hex = hex.replace('#', '');
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);

        result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
        return result;
    },

    addMenu : function(target, menuid) {
        for (var i = 0; i < com.capstone.UI.openMenus.length; i++) {
            if (com.capstone.UI.openMenus[i].target == target) {
                return;
            }
        }

        com.capstone.UI.openMenus.push({"target" : target, "menuid" : menuid });
    },

    setStatus : function (status) {
        $("#main_status").text(status);
    },

    getStatus : function () {
        return $("#main_status").text().toString();
    },

    closeOpenMenus : function() {
        for (var i = 0; i < com.capstone.UI.openMenus.length; i++) {
            com.capstone.UI.hideMenuForUIButton(com.capstone.UI.openMenus[i].target, com.capstone.UI.openMenus[i].menuid);
        }
    },

    showMenuForUIButton: function (target, menuid) {
        com.capstone.UI.closeOpenMenus();
        var target = $(target);
        var menu = $("#" + menuid);
        var offset = target.offset();
        /*menu.css({
            display: "block",
            visibility: "hidden"
        });*/
        var size = target.outerHeight();

        menu.css({
            display: "block",
            position: "absolute",
            left: offset.left,
            bottom: size,
            "z-index" : "1000"
        });
        com.capstone.UI.addMenu(target, menuid);
        target.addClass("activeUI");
        target.data("uimenustate", true);
    },

    hideMenuForUIButton: function (target, menuid) {
        $("#" + menuid).css({ display: "none" });
        $(target).removeClass("activeUI");
        $(target).data("uimenustate", false);
    },

    toggleMenuForUIButton: function (target, menuid) {
        var target = $(target);
        if (target.data("uimenustate")) {
            com.capstone.UI.hideMenuForUIButton(target, menuid);
        }
        else {
            com.capstone.UI.showMenuForUIButton(target, menuid);
        }
    },

    showSettingsMenu: function (target, menuid, tabsectionid) {
        $("#" + menuid).dialog({
            modal: true,
            "minWidth": 500,
            "width": "50%",
            "minHeight": 500,
            "title": "Settings"
        });

        $("#" + tabsectionid).tabs();
    },

    getPickupColor: function () {
        return $("#PickupColor").val();
    },

    getPickupFillColor: function () {
        return $("#PickupFillColor").val();
    },

    getDropoffColor: function () {
        return $("#DropoffColor").val();
    },

    getDropoffFillColor: function () {
        return $("#DropoffFillColor").val();
    },

    getPickupStrokeWeight: function () {
        return $("#PickupStroke").val();
    },

    getDropoffStrokeWeight: function () {
        return $("#DropoffStroke").val();
    },

    refreshMapDelayed: function () {
        clearTimeout(com.capstone.UI.mapUpdateTimeout);
        com.capstone.UI.mapUpdateTimeout = setTimeout(function () {
            com.capstone.mapController.RefreshResults();
        }, 1000);
    }
};

$(document).ready(function () {
    $.fn.button.noConflict();
    $(".color").colorPicker({
        renderCallback: function () {
            com.capstone.UI.refreshMapDelayed();
        },
        opacity: false
    });
    $(".trigger").colorPicker({
        opacity: true
    });

    $(".queryInner").on("click", function (e) {
    });

    $("#DropoffStroke, #PickupStroke").on("change", function () {
        com.capstone.UI.refreshMapDelayed();
    });
});