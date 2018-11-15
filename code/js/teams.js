class Teams {
    constructor () {
        this.activeYear = 1990;
        this.drawYearBar();
    }


    /**
     * Draws the year bar and hooks up the events of a year change
     */
    drawYearBar() {

        let that = this;

        //Slider to change the activeYear of the data
        let yearScale = d3.scaleLinear().domain([1950, 2018]).range([30, 730]);

        let yearSlider = d3.select('#year-slider')
            .append('div').classed('slider-wrap', true)
            .append('input').classed('slider', true)
            .attr('type', 'range')
            .attr('min', 1950)
            .attr('max', 2018)
            .attr('value', this.activeYear);

        let sliderLabel = d3.select('.slider-wrap')
            .append('div').classed('slider-label', true)
            .append('svg');

        let sliderText = sliderLabel.append('text').text(this.activeYear);

        sliderText.attr('x', yearScale(this.activeYear));
        sliderText.attr('y', 25);

        yearSlider.on('input', function() {
            that.activeYear = this.value;
            sliderText.text(this.value);
            sliderText.attr('x', yearScale(this.value));
        });

        yearSlider.on('click', function() {
            d3.event.stopPropagation();
        });
    }
}