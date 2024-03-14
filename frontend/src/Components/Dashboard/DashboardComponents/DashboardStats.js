import React from 'react'

const DashboardStats = () => {
  return (
    <div className='flex gap-4 w-full'>
        <BoxWrapper>a</BoxWrapper>
        <BoxWrapper>c</BoxWrapper>
        <BoxWrapper>b</BoxWrapper>
        <BoxWrapper>d</BoxWrapper>
    </div>
  )
}

export default DashboardStats

function BoxWrapper({ children }){
    return <div className='bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center'>{children}</div>
}