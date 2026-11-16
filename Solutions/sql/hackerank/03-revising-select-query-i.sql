-- Display USA cities with a population greater than 100000.
SELECT *
FROM CITY
WHERE POPULATION > 100000
AND COUNTRYCODE = 'USA';