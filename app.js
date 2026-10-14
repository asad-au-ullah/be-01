import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import taskRoutes from './routes/tasks.js';

const app = express();
const port = 3000;

app.use(express.json());

// Swagger options configuration pointing to your routes folder[cite: 1]
const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Task API",
            description: "A simple REST API for managing tasks.",
            version: "1.0.0"
        },
        servers: [
            {
                url: `http://localhost:${port}`
            }
        ]
    },
    apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

// Explorer option enabled cleanly here
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Mount your task routes
app.use('/', taskRoutes);

console.log(JSON.stringify(specs.paths, null, 2));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});