import React from "react";
import styled, { css } from "styled-components";
import { useSelector } from "react-redux";
import { HiHome } from "react-icons/hi";
import { GiTrade, GiLightBackpack } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { RiLogoutCircleRLine } from "react-icons/ri";

export const Header = () => {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  console.log(isAuth);
  const token = localStorage.getItem("token");
  const [dbInfo, setDbInfo] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const dbData = await fetch(`http://localhost:4000/api/profile/${token}`);
      let info = await dbData.json();
      setDbInfo(info.profile._id);
    };
    fetchData();
  }, []);
  console.log(dbInfo);
  return (
    <Nav>
      <Wrapper to="/">
        <Span>Home</Span>
        <Home />
      </Wrapper>
      <Wrapper to="/trading-center">
        <Span>Trading center</Span>
        <Trade />
      </Wrapper>
      <Wrapper to={`/profile/${dbInfo}`}>
        <Span>Profile</Span>
        <Profile />
      </Wrapper>
      <Wrapper to="/inventory">
        <Span>Inventory</Span>
        <Inventory />
      </Wrapper>
      <Wrapper to="/login">
        <Span>Logout</Span>
        <Logout1 />
      </Wrapper>
    </Nav>
  );
};
const button = css`
  --fontSizeXl: 40px;
  --fontSizeLg: 35px;
  --fontSizeMd: 30px;
  color: black;
  font-size: var(--fontSizeXl);
  @media only screen and (max-width: 1200px) {
    font-size: var(--fontSizeLg);
  }
  @media only screen and (max-width: 800px) {
    font-size: var(--fontSizeMd);
  }
`;
const Span = styled.span``;
const Home = styled(HiHome)`
  ${button};
`;
const Profile = styled(CgProfile)`
  ${button};
`;
const Logout1 = styled(RiLogoutCircleRLine)`
  ${button};
`;
const Trade = styled(GiTrade)`
  ${button};
`;
const Inventory = styled(GiLightBackpack)`
  ${button};
`;

const Nav = styled.nav`
  height: 10vh;
  width: 100vw;
  background-color: white;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const Wrapper = styled(NavLink)`
  text-decoration: none;
  color: black;
  display: flex;
  align-items: center;
  flex-direction: column;
`;
