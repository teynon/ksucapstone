var com = com || {};
com.eynon = com.eynon || {};
com.eynon.tutorialEy = function (options) {
    // Inherit iterator
    com.eynon.iterator.call(this, []);
    var tutorial = this;
    this.options = {
        "pointerControlDistance": 0.5,
        "arrowHeadSize": 10,
        "arrowHeadLength": 20,
        "maxSpacing": 50,
        "uiRefresh" : 500,
        "tutorialCSS": {
            "min-width": "200px",
            "min-height": "200px"
        }
    };
    this.options = $.extend(this.options, options);
    this.position = 0;
    this.tutorialWindow = $("<div></div>");
    this.tutorialWindow.css("display", "none").appendTo($("body"));
    this.tutorialWindow.draggable({
        "containment" : "parent",
        drag: function (event, ui) {
            tutorial.updateArrow();
        }
    });
    this.refreshInterval = null;
    this.tutorialWindowTitle = $("<div></div>");
    this.tutorialWindowTitle.css({
        "background": "#AAAAAA",
        "padding" : "5px",
        "line-height" : "20px"
    }).appendTo(this.tutorialWindow);

    this.tutorialWindowBody = $("<div></div>");
    this.tutorialWindowBody.css({
        "padding": "5px",
        color : "#FFFFFF",
        "line-height": "20px"
    }).appendTo(this.tutorialWindow);

    this.pointerCanvas = $("<canvas></canvas>");
    this.pointerCanvas.on("mousedown", function (event) { event.preventDefault(); });
    this.pointerCanvas.appendTo($("body"));
    this.pointerCanvas.css({ "display": "none", "pointer-events": "none" });
    this.pointerCtx = this.pointerCanvas[0].getContext("2d");

    // Sections
    // Steps

    this.addSection = function (sectionName, steps) {
        var section = new com.eynon.tutorialSection(sectionName, steps);
        this.items.push(section);
        return section;
    }

    this.play = function () {
        if (this.options.uiRefresh > 0) {
            this.refreshInterval = setInterval(function () { tutorial.updateArrow(); }, this.options.uiRefresh);
        }

        // Open the first section, first step
        var section = this.current();
        var step = section.current();
        var bounds = this.getBounds(step.target);

        this.tutorialWindowTitle.html(step.title);
        this.tutorialWindowBody.html(step.content);

        this.tutorialWindow.css($.extend({
            "display": "block",
            "visibility": "visible",
            "background-color": "#444444",
            "position": "absolute",
            "z-index" : 999999999
        }, this.options.tutorialCSS));

        var winLocation = this.getWindowLocation(step.target, this.tutorialWindow);
        this.tutorialWindow.css({
            "left": winLocation.x,
            "top": winLocation.y
        });

        this.updateArrow();
    }

    this.updateArrow = function () {
        // Update arrow only.
        var result = {
            x: 0,
            y: 0,
            arrowStartX: 0,
            arrowStartY: 0,
            arrowStopX: 0,
            arrowStopY: 0
        }

        var bounds = this.getBounds(this.current().current().target);
        var tutBounds = this.getBounds(this.tutorialWindow);

        // Draw on Left
        if (tutBounds.left - bounds.left >= bounds.right - tutBounds.right) {
            result.arrowStartX = tutBounds.left;
            result.arrowStopX = bounds.right;
        }
            // Draw on right
        else {
            result.arrowStartX = tutBounds.right;
            result.arrowStopX = bounds.left;
        }

        // Draw on Top
        if (tutBounds.top - bounds.top >= bounds.bottom - tutBounds.bottom) {
            result.arrowStartY = tutBounds.top;
            result.arrowStopY = bounds.bottom;
        }
            // Draw on Bottom
        else {
            result.arrowStartY = tutBounds.bottom;
            result.arrowStopY = bounds.top;
        }

        this.drawArrowToPoint(result.arrowStartX, result.arrowStartY, result.arrowStopX, result.arrowStopY);

        return result;
    }

    this.getWindowLocation = function (target, tutorialWindow) {
        var result = {
            x: 0,
            y: 0,
            arrowStartX: 0,
            arrowStartY: 0,
            arrowStopX: 0,
            arrowStopY: 0
        }
        var bounds = this.getBounds(target);
        var tutBounds = this.getBounds(tutorialWindow);
        // Which area has the most space available?
        var vp = {
            width: $(window).width(),
            height: $(window).height()
        }

        // Draw on Left
        if (bounds.left >= vp.width - bounds.right) {
            if (bounds.left > tutBounds.width + this.options.maxSpacing) {
                result.x = bounds.left - (tutBounds.width + this.options.maxSpacing);
                result.arrowStartX = result.x + tutBounds.width;
                result.arrowStopX = bounds.left;
            }
            else {
                result.x = 0;
                result.arrowStartX = tutBounds.width;
                result.arrowStopX = bounds.left;
            }
        }
            // Draw on right
        else {
            // Left is most available.
            // - Center tutorial between right and element's right. (Or as far right as possible without pushing the page size)
            if (vp.width - bounds.right > tutBounds.width + this.options.maxSpacing) {
                result.x = bounds.right + this.options.maxSpacing;
                result.arrowStartX = result.x;
                result.arrowStopX = bounds.right;
            }
            else {
                result.x = vp.width - tutBounds.width;
                result.arrowStartX = result.x;
                result.arrowStopX = bounds.right;
            }
        }

        // Draw on Top
        if (bounds.top >= vp.height - bounds.bottom) {
            if (bounds.top > tutBounds.height + this.options.maxSpacing) {
                result.y = bounds.top - (tutBounds.height + this.options.maxSpacing);
                result.arrowStartY = result.y + tutBounds.height;
                result.arrowStopY = bounds.top;
            }
            else {
                result.y = 0;
                result.arrowStartY = tutBounds.height;
                result.arrowStopY = bounds.top;
            }
        }
            // Draw on Bottom
        else {
            if (vp.height - bounds.bottom > tutBounds.height + this.options.maxSpacing) {
                result.y = bounds.bottom + this.options.maxSpacing;
                result.arrowStartY = result.y;
                result.arrowStopY = bounds.bottom;
            }
            else {
                result.y = vp.height - tutBounds.height;
                result.arrowStartY = result.y;
                result.arrowStopY = bounds.bottom;
            }
        }

        return result;
    }

    this.drawArrowToPoint = function (startX, startY, endX, endY) {
        // Middle Distance Vector
        var mv = {
            x: Math.abs((startX - endX) / 2),
            y: Math.abs((startY - endY) / 2)
        }

        // Halfway point
        var hv = {
            x: startX + mv.x,
            y: startY + mv.y
        }

        if (endX < startX)
            hv.x = endX + mv.x;

        if (endY < startY)
            hv.y = endY + mv.y;

        // Change in X,y
        var dx = startX - endX;
        var dy = startY - endY;

        // Scale to max control distance.
        var multiplier = this.options.pointerControlDistance;// * Math.sqrt(dx * dx + dy * dy);
        dx *= multiplier;
        dy *= multiplier;

        var n1 = {
            x: hv.x + dy,
            y: hv.y - dx
        }

        var cx = n1.x;
        var cy = n1.y;

        this.pointerCanvas.prop("width", $(window).width());
        this.pointerCanvas.prop("height", $(window).height());
        this.pointerCanvas.css({
            "display": "block",
            "position": "absolute",
            "top": 0,
            "left": 0
        });
        var halfWayPoint = {
            x: cx - (cx - hv.x) / 5,
            y: cy + (cy - hv.y) / 5
        }
        var ahNormals = this.getNormalInfo(endX, endY, halfWayPoint.x, halfWayPoint.y);

        var arrowHeadSizeMultiplier = this.options.arrowHeadSize / Math.sqrt(ahNormals.dx * ahNormals.dx + ahNormals.dy * ahNormals.dy);
        var arrowHeadLengthMultiplier = this.options.arrowHeadLength / Math.sqrt(ahNormals.dx * ahNormals.dx + ahNormals.dy * ahNormals.dy);
        var arrowHeadTail = {
            x: endX + ahNormals.dx * arrowHeadLengthMultiplier,
            y: endY + ahNormals.dy * arrowHeadLengthMultiplier
        }

        var a1 = {
            x: arrowHeadTail.x + ahNormals.normals[0].x * arrowHeadSizeMultiplier,
            y: arrowHeadTail.y + ahNormals.normals[0].y * arrowHeadSizeMultiplier
        };

        var a2 = {
            x: endX + ahNormals.dx * arrowHeadLengthMultiplier + ahNormals.normals[1].x * arrowHeadSizeMultiplier,
            y: endY + ahNormals.dy * arrowHeadLengthMultiplier + ahNormals.normals[1].y * arrowHeadSizeMultiplier
        };

        /*this.pointerCtx.lineWidth = 10;
        this.pointerCtx.strokeStyle = "#00FF00";
        this.pointerCtx.beginPath();
        this.pointerCtx.arc(hv.x, hv.y, 50, 0, 2*Math.PI);
        this.pointerCtx.stroke();
        this.pointerCtx.lineWidth = 10;
        this.pointerCtx.strokeStyle = "#0000FF";
        this.pointerCtx.beginPath();
        this.pointerCtx.arc(cx, cy, 50, 0, 2*Math.PI);
        this.pointerCtx.stroke();
        this.pointerCtx.lineWidth = 10;
        this.pointerCtx.strokeStyle = "#FF00FF";
        this.pointerCtx.beginPath();
        this.pointerCtx.arc(arrowHeadTail.x, arrowHeadTail.y, 10, 0, 2*Math.PI);
        this.pointerCtx.stroke();*/

        this.pointerCtx.lineWidth = 4;
        this.pointerCtx.strokeStyle = "#FF0000";
        this.pointerCtx.fillStyle = "#FF0000";
        this.pointerCtx.beginPath();
        this.pointerCtx.moveTo(a1.x, a1.y);
        this.pointerCtx.lineTo(endX, endY);
        this.pointerCtx.lineTo(a2.x, a2.y);
        this.pointerCtx.closePath();
        this.pointerCtx.stroke();
        this.pointerCtx.fill();

        this.pointerCtx.lineWidth = 4;
        this.pointerCtx.strokeStyle = "#FF0000";
        this.pointerCtx.beginPath();
        this.pointerCtx.moveTo(startX, startY);
        this.pointerCtx.quadraticCurveTo(cx, cy, endX, endY);
        this.pointerCtx.stroke();
    }

    this.getNormalInfo = function (x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        return { dx: dx, dy: dy, normals: [{ x: dy, y: -dx }, { x: -dy, y: dx }] };
    }

    this.distance = function (p1, p2) {
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    this.getBounds = function (target) {
        var bounds = {
            top: -1,
            left: -1,
            right: -1,
            bottom: -1,
            width: -1,
            height: -1
        };
        var offset = target.offset();
        bounds.top = offset.top;
        bounds.left = offset.left;
        bounds.width = target.width();
        bounds.height = target.height();
        bounds.right = bounds.left + bounds.width;
        bounds.bottom = bounds.top + bounds.height;

        return bounds;
    }

    this.getWindowBounds = function () {
        var bounds = {
            top: $(window).scrollTop(),
            left: $(window).scrollLeft(),
            bottom: $(document).height(),
            right: $(document).width(),
            width: $(document).width(),
            height: $(document).height()
        };
        return bounds;
    }
}

com.eynon.tutorialSection = function (sectionName, steps) {
    // Inherit iterator
    com.eynon.iterator.call(this, steps);

    var section = this;

    this.name = sectionName;
    this.position = 0;

    // Add a step to this section.
    this.addStep = function (step) {
        this.items.push(step);
    }
}

com.eynon.tutorialStep = function (targetElement, title, content, link) {
    var step = this;

    this.target = $(targetElement);
    this.title = title;
    this.content = content;
    this.link = link;
}

com.eynon.iterator = function (items) {
    this.items = items;

    this.each = function (callback) {
        this.rewind();

        while (this.valid()) {
            callback(this.current());
            this.next();
        }

        this.rewind();
    }

    this.current = function () {
        return this.items[this.position];
    }

    this.next = function () {
        if (this.position == this.items.length)
            return false;

        this.position++;
    }

    this.key = function () {
        return this.position;
    }

    this.rewind = function () {
        this.position = 0;
    }

    this.valid = function () {
        return (this.position >= 0 && this.position < this.items.length);
    }
}

$(window).load(function () {
    var tutorial = new com.eynon.tutorialEy({});
    var section = tutorial.addSection("test", []);
    section.addStep(new com.eynon.tutorialStep($("#timerange"), "test", "content", "link"));
    tutorial.play();
});