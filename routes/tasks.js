import express from 'express';

const router = express.Router();

//#region in-memory

const SEED_TASKS = [
    { id: 1, title: 'Bring meat', done: false },
    { id: 2, title: 'Bring eggs', done: true },
    { id: 3, title: 'Bring fish', done: false },
];

let TASKS = [...SEED_TASKS];

//#endregion

/**
 * @swagger
 * components:
 *   parameters:
 *     TaskId:
 *       name: id
 *       in: path
 *       required: true
 *       description: The ID of the task
 *       schema:
 *         type: integer
 *         example: 1
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - done
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique task ID
 *           example: 1
 *         title:
 *           type: string
 *           description: Task title
 *           example: "Learn OpenAPI"
 *         done:
 *           type: boolean
 *           description: Whether the task is completed
 *           example: false
 *     CreateTaskRequest:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the new task
 *           minLength: 1
 *           example: "Learn OpenAPI"
 *     UpdateTaskRequest:
 *       type: object
 *       required:
 *         - title
 *         - done
 *       properties:
 *         title:
 *           type: string
 *           description: Updated task title
 *           minLength: 1
 *           example: "Learn OpenAPI properly"
 *         done:
 *           type: boolean
 *           description: Whether the task is completed
 *           example: true
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Task 999 not found"
 *     TaskStats:
 *       type: object
 *       required:
 *         - total
 *         - done
 *         - open
 *       properties:
 *         total:
 *           type: integer
 *           description: Total number of tasks.
 *           example: 5
 *         done:
 *           type: integer
 *           description: Number of completed tasks.
 *           example: 3
 *         open:
 *           type: integer
 *           description: Number of incomplete tasks.
 *           example: 2
 */

/**
 * @swagger
 * /hello:
 *   get:
 *     summary: Say hello
 *     responses:
 *       200:
 *         description: Hello message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Hello World!"
 */
router.get('/hello', (req, res) => {
    res.send('Hello World!');
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API information
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Task API"
 *                 version:
 *                   type: string
 *                   example: "1.0"
 *                 endpoints:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["/tasks"]
 */
router.get('/', (req, res) => {
    res.send({ "name": "Task API", "version": "1.0", "endpoints": ["/tasks"] });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 */
router.get('/health', (req, res) => {
    res.send({ "status": "ok" });
});

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get tasks
 *     description: Returns all tasks, optionally filtered by completion status and title search.
 *     parameters:
 *       - name: done
 *         in: query
 *         required: false
 *         description: Filter tasks by completion status.
 *         schema:
 *           type: boolean
 *           example: true
 *       - name: search
 *         in: query
 *         required: false
 *         description: Search for tasks by title.
 *         schema:
 *           type: string
 *           example: "node"
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid query parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid task title
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/tasks', (req, res) => {
    const { done, search } = req.query;
    let filteredTasks = TASKS;

    if (done !== undefined) {
        if (done !== 'true' && done !== 'false') {
            return res.status(400).json({ error: 'done must be true or false' });
        }
        const isDone = done === 'true';
        filteredTasks = filteredTasks.filter(t => t.done === isDone);
    }

    if (search && search.trim() !== '') {
        const searchTerm = search.trim().toLowerCase();
        filteredTasks = filteredTasks.filter(t => t.title.toLowerCase().includes(searchTerm));
    }

    res.send(filteredTasks);
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     parameters:
 *       - $ref: '#/components/parameters/TaskId'
 *     responses:
 *       200:
 *         description: Task found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update a task
 *     parameters:
 *       - $ref: '#/components/parameters/TaskId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskRequest'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a task
 *     parameters:
 *       - $ref: '#/components/parameters/TaskId'
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = TASKS.find(t => t.id === id);
    if (!task) {
        return res.status(404).send({ "error": `Task ${id} not found` });
    }
    res.send(task);
});

router.post('/tasks', (req, res) => {
    const { title } = req.body;
    if (!title || typeof (title) != 'string' || title.trim() === '') {
        return res.status(400).json({ 'error': 'Title cannot be empty' });
    }
    const maxId = TASKS.reduce((max, task) => (task.id > max ? task.id : max), 0);
    const newTask = { id: maxId + 1, title: title.trim(), done: false };
    TASKS.push(newTask);
    res.status(201).json(newTask);
});

router.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const { title, done } = req.body;

    if (!title || typeof (title) != 'string' || title.trim() === '') {
        return res.status(400).json({ 'error': 'Title cannot be empty' });
    }
    if (typeof done !== 'boolean') {
        return res.status(400).json({ 'error': 'Done cannot be empty' });
    }

    const task = TASKS.find(t => t.id === id);
    if (!task) {
        return res.status(404).send({ "error": `Task ${id} not found` });
    }

    task.done = done;
    task.title = title.trim();
    return res.status(200).json(task);
});

router.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const taskIndex = TASKS.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: `Task ${id} not found` });
    }

    TASKS.splice(taskIndex, 1);
    return res.status(204).send();
});

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Get task statistics
 *     responses:
 *       200:
 *         description: Task statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskStats'
 */
router.get('/stats', (req, res) => {
    const totalTasks = TASKS.length;
    const doneTasks = TASKS.filter(t => t.done === true).length;
    const openTasks = TASKS.filter(t => t.done === false).length;

    return res.json({ total: totalTasks, done: doneTasks, open: openTasks });
});

/**
 * @swagger
 * /reset:
 *   post:
 *     summary: Reset tasks
 *     responses:
 *       200:
 *         description: Tasks successfully reset
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.post('/reset', (req, res) => {
    TASKS = SEED_TASKS.map(task => ({ ...task }));
    return res.status(200).json(TASKS);
});

export default router;