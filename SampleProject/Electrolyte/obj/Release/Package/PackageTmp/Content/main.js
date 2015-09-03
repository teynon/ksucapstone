
// Namespace.
if (com == null) {
    var com = {};
}

com.DateInfo = {
    monthNames: [ "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December" ],
}

com.CreateAgreement = {
    div: null,
    initialized: false,
    loading: false,
    agreementID: 0,
    taskDiv: null,
    taskDates : [],
    init: function () {
        if (!this.initialized) {
            // Insert div into body.
            this.overlay = $("<div></div>").prependTo("body").prop("class", "overlay").prop("id", "overlay");
            this.div = $("<div>Loading</div>").prependTo("body").prop("class", "overlay-body");

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
            this.div = $("<div>Loading</div>").prependTo("body").prop("class", "overlay-body");

            // Insert close button.
            this.initialized = true;
        }
    },
    startLoading: function () {
        this.loading = true;
        var theDiv = this.div;
        var self = this;
        $.get("/Agreement/NewAgreement", function (data) {
            this.loading = false;
            theDiv.html(data);

            self.insertCloseButton(theDiv);
        }).fail(function (data) {
        });
    },
    saveContact: function () {

    },
    getContactFromAjaxForm : function() {
        var data = {};
        data.name = $("#contactName").val();
        data.phone = $("#contactPhone").val();
        data.email = $("#contactEmail").val();
        data.street = $("#contactStreet").val();
        data.city = $("#contactCity").val();
        data.state = $("#contactState").val();
        data.agreementid = com.CreateAgreement.agreementID;
        return data;
    },
    clearContactForm : function() {
        $("#contactName").val("");
        $("#contactPhone").val("");
        $("#contactEmail").val("");
        $("#contactStreet").val("");
        $("#contactCity").val("");
        $("#contactState").val("");
    },
    addContact: function (dataFunc) {
        var data = dataFunc();
        console.log(data);

        var empty = true;
        for (var x in data) {
            if (data[x] && data[x] != "") {
                empty = false;
                break;
            }
        }

        if (empty) return;

        var self = this;
        $.post("/Agreement/AddContact", data, function (data) {
            self.clearContactForm();
            $("#associatedContacts").html($("#associatedContacts").html() + data);
        });
    },
    deleteContact: function (el, id) {
        var div = el;
        $.get("/Agreement/DeleteContact", { "agreementid" : this.agreementID, "id": id }, function () {
            $(div).closest(".agreementContact").remove();
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
    openBasic: function() {
        if (!this.initialized) this.init_basic();

        this.overlay.css({ "display": "block" });
        this.div.css({ "display": "block" });
    },
    getCreateFromAjaxForm: function () {
        var data = {};
        data.title = $("#contractTitle").val();
        data.description = $("#contractDescription").val();
        data.contact_name = $("#contactName").val();
        data.contact_phone = $("#contactPhone").val();
        data.contact_email = $("#contactEmail").val();
        data.contact_street = $("#contactStreet").val();
        data.contact_city = $("#contactCity").val();
        data.contact_state = $("#contactState").val();
        data.agreementid = com.CreateAgreement.agreementID;
        return data;
    },
    getTaskFromAjaxForm: function() {
        var data = {};
        data.task = $("#selectedTask").data("id");
        data.title = $("#taskTitle").val();
        data.description = $("#taskDescr").val();
        data.date = $("#taskDate").val();
        data.time = $("#taskTime").val();
        data.agreementID = com.CreateAgreement.agreementID;
        return data;
    },
    create: function (dataFunc) {
        var data = dataFunc();

        if (data.title == "") {
            // Title is required.
            alert("Contract title is required.");
            return;
        }

        var empty = true;
        for (var x in data) {
            if (data[x] && data[x] != "") {
                empty = false;
                break;
            }
        }

        if (empty) return;
        var self = this;
        $.post("/Agreement/Create", data, function (response) {
            self.agreementID = response.Data.id;
            // On close, go to /Agreement/Manage?id=agreementID

            // Switch to events page.
            self.openTasks(self.agreementID);
        });
    },
    openTasks: function (agreementID) {
        this.agreementID = agreementID;
        this.openBasic();
        var theDiv = this.div;
        var self = this;
        

        $.get("/Agreement/NewTasks", { id : agreementID },  function (data) {
            this.loading = false;
            theDiv.html(data);
            var that = self;
            $("#taskDate").on("keyup", function () { $("#datePicker").datepicker("refresh"); });
            $("#datePicker").datepicker({
                onSelect: function (dateText, inst) {
                    $("#taskDate").val(dateText);
                },
                beforeShowDay: function (date) {
                    var thedate = String("00" + (date.getMonth() + 1)).slice(-2) + "/" + String("00" + date.getDate()).slice(-2) + "/" + date.getFullYear();
                    console.log(thedate + " vs " + $("#taskDate").val());
                    var className = "";
                    if (thedate == $("#taskDate").val()) {
                        className = "dateSelected";
                    }
                    var result = [];
                    result[0] = true;
                    result[1] = className;
                    result[2] = "";
                    return result;
                }
            });

            $("#taskSelector").find(".autocompleteItem").each(function () {
                var those = that;
                $(this).on("click", function () {
                    those.setAutosuggest($(this).text().trim().substring(2), $(this).data("id"));
                });
            });

            self.bindClickOutside(function () {
                $("#taskSelector").hide();
            });

            $("#selectedTask").on("click", function (event) {
                $("#taskSelector").toggle();
                event.stopPropagation();
            });

            $("#taskType").on("keyup", function () {
                self.autosuggest($(this).val(), $("#taskSelector"));
            });

            self.insertCloseButton(theDiv);
        }).fail(function (data) {
        });
    },
    edit : function (agreementID) {
        this.agreementID = agreementID;

        this.openBasic();
        var theDiv = this.div;
        var self = this;

        $.get("/Agreement/EditAgreement", { id: agreementID }, function (data) {
            this.loading = false;
            theDiv.html(data);
            var that = self;

            self.insertCloseButton(theDiv);
        }).fail(function (data) {
        });
    },
    saveEdits: function (dataFunc) {
        var data = dataFunc();

        $.post("/Agreement/SaveAgreement", data, function (data) {
            com.CreateAgreement.Close();
        }).fail(function (data) {
        });
    },
    datepicker : function(element) {

        $(element).datepicker({
            beforeShowDay : this.filterCalendarByTasks
        });
    },
    getCurrentTasks: function () {
        com.CreateAgreement.taskDates = [];
        com.CreateAgreement.taskDiv.find(".agreementTaskDate").each(function () {
            com.CreateAgreement.taskDates.push($(this).text());
        });
    },
    filterCalendarByTasks: function (date) {
        com.CreateAgreement.getCurrentTasks();
        var thedate = com.DateInfo.monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
        var className = "";
        for (var i = 0; i < com.CreateAgreement.taskDates.length; i++) {
            if (com.CreateAgreement.taskDates[i].substring(0, thedate.length) == thedate) {
                className = "dateActive";
            }
        }
        var result = [];
        result[0] = true;
        result[1] = className;
        result[2] = "";
        return result;
    },
    addTask: function (dataFunc) {
        var data = dataFunc();

        // Validate task
        if (data.task == undefined || data.task == 0) {
            alert("Please select a task type.");
            return;
        }

        if (data.title == undefined && data.title != "") {
            alert("Please enter a title.");
            return;
        }

        if (!/^[\d]{1,2}\/[\d]{1,2}\/[\d]{4}$/.test(data.date)) {
            alert("Please enter a valid date (dd/mm/yyyy).");
            return;
        }

        if (!/^[\d]{1,2}\:[\d]{2}\s[\D]{2}$/.test(data.time)) {
            alert("Please enter a valid time (hh:mm AM/PM).");
            return;
        }

        $.post("/Agreement/AddTask", data, function (response) {
            // Add task to task list.
            $("#currentTasks").append(response);
        });
    },
    deleteTask: function (el, id, agreeID) {
        var div = el;
        if (this.agreementID == 0 && agreeID != 0) this.agreementID = agreeID;
        $.get("/Agreement/DeleteTask", { "agreementid": this.agreementID, "id": id }, function () {
            $(div).parent().remove();
        });
    },
    FinishAgreement: function (dataFunc) {
        var data = dataFunc();

        this.div.hide();
        this.overlay.hide();
        document.location.href = "/Agreement/Manage?id=" + com.CreateAgreement.agreementID;
    },
    Close: function () {
        this.div.hide();
        this.overlay.hide();
        if (this.agreementID != 0 && this.agreementID != undefined) {
            // Refresh.
            location.reload();
        }
    },
    setAutosuggest: function(text, value) {
        $("#taskType").val(text);
        $("#selectedTask").data({ id: value });
    },
    autosuggest: function(value, results) {
        var val = value.toLowerCase();
        $(results).find(".autocompleteItem").each(function () {
            if (val == "" || val == undefined) $(this).show();
            else if ($(this).text().toLowerCase().indexOf(val) == -1) {
                $(this).hide();
            }
            else $(this).show();
        });
    },
    insertCloseButton: function (theDiv, element) {
        var that = this;
        $("<div></div>").appendTo(theDiv).prop("class", "modalClose").on("click", function () {
            that.overlay.css({ "display": "none" });
            that.div.css({ "display": "none" });
        });
    },
    bindClickOutside: function (func) {
        $('html').on("click", func);
    },
    fileUpload: function (el) {
        var files = el.get(0).files;
        var fileUploadEl = el;

        // Get file upload data.
        $.get("FileUploadData", function (data) {
            //console.log(data);
            for (var i = 0; i < files.length; i++) {
                var reader = new FileReader();
                reader.readAsText(files[i], 'UTF-8');
                reader.onload = function (event) {
                    data.data = event.target.result;
                    data.filename = fileUploadEl.get(0).files[0].name;
                    data.key = "uploads/${filename}";
                    $.post("UploadFile", data, function () { });
                };
            }
        });
    },
    updateFiles: function (files) {
        $("#associatedFiles").empty();

        for (var x = 0; x < files.length; x++) {
            var fileDiv = $("<div></div>").data("id", files[x].id).text(com.CreateAgreement.shortenFileName(files[x].filename, 20)).addClass("agreementFile");
            $("<div></div>").appendTo(fileDiv).addClass("deleteContact").on("click", function () {
                com.CreateAgreement.deleteFile($(this).parent().data("id"));
            });

            fileDiv.appendTo($("#associatedFiles"));
        }
    },
    deleteFile: function (fileid) {
        $.get("deleteFile", { id: fileid, agreementid: com.CreateAgreement.agreementID }, function (data) {
            com.CreateAgreement.updateFiles(data.Files);
        });
    },
    viewFile: function(fileid, agreementid) {
        window.open("GetFile?id=" + fileid + "&agreementid=" + agreementid, "Download File", "");
    },
    shortenFileName: function (filename, length) {
        if (filename.length > length) {
            filename = filename.substring(0, length - 6) + "..." + filename.split('.').pop();
        }

        return filename;
    }
}

com.showOfficial = function () {
    var data = $("#preview").text();
    $("#questions").find("input").each(function () {
        console.log(this.name);
        data = data.replace("%%" + this.name + "%%", this.value);
    });
    $("#preview").text(data);
    $("#questions").css("display", "none");
    $("#preview").css("display", "block");
}

com.addMessage = function () {
    var msg = $("#msgbox").val();
    var text = $("#message-area").html();
    text += "<b>Me:</b> " + msg + "<br />";
    $("#message-area").html(text);
}