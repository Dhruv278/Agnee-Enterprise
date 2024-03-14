import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Utils/Sidebar'
import Header from './Utils/Header'
const Dashboard = () => {
  return (
    <div className='flex flex-row bg-neutral-100  h-screen w-screen overflow-hidden'>
      <Sidebar />
      <div className='flex-1'>
        <Header />
        <div className='p-4'>
          {<Outlet />}
        </div>
      </div>
    </div>
  )
}

export default Dashboard