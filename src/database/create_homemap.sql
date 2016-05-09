-- CREATE TABLE
CREATE TABLE "homemap" (
  "country" TEXT,
  "ntotal" INT, -- total number of participant comming from there
  "inst" TEXT, -- Inst from the country with the most representant to AGU
  "ninst" INT,  -- Number of people in the inst
  "section" TEXT, -- Most popular section according to the number of fellow
  "nsection" INT,-- number of people in that section
  PRIMARY KEY (country)    
);

INSERT INTO homemap
SELECT table0.country as country,
table0.c as ntotal,
table1.inst as inst ,b
table1.ninst as ninst,
table2.section as section,
table2.nsection as nsection
from 
(
-- table0
select country,count(distinct(name)) as c
from authors
group by country
) as table0,
-- table1
(select country,inst,max(n) as ninst
from (
select country,inst,n
from
(select authors.country as country ,p2a.inst as inst ,count(p2a.name) as n
from p2a
inner join authors
on p2a.name = authors.name
group by authors.country, p2a.inst)
order by n)
group by country
order by n) as table1,
-- table2
(select country,section,max(c) as nsection
from
(select au.country as country, pa.section as section, count(au.name) as c
from papers as pa ,p2a,authors as au
where pa.linkp =p2a.linkp and p2a.name=au.name
group by au.country,pa.section
order by c)
group by country
order by nsection) as table2

where table0.country=table1.country and table1.country=table2.country
order by ntotal;
