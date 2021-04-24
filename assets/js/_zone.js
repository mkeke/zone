const zone = {
    init: function() {

        // set corect values on range
        dom.range.setAttribute("min", conf.min);
        dom.range.setAttribute("max", conf.max);
        dom.range.setAttribute("value", conf.default);

        // set values on labels
        dom.min.innerHTML = this.createNumHTML(conf.min);
        dom.max.innerHTML = this.createNumHTML(conf.max);
        dom.value.innerHTML = this.createNumHTML(conf.default);

        // handle user interaction
        this.handleRangeMove();
        this.handleStartClick();
        this.handleCancelClick();
        this.handleTimerClick();
        this.handleEndClick();

        dom.showConfig();

        util.raf(this.run.bind(this));

    },

    handleRangeMove: function() {
        dom.range.addEventListener("input", function(e){
            dom.value.innerHTML = this.createNumHTML(dom.range.value);
        }.bind(this));
    },

    handleStartClick: function() {
        dom.start.addEventListener("click", function(e){
            e.preventDefault();
            state.minutes = parseInt(dom.range.value);
            state.start();
            dom.showTimer();
            dom.configSection.removeClass("initial");
        });
    },

    handleCancelClick: function() {
        dom.cancel.addEventListener("click", function(e){
            e.preventDefault();
            dom.hideConfig();
            log("cancel");
        });
    },

    handleTimerClick: function() {
        dom.timerSection.addEventListener("click", function(e){
            e.preventDefault();
            dom.showConfig();
        }.bind(this));
    },

    handleEndClick: function() {
        dom.endSection.addEventListener("click", function(e){
            state.start();
            dom.hideEnd();
        }.bind(this));
    },

    createNumHTML: function(num) {
        let str = "";
        let arr = ("" + num).split("");
        for(let i in arr) {
            str += `<span class="n${arr[i]}"></span>`;
        }
        return str;
    },

    run: function() {
        let time = Date.now();
        if (time - state.time > conf.delay) {
            state.time = time;

            if(state.running) {

                if(time > state.endTime) {
                    dom.showEnd();
                    state.running = false;
                } else {
                    // calculate elapsed time
                    let elapsed = time - state.startTime;

                    // determine the remaining angle
                    state.deg = 360 - (360 * elapsed / state.interval)%360;

                    // calculate dx and dy
                    let rad = state.deg * Math.PI / 180;
                    let dx = Math.cos(rad) * conf.r;
                    let dy = Math.sin(rad) * conf.r;

                    // translate coordinates to fit the rotated flip view
                    let x = conf.ox + dy;
                    let y = conf.oy - dx;
                    let f = state.deg < 180 ? "0 0 1" : "0 1 1";

                    // set the correct pie sector
                    dom.clock.setAttribute("d", `M${conf.ox},${conf.oy} v${-conf.r} A ${conf.r},${conf.r} ${f} ${x},${y} Z`);

                    let remainingMinutes = Math.ceil((state.interval-elapsed)/60000);
                    if (remainingMinutes !== state.lastRemaining) {
                        state.lastRemaining = remainingMinutes;
                        dom.remaining.innerHTML = this.createNumHTML(state.lastRemaining);
                    }

                }
            }
        }
        util.raf(this.run.bind(this));
    },

};