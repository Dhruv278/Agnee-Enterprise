import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../Redux/hook';
import { generateExcelReport, getBillsByDateRangeByAPI } from '../../Redux/Actions/InvoiceAPI';
import { InvoiceType } from '../../dto/InvoiceType.dto';
import { useNavigate } from 'react-router-dom';
import { getHostUrl } from '../../Redux/Actions/getHostURL';
import { setCurrentInvoice } from '../../Redux/Slices/InvoiceSlice';



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
  const handleGenerateExcelReport=()=>{
    let month=new Date(startDate).getMonth() +1;
    let year=new Date(startDate).getFullYear();
    console.log(month,year);
    window.open(`${getHostUrl()}/api/v1/getBillByMonth?month=${month}&year=${year}`,'_blank',)
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
