const dom = {
    runtimeStyle: null,
    parent: null,

    timerSection: null,
    endSection: null,
    configSection: null,
    range: null,
    start: null,
    cancel: null,
    clock: null,
    remaining: null,

    init: function() {

        this.runtimeStyle = z("style.runtime");
        this.parent = z(".fullscreen");

        this.timerSection = z("section.timer");
        this.endSection = z("section.end");
        this.configSection = z("section.config");

        this.range = this.configSection.find("input[type=range]");
        this.start = this.configSection.find("button.start");
        this.cancel = this.configSection.find("button.cancel");

        this.clock = this.timerSection.find("svg.clock path");
        this.remaining = this.timerSection.find(".remaining");

        // handle viewport size change
        this.handleResize();
        window.onresize = this.handleResize.bind(this);

    },

    /*
        calculateSizes()
        make sure everything fits and has correct ratio

        TODO accomplish size and positioning using CSS. JS shouldn't really
        be necessary here.
    */
    calculateSizes: function() {
        // ensure 1:1 ratio that fits on screen
        let maxwidth = Math.min(window.innerWidth, window.innerHeight);
        state.clockSize = Math.round(maxwidth * 0.6);

        // calculate digit sizes with ratio 26:46
        state.digitWidth = Math.round(state.clockSize * 0.15);
        state.digitHeight = Math.round(46*state.digitWidth/26);

        // position remaining time differently based on screen orientation
        if(window.innerWidth > window.innerHeight) {
            // pos right of disc
            state.remainingLeft = Math.round(window.innerWidth / 2 + state.clockSize / 2);
            state.remainingTop = Math.round(window.innerHeight / 2 - state.digitHeight / 2);
            state.remainingWidth = Math.floor(window.innerWidth/2 - state.clockSize/2);
            dom.remaining.removeClass("height");
        } else {
            // pos bottom of disc
            state.remainingLeft = 0;
            state.remainingTop = Math.round( (window.innerHeight + state.clockSize + state.digitHeight)/2);
            state.remainingWidth = window.innerWidth;
        }
    },

    /*
        updateRuntimeCSS()
        update rules for misc elements.
        This is done at startup and whenever the viewport is altered
    */
    updateRuntimeCSS: function() {
        let str = "";
        str += 'svg.clock{' +
                `width:${state.clockSize}px;` +
                `height:${state.clockSize}px;` +
                '}';

        str += '.digits span{' +
                `width:${state.digitWidth}px;` +
                `height:${state.digitHeight}px;` +
                '}';

        str += '.remaining{' +
                `left:${state.remainingLeft}px;` +
                `top:${state.remainingTop}px;` +
                `width:${state.remainingWidth}px;` +
                '}';

        this.runtimeStyle.innerHTML = str;
    },

    handleResize: function() {
        this.calculateSizes();
        this.updateRuntimeCSS();
    },

    showTimer: function() {
        this.hideConfig();
        this.timerSection.addClass("visible");
    },

    showEnd: function() {
        this.endSection.addClass("visible");
    },

    hideEnd: function() {
        this.endSection.removeClass("visible");
    },

    showConfig: function() {
        this.configSection.addClass("visible");
    },

    hideConfig: function() {
        this.configSection.removeClass("visible");
    },

};
