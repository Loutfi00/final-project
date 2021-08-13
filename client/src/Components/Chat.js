import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
const Chat = () => {
  const token = localStorage.getItem("token");
  const exId = useParams();
  const _id = exId.id;
  const [message, setMessages] = useState({});
  const [user, setUser] = useState("false");
  console.log(exId);
  const fetchData = async () => {
    const dbUser = await fetch(`http://localhost:4000/api/messages/${_id}`);
    let user = await dbUser.json();
    setMessages(user.users[0].messages);
  };
  useEffect(() => {
    // setInterval(() => {
    fetchData();
    // }, 1000);
    const fetchData1 = async () => {
      const dbData = await fetch(`http://localhost:4000/api/profile/${token}`);
      let info = await dbData.json();
      setUser(info.profile.username);
    };
    fetchData1();
  }, []);
  console.log(message);
  const handleSend = (e) => {
    // e.preventDefault();
    console.log(exId.id);
    let form = document.forms.msgForm.elements;
    let fullForm = {};
    for (let i = 0; i < form.length; i++) {
      let key = form[i].name;
      let value = form[i].value;
      fullForm[key] = value;
    }
    console.log(fullForm.messages);
    fetch("http://localhost:4000/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        _id: exId.id,
        userInput: fullForm.messages,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  };
  console.log(user);

  return (
    <Wrapper>
      {/* <Wrap> */}
      <Messages id="msgForm" onSubmit={handleSend}>
        {message.length > 0 && user !== "false"
          ? message.map((messag, i) => {
              console.log(messag.userInput);
              return (
                <One>
                  {user}:{<span> {messag.userInput}</span>}
                </One>
              );
            })
          : ""}

        <Input type="text" name="messages"></Input>
        <Button type="submit">Send</Button>
      </Messages>
      {/* </Wrap */}
    </Wrapper>
  );
};

const One = styled.div`
  margin-left: 10px;
  margin-top: 20px;
  /* background-color: grey; */
  width: fit-content;
  padding: 0 10px 0;
  border-radius: 10px;
  color: black;
`;
const Wrapper = styled.div`
  height: 90vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Messages = styled.form`
  width: 80%;
  height: 80%;
  background-color: aliceblue;
  position: relative;
`;
const Button = styled.button`
  position: absolute;
  bottom: 0;
  height: 30px;
  right: 0px;
  width: 90px;
`;

const Input = styled.input`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30px;
`;
export default Chat;
