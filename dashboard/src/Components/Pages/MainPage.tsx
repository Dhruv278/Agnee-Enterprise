import React from 'react'
import styled from 'styled-components'
import Navbar from '../Templates/Navbar'
import { Outlet } from 'react-router-dom'


const MainPage = () => {
  return (
    <Container>
      <Navbar />
      <Outlet />
    </Container>
  )
}

export default MainPage

const Container=styled.div`

`;