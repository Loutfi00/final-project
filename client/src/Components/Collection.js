import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import CardComponent from "./CardComponent";
import { Tooltip } from "react-tippy";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const Collection = () => {
  const { profileId } = useParams();
  const [dbInfo, setDbInfo] = useState({});
  // const [username, setUsername] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = await fetch(
        `http://localhost:4000/api/collection/${profileId}`
      );
      let cardCollection = await dbCollection.json();
      setDbInfo(cardCollection.inventory);
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
            console.log(card.card.name);
            const id = card.card._id;
            const name = card.card.name;
            // setUsername(name);
            const image = card.card.image;
            const rarity = card.card.rarity;
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
        <div>Looks like don't own any cards yet</div>
      )}
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
`;

const Tip = styled(Tooltip)`
  margin-top: 80px;
  margin-left: 20px;
`;

export default Collection;
