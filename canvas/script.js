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
                    score = possible
                else {
                    var $grade = $score.find('.grade').get(0);
                    score = +$grade.childNodes[$grade.childNodes.length - 1].nodeValue;
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