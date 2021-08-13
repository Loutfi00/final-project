import React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { RiStarSFill } from "react-icons/ri";
// import Tippy from "@tippy.js/react";
import "react-tippy/dist/tippy.css";
import CardComponent from "./CardComponent";
import { Tooltip } from "react-tippy";
import { NavLink } from "react-router-dom";

const Inventory = () => {
  const token = localStorage.getItem("token");
  const [inventory, setInventory] = useState([]);
  console.log(token);
  useEffect(() => {
    const fetchData = async () => {
      const dbInventory = await fetch(
        `http://localhost:4000/api/inventory/${token}`
      );
      let inventoryData = await dbInventory.json();
      setInventory(inventoryData.inventory);
    };
    if (token) {
      fetchData();
    }
  }, []);
  console.log(inventory);

  const handleFavorite = (e) => {
    e.preventDefault();
    console.log(e.target.dataset.id);
    fetch("http://localhost:4000/api/add-fav", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        cardId: e.target.dataset.id,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  };
  const handleExchange = (e) => {
    e.preventDefault();
    fetch("http://localhost:4000/api/add-exch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        cardId: e.target.dataset.id,
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
      <Wrapper>
        {inventory.map((card) => {
          const id = card.card._id;
          const name = card.card.name;
          const image = card.card.image;
          const rarity = card.card.rarity;
          console.log(id);
          return (
            <Wrap>
              <Tip title={name}>
                <Link to={`/inventory/${id}`}>
                  <CardComponent name={name} image={image} rarity={rarity} />
                </Link>
              </Tip>
              <ButtonWrap>
                <Button data-id={id} onClick={handleFavorite}>
                  Toggle Favorite
                </Button>
                <Button data-id={id} onClick={handleExchange}>
                  Toggle Exchange
                </Button>
              </ButtonWrap>
            </Wrap>
          );
        })}
      </Wrapper>
    </>
  );
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;
const Wrapper = styled.div`
  display: flex;
`;

const Button = styled.button`
  margin-right: 20px;
  padding: 5px 0 5px;
  border-radius: 20px;
  text-decoration: none;
  border: none;
  transition: all 0.2s;
  &:hover {
    cursor: pointer;
    transform: scale(1.04);
  }
`;
const ButtonWrap = styled.div`
  text-decoration: none;
  margin-top: 10px;
  left: 5px;
  /* position: absolute; */
  /* bottom: -30px; */
  /* left: 20px; */
  margin-left: 30px;
`;
const Link = styled(NavLink)`
  /* display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center; */
  position: relative;
`;
const Tip = styled(Tooltip)`
  margin-top: 80px;
  margin-left: 20px;
`;
export default Inventory;
