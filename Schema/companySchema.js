const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
    billNo:{
        type:Number,
        require:true
    },
    HSN:{
        type:Number,
        required:true,
    }
});


const Company = mongoose.model('Company', companySchema);
module.exports = Company;
