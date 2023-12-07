import express from 'express';
import cors from 'cors';
import CommandManager from "./commandManager/commandManager";

const Pusher = require("pusher");

export const pusher = new Pusher({
  appId: "1720823",
  key: "39f939b9f53716caf5d8",
  secret: "201eb1f9e95745623191",
  cluster: "eu",
  useTLS: true
});

export const app = express();
export const APPPort = 3001;
app.use(express.json());
app.use(cors());

CommandManager();

app.listen(APPPort, () => {
    console.log(`Server is running on port ${APPPort}`);
});