import React from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { RiStarSFill } from "react-icons/ri";

const BigCard = () => {
  const { cardId } = useParams();
  console.log(cardId);

  const [dbInfo, setDbInfo] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const dbCard = await fetch(`http://localhost:4000/api/card/${cardId}`);
      let cardData = await dbCard.json();
      setDbInfo(cardData.data);
    };
    (async () => {
      await fetchData();
    })();
  }, []);
  console.log(dbInfo);
  const name = dbInfo.name;
  const image = dbInfo.image;
  const rarity = dbInfo.rarity;
  const stars = Array.from({ length: rarity });
  const imgSrc = `/cards/${image}`;
  console.log(name);
  return (
    <Wrapper>
      <CardName>{name}</CardName>
      <Card>
        <CardImage style={{ backgroundImage: `url(${imgSrc})` }}></CardImage>
        <Stars>
          {stars.map((star) => {
            return <Rating />;
          })}
        </Stars>
      </Card>
      <ButtonWrapper>
        <Button>Add to favorite</Button>
        <Button>Add to trading</Button>
      </ButtonWrapper>
    </Wrapper>
  );
};
const ButtonWrapper = styled.div``;
const Button = styled.button`
  width: 150px;
  height: 30px;
  border-radius: 10px;
  border: none;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 20px;
  &:hover {
    cursor: pointer;
  }
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;

const Card = styled.div`
  color: blue;
  height: 50vh;
  width: 20vw;
  background-color: grey;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  border: 1px solid black;
  transition: all 0.5s;
  &:hover {
    transform: scale(1.03);
    cursor: pointer;
  }
`;
const CardName = styled.h1`
  color: gold;
  margin-bottom: 10px;
  font-size: 50px;
`;

const CardImage = styled.div`
  height: 80%;
  width: 100%;
  background-size: cover;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const Rating = styled(RiStarSFill)`
  color: gold;
  font-size: 60px;
`;

const Stars = styled.div`
  display: flex;
  margin-bottom: 9px;
`;

export default BigCard;
