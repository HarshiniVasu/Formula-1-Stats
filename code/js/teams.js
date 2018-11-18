class Teams {
    constructor () {
        this.drawYearBar();
    }


    /**
     * Draws the year bar and hooks up the events of a year change
     */
    drawYearBar() {

        let that = this;

        let slider = createD3RangeSlider(1950, 2018, "#slider-container");
        slider.onChange(function(newRange){
            d3.select("#range-label").text(newRange.begin + " - " + newRange.end);
        });
        slider.range(1970,1980);
    }
}