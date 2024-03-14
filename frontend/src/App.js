import logo from './logo.svg';
import './App.css';
import InvoiceForm from './Components/billForm/InvoiceForm'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import BillDetails from './Components/BillDetails/BillDetails';
import Dashboard from './Components/Dashboard/Dashboard';
import Admin from './Components/Dashboard/DashboardComponents/Admin';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<InvoiceForm />}  exact/>
          <Route path='/bill/:id' element={<BillDetails />} exact/>
          <Route path='/dashboard' element={<Dashboard/>} >
            <Route index element={<Admin />}></Route>
            <Route path="products" element={<Admin />} />
            {/* <Route path="/dashboard/profile/:slug" element={<Profile />}></Route> */}
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
