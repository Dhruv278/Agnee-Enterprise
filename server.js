const fs=require('fs');
const express=require('express');
const mongoose=require('mongoose')
const globalerror=require('./errorHandling/GlobalError')
const app=express();
const path=require('path');


const dotenv=require('dotenv')
const cookieparser=require('cookie-parser')
app.use(cookieparser())
dotenv.config({path:'./config.env'});
const db=process.env.DATABASE;
mongoose.connect(db,{ 
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
}).then(con => console.log('database is connected'));




app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname,'Public')))
app.set('view engine','pug')
app.set('views',path.join(__dirname,'views/'));

app.use(globalerror)

const port=process.env.PORT ||3000;

const server=app.listen(port,()=>{
    console.log(`server is listing on port ${port}`);
})