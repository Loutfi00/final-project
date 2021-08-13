import React, { forwardRef } from "react";
import styled from "styled-components";
import { RiStarSFill } from "react-icons/ri";
import Tippy from "@tippyjs/react";

import "tippy.js/dist/tippy.css";
import { useEffect, useState } from "react";

const CardComponent = forwardRef(({ name, image, rarity }, ref) => {
  const stars = Array.from({ length: rarity });
  const imgSrc = `/cards/${image}`;

  return (
    <Card ref={ref}>
      <CardImage style={{ backgroundImage: `url(${imgSrc})` }}></CardImage>
      <Stars>
        {stars.map((star) => {
          return <Rating />;
        })}
      </Stars>
    </Card>
  );
});

const Card = styled.div`
  color: blue;
  height: 28vh;
  min-width: 180px;
  max-width: 180px;
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

const CardImage = styled.div`
  height: 80%;
  width: 100%;
  background-size: cover;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const Rating = styled(RiStarSFill)`
  color: gold;
  font-size: 30px;
`;

const Stars = styled.div`
  display: flex;
  margin-bottom: 6px;
`;
export default CardComponent;
