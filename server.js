import express from 'express';
import { APP_PORT,DB_URL } from './config';
import router from './routes';
import errorHandler from './middlewares/errorHandlers';
import mongoose from 'mongoose';



const app = express();

//Mongo DB connection
mongoose.connect(DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("DB Connected successfully");
});



app.use(express.json());
app.use('/api/',router);
app.use(errorHandler);

app.listen(APP_PORT,()=>{
    console.log(`Server is running at ${APP_PORT}`)
})