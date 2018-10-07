let express = require('express')
let hbs = require('express-handlebars')
let fs = require('fs')
let bodyParser = require('body-parser')
let uniqid = require('uniqid')
let app = express()

app.use(express.static('./statics'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('hbs', hbs({
    extname:'hbs',
    defaultLayout:'default',
    layoutsDir:'./views/layouts',
    partialsDir:'./views/partials'
}))
app.set('views', './views')
app.set('view engine', 'hbs');

let database = fs.readFile('./statics/data/rooms.json', (err, data) => {

    if(err) {
        console.log(err)
        throw err
    }

    database = JSON.parse(data)
})

app.get('/', (req,res) => {
    res.render('index', {
        title:'index/home page'
    })
})

app.route('/rooms')
    .get((req,res) => {

        let rendered = resize([database], Math.ceil(database.length/3), 3)

        remainder = Math.ceil(database.length/3)*3-database.length

        for(i = 0; i < remainder; i++){
            rendered[rendered.length-1].pop()
        }

        res.render('rooms', {
            title:'room listings',
            rooms:rendered,
            room_link:`${__dirname}/rooms/`
        })
    })
    .post((req,res) => {
        let new_room = {
            id:uniqid(),
            room_name:req.body.room_name,
            creation_time:Date.now(),
            notes:[]
        }

        database.push(new_room)

        updateDatabase()
    })

app.route('/rooms/:id')
    .get((req,res) => {

        let room_details = database.filter((data) => {
            return data.id === req.params.id
        })

        res.render('room_view', {
            title:room_details[0].room_name,
            id:room_details[0].id,
            notes:room_details[0].notes
        })

    })
    .post((req,res) => {

        let index = database.findIndex((data) => {
            return data.id === req.params.id
        })

        database[index].notes.push({
            id:uniqid(),
            title:req.body.title,
            notes:req.body.notes
        })

        updateDatabase()
    })

app.get('/rooms/delete/flush', (req,res) => {
    fs.writeFile('./statics/data/rooms.json', JSON.stringify([]), (err) => {
        if(err) throw err
        console.log('database wiped')
    })
    res.send('rooms flushed')
})

app.get('/rooms/delete/are_you_sure', (req,res) => {
    res.render('delete', {
        title:'Removing Rooms'
    })
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})

let updateDatabase = () => {
    fs.writeFile('./statics/data/rooms.json', JSON.stringify(database, null, '\t'), (err) => {
        if (err) throw err
        console.log('finished')
    })  
}

function resize(array, i, j) {
    var gen = array.reduce((a, b) => a.concat(b))[Symbol.iterator]();
    
    return Array.from({ length: i }, _ => Array.from({ length: j }, _ => gen.next().value));
}