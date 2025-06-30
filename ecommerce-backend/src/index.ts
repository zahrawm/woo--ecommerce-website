
import express from 'express';

import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth_routes';
import productRoutes from './routes/product_routes'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.PROD_CLIENT_URL : process.env.DEV_CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);



app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

