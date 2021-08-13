import React from "react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import Char from "../assets/users.jpg";
import Castle from "../assets/castle.jpg";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dbUsers = await fetch(`http://localhost:4000/api/all-users`);
      let users = await dbUsers.json();
      setUsers(users.data);
    };
    fetchData();
  }, []);
  const username = users.map((user) => {
    return user.username;
  });
  console.log(username);

  return (
    <Wrapper>
      <Link to={"/pull-card"}>Press here to earn some cards</Link>
      {users.map((user) => {
        return (
          <LinkTo to={`/profile/${user._id}`}>
            <Box>
              <Name>{user.username}</Name>
            </Box>
          </LinkTo>
        );
      })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  /* background-image: url(${Char}); */
  background-size: cover;
  height: 90vh;
`;
const Link = styled(NavLink)`
  text-decoration: none;
  margin-bottom: 30px;
  margin-top: 30px;
  width: 300px;
  background-image: url(${Char});
  background-size: cover;
  height: 30px;
  border-radius: 10px;
  transition: all 0.8s;
  text-align: center;
  padding-top: 5px;
  color: black;
  font-weight: bold;
  &:hover {
    transform: scale(1.06);
    cursor: pointer;
    /* filter: grayscale(1); */
    filter: grayscale(20%);
  }
`;
const Box = styled.div`
  width: 200px;
  background-color: orange;
  height: 30px;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  align-items: center;
  border-radius: 10px;
  transition: all 0.8s;
  background-image: url(${Castle});
  background-size: cover;
  color: black;
  font-weight: bold;
  &:hover {
    transform: scale(1.06);
    cursor: pointer;
    /* filter: grayscale(1); */
    filter: grayscale(20%);
  }
`;

const Name = styled.span``;

const LinkTo = styled(NavLink)`
  text-decoration: none;
  color: white;
`;
export default Users;
