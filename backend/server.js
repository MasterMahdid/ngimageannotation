const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const shortid = require('shortid');
// handling CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin",
        "http://localhost:4200");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());

/*app.get('*', function(req,res) {
    res.sendFile(path.resolve('../frontend/dist/ngimageannotation/index.html'));
});*/
// route for handling requests from the Angular client
app.use(express.static('../frontend/dist/ngimageannotation/'));

app.get('/api/annotations/reset', (req, res) => {
    fs.readdirSync('data').forEach(file => {
        let p = 'data/' + file;
        fs.unlinkSync(p);
    });
    const def = {
        "type": "detection",
        "dnn_model": "M001A",
        "confidence": 99.9,
        "object": "neutrophil",
        "object_version": "N01A",
        "x": 464,
        "y": 843,
        "width": 29,
        "height": 32
    }
    fs.writeFileSync('data/default', JSON.stringify(def));
    res.json({ message: "ok" });
});

app.get('/api/annotations', (req, res) => {
    let anns = [];
    fs.readdirSync('data').forEach(file => {
        let str = fs.readFileSync('data/' + file, 'utf8');
        anns.push(JSON.parse(str));
    });
    res.json({ message: "ok", annotations: anns });
});
app.post('/api/annotations', (req, res) => {
    let str = JSON.stringify(req.body)
    let id = shortid.generate();
    fs.writeFileSync('data/' + id, str);
    res.json({ message: 'ok', id: id });
});
app.put('/api/annotations/:id', (req, res) => {
    const p = 'data/' + req.params.id;
    if (!fs.existsSync(p)) {
        res.status(400).send({ message: 'Annotation does not exist ' + p });
        return;
    }
    let str = JSON.stringify(req.body)
    fs.writeFileSync(p, str);
    res.json({ message: 'ok' });
});
app.delete('/api/annotations/:id', (req, res) => {
    const p = 'data/' + req.params.id;
    if (!fs.existsSync(p)) {
        res.status(400).send({ message: 'Annotation does not exist ' + p });
        return;
    }
    fs.unlinkSync(p);
    res.json({ message: 'ok' });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});