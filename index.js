const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose')
const globalerror = require('./Backend/errorHandling/GlobalError')
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors')
const dotenv = require('dotenv')
const cookieparser = require('cookie-parser')
const billController = require('./Backend/Controllers/BillCOntroller');
app.use(cookieparser())
app.use(bodyParser.json())
dotenv.config({ path: './config.env' });
const db = process.env.TYPE === 'PRODUCTION' ? process.env.DATABASE : process.env.DEVDATABASE;
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(con => console.log('database is connected'));

app.use(cors());



app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'Backend/views/'));




app.post('/api/v1/submitInvoiceData', billController.createBill);
app.get('/api/v1/getBillData/:id', billController.getBillData);
app.post('/api/v1/getFilterBillData', billController.getFilterBills);
app.get('/api/v1/getMonthData',billController.getDataByMonths)
app.get('/api/v1/getBillByMonth',billController.getBillByMonth)
app.get("/api/test",(req,res)=>{
    res.status(200).json({
        message:"success"
    })
})
if(process.env.TYPE="PRODUCTION"){

    app.use(express.static(path.join(__dirname, '/frontend/build')));
    app.get('*', (req, res) => {
    console.log("calling");
        console.log(__dirname, '/frontend/build')
        console.log(path.join(__dirname, './frontend/build/index.html'))
        res.sendFile(path.resolve(__dirname, './frontend/build/index.html'))
    })

}
app.use(globalerror)

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
    console.log(`server is listing on port ${port}`);
})