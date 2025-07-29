import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import { createServer } from "http";
import { errorMiddleware } from "./middleware/error.middleware.js";
import appRouter from './routes/v1-routes.js';

const app = express();
const server = createServer(app);

app.use(cors());
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// define routes here
app.use( '/api/v1', appRouter );

// define global error handler here
app.use( errorMiddleware );

//export server and app
export { app, server };
