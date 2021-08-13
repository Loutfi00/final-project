import React from "react";
import styled from "styled-components";
import Dragon from "../assets/dragonBg.jpg";

const CreateCards = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    let form = document.forms.cardForm.elements;
    let fullForm = {
      favorite: false,
      exchangeable: false,
    };
    for (let i = 0; i < form.length; i++) {
      let key = form[i].name;
      let value = form[i].value;
      fullForm[key] = value;
    }
    console.log(fullForm);
    await fetch("http://localhost:4000/api/cards", {
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
        console.log(data);
      });
  };
  return (
    <>
      <div>
        <Form id="cardForm" onSubmit={handleSubmit}>
          <h1 style={{ fontSize: "60px" }}>Create your own Card</h1>
          <Wrapper>
            <Input type="text" name="name" placeholder="Name"></Input>
            <Input type="text" name="image" placeholder="Image Source"></Input>
            <Input type="text" name="rarity" placeholder="Rarity"></Input>
            <Button>Submit</Button>
          </Wrapper>
        </Form>
      </div>
    </>
  );
};

const Form = styled.form`
  height: 90vh;
  background-image: url(${Dragon});
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px solid black;
  padding: 45px;
  margin-top: 30px;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
      rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
      rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  }
`;

const Input = styled.input`
  margin-top: 20px;
  width: 20vw;
  height: 4vh;
  font-size: 20px;
  &:focus {
    border: none;
    outline: none;
  }
`;

const Button = styled.button`
  height: 40px;
  width: 50%;
  margin-top: 20px;
  font-size: 20px;
  border: none;
  border-radius: 20px;
  transition: all 0.2s;
  &:hover {
    cursor: pointer;
    transform: scale(1.04);
    /* background-color: black; */
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

export default CreateCards;
