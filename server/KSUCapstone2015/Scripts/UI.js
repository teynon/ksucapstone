var com = com || {};
com.capstone = com.capstone || {};

com.capstone.UI = {
    openMenus: [],

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
        target.addClass("active");
        target.data("uimenustate", true);
    },

    hideMenuForUIButton: function (target, menuid) {
        $("#" + menuid).css({ display: "none" });
        $(target).removeClass("active");
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
}

};