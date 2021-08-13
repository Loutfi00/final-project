import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import styled from "styled-components";
import { CgProfile } from "react-icons/cg";
import background from "../assets/castle.jpg";
import earth from "../assets/angel.jpg";

const Register = () => {
  const history = useHistory();
  const [passObj, setPassObj] = useState({});
  const [error, setError] = useState(null);
  const [id, setId] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    let form = document.forms.registerForm.elements;
    let fullForm = {};
    for (let i = 0; i < form.length; i++) {
      let key = form[i].name;
      let value = form[i].value;
      fullForm[key] = value;
    }
    console.log(fullForm);
    setPassObj({
      password: fullForm.password,
      confirmPassword: fullForm.confirmPassword,
    });
    await fetch("http://localhost:4000/api/register", {
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
        setError(data.errCode);
        // history.push("/login");
        if (data.errCode === 0) {
          fetch("http://localhost:4000/api/inventory", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              _id: data.message._id,
            }),
          })
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              console.log(data);
            });
          history.push("/login");
        }
        console.log(error);
      });
    console.log(id);
  };
  console.log(error);
  console.log(passObj);
  console.log(id);
  const errorHandler = (errCode) => {
    if (errCode === 0) {
      return "Success";
    }
    if (errCode === "X") {
      return "Passwords does not match";
    }
    if (errCode === 1) {
      return "Invalid username/password";
    }
    if (errCode === 2) {
      return "Invalid username";
    }
    if (errCode === 3) {
      return "Invalid password";
    }
    if (errCode === 4) {
      return "Password must be at leat 6 characters";
    }
    if (errCode === 5) {
      return "Username already exist";
    }
    if (errCode === 6) {
      return "Email already Exist";
    }
    if (errCode === 7) {
      return "Invalid email";
    }
    return "Unkown error";
  };
  return (
    <>
      <Wrapper>
        <Form id="registerForm" onSubmit={handleSubmit}>
          <Left>
            <Error
              style={
                error
                  ? { height: "30px" }
                  : passObj.confirmPassword !== passObj.password
                  ? { height: "30px" }
                  : { height: "0px" }
              }
            >
              <Span>
                {error
                  ? errorHandler(error)
                  : // : passObj.confirmPassword !== passObj.password
                    // ? "Passwords do not match"
                    ""}
              </Span>
            </Error>
            <ProfileWrapper>
              <ProfileIcon />
              <Title>Register</Title>
            </ProfileWrapper>
            <InputWrapper>
              <label htmlFor="username"></label>
              <Input
                style={
                  error === 1 || error === 2
                    ? {
                        border: "1px solid red",
                        backgroundColor: "rgba(155, 0, 0, 0.1)",
                        color: "white",
                      }
                    : { border: "1px solid rgba(0, 0, 0, 0.6)" }
                }
                type="text"
                id="username"
                name="username"
                placeholder="username"
              ></Input>
            </InputWrapper>
            <InputWrapper>
              <label htmlFor="email"></label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="email"
                style={
                  error === 6 || error === 7
                    ? {
                        border: "1px solid red",
                        backgroundColor: "rgba(155, 0, 0, 0.1)",
                        color: "white",
                      }
                    : { border: "1px solid rgba(0, 0, 0, 0.6)" }
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
                style={
                  error === 1 || error === "X" || error === 3 || error === 4
                    ? {
                        border: "1px solid red",
                        backgroundColor: "rgba(155, 0, 0, 0.1)",
                        color: "white",
                      }
                    : { border: "1px solid rgba(0, 0, 0, 0.6)" }
                }
              ></Input>
            </InputWrapper>
            <InputWrapper>
              <label htmlFor="password"></label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="confirm password"
                style={
                  error === "X"
                    ? {
                        border: "1px solid red",
                        backgroundColor: "rgba(155, 0, 0, 0.1)",
                        color: "white",
                      }
                    : { border: "1px solid rgba(0, 0, 0, 0.6)" }
                }
              ></Input>
            </InputWrapper>

            <ButtonWrapper>
              <Button type="submit">Register</Button>
              <RegisterBtn href="/login">Login</RegisterBtn>
            </ButtonWrapper>
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
  align-self: center;
`;
const ProfileWrapper = styled.div`
  margin-top: -70px;
  @media only screen and (max-width: 850px) {
    margin-top: -20px;
  }
`;
const Form = styled.form`
  background-color: red;
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
  margin-top: 10px;
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
  &:focus {
    border: 1px solid rgba(0, 0, 0, 0.5);
    outline: none;
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
const RegisterBtn = styled.a`
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
  align-self: center;
  margin-left: 10px;
`;
export default Register;
