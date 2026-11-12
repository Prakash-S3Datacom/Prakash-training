
-- 1. Display student names along with their enrolled course names.
SELECT s.student_name, c.course_name
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
INNER JOIN courses c ON e.course_id = c.course_id;


-- 2. Count how many enrollments each course has.
SELECT c.course_name, COUNT(e.enrollment_id) AS total_enrollments
FROM courses c
INNER JOIN enrollments e ON c.course_id = e.course_id
GROUP BY c.course_name;


-- 3. Find the average marks obtained in each course.
SELECT c.course_name, ROUND(AVG(e.marks), 2) AS average_marks
FROM courses c
INNER JOIN enrollments e ON c.course_id = e.course_id
GROUP BY c.course_name;


-- 4. Display students who scored more than 80 marks.
SELECT s.student_name, e.marks
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
WHERE e.marks > 80;


-- 5. Find the highest marks in each course.
SELECT c.course_name, MAX(e.marks) AS highest_marks
FROM courses c
INNER JOIN enrollments e ON c.course_id = e.course_id
GROUP BY c.course_name;


-- 6. Find students who have not enrolled in any course.
SELECT s.student_id, s.student_name
FROM students s
LEFT JOIN enrollments e ON s.student_id = e.student_id
WHERE e.enrollment_id IS NULL;


-- 7. Find courses whose fees are greater than the average course fee.
SELECT course_name, fee
FROM courses
WHERE fee > (SELECT AVG(fee) FROM courses);


-- 8. Find enrollments where marks are greater than the overall average marks.
SELECT s.student_name, e.marks
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
WHERE e.marks > (SELECT AVG(marks) FROM enrollments);


-- 9. Find the course with the highest number of enrollments.
SELECT c.course_name, COUNT(e.enrollment_id) AS total_enrollments
FROM courses c
INNER JOIN enrollments e ON c.course_id = e.course_id
GROUP BY c.course_name
ORDER BY total_enrollments DESC
LIMIT 1;


-- 10. Find courses that have no enrollments.
SELECT c.course_id, c.course_name
FROM courses c
WHERE NOT EXISTS (
    SELECT 1
    FROM enrollments e
    WHERE e.course_id = c.course_id
);
