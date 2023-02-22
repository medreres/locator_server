import express from 'express';
import dotenv from 'dotenv'
import locationRouter from './routes/location';
// arrange
const app = express();
dotenv.config();

// routes
app.use(locationRouter);

app.get('/', (req,res) => {
    res.send('Hello world')
})

// spin up 
app.listen(3000);