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
    billData.billNo=companyData.billNo;
    billData.HSN=companyData.HSN
    await IncreaseBillNumber(companyData.billNo + 1);
    if(true){
        billData.gst={};
        billData.gst.sgst=(billData.final_amount*(0.09)).toFixed(2);
        billData.gst.cgst=(billData.final_amount*(0.09)).toFixed(2);
        let totalGst=parseFloat(billData.gst.sgst)+parseFloat(billData.gst.cgst);
        console.log("total GST",totalGst);
        billData.totalBillAmmount=Math.round(billData.final_amount+totalGst);
    }

    let newBillData;
    console.log(billData);
    try{

         newBillData=await Bill.create(billData);
    }catch(err){
        console.log(err);
    }

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
    res.render('bill',{
        billData,
        currentPage:'Home'
    });
})
async function  createCompanyInfo(){
   await Company.create({billNo:1,HSN:9602});
}

async function getBillNo(){
    return await Company.findById('65a6a1efa5c99e42c492b67c')
}

async function IncreaseBillNumber(no){
    await Company.findByIdAndUpdate('65a6a1efa5c99e42c492b67c',{billNo:no});
}