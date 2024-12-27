const script = document.createElement('script');
script.src = 'https://simple-chat-app-dun.vercel.app/socket.io/socket.io.js'; // Replace with your backend's URL
document.head.appendChild(script);
let socket;
script.onload = () => {
  socket = io('https://simple-chat-app-dun.vercel.app/'); 
  let chatMsgContainer = document.querySelector(".chat-messages");
const chatForm = document.querySelector("#chat-form");
let roomName = document.querySelector("#room-name");
let usersNames = document.querySelector("#users");
// Get userName and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// join chat room
socket.emit("joinRoom", { username, room });
// render users info in UI
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});
// sending msgs
socket.on("message", (message) => {
  outputMessage(message);

  //   scroll to the last message
  chatMsgContainer.scrollTop = chatMsgContainer.scrollHeight;
});

// handle submit messages
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // message text
  const msg = event.target.elements.msg.value;
  //   emit event send chat messages to server
  socket.emit("chatMsg", msg);

  //   clear input
  event.target.elements.msg.value = "";
  event.target.elements.msg.focus();
});
// output message to DOM
function outputMessage(mesg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
     <p class="meta">${mesg.userName} <span>${mesg.time}</span></p>
            <p class="text">
              ${mesg.text}
            </p>
    `;
  chatMsgContainer.appendChild(div);
}
// outputRoom name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// output users to DOM
function outputUsers(users) {
  usersNames.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
  console.log(users);
}

};




// const socket = io('http://localhost:3000/socket.io/socket.io.js');
