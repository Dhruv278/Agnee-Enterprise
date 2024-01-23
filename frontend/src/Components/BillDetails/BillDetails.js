// BillDetails.js
import React, { useEffect, useRef, Fragment } from 'react';
import styles from './billDetails.module.css'; // Import the corresponding CSS module
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getBillData } from '../../Actions/billActions';
import { useNavigate, useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BillDetails = () => {
    const dispatch = useDispatch();
    const invoiceRef = useRef(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const { loading, error, isError, billDetails } = useSelector(state => state.billDetails);

    useEffect(() => {
        if (isError) alert(error);
        else {
            dispatch(getBillData(id));
        }
    }, [dispatch, id, isError]);

    const downloadInvoice = () => {
        const invoice = invoiceRef.current;
        const pdfFontSize = 30;

        const invoiceSection = invoice.querySelector('#invoice_section');

        // Convert invoiceSection to HTMLElement
        const invoiceSectionElement = invoiceSection 

            console.log(invoice)
        if (window.innerWidth > 700 && invoiceSectionElement) {
            invoiceSectionElement.style.fontSize = pdfFontSize + 'px';
        }

        html2canvas(invoice, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`${billDetails.recipient.recipientName}_${new Date(billDetails.invoiceDate).toLocaleDateString('en-GB')}_invoice.pdf`);

            if (invoiceSectionElement) {
                invoiceSectionElement.style.fontSize = ''; // Revert back to the original font size
            }
        });
    };

    return (
        loading || Object.keys(billDetails).length === 0 ? (
            <p>Loading</p>
        ) : (
            <Fragment>
                <div className={styles.invoice} ref={invoiceRef}>
                    <div className={styles.header}>
                        <h1 className={styles.heading1}>AGNEE ENTERPRISE</h1>
                        <p>Company Address: Shop no. 2, H no. 9/928/3 Common, Near zatpatiya hanuman mandir, ambaji road, bhagal, surat-395003 </p>
                        <p>Phone: 9825757232</p>
                        <p> GST Number: 24AJMPG8690D1Z2</p>
                    </div>

                    <div className={styles.invoice_section} id="invoice_section">
                        <div className={styles.center}>
                            <p className={styles.bold}>(Tax Invoice)</p>
                        </div>
                        <p className={styles.bold}>Bill To:</p>
                        <div className={styles.recipient_details}>
                            <p>Name: {billDetails.recipient.recipientName}</p>
                            {billDetails.recipient.recipientPhone && <p> Contact No: {billDetails.recipient.recipientPhone}</p>}
                            {billDetails.isGST && <p>Bill Number: {billDetails.billNo}</p>}
                            <p> Invoice Date: {new Date(billDetails.invoiceDate).toLocaleDateString('en-GB')}</p>
                            {billDetails.recipient.recipientGSTNo && <p> GST No: {billDetails.recipient.recipientGSTNo}</p>}
                            <p>Place of Supply: Gujarat (24)</p>
                        </div>

                        <table className={styles.product_table}>
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
                                {billDetails.products.map((product, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{product.name}</td>
                                        <td>{billDetails.HSN}</td>
                                        <td>{product.quantity}</td>
                                        <td>Rs.{product.price}</td>
                                        <td>Rs.{product.total_amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className={styles.total_row}>
                                    <td colSpan="5">Total:</td>
                                    <td>Rs.{billDetails.final_amount}</td>
                                </tr>
                                {billDetails.isGST && (
                                    <>
                                        <tr className={styles.total_row}>
                                            <td colSpan="5">SGST (9%):</td>
                                            <td>Rs.{billDetails.gst.sgst}</td>
                                        </tr>
                                        <tr className={styles.total_row}>
                                            <td colSpan="5">CGST (9%):</td>
                                            <td>Rs.{billDetails.gst.cgst}</td>
                                        </tr>
                                    </>
                                )}
                                <tr className={styles.total_row}>
                                    <td colSpan="5">Grand Total(Round off):</td>
                                    <td>Rs.{billDetails.totalBillAmmount}</td>
                                </tr>
                            </tfoot>
                        </table>
                        <div className={styles.thank_you}>
                            <p>Thank you for allowing us to serve you. We appreciate your continued trust!</p>
                        </div>
                    </div>
                </div>
            <div className={styles.center} >

                <button id="downloadPDF" className={styles.downloadPDF} onClick={downloadInvoice}>
                    Download PDF
                </button>
            </div>
            </Fragment>
        )
    );
};

export default BillDetails;
