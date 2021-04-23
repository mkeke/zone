const state = {
    debugLevel: null,
    time: null,

    // px size of clock svg
    clockSize: null,

    // current angle (in degrees) of pie chart countdown
    deg: null,

    // total interval time in milliseconds
    interval: null,

    // start and end time of countdown
    startTime: null,
    endTime: null,

    // last calculated digit, to determine if they should be updated or nah
    lastRemaining: null,

    init: function() {
        this.debugLevel = 0;

        // timer for animation loop
        this.time = Date.now();

    },

    start: function() {
        this.deg = 360;
        this.interval = conf.minutes * 60 * 1000;

        // set + calc timestamps
        this.startTime = Date.now();
        this.endTime = this.startTime + this.interval;

        this.lastRemaining = 0;
    }
};
