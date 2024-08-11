import React, { useEffect, } from 'react';
import './App.css';
import { Provider } from 'react-redux';

import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import store from './Redux/store';
import MainPage from './Components/Pages/MainPage';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
           
        </Routes>
    
      </div>
    </Provider>
  );
}

export default App;
