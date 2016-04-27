-- Insert primary key in papers
CREATE TABLE "papers2" (
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
  "id_paper" INTEGER,
  PRIMARY KEY (linkp)    
);

INSERT INTO papers2 
   SELECT * FROM papers;
DROP TABLE papers;
ALTER TABLE papers2 RENAME TO papers;

-- Insert primary key in authors
CREATE TABLE "authors2" (
"name" TEXT,
  "country" TEXT,
  "linka" TEXT,
  "address" TEXT,
  "id_author" INTEGER,
  PRIMARY KEY (linka)
);

INSERT INTO authors2 
   SELECT * FROM authors;
DROP TABLE authors;
ALTER TABLE authors2 RENAME TO authors;

-- Insert primary key in p2a
CREATE TABLE "p2a2" (
"id" INTEGER,
  "linkp" TEXT,
  "name" TEXT,
  PRIMARY KEY(id)
);

INSERT INTO p2a2 
   SELECT * FROM p2A;
DROP TABLE p2a;
ALTER TABLE p2a2 RENAME TO p2a;

