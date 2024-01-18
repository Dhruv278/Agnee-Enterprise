const catchAsync=require('./../errorHandling/cathError');
const ErrorFormate=require('./../errorHandling/ErrorFormate');
const Bill=require('./../Schema/BillSchema');
const Company=require('./../Schema/companySchema');

exports.createBill=catchAsync(async(req,res,next)=>{
    const billData=req.body;
    var final_amount=0;
    billData.products.forEach((product)=>{
        final_amount=final_amount+parseFloat(product.total_amount);
    })
    billData.final_amount=parseFloat(final_amount.toFixed(2));
    let companyData=await getBillNo();
    billData.HSN=companyData.HSN
    billData.isPaid=billData.isPaid ? billData.isPaid : true;
    let totalGst=0;
    if(billData.isGST){
        billData.billNo=companyData.billNo;
        billData.gst={};
        billData.gst.sgst=(billData.final_amount*(0.09)).toFixed(2);
        billData.gst.cgst=(billData.final_amount*(0.09)).toFixed(2);
         totalGst=parseFloat(billData.gst.sgst)+parseFloat(billData.gst.cgst);
        await IncreaseBillNumber(companyData.billNo + 1);
        // console.log("total GST",totalGst);
    }
    billData.totalBillAmmount=Math.round(billData.final_amount+totalGst);

    let newBillData;

         newBillData=await Bill.create(billData);
    // console.log(newBillData)
    res.status(200).json({
        status:"success",
        billData:newBillData
    })
})


exports.getBillData=catchAsync(async(req,res,next)=>{
    const billId=req.params.id;
    // await createCompanyInfo();
    const billData=await Bill.findById(billId);
    console.log(req.query);
    if(!billData)return next(new ErrorFormate('Invalid bill id',500));
    if(req.query.isGST==='false'){
        console.log(billData)
        const deletData=await Bill.findByIdAndDelete(billData._id);
    }
    console.log(billData)
    res.render('bill',{
        billData,
        currentPage:'Home'
    });
})



exports.getFilterBills=catchAsync(async(req,res,next)=>{
        const BillData=await Bill.find(req.body.query);
        res.status(200).json({
            BillData
        }) 
})



async function  createCompanyInfo(){
   await Company.create({billNo:1,HSN:9602});
}

async function getBillNo(){
    let id=process.env.TYPE==="PRODUCTION"?'65a8bfafdfb9d72bd46f3a6f':'65a6a1efa5c99e42c492b67c';
    return await Company.findById(id);
}

async function IncreaseBillNumber(no){
    let id=process.env.TYPE==="PRODUCTION"?'65a8bfafdfb9d72bd46f3a6f':'65a6a1efa5c99e42c492b67c';
   
    await Company.findByIdAndUpdate(id,{billNo:no});
}