import express from 'express';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import connectDB from './db/db.js'; 
import cookieParser from 'cookie-parser';
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
// Database connection
connectDB();

// Routes
app.use('/api/users', userRoutes);


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

export default app;