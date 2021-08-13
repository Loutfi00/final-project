import React from "react";
import Angel from "../assets/angel.jpg";
import styled from "styled-components";
import { NavLink, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const Profile = () => {
  const { profileId } = useParams();

  const [user, setUser] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const dbUser = await fetch(
        `http://localhost:4000/api/profileP/${profileId}`
      );
      let user = await dbUser.json();
      setUser(user.data);
    };
    fetchData();
  }, []);

  console.log(profileId);
  const name = user.username;
  const email = user.email;
  console.log(name);
  return (
    <Wrapper>
      <Wrap>
        <Span>Welcome to {name}'s profile</Span>
        <Title>Checkout {name}'s</Title>
        <ButtonWrap>
          <NavLink to={`/collection/${profileId}`}>
            <Inv>Collection</Inv>
          </NavLink>
          <NavLink to={`/favorite/${profileId}`}>
            <Inv>Favorite cards</Inv>
          </NavLink>
          <NavLink to={`/exchange/${profileId}`}>
            <Inv>Exchangeable cards</Inv>
          </NavLink>
        </ButtonWrap>
      </Wrap>
    </Wrapper>
  );
};

const ButtonWrap = styled.div``;
const Title = styled.h1`
  @import url("https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap");
  font-family: "MedievalSharp", cursive;
  margin-top: 30px;
`;
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 900px;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;
const Inv = styled.button`
  width: 250px;
  @import url("https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap");
  font-family: "MedievalSharp", cursive;
  font-size: 25px;
  margin-top: 30px;
  height: 50px;
  margin-left: 10px;
  border-radius: 10px;
  border: none;
  background-color: transparent;
  transition: all 0.48s;
  &:hover {
    cursor: pointer;
    background-color: #dbd6cd;
    transform: scale(1.04);
  }
`;
const Wrapper = styled.div`
  background-image: url(${Angel});
  background-size: cover;
  height: 90vh;
  display: flex;
  flex-direction: column;
`;
const Span = styled.span`
  font-size: 30px;
  @import url("https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap");
  font-family: "MedievalSharp", cursive;
  color: #f5f5f5;
  text-shadow: 0px -2px 4px #fff, 0px -2px 10px #ff3, 0px -10px 20px #f90,
    0px -20px 40px #c33;
  font-size: 50px;
  margin-top: 40px;
`;
export default Profile;
