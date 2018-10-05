let express = require('express')
let hbs = require('hbs')
let fs = require('fs')
let uniqid = require('uniqid')
let app = express()

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

app.get('/rooms', (req,res) => {

    console.log(database)

    res.render('rooms', {
        title:'room listings',
        rooms:database
    })
    
})

app.get('/rooms/add/:roomName', (req,res) => {

    let id = uniqid()

    let render = {
        id: id,
        room_name: req.params.roomName,
        creation_time: Date.now()
    }

    res.render('add_room', {
        title:'add rooms',
        room_name: req.params.roomName,
        id:id,
        raw_json:JSON.stringify(render)
    })

    database.push(render)

    fs.writeFile('./statics/data/rooms.json', JSON.stringify(database), (err) => {
        if (err) throw err
        console.log('finished')
    })
})

app.get('/rooms/flush', (req,res) => {
    fs.writeFile('./statics/data/rooms.json', JSON.stringify([]), (err) => {
        if(err) throw err
        console.log('database wiped')
    })
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})

app.use(express.static('statics'))

app.set('view engine', 'hbs');
app.set('views', './views')