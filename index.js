// Importo express
const express= require('express');
const app = express();

// Morgan para Logger desde consola
const morgan = require('morgan');

// Para permitir solicitudes de todos los origenes
const cors = require('cors');


// Para poder leer el bodty de la solicitud HTTP POST
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))


// Crando el token para obtener el body en caso de solicitud http
morgan.token('body', (req, res) => {
if(req.method === 'POST'){
    return JSON.stringify(req.body);
}else{
    return "Isn't POST method"
}
});
app.use(morgan(':method :url :response-time :body'))

// Permitir solicitudes de todos los origenes
app.use(cors());



// Personsas de la agenda
let notes = [
        {
          "id": 1,
          "content": "HTML is easy",
          "date": "2019-05-30T17:30:31.098Z",
          "important": false
        },
        {
          "id": 2,
          "content": "Browser can execute only JavaScript",
          "date": "2019-05-30T18:39:34.091Z",
          "important": true
        },
        {
          "id": 3,
          "content": "GET and POST are the most important methods of HTTP protocol",
          "date": "2019-05-30T19:20:14.298Z",
          "important": false
        },
        {
          "content": "Nueva Nota",
          "important": false,
          "id": 4
        },
        {
          "content": "Otra nueva nota",
          "important": false,
          "id": 5
        },
        {
          "content": "cuba",
          "important": true,
          "id": 6
        },
        {
          "content": "sd",
          "important": true,
          "id": 7
        },
        {
          "content": "a",
          "important": false,
          "id": 8
        },
        {
          "content": "dcasdas",
          "important": false,
          "id": 9
        },
        {
          "content": "Perro",
          "important": false,
          "id": 10
        }
];

//      ==> Ejercicio 3.1 <==
// Solicitud HTTP GET a la ruta /api/persons  
app.get('/api/notes', (request, response) => {
    response.json(notes);
})

//       ==> Ejercicio 3.2  <==
// Solicitud HTTP GET a la ruta localhost:3001/info
app.get('/info', (request, response) => {
    const date = new Date();
    const dateText = date.toDateString();
    const dateTimeText = date.toTimeString();
    const dateGTM = date.getTimezoneOffset();
    const dateCompleta = `${dateText} ${dateTimeText} ${dateGTM}`;
    
    const cantNotes = notes.length;
    const show = `
    <p>Phonebook has info for ${cantNotes} people</p>
    <p>${dateCompleta}</p>
    `
    response.send(show);
})

//       ==> Ejercicio 3.3  <==
// Acceder a una sola persona
app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id); // ==> id de la url
    const note = notes.find(person => person.id === id); // busco a la persona correspondiente con ese id

    if (!note){
        response.status(404).end(); // si no se encuentra a la persona se respondera con el codigo 404
    }else{
        response.json(note);      // si se encuentra se devolvera a la persona
    }
})

//       ==> Ejercicio 3.4  <==
// Solicitud HTTP DELETE para eliminar una persona
app.delete('/api/notes/:id', (request, response) => {
    const id  = Number(request.params.id);
    const newNotes = notes.filter(person => person.id !== id); // Ahora person van a ser todas las que no sean ese id

    response.json(newNotes);
})

//       ==> Ejercicio 3.5  <==
// Solicitud HTTP POST para agregar nuevas personas
app.post('/api/notes', (request, response) => {
    const body = request.body;

    //       ==> Ejercicio 3.6  <==
    // Manejo de errores
    if (!body.content || !body.important){
       // Si no se entran parametros como nombre o numero
       return response.status(400).json({ 
           error: 'Content or important missing' 
         })
    }

    // if (persons.find(person => person.name === body.name)){
    //     // Si el nombre de la persona se encuentra ya en la agenda
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    // Creo la nueva nota
    const newNote= {
        id: generarId(),
        content: body.content,
        important: body.important
      }

    // Agrego la nueva persona a la lista
    // persons = persons.concat(newPerson);
    notes = notes.concat(newNote)
    response.json(notes)
})


// Solicitud PUT
app.put('/api/notes/:id', (request, response) => {

  const id = String(Number(request.params.id) - 1 );
  const important = request.body.important;
  const note = notes[id];
 
  console.log(important);

  note.important = !important;
  
  console.log(note);
  response.json(note)
})

// FUNCION PARA GENERAR ID
const generarId = () => {
    const newId = Math.max(...notes.map(note => note.id));
    return newId + 1
}


const PORT = process.env.PORT || 3001; // para que funcione en Heroku
app.listen(PORT, () => {
    console.log(`Puerto: ${PORT} a la estcucha...`);
})