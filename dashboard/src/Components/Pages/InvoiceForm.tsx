import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../Redux/hook';
import { Product, Recipient } from '../../dto/InvoiceType.dto';
import { createBillAPI } from '../../Redux/Actions/InvoiceAPI';

// Styled components
const InvoiceContainer = styled.div`
  padding: 2rem;
  max-width: 90%;
  margin: auto;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;

  @media (min-width: 768px) {
    max-width: 800px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 2.5rem;
  color: #2c3e50;
  font-weight: 600;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const CheckboxInput = styled.input`
  margin-right: 0.5rem;
`;

const ProductData = styled.div`
  margin-top: 2rem;

  @media (max-width: 600px) {
    padding: 0 1rem;
  }
`;

const ProductRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #ecf0f1;
  border-radius: 5px;
  box-sizing: border-box;

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: center;

    input {
      flex: 1;
      margin-right: 1rem;
      min-width: 150px;
    }

    input:last-child {
      margin-right: 0;
    }
  }
`;

const RemoveProductButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;

  i {
    margin-right: 0.5rem;
  }

  &:hover {
    background: #c0392b;
  }
`;

const Actions = styled.div`
  margin-top: 2rem;
  text-align: center;

  button {
    background: #3498db;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    margin: 0 0.5rem;
    transition: background 0.3s ease;

    &:hover {
      background: #2980b9;
    }
  }
`;

const ThankYouMessage = styled.div`
  text-align: center;
  margin-top: 2rem;
  font-size: 1.1rem;
  color: #2c3e50;
`;

const InvoiceForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, isError, invoices,isInvoiceCreated,currentInvoice } = useAppSelector(state => state.invoice);

  const [products, setProducts] = useState<Product[]>([{ name: '', quantity: '', price: '' }]);
  const [recipient, setRecipient] = useState<Recipient>({
    recipientName: '',
    recipientPhone: '',
    recipientGSTNo: '',
  });
  const [invoiceDate, setInvoiceDate] = useState('');
  const [isGST, setIsGST] = useState(false);

  useEffect(() => {
    if (isError) {
      console.log("error")
    } else {
      // if (!loading && Object.keys(invoices).length !== 0) {
      //   navigate(`/bill/${billDetails._id}`);
      // }
      if(isInvoiceCreated && currentInvoice){
        navigate(`/invoice/${currentInvoice._id}`)
      }
    }
    return () => {
      // dispatch(clearErrors());
    };
  }, [dispatch, isError, navigate, loading]);

  const addProduct = () => {
    setProducts([...products, { name: '', quantity: '', price: '' }]);
  };

  const removeProduct = (index: number) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleProductChange = (index: number, field: keyof Product, value: string) => {
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    };
    setProducts(updatedProducts);
  };

  const handleRecipientChange = (field: keyof Recipient, value: string) => {
    setRecipient({
      ...recipient,
      [field]: value,
    });
  };

  const handleCheckboxChange = () => {
    setIsGST(!isGST);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInvoiceDate(event.target.value);
  };

  const sendData = async () => {
    const billData: any = {};
    billData.recipient = recipient;
    billData.invoiceDate = invoiceDate;
    billData.isGST = isGST;
    billData.products = products.map(product => ({
      ...product,
      price: parseFloat(product.price),
      quantity: parseFloat(product.quantity),
      total_amount: parseFloat((parseFloat(product.price) * parseFloat(product.quantity)).toFixed(2)),
    }));
    console.log(billData);
    await dispatch(createBillAPI(billData));
  };

  return (
    loading ? 
      <p>Loading...</p> : 
      <InvoiceContainer>
        <Header>
          <HeaderTitle>Invoice Form</HeaderTitle>
        </Header>
        <FormSection>
          <FormGroup>
            <FormLabel htmlFor="recipientName">Recipient Name:</FormLabel>
            <FormInput
              type="text"
              id="recipientName"
              value={recipient.recipientName}
              onChange={(e) => handleRecipientChange('recipientName', e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="recipientPhone">Recipient Phone:</FormLabel>
            <FormInput
              type="tel"
              id="recipientPhone"
              value={recipient.recipientPhone}
              onChange={(e) => handleRecipientChange('recipientPhone', e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="recipientGSTNo">Recipient GST Number:</FormLabel>
            <FormInput
              type="text"
              id="recipientGSTNo"
              value={recipient.recipientGSTNo}
              onChange={(e) => handleRecipientChange('recipientGSTNo', e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="datepicker">Invoice Date:</FormLabel>
            <FormInput
              type="date"
              id="datepicker"
              value={invoiceDate}
              onChange={handleDateChange}
              required
            />
          </FormGroup>
          <FormGroup style={{alignItems:'baseline',display:"flex"}}>
            <CheckboxInput
              type="checkbox"
              id="isGST"
              checked={isGST}
              onChange={handleCheckboxChange}
            />
            <FormLabel htmlFor="isGST">GST:</FormLabel>
          </FormGroup>
        </FormSection>
        <ProductData>
          <h3>Product Data</h3>
          {products.map((product, index) => (
            <ProductRow key={index}>
              <FormInput
                type="text"
                placeholder="Product"
                value={product.name}
                onChange={(e) => handleProductChange(index, 'name', e.target.value)}
              />
              <FormInput
                type="number"
                placeholder="Quantity"
                value={product.quantity}
                onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
              />
              <FormInput
                type="text"
                placeholder="Price"
                value={product.price}
                onChange={(e) => handleProductChange(index, 'price', e.target.value)}
              />
              <RemoveProductButton onClick={() => removeProduct(index)}>
                <i className="fa fa-close"></i> Remove
              </RemoveProductButton>
            </ProductRow>
          ))}
          <Actions>
            <button onClick={addProduct}>Add Product</button>
            <button onClick={sendData}>Generate Bill</button>
          </Actions>
        </ProductData>
        <ThankYouMessage>
          <p>Thank you for using our invoice form!</p>
        </ThankYouMessage>
      </InvoiceContainer>
  );
};

export default InvoiceForm;
