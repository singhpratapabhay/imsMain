import React from 'react';
import Header from '../component/Header';
import MainPage from '../component/MainPage';
import ManageSuplier from './ManageSuplier';
import ManageCategory from './ManageCategory';
import './home.css';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import ManageProduct from './ManageProduct';
import ManagePurchase from './ManagePurchase';
import Approvepurchase from '../component/Approvepurchase';
import ManageCustomer from './ManageCustomer';
import ManageInvoice from './ManageInvoice';
// import ApprovalInvoice from '../component/ApprovalInvoice';
import DueInvoice from '../component/DueInvoice';
import PaidInvoices from '../component/PaidInvoices';
import ManageHsn from './ManageHsn';
import ManageUnits from '../component/ManageUnits';
import GetInvoice from '../component/GetInvoice';
import GetPurchase from '../component/GetPurchase';
import ManagerTax from './ManagerTax';
import TotalUnits from '../component/TotalUnits';
import DuePurchase from '../component/DuePurchase';
import PaidPurchase from '../component/PaidPurchase';
import TotalProfit from '../component/TotalProfit';
import BatchProfit from '../component/BatchProfit';
// import NotFound from '../component/NotFound'; // Import a NotFound component for handling 404 errors

const Home = () => {
  return (
    <>
      <Header />
      <div className='dashboard'>
        <Sidebar />
        <Routes>
          <Route path='/home' element={<MainPage />} />
          <Route path='/supplier' element={<ManageSuplier />} />
          <Route path='/category' element={<ManageCategory />} />
          <Route path='/product' element={<ManageProduct />} />
          <Route path='/purchase/*' element={<PurchaseRoutes />} />
          <Route path='/customer' element={<ManageCustomer />} />
          <Route path='/invoice/*' element={<InvoiceRoutes />} />
          <Route path='/hsn' element={<ManageHsn />} />
          <Route path='/unit/*' element={<UnitRoutes />} />
          <Route path='/taxes' element={<ManagerTax />} />
          {/* <Route path='*' element={<NotFound />} /> Catch-all route for undefined paths */}
        </Routes>
      </div>
    </>
  );
};

const PurchaseRoutes = () => {
  return (
    <Routes>
      <Route path='' element={<ManagePurchase />} />
      <Route path='approvePurchase' element={<Approvepurchase />} />
      <Route path='duePurchase' element={<DuePurchase />} />
      <Route path='paidPurchase' element={<PaidPurchase />} />
      <Route path='getPurchase' element={<GetPurchase />} />
    </Routes>
  );
};

const InvoiceRoutes = () => {
  return (
    <Routes>
      <Route path='' element={<ManageInvoice />} />
      {/* <Route path='approveInvoice' element={<ApprovalInvoice />} /> */}
      <Route path='dueInvoice' element={<DueInvoice />} />
      <Route path='paidInvoice' element={<PaidInvoices />} />
      <Route path='getInvoice' element={<GetInvoice />} />
    </Routes>
  );
};

const UnitRoutes = () => {
  return (
    <Routes>
      <Route path='' element={<TotalUnits />} />
      <Route path='batchUnits' element={<ManageUnits />} />
      <Route path='profit' element={<BatchProfit />} />
      <Route path='totalProfit' element={<TotalProfit />} />
    </Routes>
  );
};

export default Home;
