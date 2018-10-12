// Are we on the main page?
if (window.location.href === 'https://iu.instructure.com/') {
    var blackList = ['GPSG', 'Graduate and Professional Student Government'];
    var ticks = 0;

    var interval = setInterval(function () {
        if ($('#planner-todosidebar-item-list').length) {
            clearInterval(interval);
            removeTodo();
            console.log('To Do loaded after', ticks * 10, 'ms');
        }

        // Stop after 30s if it still hasn't loaded
        if (ticks++ > 3000)
            clearInterval(interval);
    }, 10);

    removeUpcoming();

    function removeTodo() {
        // Remove certain "To Do" items
        $('.ToDoSidebarItem__Title + span').filter(function (i, span) {
            return blackList.indexOf($(span).text()) !== -1;
        }).each(function (i, span) {
            $(span).closest('li').remove();
        });
    }

    function removeUpcoming() {
        // Removing certain "Coming Up" items
        $('.event-details p:first-of-type').filter(function (i, p) {
            return blackList.indexOf($(p).text()) !== -1;
        }).each(function (i, p) {
            $(p).closest('li').remove();
        });

        var $upcoming = $('.coming_up li.event');

        $upcoming.slice(0, 3).each(function (i, li) {
            $(li).show();
        });

        if ($upcoming.length > 3) {
            $('.coming_up .more_link').text(($upcoming.length - 3) + ' more in the next week ...');
        } else {
            $('.coming_up .more_link').closest('li').hide();
        }
    }
}

// Are we on the grades page?
if (/^https:\/\/iu.instructure.com\/courses\/\d+\/grades$/.test(window.location.href)) {
    (function () {
        var $grades = $('#student-grades-final');

        // Do we need the grades to be calculated?
        if ($grades.html().trim() === 'Calculation of totals has been disabled') {
            var totalScore = 0;
            var totalPossible = 0;

            $('tr.assignment_graded.student_assignment').each(function () {
                var $this = $(this);
                var $score = $this.children('.assignment_score');
                var $possible = $this.children('.points_possible');

                var score;
                var possible = +$possible.text();

                if ($score.find('.icon-check').length)
                    score = possible;
                else {
                    var $grade = $score.find('.grade').get(0);
                    var grade = $grade.childNodes[$grade.childNodes.length - 1].nodeValue.trim();

                    if (grade === '') {
                        $grade = $score.find('.score_value').get(0);
                        grade = $grade.childNodes[0].nodeValue.trim().split(' ')[0];
                        console.log(grade);
                    }

                    score = +grade;
                }

                totalScore += score;
                totalPossible += possible;
            });

            var percentage = Math.round(totalScore / totalPossible * 1000) / 10;
            var letterGrade = getLetterGrade(percentage);

            $grades.html(percentage + '%' + ' (' + letterGrade + ')').attr('title', totalScore + ' out of ' + totalPossible);

            function getLetterGrade(x) {
                if (x >= 97)
                    return 'A+';
                else if (x >= 93)
                    return 'A';
                else if (x >= 90)
                    return 'A-';

                else if (x >= 87)
                    return 'B+';
                else if (x >= 83)
                    return 'B';
                else if (x >= 80)
                    return 'B-';

                else if (x >= 77)
                    return 'C+';
                else if (x >= 73)
                    return 'C';
                else if (x >= 70)
                    return 'C-';

                else if (x >= 67)
                    return 'D+';
                else if (x >= 63)
                    return 'D';
                else if (x >= 60)
                    return 'D-';

                else return 'F';
            }
        }
    })();
}