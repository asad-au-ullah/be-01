import express from 'express';

//#region in-memory
// id (number), title (text), done (true/false).
const TASKS = [
    { id: 1, title: 'Bring meat', done: false },
    { id: 2, title: 'Bring eggs', done: true },
    { id: 3, title: 'Bring fish', done: false },
]

//#endregion

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

app.get('/tasks', (req, res) => {
    res.send(TASKS);
})

app.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id)
    const task = TASKS.find(t => t.id === id)
    if (!task) {
        res.status(404).send({ "error": `Task ${id} not found` });
    }
    res.send(task)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});