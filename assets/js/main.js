/* include zquery */
/* file:zquery.js */

zz.loadReady(function(){
    //=require _*.js
    util.init();
    dom.init();
    state.init();

    handleEndClick();
    dom.timerSection.addClass("visible");
    state.start();
    util.raf(run);

    function handleEndClick() {
        dom.endSection.addEventListener("click", function(e){
            state.start();
            dom.endSection.removeClass("visible");
        });
    }

    function createNumHTML(num) {
        let str = "";
        let arr = ("" + num).split("");
        for(let i in arr) {
            str += `<span class="n${arr[i]}"></span>`;
        }
        return str;
    }

    function run() {
        let time = Date.now();
        if (time - state.time > conf.delay) {
            state.time = time;

            if(time > state.endTime) {
                dom.endSection.addClass("visible");
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

                dom.clock.innerHTML = 
                    `<path fill="red" d="M${conf.ox},${conf.oy} v${-conf.r} A ${conf.r},${conf.r} ${f} ${x},${y} Z" />`;

                let remainingMinutes = Math.ceil((state.interval-elapsed)/60000);
                if (remainingMinutes !== state.lastRemaining) {
                    state.lastRemaining = remainingMinutes;
                    dom.digits.innerHTML = createNumHTML(state.lastRemaining);
                }

            }
        }
        util.raf(run);
    }
});
