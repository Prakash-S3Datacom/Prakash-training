-- Find the difference between total city entries and unique city names.
SELECT COUNT(CITY) - COUNT(DISTINCT CITY)
FROM STATION;