import React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { CgProfile } from "react-icons/cg";
import background from "../assets/earthbg.jpg";
import earth from "../assets/earth.jpg";

const Login = () => {
  const history = useHistory();
  const [theData, setData] = useState(null);
  const [username, setUsername] = useState([]);
  const [error, setError] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    let form = document.forms.loginForm.elements;
    let fullForm = {};
    for (let i = 0; i < form.length; i++) {
      let key = form[i].name;
      let value = form[i].value;
      fullForm[key] = value;
    }
    console.log(fullForm);
    fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...fullForm,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setData(data.data);
        setError(data.errCode);
        console.log(data);
        if (data.errCode === 0) {
          history.push("/");
          window.location.reload();
        }
      });
  };
  console.log(theData);
  console.log(error);

  localStorage.setItem("token", theData);
  return (
    <>
      <Wrapper>
        <Form id="loginForm" onSubmit={handleLogin}>
          <Left>
            <Error style={error === 1 ? { height: "30px" } : { height: "0px" }}>
              <Span>{error === 1 ? "Invalid username/password" : ""}</Span>
            </Error>
            <ProfileWrapper>
              <ProfileIcon />
              <Title>Login</Title>
            </ProfileWrapper>
            <InputWrapper>
              <label htmlFor="username"></label>

              <Input
                type="text"
                id="username"
                name="username"
                placeholder="username"
                style={
                  error === 1
                    ? {
                        border: "1px solid red",
                        backgroundColor: "rgba(155, 0, 0, 0.1)",
                        color: "white",
                      }
                    : error === 0
                    ? { border: "2px solid rgba(81, 203, 255, 1)" }
                    : {}
                }
              ></Input>
            </InputWrapper>
            <InputWrapper>
              <label htmlFor="password"></label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="password"
              ></Input>
            </InputWrapper>
            <ButtonWrapper>
              <Button>Login</Button>
              <Register href="/register">Register</Register>
            </ButtonWrapper>
            <Group>Group Earth</Group>
          </Left>
          <Right></Right>
        </Form>
      </Wrapper>
    </>
  );
};

const Error = styled.div`
  width: 100%;
  background-color: rosybrown;
  position: absolute;
  top: 0;
  transition: all 0.5s;
  z-index: 100;
  display: flex;
  align-self: center;
  justify-content: center;
`;
const Span = styled.span`
  text-align: center;
  align-self: center;
`;

const Group = styled.h1`
  margin-top: 40px;
  color: white;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(${background});
`;
const Title = styled.h1`
  color: white;
`;
const ProfileWrapper = styled.div`
  margin-top: -70px;
  @media only screen and (max-width: 850px) {
    margin-top: -20px;
  }
`;
const Form = styled.form`
  width: 90vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;
const InputWrapper = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`;
const Left = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  background-color: black;
  height: 100%;
  width: 40%;
  align-items: center;
  justify-content: center;
  position: relative;
  @media only screen and (max-width: 850px) {
    width: 100%;
  }
`;
const Right = styled.div`
  position: absolute;
  padding: 10px;
  display: flex;
  flex-direction: row;
  background-color: grey;
  height: 100%;
  width: 60%;
  right: 0;
  background-image: url(${earth});
  background-size: cover;
  @media only screen and (max-width: 850px) {
    visibility: hidden;
  }
`;
const Input = styled.input`
  padding: 8px;
  width: 300px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  transition: all 1s;
  &:focus {
    outline: none;
    transform: translateY(-8px);
    box-shadow: 0 0 5px rgba(81, 203, 238, 1);
    border: 2px solid rgba(81, 203, 255, 1);
  }
`;
const Button = styled.button`
  padding: 9px;
  width: 150px;
  border-radius: 15px;
  margin-top: 20px;
  border: none;
  background-color: #1a8fff;
  font-size: 15px;
  font-weight: bold;
  margin-right: 10px;
  color: white;
  transition: all 0.2s;
  &:hover {
    cursor: pointer;
    background-color: #00478c;
    transform: translateY(-2px);
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
const Register = styled.a`
  padding: 9px;
  width: 150px;
  border-radius: 15px;
  margin-top: 20px;
  border: none;
  background-color: #1a8fff;
  font-size: 15px;
  font-weight: bold;
  color: white;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s;
  &:hover {
    cursor: pointer;
    background-color: #00478c;
    transform: translateY(-2px);
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }
`;
const ProfileIcon = styled(CgProfile)`
  color: white;
  font-size: 100px;
  text-align: center;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  margin-left: -8px;
`;

export default Login;
