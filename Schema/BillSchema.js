const mongoose = require('mongoose');
const moment = require('moment');


const billSchema = mongoose.Schema({
   products:[
    {
        name: {
            type: String,
            required: [true, "Please Enter Product name"],
          
    
        },
        
        quantity:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        total_amount:{
            type:Number,
            required:true
        },
    }
   ],
    final_amount:{
        type:Number,
    },
    isPaid:{
        type:Boolean,
        required:true
    },
    invoiceDate:{
        type:Date,
        set: function (value) {
            // Parse the incoming 'dd/mm/yyyy' string and convert it to a Date object
            return moment(value, 'DD/MM/YYYY').toDate();
          },
    },
    gst:{
        sgst:{
            type:Number
        },
        cgst:{
            type:Number
        }
    },
    totalBillAmmount:{
        type:Number,
        required:true,
    },
    billNo:{
        type:Number,
        
    },
    isGST:{
        type:Boolean,
        default:true
    },
    HSN:{
        type:Number,
        required:true
    },
    recipient:{
        name:{
            type:String,
            required:true
        },
        gst_no:{
            type:String
        },
        email: {
            type: String,
            },
        contact_no:{
            type:Number,
        }
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
   


});

const Bill = mongoose.model('BIll', billSchema);
module.exports = Bill;
