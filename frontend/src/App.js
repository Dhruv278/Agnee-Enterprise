import logo from './logo.svg';
import './App.css';
import InvoiceForm from './Components/billForm/InvoiceForm'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import BillDetails from './Components/BillDetails/BillDetails';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<InvoiceForm />}  exact/>
          <Route path='/bill/:id' element={<BillDetails />} exact/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
