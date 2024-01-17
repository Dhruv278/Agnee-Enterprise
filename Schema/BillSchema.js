const mongoose = require('mongoose');

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
    invoiceDate:{
        type:String
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
    isGst:{
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
            required:true
        }
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
   


});

const Bill = mongoose.model('BIll', billSchema);
module.exports = Bill;
