var com = com || {};
com.capstone = com.capstone || {};

com.capstone.UI = {
    setStatus : function (status) {
        $("#main_status").text(status);
    },

    getStatus : function () {
        return $("#main_status").text().toString();
    }
};