
import React from 'react'
import classNames from 'classnames'
import {DASHBOARD_SIDEBAR_LINKS } from '../lib/navigation'
import { Link, useLocation } from 'react-router-dom'
const Sidebar = () => {
  const linkClasses="flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base"
  const {pathname} =useLocation()
  const sidebarLink=(item)=>{
    return(
    <Link to={item.path} key={item.key} className={classNames(pathname===item.path ?' bg-neutral-700 text-white ':'text-neutral-400',linkClasses)} >
      <span className='text-xl'>{item.icon}</span>
      {item.label}
    </Link>
  )}

  return (
    <div className='flex flex-col bg-neutral-900 w-60 p-3 text-white'>
      <div className='flex item-center gap-2 px-1 py-3'>
        <span className='text-neutral-100 text-lg'>AGNEE ENTERPRISE</span>
      </div>
      <div className='flex-1 py-8 flex flex-col gap-0.5'> 
        {DASHBOARD_SIDEBAR_LINKS.map((item)=>(
          // <></>
         sidebarLink(item)
        ))}
      </div>
      <div>Bottom part</div>
    </div>
  )
}

export default Sidebar