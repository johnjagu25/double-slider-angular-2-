import { Component, ChangeDetectorRef, HostListener, ViewChild, EventEmitter, ElementRef, Input, Output } from '@angular/core';
var DoubleSliderComponent = /** @class */ (function () {
    function DoubleSliderComponent(cdr) {
        this.cdr = cdr;
        this.tooltip = false;
        this.tooltipSymbol = "";
        this.increment = 0;
        this.disable = false;
        this.minChange = new EventEmitter();
        this.maxChange = new EventEmitter();
        this.sliderMiddle = true;
        this.sliderMinIcon = "";
        this.mouseDownHandle = false;
        this.total = 0;
        this.test = 0;
    }
    DoubleSliderComponent.prototype.ngOnInit = function () {
    };
    DoubleSliderComponent.prototype.resetPosition = function () {
        var pos = -(this.halfSliderWidth);
        this.sliderChange("min", pos, this.minValue);
        pos = (this.halfSliderWidth);
        this.sliderChange("max", pos, this.maxValue);
        this.minPos = 0;
        this.maxPos = this.width;
        this.last = 0;
        this.progressFn(this.progress.nativeElement, this.minPos);
    };
    DoubleSliderComponent.prototype.onmousedown = function (e) {
        if (!this.disable) {
            e.preventDefault();
            this.element = e.target;
            this.mouseDownHandle = true;
            e.stopPropagation();
        }
    };
    DoubleSliderComponent.prototype.onResize = function (e) {
        this.width = this.dbSlider.nativeElement.clientWidth;
        this.maxPos = +(((this.maxPos) / this.lastWidth) * this.width);
        this.minPos = +((this.minPos / this.lastWidth) * this.width);
        this.lastWidth = this.width;
        this.parentHandler(this.minPos, "min");
        this.parentHandler(this.maxPos, "max");
        this.last = this.minPos;
        if (this.checkGreater()) {
            this.progressFn(this.progress.nativeElement, this.minPos);
        }
    };
    DoubleSliderComponent.prototype.sliderChange = function (ele, pos, value) {
        if (ele === "min") {
            this.slideMin.nativeElement.style.webkitTransform = "translate(" + pos + "px,0px)";
            this.minChange.emit(value);
            this.minTooltip = value;
        }
        else {
            this.slideMax.nativeElement.style.webkitTransform = "translate(" + pos + "px,0px)";
            this.maxChange.emit(value);
            this.maxTooltip = value;
        }
    };
    DoubleSliderComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.sliderWidth = _this.slideMax.nativeElement.clientWidth;
            _this.halfSliderWidth = _this.sliderWidth / 2;
            _this.width = _this.dbSlider.nativeElement.clientWidth;
            _this.lastWidth = _this.width;
            _this.initalPosition = _this.dbSlider.nativeElement.offsetParent.offsetLeft + _this.dbSlider.nativeElement.offsetLeft;
            _this.minPos = 0;
            _this.maxPos = _this.width;
            _this.total = _this.maxValue - _this.minValue;
            _this.min = _this.minValue | 0;
            _this.max = _this.total > 0 ? _this.maxValue : _this.width;
            _this.minTooltip = _this.min;
            _this.maxTooltip = _this.max;
            _this.resetPosition();
            _this.last = 0;
        });
    };
    DoubleSliderComponent.prototype.getPosition = function (e) {
        var touch = e.type.indexOf('touch') === 0;
        var clientX = touch ? e.touches[0].clientX : e.clientX;
        return clientX;
    };
    DoubleSliderComponent.prototype.parentHandler = function (e, checkS) {
        if (!this.disable) {
            var totalPos = 0;
            if (!checkS) {
                var pos = this.getPosition(e);
                totalPos = pos - (this.dbSlider.nativeElement.offsetParent.offsetLeft + this.dbSlider.nativeElement.offsetLeft);
            }
            else {
                totalPos = Math.floor(e);
            }
            var value = this.evaluateValue(totalPos);
            if ((((totalPos <= this.width / 2) && this.max >= value) || value <= this.min) || checkS === "min") {
                this.minPos = totalPos;
                this.min = value;
                this.element = this.slideMin.nativeElement;
                var pos = totalPos - this.halfSliderWidth;
                this.sliderChange("min", pos, value);
            }
            else {
                this.maxPos = totalPos;
                this.max = value;
                this.element = this.slideMax.nativeElement;
                var pos = -(this.width - totalPos - this.halfSliderWidth);
                this.sliderChange("max", pos, value);
            }
            this.getSliderValue();
            if (this.checkGreater() && !checkS) {
                this.progressFn(this.progress.nativeElement, this.minPos);
            }
        }
    };
    DoubleSliderComponent.prototype.parent = function (e) {
        e.preventDefault();
        this.parentHandler(e, false);
    };
    DoubleSliderComponent.prototype.onmouseup = function (e) {
        this.mouseDownHandle = false;
    };
    DoubleSliderComponent.prototype.checkGreater = function () {
        return this.max >= this.min;
    };
    DoubleSliderComponent.prototype.onMove = function (e) {
        if (this.mouseDownHandle && !this.disable) {
            e.preventDefault();
            var check = this.getPosition(e) - (this.dbSlider.nativeElement.offsetParent.offsetLeft + this.dbSlider.nativeElement.offsetLeft);
            if ((check <= this.width + 4) && (check - 2 >= 0)) {
                this.getSliderValue();
                var value = 0;
                if (this.getSlider === "min") {
                    this.minPos = check;
                    this.min = value = this.evaluateValue(check);
                    if (this.checkGreater()) {
                        var pos = this.minPos - this.halfSliderWidth;
                        this.sliderChange("min", pos, value);
                    }
                }
                else {
                    this.maxPos = check;
                    this.max = value = this.evaluateValue(this.maxPos);
                    if (this.checkGreater()) {
                        var pos = -(this.width - check - this.halfSliderWidth);
                        this.sliderChange("max", pos, value);
                    }
                }
                if (this.checkGreater()) {
                    this.progressFn(this.progress.nativeElement, this.minPos);
                }
            }
        }
    };
    DoubleSliderComponent.prototype.mouseup = function (e) {
        // e.preventDefault();
        this.mouseDownHandle = false;
    };
    DoubleSliderComponent.prototype.progressFn = function (progress, pos) {
        // if (this.sliderMiddle) {
        var check = (pos !== false ? (this.maxPos - this.minPos) / this.width : 1);
        if (this.getSlider === "min") {
            this.last = pos;
            progress.style.webkitTransform = "translate(" + pos + "px,0) scale(" + check + ",1)";
        }
        else {
            progress.style.webkitTransform = "translate(" + this.last + "px,0) scale(" + check + ",1)";
        }
        // }
    };
    DoubleSliderComponent.prototype.evaluateValue = function (vals) {
        var increment = this.increment ? (this.total / this.increment) : 100;
        var val = Math.floor((vals / this.width) * increment);
        var value = (this.total / increment) * val;
        return value + this.minValue;
    };
    DoubleSliderComponent.prototype.decodeValue = function (element, val) {
        val = val - this.minValue;
        var val1 = this.width / (this.total / val);
        return val1;
    };
    DoubleSliderComponent.prototype.getSliderValue = function () {
        if (this.element.classList.contains("slider-min")) {
            this.getSlider = "min";
        }
        else if (this.element.classList.contains("slider-max")) {
            this.getSlider = "max";
        }
    };
    DoubleSliderComponent.prototype.reset = function () {
        this.resetPosition();
    };
    DoubleSliderComponent.prototype.setMax = function (val) {
        val = parseInt(val);
        if (val <= this.maxValue && val >= this.min && !this.disable) {
            this.getSlider = "max";
            var element = this.slideMax.nativeElement;
            var pos = -(this.width - this.decodeValue(element, val) - this.halfSliderWidth);
            this.sliderChange("max", pos, val);
            this.max = val;
            this.maxPos = this.width + pos;
            this.progressFn(this.progress.nativeElement, this.minPos);
        }
    };
    DoubleSliderComponent.prototype.setMin = function (val) {
        val = parseInt(val);
        if (val >= this.minValue && val <= this.max && !this.disable) {
            this.getSlider = "min";
            var element = this.slideMin.nativeElement;
            var pos = this.decodeValue(element, val) - this.halfSliderWidth;
            this.sliderChange("min", pos, val);
            this.minPos = pos;
            this.min = val;
            this.progressFn(this.progress.nativeElement, this.minPos);
        }
    };
    DoubleSliderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'double-slider',
                    templateUrl: './double-slider.component.html',
                    styleUrls: ['./double-slider.component.css']
                },] },
    ];
    /** @nocollapse */
    DoubleSliderComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
    ]; };
    DoubleSliderComponent.propDecorators = {
        "tooltip": [{ type: Input, args: ["tooltip",] },],
        "tooltipSymbol": [{ type: Input, args: ["tooltipSymbol",] },],
        "minValue": [{ type: Input, args: ["min",] },],
        "maxValue": [{ type: Input, args: ["max",] },],
        "increment": [{ type: Input, args: ["increment",] },],
        "disable": [{ type: Input, args: ["disable",] },],
        "minChange": [{ type: Output, args: ["minChange",] },],
        "maxChange": [{ type: Output, args: ["maxChange",] },],
        "dbSlider": [{ type: ViewChild, args: ["dbSlider1",] },],
        "slideMin": [{ type: ViewChild, args: ["slideMin",] },],
        "slideMax": [{ type: ViewChild, args: ["slideMax",] },],
        "progress": [{ type: ViewChild, args: ["sliderProgress",] },],
        "sliderMiddle": [{ type: Input, args: ["sliderMiddle",] },],
        "sliderMinIcon": [{ type: Input, args: ["sliderMinIcon",] },],
        "onMove": [{ type: HostListener, args: ['document:mousemove', ['$event'],] }, { type: HostListener, args: ['document:touchmove', ['$event'],] },],
        "mouseup": [{ type: HostListener, args: ['document:mouseup', ['$event'],] }, { type: HostListener, args: ['document:touchend', ['$event'],] },],
    };
    return DoubleSliderComponent;
}());
export { DoubleSliderComponent };
//# sourceMappingURL=double-slider.component.js.map