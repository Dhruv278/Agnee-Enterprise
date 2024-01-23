import React, { useState, useEffect, Fragment } from 'react';
import styles from'./InvoiceForm.module.css'; // Import your CSS file for styling
import { useDispatch, useSelector } from 'react-redux'
import {clearErrors,createBill} from '../../Actions/billActions'
import {useNavigate}  from 'react-router-dom'


const InvoiceForm = () => {
  const disptach = useDispatch();
  const navigate=useNavigate();
  const { loading, error, isError,billDetails} = useSelector(state => state.billDetails);
  const [products, setProducts] = useState([{ name: '', quantity: '', price: '' }]);
  const [recipient, setRecipient] = useState({
    recipientName: '',
    recipientPhone: '',
    recipientGSTNo: '',
  });

  const [invoiceDate, setInvoiceDate] = useState('');
  const [isGST, setIsGST] = useState(false);

  useEffect(()=>{
    if(isError){
      alert(error)
    }else{
      console.log("navigate")
      console.log(!loading,Object.keys(billDetails))
      if(!loading && !(Object.keys(billDetails).length === 0)){
        console.log(billDetails)
          navigate(`/bill/${billDetails._id}`);
      }
    }
    return()=> {
  disptach(clearErrors())
    }
  },[disptach,isError,billDetails])

  const addProduct = () => {
    setProducts([...products, { name: '', quantity: '', price: '' }]);
  };

  const removeProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };


  const handleRecipientChange = (field, value) => {
    setRecipient({ ...recipient, [field]: value });
  };

  const handleCheckboxChange = () => {
    setIsGST(!isGST);
  };

  const handleDateChange = (event) => {
    setInvoiceDate(event.target.value);
  };


  const sendData =async () => {
    const billData = {}
    billData.recipient = recipient;
    billData.invoiceDate = invoiceDate;
    billData.isGST = isGST;
    billData.products = products;
    billData.products.forEach(product => {
      product.price = parseFloat(product.price)
      product.quantity = parseFloat(product.quantity)
      product.total_amount = parseFloat((product.price * product.quantity).toFixed(2))
    })
    console.log(billData);
    await disptach(createBill(billData));
   
  }
  return (
    loading ?
      <p>Loading</p> :
      <Fragment>
      <div className={styles.invoice}>
        <div className={styles.header}>
          <h1 className={styles.header_h1}>Invoice Form</h1>
        </div>

        <div className={styles.invoice_section}>
          {/* Recipient Details */}
          <div className={styles.recipient_details}>
            <div className={styles.form_group}>
              <label htmlFor="recipientName" className={styles.form_group_label}>
                Recipient Name:
              </label>
              <input
                type="text"
                id="recipientName"
                name="recipientName"
                value={recipient.recipientName}
                onChange={(e) => handleRecipientChange('recipientName', e.target.value)}
                required
                className={styles.form_group_input_text}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="recipientPhone" className={styles.form_group_label}>
                Recipient Phone:
              </label>
              <input
                type="tel"
                id="recipientPhone"
                name="recipientPhone"
                value={recipient.recipientPhone}
                onChange={(e) => handleRecipientChange('recipientPhone', e.target.value)}
                required
                className={styles.form_group_input_tel}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="recipientGSTNo" className={styles.form_group_label}>
                Recipient GST Number:
              </label>
              <input
                type="text"
                id="recipientGSTNo"
                name="recipientGSTNo"
                value={recipient.recipientGSTNo}
                onChange={(e) => handleRecipientChange('recipientGSTNo', e.target.value)}
                className={styles.form_group_input_text}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="datepicker" className={styles.form_group_label}>
                Invoice date:
              </label>
              <input
                type="date"
                id="datepicker"
                value={invoiceDate}
                onChange={handleDateChange}
                required
                className={styles.form_group_input_text}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="isGST" className={styles.form_group_label}>
                GST:
              </label>
              <input
                type="checkbox"
                id="isGST"
                checked={isGST}
                onChange={handleCheckboxChange}
                required
                className={styles.form_group_input_checkbox}
              />
            </div>

            {/* ... Other recipient details */}
          </div>

          {/* Product Data Section */}
          <div className={styles.product_data}>
            <h3>Product Data</h3>
            {products.map((product, index) => (
              <div key={index} className={styles.product_row}>
                <input
                  type="text"
                  placeholder="Product"
                  className={styles.product_row_input}
                  value={product.name}
                  onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  className={styles.product_row_input}
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Price"
                  className={styles.product_row_input}
                  value={product.price}
                  onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                />
                <button className={styles.remove_product_btn} onClick={() => removeProduct(index)}>
                <i class="fa fa-close"></i>
                </button>
              </div>
            ))}

            <div className={styles.actions}>
              <button className={styles.btn} onClick={addProduct}>
                Add Product
              </button>
              <button className={styles.btn} onClick={sendData}>
                Generate Bill
              </button>
            </div>
          </div>
        </div>

        <div className={styles.thank_you}>
          <p>Thank you for using our invoice form!</p>
        </div>
      </div>
    </Fragment>
  );
};

export default InvoiceForm;
