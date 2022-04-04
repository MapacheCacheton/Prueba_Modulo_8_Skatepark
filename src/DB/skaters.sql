DROP DATABASE IF EXISTS skatepark;
CREATE DATABASE skatepark;

\c skatepark;

CREATE TABLE skaters (
    id SERIAL PRIMARY KEY, 
    email VARCHAR(50) NOT NULL UNIQUE, 
    name VARCHAR(25) NOT NULL, 
    password VARCHAR(25) NOT NULL, 
    experience INT NOT NULL, 
    speciality VARCHAR(50) NOT NULL, 
    photo VARCHAR(255) NOT NULL, 
    state BOOLEAN NOT NULL DEFAULT false,--0 en revision, 1 aprobado
    deleted BOOLEAN DEFAULT false, --0 borrado, 1 activo
    admin BOOLEAN DEFAULT false --0 skater, 1 admin
);


--Insertar nuevo skater
-- INSERT INTO skaters (email, name, password, experience, speciality, photo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING*;

--Traer info de todos los skaters
-- SELECT id, photo, name, experience, speciality, state FROM skaters WHERE deleted = 0;

--Editar info de un skater
-- UPDATE skaters SET name=$1, password=$2, experience=$3, speciality=$4 WHERE email=$5 RETURNING*;

--Editar estado
-- UPDATE skaters SET state=true WHERE id=1;

--Traes contraseña de un usuario con un email determinado para validad contraseña
-- SELECT password FROM skaters WHERE email='caballo@gmail.com';

-- INSERT INTO skaters (email, name, password, experience, speciality, photo) VALUES ('ñee@gmail.com', 'ñee', 'pass', 55, 'Imposible', 'no tiene');
