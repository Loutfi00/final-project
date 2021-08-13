import React from "react";
import styled from "styled-components";
import earth from "../assets/earth.jpg";
import { useEffect, useState } from "react";
import { RiStarSFill } from "react-icons/ri";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
const Trading = () => {
  const history = useHistory();
  const [isClicked, setIsClicked] = useState(false);
  const [dbInfo, setDbInfo] = useState({});
  const [dbInfo2, setDbInfo2] = useState({});

  const [number, setNumber] = useState(0);
  const [openTrade, setOpenTrade] = useState(false);
  const [inventory, setInventory] = useState({});
  const [tradeable, setTradeable] = useState([]);
  const [tradeableInv, setTradeableInv] = useState([]);
  const [user2Inv, setUser2Inv] = useState(false);

  const [select, setSelect] = useState(false);
  const [selectInv, setSelectInv] = useState(false);
  const [exchangeId, setExchangeId] = useState({});
  const [exchInv, setExchInv] = useState({});
  const [currentUser, setCurrentUser] = useState();
  const [exId, setExId] = useState();
  const token = localStorage.getItem("token");
  let test = 0;
  const fetchData = async () => {
    const dbCard = await fetch(`http://localhost:4000/api/exchange1`);
    let cardData = await dbCard.json();
    setDbInfo(cardData.users);
    setDbInfo2(cardData.user2);
    setExchangeId(cardData);
  };

  const fetchInventory = async () => {
    const dbCard = await fetch(
      `http://localhost:4000/api/exchangeable/${token}`
    );
    let cardData = await dbCard.json();
    setInventory(cardData.data);
    setExchInv(cardData.user.inventory);
  };
  useEffect(() => {
    (async () => {
      await fetchData();
      await fetchInventory();
    })();
  }, []);
  console.log(dbInfo);
  const handleModal = (e) => {
    e.preventDefault();
    setIsClicked(!isClicked);
    console.log(isClicked);
    fetchData();
    setNumber(e.target.dataset.nbs);
    setCurrentUser(e.target.dataset.userid);
    console.log(e.target.dataset.userid);
    console.log(exchangeId.find[number]._id);
    setExId(exchangeId.find[number]._id);
    console.log(exId);
    console.log(dbInfo2);
    console.log(exchangeId.find);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setIsClicked(false);
    setOpenTrade(false);
    console.log(exId);
  };
  const handleUser1 = (e) => {
    setOpenTrade(!openTrade);
    console.log(openTrade);
    fetchInventory();
    console.log(inventory);
  };
  const handleCards = (e) => {
    e.preventDefault();
    setSelect(true);
    console.log(select);
    console.log(e.target.dataset.cardid);
    if (tradeable.includes(e.target.dataset.cardid)) {
      const index = tradeable.indexOf(e.target.dataset.cardid);
    } else {
      setTradeable((tradeable) => [...tradeable, e.target.dataset.cardid]);
    }
    console.log(tradeable);
  };
  const handleSubmit = (e) => {
    fetch("http://localhost:4000/api/exchange", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        cards_id: tradeable,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.errCode === 5) {
          console.log("error");
        }
        window.location.reload();
      });
  };
  const handleConfirm = (e) => {
    e.preventDefault();
    fetch("http://localhost:4000/api/exchange2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        cards_id: tradeableInv,
        userid: currentUser,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.errCode === 5) {
          console.log("error");
        }
        window.location.reload();
      });
  };
  const handleInv1 = (e) => {
    e.preventDefault();
    setSelectInv(true);
    console.log(selectInv);
    console.log(e.target.dataset.cardid);
    if (tradeable.includes(e.target.dataset.cardid)) {
      const index = tradeable.indexOf(e.target.dataset.cardid);
    } else {
      setTradeableInv((tradeableInv) => [
        ...tradeableInv,
        e.target.dataset.cardid,
      ]);
    }
    console.log(tradeableInv);
  };
  const handleUser2 = (e) => {
    e.preventDefault();
    setUser2Inv(true);
    console.log(user2Inv);
  };
  return (
    <Wrapper>
      {openTrade ? (
        <>
          <Inventory>
            {inventory.map((card, i) => {
              const rarity = card.card.rarity;
              const image = card.card.image;
              const stars = Array.from({ length: rarity });
              const imgSrc = `/cards/${image}`;
              const id = card.card._id;
              console.log(card.card._id);
              return (
                <Wrapping>
                  <MiniWrap>
                    <Card
                      style={
                        select && tradeable.includes(id)
                          ? {
                              boxShadow:
                                "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
                              height: "24vh",
                              maxWidth: "180px",
                              minWidth: "180px",
                              border: "3px solid lime",
                            }
                          : {
                              height: "24vh",
                              maxWidth: "180px",
                              minWidth: "180px",
                            }
                      }
                    >
                      <CardImage
                        style={{ backgroundImage: `url(${imgSrc})` }}
                      ></CardImage>
                      <Stars>
                        {stars.map((star) => {
                          return <Rating style={{ fontSize: "27px" }} />;
                        })}
                      </Stars>
                    </Card>
                    {select && tradeable.includes(id) ? (
                      ""
                    ) : (
                      <Button data-cardid={id} onClick={handleCards}>
                        Select
                      </Button>
                    )}
                  </MiniWrap>
                </Wrapping>
              );
            })}
            <button
              style={{
                position: "absolute",
                top: "500px",
                left: "50%",
                zIndex: "2000000",
              }}
              onClick={handleSubmit}
            >
              Trade !
            </button>
            <button
              style={{
                position: "absolute",
                top: "550px",
                left: "50%",
                zIndex: "2000000",
              }}
              onClick={handleBack}
            >
              Go back
            </button>
          </Inventory>
        </>
      ) : (
        <>
          {!isClicked ? <Title>Here is a list of on going trades</Title> : ""}
          {!isClicked ? (
            <Initiate onClick={handleUser1}>Start a trade</Initiate>
          ) : (
            ""
          )}
        </>
      )}
      {isClicked ? (
        <Wrap>
          <Modal>
            {user2Inv ? (
              <Inventory>
                {/* <h1 style={{ textAlign: "center" }}>Your cards :</h1> */}
                <CardWrap>
                  {exchInv.length > 0 ? (
                    exchInv.map((card) => {
                      const rarity = card.card.rarity;
                      const image = card.card.image;
                      const id = card.card._id;
                      const stars = Array.from({ length: rarity });
                      const imgSrc = `/cards/${image}`;
                      console.log(card);
                      return (
                        <MiniWrap>
                          <Card
                            style={
                              selectInv && tradeableInv.includes(id)
                                ? {
                                    boxShadow:
                                      "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
                                    border: "3px solid lime",
                                  }
                                : {}
                            }
                          >
                            <CardImage
                              style={{ backgroundImage: `url(${imgSrc})` }}
                            ></CardImage>
                            <Stars>
                              {stars.map((star) => {
                                return <Rating />;
                              })}
                            </Stars>
                          </Card>
                          {selectInv && tradeableInv.includes(id) ? (
                            ""
                          ) : (
                            <Button
                              style={{
                                padding: "5px 20px 5px",
                                marginLeft: "9px",
                              }}
                              data-cardid={id}
                              onClick={handleInv1}
                            >
                              Select
                            </Button>
                          )}
                        </MiniWrap>
                      );
                    })
                  ) : (
                    <div>There is no trade</div>
                  )}
                </CardWrap>
                <Button1
                  style={{ left: "45%" }}
                  data-cards={tradeableInv}
                  onClick={handleConfirm}
                >
                  Confirm
                </Button1>
              </Inventory>
            ) : (
              <Left>
                <h1 style={{ textAlign: "center" }}>
                  {exchangeId.find[number].users[1].username}{" "}
                </h1>
                <CardWrap>
                  {exchangeId.find[number].users[1].cards.length > 0 ? (
                    exchangeId.find[number].users[1].cards.map((card) => {
                      const rarity = card.card.rarity;
                      const image = card.card.image;
                      const stars = Array.from({ length: rarity });
                      const imgSrc = `/cards/${image}`;
                      console.log(card);
                      return (
                        <Card>
                          <CardImage
                            style={{ backgroundImage: `url(${imgSrc})` }}
                          ></CardImage>
                          <Stars>
                            {stars.map((star) => {
                              return <Rating />;
                            })}
                          </Stars>
                        </Card>
                      );
                    })
                  ) : (
                    <div>There is no trade</div>
                  )}
                </CardWrap>
                {user2Inv ? (
                  ""
                ) : (
                  <Button1 onClick={handleUser2}>
                    Add cards to this trade
                  </Button1>
                )}

                {/* <button onClick={handleUser2}>Check your inventory</button> */}
              </Left>
            )}
            {user2Inv ? (
              ""
            ) : (
              <Right>
                <h1 style={{ textAlign: "center" }}>
                  {dbInfo[number].username} is exchanging :{" "}
                </h1>
                <CardWrap>
                  {dbInfo.length > 0 ? (
                    dbInfo[number].cards.map((card) => {
                      const rarity = card.card.rarity;
                      const image = card.card.image;
                      const stars = Array.from({ length: rarity });
                      const imgSrc = `/cards/${image}`;
                      console.log(card);
                      return (
                        <Card>
                          <CardImage
                            style={{ backgroundImage: `url(${imgSrc})` }}
                          ></CardImage>
                          <Stars>
                            {stars.map((star) => {
                              return <Rating />;
                            })}
                          </Stars>
                        </Card>
                      );
                    })
                  ) : (
                    <div>There is no trade</div>
                  )}
                </CardWrap>
              </Right>
            )}
          </Modal>
          <button style={{ marginTop: "20px" }} onClick={handleBack}>
            Go back
          </button>
          <NavLink
            to={`/chat/${exchangeId.find[number]._id}`}
            style={{ marginTop: "20px" }}
          >
            Chat
          </NavLink>
          {/* <Middle></Middle> */}
        </Wrap>
      ) : openTrade === false ? (
        dbInfo.length > 0 ? (
          dbInfo.map((user, i) => {
            return (
              <Box
                data-nbs={i}
                data-userid={user.user_id}
                onClick={handleModal}
              >
                {user.username}'s trade
              </Box>
            );
          })
        ) : (
          <div>There is no trade going on right now</div>
        )
      ) : (
        <div>'</div>
      )}
    </Wrapper>
  );
};
const MiniWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Wrapping = styled.div`
  display: flex;
  flex-direction: row;
  /* align-items: center; */
  /* justify-content: center; */
  align-items: center;
`;
const Button1 = styled.button`
  position: absolute;
  bottom: 20px;
  left: 35%;
  border: none;
  background-color: grey;
  padding: 5px 20px 5px;
  border-radius: 10px;
  transition: all 0.2s;
  &:hover {
    transform: scale(1.1);
    cursor: pointer;
  }
`;
const Inventory = styled.div`
  background-color: aliceblue;
  height: 80vh;
  display: flex;
  width: 80vw;
  align-items: flex-start;
  z-index: 3000000;
  position: relative;
`;

const Title = styled.h1`
  color: white;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const Initiate = styled.button`
  width: 300px;
  height: 40px;
  background-color: aliceblue;
  border: none;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 30px;
  font-weight: bold;
  transition: all 0.4s;
  &:hover {
    transform: translateY(-4px);
    cursor: pointer;
  }
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  flex-direction: column;
  align-items: center;
`;
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
`;
const Box = styled.button`
  width: 300px;
  height: 20px;
  background-color: white;
  border-radius: 10px;
  text-align: center;
  transition: all 0.2s;
  border: none;
  margin-top: 10px;
  &:hover {
    transform: translateY(-4px);
    cursor: pointer;
  }
`;
const Modal = styled.div`
  height: 70vh;
  width: 80vw;
  z-index: 3000;
  border-radius: 30px;
  display: flex;
`;
const Left = styled.div`
  width: 50%;
  height: 100%;
  background-color: aliceblue;
  border-radius: 30px;
  margin-right: 10px;
  position: relative;
`;
const Right = styled.div`
  width: 50%;
  height: 100%;
  background-color: aliceblue;
  border-radius: 30px;
  margin-left: 10px;
`;
const Middle = styled.div`
  background-color: white;
  height: 20vh;
  width: 20vw;
  display: flex;
  justify-content: center;
`;

const CardWrap = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
const Button = styled.button`
  border: none;
  background-color: transparent;
  max-width: 200px;
  padding: 5px 30px 5px;
  background-color: orange;
  border-radius: 10px;
  justify-content: center;
  margin-top: 10px;
  /* align-self: center; */
  &:hover {
    cursor: pointer;
  }
`;
const Card = styled.div`
  color: blue;
  height: 15vh;
  min-width: 100px;
  max-width: 100px;
  background-color: grey;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  border: 1px solid black;
  transition: all 0.5s;
  outline: none;
  margin-left: 10px;
  margin-top: 20px;
  border: none;
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
  font-size: 10px;
`;

const Stars = styled.div`
  display: flex;
  margin-bottom: 6px;
`;

export default Trading;
