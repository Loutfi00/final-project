import React from "react";
import { useEffect, useState } from "react";
import Users from "./Users";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Char from "../assets/users.jpg";

export const Homepage = () => {
  return (
    <Wrapper>
      {/* <div>Welcome to ...</div> */}
      {/* <Wrapper> */}
      <Users />
      {/* </Wrapper> */}
    </Wrapper>
  );
};
const Wrapper = styled.div`
  background-image: url(${Char});
  background-size: cover;
  position: relative;
`;
