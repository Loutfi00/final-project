import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import Char from "../assets/users.jpg";

const EarnCard = () => {
  const history = useHistory();
  const [dbInfo, setDbInfo] = useState({});
  const token = localStorage.getItem("token");
  const handlePull = (e) => {
    e.preventDefault();
    fetch("http://localhost:4000/api/add-cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        history.push("/inventory");
        window.location.reload();
      });
  };
  // console.log(token);
  const array = [
    "bluedragon.jpg",
    "dragonslayer.jpg",
    "gryphon.jpg",
    "hydra.jpg",
    "ninja.jpg",
    "poseidon.jpg",
    "samurai.jpg",
    "seasnake.jpg",
    "shadow.jpg",
    "soldier.jpg",
    "viking.jpg",
    "viking5.jpg",
    "wizard.jpg",
    "wizardknight5.jpg",
  ];
  const [currentBg, setCurrentBg] = useState();
  let rng = Math.floor(Math.random() * array.length);
  // let imgSrc = `/cards/${array[rng]}`;
  useEffect(() => {
    const interval = setInterval(() => {
      rng = Math.floor(Math.random() * array.length);
      setCurrentBg(`/cards/${array[rng]}`);
    }, 800);

    return () => {
      clearInterval(interval);
    };
  }, []);
  console.log(rng);

  return (
    <Wrap>
      <Image style={{ backgroundImage: `url(${currentBg})` }}></Image>
      <Button onClick={handlePull}>Pull a card</Button>
    </Wrap>
  );
};

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 40px 10px;
  font-size: 20px;
  font-weight: bold;
  transition: all 0.2s;
  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
`;
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
`;
const Image = styled.div`
  height: 50vh;
  width: 30vw;
  background-color: white;
  background-size: cover;
  /* background-image: url(${Char}); */
`;
export default EarnCard;
