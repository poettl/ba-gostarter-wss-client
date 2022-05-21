import fetch from 'node-fetch';
import WebSocket from 'ws';

console.log('login');
const loginResponse = await fetch('http://localhost:8080/api/v1/auth/login', {
  method: 'POST',
  body: JSON.stringify({
    username: 'user1@email.com',
    password: 'password',
  }),
  headers: {
    'Content-Type': 'application/json',
  },
});
const loginJson = await loginResponse.json();

const wssResponse = await fetch('http://localhost:8080/api/v1/wss/token', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${loginJson.access_token}`,
  },
});
const wssJson = await wssResponse.json();

console.log('wss');
const ws = new WebSocket(
  'ws://localhost:8080/api/v1/wss/stream?wssToken=' + wssJson.token
);

const channel = ['test'];

ws.on('open', function open() {
  ws.send(JSON.stringify(channel));
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});

ws.onclose = function close() {
  console.log('disconnected');
};

await new Promise((resolve) => setTimeout(resolve, 1500));
await fetch('http://localhost:8080/api/v1/sse/trigger/test2');
await fetch('http://localhost:8080/api/v1/sse/trigger/testUser');
await fetch('http://localhost:8080/api/v1/sse/trigger/test');

// await new Promise((resolve) => setTimeout(resolve, 1000));
// await fetch('http://localhost:8080/api/v1/auth/logout', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${loginJson.access_token}`,
//   },
// });

// try wss with invalid token
// try {
//   new WebSocket(
//     'ws://localhost:8080/api/v1/wss/stream?wssToken=' + wssJson.token
//   );
// } catch (e) {
//   console.log('wss with invalid token failed');
// }

console.log('done');

// ws.close();
