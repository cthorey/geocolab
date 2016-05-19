-- Insert  papers

CREATE TABLE "papers" (
"session" TEXT,
  "reference" TEXT,
  "title" TEXT,
  "abstract" TEXT,
  "tag" TEXT,
  "linkp" TEXT,
  "time" TEXT,
  "date" TEXT,
  "place" TEXT,
  "section" TEXT,
  "formatTitle" TEXT,  
  "id_paper" INTEGER,
  PRIMARY KEY (linkp)    
);

-- Insert  authors
CREATE TABLE "authors" (
"name" TEXT,
  "country" TEXT,
  "linka" TEXT,
  "address" TEXT,
  "id_author" INTEGER,
  PRIMARY KEY (linka)
);

-- create  p2a
CREATE TABLE "p2a" (
"id" INTEGER,
  "linkp" TEXT,
  "name" TEXT,
  "inst" TEXT,
  "formatName" TEXT,
  "inverseName" TEXT,
  PRIMARY KEY(id)
);
