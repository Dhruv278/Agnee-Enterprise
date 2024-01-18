const fs=require('fs');
const express=require('express');
const mongoose=require('mongoose')
const globalerror=require('./errorHandling/GlobalError')
const app=express();
const path=require('path');
const bodyParser=require('body-parser');

const dotenv=require('dotenv')
const cookieparser=require('cookie-parser')
const billController=require('./Controllers/BillCOntroller');
app.use(cookieparser())
app.use(bodyParser.json())
dotenv.config({path:'./config.env'});
const db=process.env.TYPE==='PRODUCTION'?process.env.DATABASE:process.env.DEVDATABASE;
mongoose.connect(db,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(con => console.log('database is connected'));


app.use(express.static(path.join(__dirname, '/Public/')));




app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views/'));


app.get('/',(req,res)=>{
    res.render('form');
})

app.post('/submitInvoiceData',billController.createBill);
app.get('/getBillData/:id',billController.getBillData);
app.post('/getFilterBillData',billController.getFilterBills);


app.use(globalerror)

const port=process.env.PORT ||3000;

const server=app.listen(port,()=>{
    console.log(`server is listing on port ${port}`);
})