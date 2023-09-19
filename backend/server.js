const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const shortid = require('shortid');
// handling CORS
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
    let def = {
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
    def = {
        "type": "manual",
        "dnn_model": "0",
        "confidence": 0,
        "object": "another object",
        "object_version": "ver1",
        "x": 100,
        "y": 300,
        "width":40,
        "height": 80
    }
    fs.writeFileSync('data/default2', JSON.stringify(def));
    def = {
        "type": "manual",
        "dnn_model": "",
        "confidence": 0,
        "object": "some object",
        "object_version": "ver1",
        "x": 200,
        "y": 200,
        "width": 75,
        "height": 100
    }
    fs.writeFileSync('data/default3', JSON.stringify(def));
    res.json({ message: "ok" });
});

app.get('/api/annotations', (req, res) => {
    let anns = [];
    fs.readdirSync('data').forEach(file => {
        let str = fs.readFileSync('data/' + file, 'utf8');
        let obj = JSON.parse(str);
        obj['id'] = file;
        anns.push(obj);
    });
    res.json(anns);
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