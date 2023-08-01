/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-undef */
// global variables so they can be accessed anywhere.

// import { io } from 'socket.io-client';

let inRoom;
let activeRoom;
const rooms = [];

// Send message to frontend
function addMessage(msg) {
  const chatList = document.getElementById('chat-list');
  const newMessage = document.createElement('li');
  newMessage.textContent = msg;
  chatList.appendChild(newMessage);
}

// Exits the active room
function exitRoom() {
  if (inRoom || activeRoom) {
    console.log('changing active room from', activeRoom);
    addMessage(`Exiting room: ${activeRoom}`);
    activeRoom = null;
    inRoom = false;
  }
}

function enterRoom(room) {
  console.log(`Entering room: ${room}`);
  if (inRoom || activeRoom) {
    exitRoom();
  }
  activeRoom = room;
  inRoom = true;
  addMessage(`Joining: ${room}`);
  rooms.push(room);
}

// Get user from token
async function getUser(token) {
  try {
    const response = await fetch(`http://localhost:3000/chatDB/verify/token/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const res = await response.json();
    if (res.error) throw new Error(`Received an error ${res.error}`);
    const { name, id } = res;
    return { name, id };
  } catch (err) {
    console.log(err);
    return err;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Get reference to chat-form and send-message-input elements.
  const chatForm = document.getElementById('chat-form');
  const roomForm = document.getElementById('room-form');
  const msgInput = document.getElementById('chat-input');
  const roomInput = document.getElementById('room-input');

  // Function to show the login popup
  async function showLoginPopup() {
    const email = prompt('Please enter your email:');
    const password = prompt('Please enter your password:');

    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Authenticating...');

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const res = await response.json();
      if (res.status === 'success') {
        // Authentication successful, store the JWT token in local storage

        console.log('authenticated!');

        localStorage.setItem('token', res.token);
        const { token } = res.data;
        const usr = await getUser(token);

        console.log(usr);

        // Continue with the socket connection and event listeners
        const socket = io('http://localhost:3000', {transports: ['websocket'], query: { user: usr.name, id: usr.id } });

        // console.log('user', socket.handshake.query.user);

        socket.on('connect', () => {
          console.log('connected to server');
          activeRoom = null;
          inRoom = false;

          // ---HANDLE CHAT FORM SUBMISSION---
          chatForm.addEventListener('submit', (e) => {
            e.preventDefault();

            console.log('InRoom: ', inRoom);
            console.log('ActiveRoom: ', activeRoom);

            const message = msgInput.value;

            if (!inRoom) {
              // Send it to server
              socket.emit('public-message', message);
              console.log('sent public message');
            } else {
              // Send it to room I'm actively in.
              socket.emit('private-message', activeRoom, message);
              console.log('sent room message');
            }

            // Clear msgInput field. (This won't work in all browsers.)
            msgInput.value = '';

            // Append What I said
            addMessage(`I said: ${message}`);
          });

          // ---HANDLE JOIN ROOM FORM SUBMISSION---
          roomForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get message text
            const destination = roomInput.value;

            // Send it to server
            socket.emit('join', destination);
            console.log(destination);

            // Clear roomInput field. (This won't work in all browsers.)
            roomInput.value = '';
          });
        });

        socket.on('server-message', (msg) => {
          addMessage(`[Server]: ${msg}`);
        });

        // Listen for broadcast 'public' event from public space
        socket.on('public-message', (msg) => {
          addMessage(`[Public]: ${msg}`);
        });

        // Listen for broadcast 'room' event from rooms.
        socket.on('room-message', (room, msg) => {
          addMessage(`[${room}]: ${msg}`);
        });

        // Listen for 'join' event
        socket.on('joined', (feedback, room, chatHistory) => {
          console.log(`${room}:${feedback}`);
          enterRoom(room);

          chatHistory.forEach((chat) => {
            addMessage(`${chat.User.name}: ${chat.message}`);
          });
        });

        // Listen for 'exit' event. If reason = server, try deleting this socket from db
        socket.on('disconnect', async (reason) => {
          addMessage('[Disconnected]: ', reason);
          console.log('disconnected', reason);

          window.location.reload();
        });
      } else {
        // Authentication failed, handle the error
        console.log('Authentication failed:', res.error);
        alert('not allowed to join.');
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Add an event listener to trigger the login popup when the page is loaded
  window.addEventListener('load', showLoginPopup);
});
