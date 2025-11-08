import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import bookRoutes from './routes/Book.routes.js';
import ordersRoutes from './routes/order.routes.js';
import aiRoutes from './routes/Ai.routes.js';

const app = express();
const PORT = 3000;
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send('Book store app is running');
});
app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)
app.use("/api/order", ordersRoutes)
app.use("/api/ai", aiRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});