# socket.io-react
A High-Order component to connect React and Socket.io easily.

## API
```javascript
import {
  SocketProvider,
  socketConnect,
} from 'socket.io-react';
```

### SocketProvider(socket?)
```javascript
import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';

import App from './containers/App';

const socket = io.connect(process.env.SOCKET_URL);
socket.on('message', msg => console.log(msg));

const DOMNode = document.getElementById('renderTarget');

render(
  <SocketProvider socket={socket}>
    <App />
  </SocketProvider>,
  DOMNode
);
```
* `socket` property is `false` by default.

### socketConnect(Target)
```javascript
import { socketConnect } from 'socket.io-react';

function App(props) {
  function sendMessage() {
    props.socket.emit('message', 'Hello world!');
  }

  return (
    <button onClick={sendMessage}>
      Send!
    </button>
  );
}

export default socketConnect(App);
```
* `socketConnect` can be used as a decorator (using [**babel-plugin-transform-decorators-legacy**](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy))
