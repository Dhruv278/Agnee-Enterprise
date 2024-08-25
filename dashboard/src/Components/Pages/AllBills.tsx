import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../Redux/hook';
import { generateExcelReport, getBillsByDateRangeByAPI } from '../../Redux/Actions/InvoiceAPI';
import { InvoiceType } from '../../dto/InvoiceType.dto';
import { useNavigate } from 'react-router-dom';
import { getHostUrl } from '../../Redux/Actions/getHostURL';
import { setCurrentInvoice } from '../../Redux/Slices/InvoiceSlice';
import * as XLSX from 'xlsx';
import { showErrorToast } from '../Atoms/Toast';
import axios from 'axios';

interface Bill {
  invoiceDate: string;
  billNo: string;
  recipient: {
    recipientName: string;
    recipientGSTNo: string;
  };
  final_amount: number;
  gst: {
    sgst: number | '';
    cgst: number | '';
  };
  totalBillAmmount: number;
}




const BillSummary: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const navigate=useNavigate();
  const [endDate, setEndDate] = useState<string>('');
  const [filteredBills, setFilteredBills] = useState<InvoiceType[]>([]);
  const dispatch=useAppDispatch()
  const {invoices}=useAppSelector(state=>state.invoice)
  useEffect(()=>{
    if(invoices.length>0)
    setFilteredBills(invoices);
    else
    setFilteredBills([])
  },[invoices])

  const handleFilter=()=>{
    dispatch(getBillsByDateRangeByAPI({startDate,endDate}));
  }
  const generateExcel = (bills: InvoiceType[], month: string, year: string) => {
    // Calculate the totals
    const totalAmount = bills.reduce((sum, bill) => sum + bill.final_amount, 0);
    const totalBillAmount = bills.reduce((sum, bill) => sum + bill.totalBillAmmount, 0);
  
    // Format the data for Excel
    const formattedBills:any[] = bills.map(bill => ({
      "Bill Date": convertToDDMMYYYY(bill.invoiceDate), // Convert to 'YYYY-MM-DD' format
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
      "GST Number": "",
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
  
    // Generate a buffer and create a Blob
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  
    // Create a link to download the file
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bills_${month}_${year}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    

  const handleGenerateExcelReport=async ()=>{
    let month=new Date(startDate).getMonth() +1;
    let year=new Date(startDate).getFullYear();
    console.log(startDate,endDate)
    if(!startDate || !endDate || (new Date(startDate)>new Date(endDate))){
      showErrorToast("Please provide valid date range to generate Excel file.")
      return;
    }
    const res=await axios.post(`${getHostUrl()}/api/v1/getBillByMonthJson`,{startBodyDate:startDate,endBodyDate:endDate})

    if(res &&res.status ===200){
      if(res.data.data.formattedBills.length > 0){
        setFilteredBills(res.data.data.formattedBills)
          generateExcel(res.data.data.formattedBills,`${new Date(startDate).getMonth()+1}`,`${new Date(startDate).getFullYear()}`)
      }else{
        showErrorToast("No bill founded.")
      }
    }
  }
  const handleShowInvoice=(invoice:InvoiceType)=>{
    dispatch(setCurrentInvoice(invoice));
    navigate(`/invoice/${invoice._id}`)
  }
  function convertToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getUTCFullYear();
    console.log(`${day}/${month}/${year}`)
  
    return `${day}/${month}/${year}`;
  }
  return (
    <Container>
      <FilterSection>
        <label>
          Start Date:
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <Button onClick={()=>handleFilter()}>Submit</Button>
        <ExcelButton onClick={()=>handleGenerateExcelReport()}>Generate Excel Report</ExcelButton>
      </FilterSection>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>Bill No</th>
              <th>Bill Date</th>
              <th>Recipient Name</th>
              <th>Total Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => (
              <tr key={bill.billNo}>
                <td>{bill.billNo}</td>
                <td>{convertToDDMMYYYY(bill.invoiceDate)}</td>
                <td>{bill.recipient.recipientName}</td>
                <td>{bill.totalBillAmmount.toFixed(2)}</td>
                <td>
                <Button onClick={()=>handleShowInvoice(bill)}>Show</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default BillSummary;
const Container = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  label {
    margin-right: 10px;
    font-weight: bold;
  }
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-right: 10px;
  font-size: 1rem;
  margin-left:5px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;


const ExcelButton = styled.button`
  padding: 8px 16px;
  background-color: #3e9f3e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #297c29;
  }
`;

const TableContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px;
    border: 1px solid #ccc;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;
