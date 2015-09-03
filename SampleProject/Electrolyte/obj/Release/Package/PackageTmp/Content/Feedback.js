
// Namespace.
if (com == null) {
    var com = {};
}

com.Feedback = {
    div: null,
    initialized: false,
    loading: false,
    agreementID: 0,
    taskDiv: null,
    taskDates: [],
    init: function () {
        if (!this.initialized) {
            // Insert div into body.
            this.overlay = $("<div></div>").prependTo("body").prop("class", "overlay").prop("id", "overlay");
            this.div = $("<div>Loading</div>").prependTo("body").prop("class", "overlay-feedback");

            // Insert close button.
            this.initialized = true;
            // Start loading page.
            this.startLoading();
        }
    },
    init_basic: function () {
        if (!this.initialized) {
            // Insert div into body.
            this.overlay = $("<div></div>").prependTo("body").prop("class", "overlay").prop("id", "overlay");
            this.div = $("<div>Loading</div>").prependTo("body").prop("class", "overlay-feedback");

            // Insert close button.
            this.initialized = true;
        }
    },
    startLoading: function () {
        this.loading = true;
        var theDiv = this.div;
        var self = this;
        $.get("/Home/Feedback", function (data) {
            this.loading = false;
            theDiv.html(data);

            self.insertCloseButton(theDiv);
        }).fail(function (data) {
        });
    },
    open: function () {
        if (!this.initialized) this.init();
        this.agreementID = 0;
        if (!this.loading) {
            this.startLoading();
        }

        this.overlay.css({ "display": "block" });
        this.div.css({ "display": "block" });
    },
    send: function () {
        var data = {};
        data.name = $("#feedbackName").val();
        data.email = $("#feedbackEmail").val();
        data.message = $("#feedbackText").val();
        var theDiv = this.div;
        var self = this;

        $.post("/Home/SendFeedback", data, function (result) {
            if (result.Success) {
                self.Close();
                alert(result.Message);
            }
            else {
                alert(result.Message);
            }
        });
    },
    Close: function () {
        this.div.hide();
        this.overlay.hide();
    },
    insertCloseButton: function (theDiv, element) {
        var that = this;
        $("<div></div>").appendTo(theDiv).prop("class", "modalClose").on("click", function () {
            that.overlay.css({ "display": "none" });
            that.div.css({ "display": "none" });
        });
    }
};