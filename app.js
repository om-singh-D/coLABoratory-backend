import express from 'express';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import connectDB from './db/db.js'; 
import cookieParser from 'cookie-parser';
const app = express();
import cors from 'cors';
import projectRoutes from './routes/project.route.js';


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
// Database connection
connectDB();

// Routes
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

export default app;