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
    git clone https://github.com/pablo-troncoso/skatepark.git
    ```
2. Instala las dependencias:
    ```sh
    npm install
    ```
3. Configura la base de datos PostgreSQL:
    - La configuración y creación de tablas están en el archivo `config/database.sql`.

## Uso

1. Inicia la aplicación:
    ```sh
    node index
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
## Capturas de Pantalla

### Vista de Inicio del Servidor

![Inicio del Servidor](https://github.com/pablo-troncoso/skatepark/blob/main/images/skatepark01.jpg)

### Vista de Administración

![Administración](https://github.com/pablo-troncoso/skatepark/blob/main/images/skatepark06%20administracion.png)

### Vista de Datos del Perfil

![Datos del Perfil](https://github.com/pablo-troncoso/skatepark/blob/main/images/skatepark05%20datos.png)

### Vista de Inicio de Sesión

![Inicio de Sesión](https://github.com/pablo-troncoso/skatepark/blob/main/images/skatepark04%20inicio.png)

### Vista de Registro

![Registro](https://github.com/pablo-troncoso/skatepark/blob/main/images/skatepark03%20registros.png)

### Vista de Lista de Participantes

![Lista de Participantes](https://github.com/pablo-troncoso/skatepark/blob/main/images/skatepark02%20participantes.png)

## Consideraciones

- Utilizar las credenciales proporcionadas en el archivo `agents.js`.
- La interfaz puede ser personalizada mientras cumpla con los requerimientos.
