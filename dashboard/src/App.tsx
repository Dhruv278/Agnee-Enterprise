import React, { useEffect, } from 'react';
import './App.css';
import { Provider } from 'react-redux';

import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import store from './Redux/store';
import MainPage from './Components/Pages/MainPage';
import InvoiceForm from './Components/Pages/InvoiceForm';
import InvoicePage from './Components/Pages/InvoicePage';
import BillSummary from './Components/Pages/AllBills';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<MainPage />} >
            <Route path='/' element={<InvoiceForm />} />
            <Route path='/invoice/:id' element={<InvoicePage />} />
            <Route path='/bills' element={<BillSummary />} />
            <Route path='/dashboard' element={<BillSummary />} />
            
          </Route>
           
        </Routes>
    
      </div>
    </Provider>
  );
}

export default App;
