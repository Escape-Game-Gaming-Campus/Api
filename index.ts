import express from 'express';
import cors from 'cors';
import CommandManager from "./commandManager/commandManager";
import pusherManager from './pusherManager/pusherManager';
import { BG_COLOR_TEXT, COLOR_TEXT, FORMAT_TEXT } from './utils/colors';
import Object from './utils/object';

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
pusherManager.void();

app.listen(APPPort, () => {
    console.log(BG_COLOR_TEXT.GREEN + COLOR_TEXT.BLACK + `Server is running on port ${APPPort}` + FORMAT_TEXT.RESET);
});

export var inventory: Object[] = [];