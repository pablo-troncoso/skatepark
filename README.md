# Desafío Skate Park

## Descripción

La Municipalidad de Santiago ha organizado una competencia de Skate para impulsar el nivel deportivo de los jóvenes que desean representar a Chile en los X Games del próximo año. Para ello, se ha desarrollado una plataforma web donde los participantes pueden registrarse y revisar el estado de su solicitud.

## Tecnologías Utilizadas

- Node.js
- Express
- Express-handlebars
- PostgreSQL
- JWT (JSON Web Token)
- Express-fileupload

## Instalación

1. Clona el repositorio:
    ```sh
    git clone https://github.com/usuario/repo.git
    ```
2. Instala las dependencias:
    ```sh
    npm install
    ```
3. Configura la base de datos PostgreSQL:
    ```sql
    CREATE DATABASE skatepark;

    CREATE TABLE skaters (
        id SERIAL,
        email VARCHAR(50) NOT NULL,
        nombre VARCHAR(25) NOT NULL,
        password VARCHAR(25) NOT NULL,
        anos_experiencia INT NOT NULL,
        especialidad VARCHAR(50) NOT NULL,
        foto VARCHAR(255) NOT NULL,
        estado BOOLEAN NOT NULL
    );
    ```

## Uso

1. Inicia la aplicación:
    ```sh
    npm start
    ```
2. Accede a `http://localhost:3000` en tu navegador.

## Funcionalidades

- Registro de nuevos participantes.
- Inicio de sesión con correo y contraseña.
- Modificación de datos del perfil (excepto correo electrónico y foto).
- Vista de todos los participantes registrados y su estado de revisión.
- Administración de participantes (aprobar o rechazar solicitudes).

## Requerimientos

1. **Crear una API REST con el Framework Express**
    - Implementar las rutas necesarias para el CRUD de participantes.
2. **Servir contenido dinámico con express-handlebars**
    - Utilizar plantillas Handlebars para renderizar las vistas.
3. **Ofrecer la funcionalidad Upload File con express-fileupload**
    - Implementar la subida de fotos de los participantes.
4. **Implementar seguridad y restricción de recursos o contenido con JWT**
    - Proteger las rutas privadas utilizando JSON Web Tokens.

## Consideraciones

- La vista correspondiente a la ruta raíz debe mostrar todos los participantes registrados y su estado de revisión.
- La vista del administrador debe mostrar los participantes registrados y permitir aprobarlos para cambiar su estado.
- La información de los usuarios debe persistir en PostgreSQL.

## Ejemplo de Código

### API REST

#### Obtener todos los participantes

```javascript
app.get('/api/skaters', (req, res) => {
    // Lógica para obtener todos los participantes
});
