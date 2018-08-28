(function () {
    var $ = jQuery;

    var $scrollView = $('#highlight_strip');
    var $scrollContent = $('#highlight_strip_scroll');
    
    var minScrollLeft = $scrollView.width() - $scrollContent.width();

    var $sliderContainer = $('#highlight_slider');
    var $slider = $('#highlight_slider').find('.handle');

    var maxSliderLeft = $sliderContainer.width() - $slider.width();

    $scrollView.on('wheel', function (e) {
        // side scroll
        if (e.originalEvent.deltaX) {
            e.preventDefault();

            // determine scroll position
            var scrollLeft = parseInt($scrollContent.css('left')) - e.originalEvent.deltaX;
            scrollLeft = Math.max(minScrollLeft, Math.min(0, scrollLeft));

            // update scroll position
            $scrollContent.css('left', scrollLeft);

            // determine slider position
            var sliderLeft = maxSliderLeft * scrollLeft / minScrollLeft;

            // update slider position
            $slider.css('left', sliderLeft);
        }
    });
})();
