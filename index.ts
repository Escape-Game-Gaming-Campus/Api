const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1720823",
  key: "39f939b9f53716caf5d8",
  secret: "201eb1f9e95745623191",
  cluster: "eu",
  useTLS: true
});

import express from 'express';
import cors from 'cors';
const app = express();
const port = 3001;
app.use(express.json());
app.use(cors());

app.get('/sendMessage', (req, res) => {
    const data = { message: 'Hello from the API!' };

    pusher.trigger("my-channel", "my-event", {
      message: "hello world"
    });

    console.log("Pusher triggered");

    res.json(data);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});