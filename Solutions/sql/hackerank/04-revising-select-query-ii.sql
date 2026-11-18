-- Display names of USA cities with a population greater than 120000.
SELECT NAME
FROM CITY
WHERE POPULATION > 120000
AND COUNTRYCODE = 'USA';