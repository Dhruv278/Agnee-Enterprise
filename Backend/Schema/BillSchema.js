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
            return moment(value, 'YYYY/MM/DD').toDate();
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
        recipientName:{
            type:String,
            required:true
        },
        slug:{
            type:String,
            required:true
        },
        recipientGSTNo:{
            type:String
        },
        recipientEmail: {
            type: String,
            },
            recipientPhone:{
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
