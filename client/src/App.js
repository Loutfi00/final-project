import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import Login from "./Components/Login";
import Register from "./Components/Register";
import GlobalStyle from "./GlobalStyle";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <GlobalStyle />

        <Switch>
          <Route exact path="/">
            Hello
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route path="">404: Oops!</Route>
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default App;
