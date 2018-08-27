// Only load on the calendar page
if (window.location.href.indexOf('https://apps.iu.edu/epto-prd/ViewCalendar.do') === 0) {
    (function () {
        var isDown = false; // Tracks status of mouse button
        var dayDown = false;

        var anchor; // The date that is clicked down on
        var nonAnchor; // The date that is dragged over while the mouse is down

        var $boxes = $('.day-field-generic'); // Boxes to highlight

        $(document)
            .mousedown(function () {
                isDown = true;
            })
            .mouseup(function () {
                isDown = false;
                dayDown = false;
            });

        // Click a day to populate the form
        $("td.pto-calendar-td")
            .mousedown(function (e) {
                var $this = $(this);
                var $day = $this.children('div.day-header-generic');

                // If it is a numbered cell (has a day)
                if ($day.length) {
                    dayDown = true;
                    setDate($('#addDateRange_fromDate, #addDateRange_toDate'), $day, true);
                    highlightDates($('#addDateRange_fromDate'), $('#addDateRange_toDate'));
                }
            })
            // If mouse dragged over other day, select range
            .mouseover(function (e) {
                if (dayDown) {
                    var $this = $(this);
                    var $day = $this.children('div.day-header-generic');

                    // If it is a numbered cell (has a day)
                    if ($day.length) {
                        setDate($('#addDateRange_toDate'), $day);
                        checkDates($('#addDateRange_fromDate'), $('#addDateRange_toDate'));
                        highlightDates($('#addDateRange_fromDate'), $('#addDateRange_toDate'));
                    }
                }
            })
            // Hide selection
            .css('user-select', 'none');

        // Sets the provided date to the provided picker, and determining whether to set the anchor date or not
        function setDate($picker, $day, setAnchor) {
            var day = $day.text().trim();

            var prev = $('a[href~=targetMonth]').attr('href').match(/targetMonth=(\d+)&year=(\d+)/);
            var prevMonth = +prev[1] + 1;
            var prevMonthYear = +prev[2];

            var currDate = new Date([prevMonth, 1, prevMonthYear].join('/'));
            currDate.addMonths(1);
            currDate.setDate(day);

            if (setAnchor)
                anchor = currDate;
            else
                nonAnchor = currDate;

            $picker.val(currDate.toString('MM/dd/yyyy'));
        }

        // Swap dates if necessary
        function checkDates($from, $thru) {
            if ($from.val() && $thru.val() && anchor && nonAnchor) {
                if (anchor > nonAnchor) {
                    $from.val(nonAnchor.toString('MM/dd/yyyy'));
                    $thru.val(anchor.toString('MM/dd/yyyy'));
                } else {
                    $from.val(anchor.toString('MM/dd/yyyy'));
                    $thru.val(nonAnchor.toString('MM/dd/yyyy'));
                }
            }
        }

        // Highlight selected days
        function highlightDates($from, $thru) {
            $boxes.css('background', null);

            if ($from.val() && $thru.val()) {
                var fromDate = new Date($from.val());
                var thruDate = new Date($thru.val());

                // Make sure date are in order
                if (fromDate > thruDate) {
                    fromDate = thruDate;
                    thruDate = new Date($from.val());
                }

                var fromIndex = fromDate.getDate() - 1;
                var thruIndex = thruDate.getDate() - 1;

                for (var i = fromIndex; i <= thruIndex; i++)
                    $($boxes[i]).css('background', 'yellow');
            }
        }
    })();
}