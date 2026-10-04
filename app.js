import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './openapi.json' with { type: 'json' };

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

app.use(express.json())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


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
    let filteredTasks = TASKS;

    const { done } = req.query;

    if (done !== undefined) {
        filteredTasks = filteredTasks.filter(
            t => t.done === (done === 'true')
        );
    }

    res.send(filteredTasks);
})

app.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id)
    const task = TASKS.find(t => t.id === id)
    if (!task) {
        return res.status(404).send({ "error": `Task ${id} not found` });
    }
    res.send(task)
})

app.post('/tasks', (req, res) => {
    const { title } = req.body;

    if (!title || typeof (title) != 'string' || title.trim() === '') {
        return res.status(400).json({ 'error': 'Title cannot be empty' });
    }

    const maxId = TASKS.reduce((max, task) => (task.id > max ? task.id : max), 0);
    const newId = maxId + 1;

    const newTask = { id: newId, title: title.trim(), done: false }

    TASKS.push(newTask)

    res.status(201).json(newTask)
});

app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const { title, done } = req.body;

    if (!title || typeof (title) != 'string' || title.trim() === '') {
        return res.status(400).json({ 'error': 'Title cannot be empty' });
    }

    if (typeof done !== 'boolean') {
        return res.status(400).json({ 'error': 'Done cannot be empty' });
    }

    const task = TASKS.find(t => t.id === id)
    if (!task) {
        return res.status(404).send({ "error": `Task ${id} not found` });
    }

    task.done = done;
    task.title = title.trim();

    return res.status(200).json(task);

});

app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const taskIndex = TASKS.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: `Task ${id} not found` });
    }

    TASKS.splice(taskIndex, 1);

    return res.status(204).send();
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});