import React from "react";
import { useEffect, useState } from "react";
import CardComponent from "./CardComponent";
import { Tooltip } from "react-tippy";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const AllCards = () => {
  const [dbInfo, setDbInfo] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const dbCards = await fetch("http://localhost:4000/api/cards");
      let cardsData = await dbCards.json();
      setDbInfo(cardsData.data);
    };
    (async () => {
      await fetchData();
    })();
  }, []);
  console.log(dbInfo);
  return (
    <>
      {dbInfo.length > 0 ? (
        <Wrapper>
          {dbInfo.map((card) => {
            const id = card._id;
            const name = card.name;
            const image = card.image;
            const rarity = card.rarity;
            console.log(id);
            return (
              <Tip title={name}>
                <NavLink to={`/cards/${id}`}>
                  <CardComponent name={name} image={image} rarity={rarity} />
                </NavLink>
              </Tip>
            );
          })}
        </Wrapper>
      ) : (
        <div></div>
      )}
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Tip = styled(Tooltip)`
  margin-top: 80px;
  margin-left: 20px;
`;
export default AllCards;
