import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CardComponent from "./CardComponent";
import { Tooltip } from "react-tippy";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const Favorite = () => {
  const { profileId } = useParams();
  const [username, setUsername] = useState();
  const [dbInfo, setDbInfo] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const dbCard = await fetch(
        `http://localhost:4000/api/favorite/${profileId}`
      );
      let cardData = await dbCard.json();
      setDbInfo(cardData.data);
      setUsername(cardData.user.username);
    };
    (async () => {
      await fetchData();
    })();
  }, []);
  // console.log(dbInfo.data.length);
  // setUsername(dbInfo.user);
  console.log(username);
  console.log(dbInfo);

  console.log(profileId);
  return (
    <>
      {dbInfo.length > 0 ? (
        <Wrapper>
          {dbInfo.map((card) => {
            console.log(card.card.name);
            const id = card.card._id;
            const name = card.card.name;
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
        <div>Looks like {username} don't have any favorite cards yet</div>
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

export default Favorite;
