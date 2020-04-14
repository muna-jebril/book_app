DROP TABLE IF EXISTS studnet;

CREATE TABLE studnet (
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    title VARCHAR(255),
    isbn VARCHAR(255),
    img_url VARCHAR(255),
     description TEXT,
     bookshelf VARCHAR(255)
);

INSERT INTO studnet (author,title,isbn,img_url,description,bookshelf) VALUES ('hello','muna','Razan','jebril','zzz','dd');
