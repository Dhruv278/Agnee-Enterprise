const catchAsync=require('./../errorHandling/cathError');
const ErrorFormate=require('./../errorHandling/ErrorFormate');
const Bill=require('./../Schema/BillSchema');
const Company=require('./../Schema/companySchema');
const moment = require('moment');
const XLSX = require('xlsx');
const fs = require('fs');

exports.createBill=catchAsync(async(req,res,next)=>{
    const billData=req.body;
    var final_amount=0;
    // // console.log(req.body)
    billData.recipient.slug=createSlug(billData.recipient.recipientName);
    billData.products.forEach((product)=>{
        final_amount=final_amount+parseFloat(product.total_amount);
    })
    billData.final_amount=parseFloat(final_amount.toFixed(2));
    let companyData=await getBillNo();
    // // console.log(companyData)
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
        // // console.log("total GST",totalGst);
    }
    billData.totalBillAmmount=Math.round(billData.final_amount+totalGst);

    let newBillData=billData;
        if(billData.isGST)
         newBillData=await Bill.create(billData);
        else{
            billData._id='temp_id'
        }
    // // console.log(newBillData)
    res.status(200).json({
        status:"success",
        data:newBillData
    })
})


exports.getBillData=catchAsync(async(req,res,next)=>{
    const billId=req.params.id;
    // await createCompanyInfo();
    const billData=await Bill.findById(billId);
    // console.log(req.query);
    if(!billData)return next(new ErrorFormate('Invalid bill id',500));
    if(!billData.isGST){
        // console.log(billData)
        const deletData=await Bill.findByIdAndDelete(billData._id);
    }
    // console.log(billData)
    res.status(200).json({
        billData,
        status:'success',
    });
})



exports.getFilterBills=catchAsync(async(req,res,next)=>{
     let query={};
     let options=req.body.options;
     // console.log(req.body,)
    // Filter by recipient name
    if (options.recipientName) {
        query['recipient.slug'] = {
          $regex: new RegExp(createSlug(options.recipientName), 'i'),
        };
      }
  
      // Filter by date range
      if (options.startDate && options.endDate) {
        query.invoiceDate = { $gte:new Date(options.startDate), $lte:  new Date(options.endDate) };
      }
  
      // Filter by bill number
      
      // Filter by isPaid status
      if (options.isPaid !== undefined) {
          query.isPaid = options.isPaid;
        }
        if (options.billNo) {
          query={};
          query.billNo = options.billNo;
        }
  
      const bills = await Bill.find(query).sort({ isPaid: 1 });
        // console.log(bills)
        res.status(200).json({
            totalBills:bills.length,
            data:bills
        }) 
})
// exports.getBillsByDateRange=catchAsync(async(req,res,next)=>{
//     const{startDate,endDate}=req.body;
//     const salesData = await Invoice.aggregate([
//         {
//             $match: {
//                 invoiceDate: {
//                     $gte: new Date(startDate),
//                     $lte: new Date(endDate)
//                 }
//             }
//         }])

//     res.status(200).json({
//         data:salesData
//     })
// })
exports.getDataByMonths=catchAsync( async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        // Aggregate the data grouped by both month and year
        const salesData = await Bill.aggregate([
            {
                $match: {
                    invoiceDate: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$invoiceDate" },
                        year: { $year: "$invoiceDate" }
                    },
                    totalSales: { $sum: "$totalBillAmmount" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Map month numbers to month names
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const formattedData = salesData.map(item => ({
            Month: `${monthNames[item._id.month - 1]}/${item._id.year}`,
            TotalSales: item.totalSales
        }));
        // console.log(formattedData)
        // Create a new workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(formattedData);

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, "Sales Data");

        // Define the file path
        const filePath = `./sales_per_month_${Date.now()}.xlsx`;

        // Write the workbook to a file
        XLSX.writeFile(wb, filePath);

        // Send the file as a response
        res.download(filePath, (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            }

            // Delete the file after sending it
            fs.unlinkSync(filePath);
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

exports.getBillByMonth=catchAsync(async (req, res) => {
    const { month, year } = req.query;

    try {
        // Define the start and end dates for the given month and year
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        // Query to find all invoices within the specified month
        const bills = await Bill.find({
            invoiceDate: {
                $gte: startDate,
                $lte: endDate
            }
        }).select('invoiceDate billNo recipient recipient final_amount gst.sgst gst.cgst totalBillAmmount');
        // console.log(bills)
        // Calculate the totals
        const totalAmount = bills.reduce((sum, bill) => sum + bill.final_amount, 0);
        const totalBillAmount = bills.reduce((sum, bill) => sum + bill.totalBillAmmount, 0);

        // Format the data for Excel
        const formattedBills = bills.map(bill => ({
            "Bill Date": bill.invoiceDate.toISOString().split('T')[0], // Convert to 'YYYY-MM-DD' format
            "Bill Number": bill.billNo,
            "Recipient Name": bill.recipient.recipientName,
            "GST Number": bill.recipient.recipientGSTNo,
            "Total Amount": bill.final_amount,
            "SGST Paid": bill.gst.sgst,
            "CGST Paid": bill.gst.cgst,
            "Total Bill Amount": bill.totalBillAmmount
        }));

        // Add the summary row at the end
        formattedBills.push({
            "Bill Date": "TOTAL",
            "Bill Number": "",
            "Recipient Name": "",
            "GST Number":"",
            "Total Amount": totalAmount,
            "SGST Paid": "",
            "CGST Paid": "",
            "Total Bill Amount": totalBillAmount
        });

        // Create a new workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(formattedBills);

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, "Bills");

        // Define the file path
        const filePath = `./bills_${month}_${year}_${Date.now()}.xlsx`;

        // Write the workbook to a file
        XLSX.writeFile(wb, filePath);

        // Send the file as a response
        res.download(filePath, (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            }

            // Delete the file after sending it
            fs.unlinkSync(filePath);
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

exports.getBillByMonthJson=catchAsync(async (req, res) => {
    const { startBodyDate, endBodyDate } = req.body;

    try {
        // Define the start and end dates for the given month and year
        const startDate = new Date(startBodyDate);
        const endDate = new Date(endBodyDate);

        // Query to find all invoices within the specified month
        const bills = await Bill.find({
            invoiceDate: {
                $gte: startDate,
                $lte: endDate
            }
        }).select('invoiceDate billNo recipient recipient final_amount gst.sgst gst.cgst totalBillAmmount');
        //  console.log(bills)
        // Calculate the totals
        // const totalAmount = bills.reduce((sum, bill) => sum + bill.final_amount, 0);
        // const totalBillAmount = bills.reduce((sum, bill) => sum + bill.totalBillAmmount, 0);

        // // Format the data for Excel
        // const formattedBills = bills.map(bill => ({
        //     "Bill Date": bill.invoiceDate.toISOString().split('T')[0], // Convert to 'YYYY-MM-DD' format
        //     "Bill Number": bill.billNo,
        //     "Recipient Name": bill.recipient.recipientName,
        //     "GST Number": bill.recipient.recipientGSTNo,
        //     "Total Amount": bill.final_amount,
        //     "SGST Paid": bill.gst.sgst,
        //     "CGST Paid": bill.gst.cgst,
        //     "Total Bill Amount": bill.totalBillAmmount
        // }));

        // // Add the summary row at the end
        // formattedBills.push({
        //     "Bill Date": "TOTAL",
        //     "Bill Number": "",
        //     "Recipient Name": "",
        //     "GST Number":"",
        //     "Total Amount": totalAmount,
        //     "SGST Paid": "",
        //     "CGST Paid": "",
        //     "Total Bill Amount": totalBillAmount
        // });
        res.status(200).json({
            data:{
                formattedBills:bills
            }
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



async function  createCompanyInfo(){
   await Company.create({billNo:1,HSN:9602});
}

async function getBillNo(){
    // console.log(process.env.TYPE)
    let id=process.env.TYPE==="PRODUCTION"?'65a8bfafdfb9d72bd46f3a6f':'65a6a1efa5c99e42c492b67c';
    return await Company.findById(id);
}

async function IncreaseBillNumber(no){
    let id=process.env.TYPE==="PRODUCTION"?'65a8bfafdfb9d72bd46f3a6f':'65a6a1efa5c99e42c492b67c';
   
    await Company.findByIdAndUpdate(id,{billNo:no});
}

function createSlug(personName) {
    // Convert to lowercase
    let slug = personName.toLowerCase();
    
    // Replace spaces with hyphens
    slug = slug.replace(/\s/g, '-');
    
    // Remove non-alphanumeric characters except hyphens
    slug = slug.replace(/[^a-z0-9-]/g, '');
    
    return slug;
  }
  
  