import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Inventory from "./Components/Inventory.js";
import GlobalStyle from "./GlobalStyle";
import { Header } from "./Components/Header";
import { authActions } from "./store/auth";
import { useSelector, useDispatch } from "react-redux";
import { Homepage } from "./Components/Homepage";
import CreateCards from "./Components/CreateCards";
import AllCards from "./Components/AllCards";
import BigCard from "./Components/BigCard";
import Profile from "./Components/Profile";
import Collection from "./Components/Collection";
import Favorite from "./Components/Favorite";
import Exchangeable from "./Components/Exchangeable";
import EarnCard from "./Components/EarnCard";
import Trading from "./Components/Trading";
import ProfileP from "./Components/pProfile";
import Chat from "./Components/Chat";
const App = () => {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const isLoggedIn = localStorage.getItem("token");
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(authActions.login());
    } else {
      dispatch(authActions.logout());
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <GlobalStyle />
        <Switch>
          <Route exact path="/">
            <Header />

            <Homepage />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/inventory">
            <Header />

            <Inventory />
          </Route>
          <Route exact path="/create-cards">
            <Header />

            <CreateCards />
          </Route>
          <Route exact path="/cards">
            <Header />

            <AllCards />
          </Route>
          <Route exact path="/cards/:cardId">
            <Header />

            <BigCard />
          </Route>
          <Route exact path="/inventory/:cardId">
            <Header />

            <BigCard />
          </Route>
          <Route exact path="/profile/:profileId">
            <Header />

            <Profile />
          </Route>
          <Route exact path="/collection/:profileId/">
            <Header />

            <Collection />
          </Route>
          <Route exact path="/favorite/:profileId/">
            <Header />

            <Favorite />
          </Route>
          <Route exact path="/exchange/:profileId/">
            <Header />

            <Exchangeable />
          </Route>
          <Route exact path="/pull-card">
            <Header />

            <EarnCard />
          </Route>
          <Route exact path="/trading-center">
            <Header />

            <Trading />
          </Route>
          <Route exact path="/profile">
            <Header />
            <ProfileP />
          </Route>
          <Route exact path="/chat/:id">
            <Header />
            <Chat />
          </Route>
          <Route path="">404: Oops!</Route>
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default App;
