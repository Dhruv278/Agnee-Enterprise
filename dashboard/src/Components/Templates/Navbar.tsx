import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Styled components
const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #333333a8;
  color: white;
  width: 96%;
  top: 0;
  z-index: 1000;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
  }
`;

const NavbarLeft = styled.div`
  h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const NavbarRight = styled.div`
  display: flex;
  gap: 1rem;

  a {
    color: white;
    text-decoration: none;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 5px;

    &:hover {
      background-color: #555;
    }
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }
`;

// Navbar Component
const Navbar: React.FC = () => {
  return (
    <NavbarContainer>
      <NavbarLeft>
        <h1>AGNEE</h1>
      </NavbarLeft>
      <NavbarRight>
        <Link to="/">Invoice Form</Link>
        <Link to="/bills">Bills</Link>
        <Link to="/dashboard">Dashboard</Link>
      </NavbarRight>
    </NavbarContainer>
  );
};

export default Navbar;
