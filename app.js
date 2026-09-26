import express from 'express';

const app = express();
const port = 3000;

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/', (req, res) => {
    res.send({ "name": "Task API", "version": "1.0", "endpoints": ["/tasks"] });
});

app.get('/health', (req, res) => {
    res.send({ "status": "ok" });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});