// BillDetailsStyled.js
import React, { useEffect, useRef, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../Redux/hook';
import {  clearInvoiceCreatedFlag } from '../../Redux/Slices/InvoiceSlice';

const InvoicePage = () => {
    const dispatch = useAppDispatch();
    const invoiceRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const { loading, isError, currentInvoice } = useAppSelector(state => state.invoice);
    
    useEffect(()=>{
      return()=>{
        if(currentInvoice)
        dispatch(clearInvoiceCreatedFlag());
      }
    },[currentInvoice])
   
    if(!currentInvoice)
      return null;
    const downloadInvoice = () => {
        const invoice = invoiceRef.current;

        if(window.innerWidth < 700){
            document.title = `${currentInvoice.recipient.recipientName}_${new Date(currentInvoice.invoiceDate).toLocaleDateString('en-GB')}_invoice`;
            window.print();
        }else{
          if(invoice)
            html2canvas(invoice, { scale: 2 }).then((canvas: HTMLCanvasElement) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = pdfWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.save(`${currentInvoice.recipient.recipientName}_${new Date(currentInvoice.invoiceDate).toLocaleDateString('en-GB')}_invoice.pdf`);
            });
        }
    };

    return (
        loading || Object.keys(currentInvoice).length === 0 ? (
            <p>Loading</p>
        ) : (
            <Fragment>
                <InvoiceContainer ref={invoiceRef}>
                    <Header>
                        <Heading1>AGNEE ENTERPRISE</Heading1>
                        <p style={{fontSize:"20px"}}>Company Address: Shop no. 2, H no. 9/928/3 Common, Near zatpatiya hanuman mandir, ambaji road, bhagal, surat-395003 </p>
                        <p style={{fontSize:"20px"}}>Phone: 9825757232</p>
                        <p style={{fontSize:"20px"}}> GST Number: 24AJMPG8690D1Z2</p>
                    </Header>

                    <InvoiceSection id="invoice_section">
                        <Center>
                            <BoldText>(Tax Invoice)</BoldText>
                        </Center>
                        <BoldText>Bill To:</BoldText>
                        <RecipientDetails>
                            <p>Name: {currentInvoice.recipient.recipientName}</p>
                            {currentInvoice.recipient.recipientPhone && <p> Contact No: {currentInvoice.recipient.recipientPhone}</p>}
                            {currentInvoice.isGST && <p>Bill Number: {currentInvoice.billNo}</p>}
                            <p> Invoice Date: {new Date(currentInvoice.invoiceDate).toLocaleDateString('en-GB')}</p>
                            {currentInvoice.recipient.recipientGSTNo && <p> GST No: {currentInvoice.recipient.recipientGSTNo}</p>}
                            <p>Place of Supply: Gujarat (24)</p>
                        </RecipientDetails>

                        <ProductTable>
                            <thead>
                                <tr>
                                    <th>SR #</th>
                                    <th>Product Name</th>
                                    <th>HSN Code</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentInvoice.products.map((product, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{product.name}</td>
                                        <td>{currentInvoice.HSN}</td>
                                        <td>{product.quantity}</td>
                                        <td>Rs.{product.price}</td>
                                        <td>Rs.{product.total_amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="total_row">
                                    <td colSpan={5}>Total:</td>
                                    <td>Rs.{currentInvoice.final_amount}</td>
                                </tr>
                                {currentInvoice.isGST && (
                                    <>
                                        <tr className="total_row">
                                            <td colSpan={5}>SGST (9%):</td>
                                            <td>Rs.{currentInvoice.gst.sgst}</td>
                                        </tr>
                                        <tr className="total_row">
                                            <td colSpan={5}>CGST (9%):</td>
                                            <td>Rs.{currentInvoice.gst.cgst}</td>
                                        </tr>
                                    </>
                                )}
                                <tr className="total_row">
                                    <td colSpan={5}>Grand Total(Round off):</td>
                                    <td>Rs.{currentInvoice.totalBillAmmount}</td>
                                </tr>
                            </tfoot>
                        </ProductTable>
                        <ThankYouMessage>
                            <p>Thank you for allowing us to serve you. We appreciate your continued trust!</p>
                        </ThankYouMessage>
                    </InvoiceSection>
                </InvoiceContainer>
                <Center>
                    <DownloadButton onClick={downloadInvoice}>
                        Download PDF
                    </DownloadButton>
                </Center>
            </Fragment>
        )
    );
};

export default InvoicePage;

// Styled Components
const InvoiceContainer = styled.div`
    width: 80%;
    margin: 20px auto;
    background: linear-gradient(to bottom, #fff, #f0f0f0);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    overflow: hidden;

    @media only screen and (max-width: 700px) {
        width: 100%;
    }
`;

const Header = styled.div`
    background: linear-gradient(to right, #0099ff, #0066cc);
    color: #fff;
    text-shadow: 2px 2px 5px black;
    padding: 20px;
    text-align: center;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;

    @media only screen and (max-width: 700px) {
        padding: 15px;
    }

    @media print {
        box-shadow: inset 0 0 0 1000px  #0099ff;
        -webkit-print-color-adjust: exact;
    }
`;

const Heading1 = styled.h1`
    margin: 0;
    font-size: 60px;

    @media only screen and (max-width: 700px) {
        font-size: 40px;
    }

    @media print {
        font-size: 24px;
    }
`;

const InvoiceSection = styled.div`
    padding: 20px;
    font-size: 16px;
    color: #333;

    @media only screen and (max-width: 700px) {
        padding: 10px;
        font-size: 14px;
    }
`;

const RecipientDetails = styled.div`
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 5px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    text-align:left;

    @media only screen and (max-width: 700px) {
        grid-template-columns: 1fr;
    }

    p {
        margin: 0;
        color: #666;
        white-space: nowrap;
    }
`;

const ProductTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;

    th, td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: left;

        @media only screen and (max-width: 700px) {
            padding: 8px;
        }
    }

    th {
        background-color: #f5f5f5;
    }

    .total_row {
        border-top: 2px solid #ddd;

        td {
            text-align: right;
            font-weight: bold;
        }
    }
`;

const BoldText = styled.p`
    font-weight: bold;
    text-align:left;
`;

const ThankYouMessage = styled.div`
    margin-top: 20px;
    text-align: center;
    font-style: italic;
    color: #555;

    @media only screen and (max-width: 700px) {
        font-size: 12px;
    }
`;

const DownloadButton = styled.button`
    padding: 15px 20px;
    background: linear-gradient(to right, #007bff, #0056b3);
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;
    transition: background 0.3s ease;

    &:hover {
        background: linear-gradient(to right, #0056b3, #003366);
    }

   @media only screen and (max-width: 700px) {
        padding: 12px 16px;
        font-size: 16px;
    }

    @media print {
        display: none;
    }
`;

const Center = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;