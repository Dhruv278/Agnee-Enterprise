import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../Redux/hook";
import { getBillsByDateRangeByAPI } from "../../Redux/Actions/InvoiceAPI";
import { InvoiceType } from "../../dto/InvoiceType.dto";
import { useNavigate } from "react-router-dom";
import { getHostUrl } from "../../Redux/Actions/getHostURL";
import { setCurrentInvoice } from "../../Redux/Slices/InvoiceSlice";
import * as XLSX from "xlsx";
import { showErrorToast, showSuccessToast } from "../Atoms/Toast";
import axios from "axios";

const BillSummary: React.FC = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isGST, setIsGST] = useState<string>("");
  const [filteredBills, setFilteredBills] = useState<InvoiceType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { invoices } = useAppSelector((state) => state.invoice);

  useEffect(() => {
    if (invoices.length > 0) setFilteredBills(invoices);
    else setFilteredBills([]);
  }, [invoices]);

  const handleFilter = () => {
    dispatch(
      getBillsByDateRangeByAPI({
        startDate,
        endDate,
        isGst: isGST === "false" ? false : true,
      })
    );
  };

  const handleShowInvoice = (invoice: InvoiceType) => {
    dispatch(setCurrentInvoice(invoice));
    navigate(`/invoice/${invoice._id}`);
  };

  const handleDeleteBill = async (billId: string) => {
    setIsLoading(true);
    if (isLoading) return;
    try {
      await axios.delete(`${getHostUrl()}/api/v1/deleteBill/${billId}`);
      showSuccessToast("Bill deleted successfully please refresh the page.");
      // dispatch(removeInvoice(billId));
    } catch (err) {
      showErrorToast("Failed to delete bill");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateExcelReport = async () => {
    if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
      showErrorToast("Please provide valid date range to generate Excel file.");
      return;
    }

    const res = await axios.post(`${getHostUrl()}/api/v1/getBillByMonthJson`, {
      startBodyDate: startDate,
      endBodyDate: endDate,
      isGST: isGST || undefined,
    });

    if (res && res.status === 200) {
      if (res.data.data.formattedBills.length > 0) {
        generateExcel(
          res.data.data.formattedBills,
          `${new Date(startDate).getMonth() + 1}`,
          `${new Date(startDate).getFullYear()}`
        );
      } else {
        showErrorToast("No bills found.");
      }
    }
  };

  const generateExcel = (bills: any[], month: string, year: string) => {
    const totalAmount = bills.reduce((sum, bill) => sum + bill.final_amount, 0);
    const totalBillAmount = bills.reduce(
      (sum, bill) => sum + bill.totalBillAmmount,
      0
    );

    const formattedBills = bills.map((bill) => ({
      "Bill Date": convertToDDMMYYYY(bill.invoiceDate),
      "Bill Number": bill.billNo,
      "Recipient Name": bill.recipient.recipientName,
      "GST Number": bill.recipient.recipientGSTNo,
      "Total Amount": bill.final_amount,
      "SGST Paid": bill.gst.sgst,
      "CGST Paid": bill.gst.cgst,
      "Total Bill Amount": bill.totalBillAmmount,
    }));

    formattedBills.push({
      "Bill Date": "TOTAL",
      "Bill Number": "",
      "Recipient Name": "",
      "GST Number": "",
      "Total Amount": totalAmount,
      "SGST Paid": "",
      "CGST Paid": "",
      "Total Bill Amount": totalBillAmount,
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedBills);
    XLSX.utils.book_append_sheet(wb, ws, "Bills");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bills_${month}_${year}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function convertToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
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
        <label>
          GST:
          <Select value={isGST} onChange={(e) => setIsGST(e.target.value)}>
            <option value="">All</option>
            <option value="true">With GST</option>
            <option value="false">Without GST</option>
          </Select>
        </label>
        <Button onClick={handleFilter}>Apply Filters</Button>
        <ExcelButton onClick={handleGenerateExcelReport}>
          Export Excel
        </ExcelButton>
      </FilterSection>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>Bill No</th>
              <th>Bill Date</th>
              <th>Recipient Name</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => (
              <tr key={bill._id}>
                <td>{bill.billNo}</td>
                <td>{convertToDDMMYYYY(bill.invoiceDate)}</td>
                <td>{bill.recipient.recipientName}</td>
                <td>{bill.totalBillAmmount.toFixed(2)}</td>
                <td>
                  <ActionGroup>
                    <Button onClick={() => handleShowInvoice(bill)}>
                      Show
                    </Button>
                    <DeleteButton onClick={() => handleDeleteBill(bill._id)}>
                      Delete
                    </DeleteButton>
                  </ActionGroup>
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

// Styled Components
const Container = styled.div`
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
`;

const FilterSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
  align-items: end;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-left: 5px;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-left: 5px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    background-color: #0056b3;
  }
`;

const ExcelButton = styled(Button)`
  background-color: #3e9f3e;
  &:hover {
    background-color: #297c29;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #e74c3c;
  &:hover {
    background-color: #c0392b;
  }
`;

const TableContainer = styled.div`
  max-height: 450px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px;
    border: 1px solid #ccc;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  tr:nth-child(even) {
    background-color: #fafafa;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
`;
