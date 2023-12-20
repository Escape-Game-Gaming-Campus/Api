import express from 'express';
import cors from 'cors';
import CommandManager from "./commandManager/commandManager";
import pusherManager from './pusherManager/pusherManager';
import { BG_COLOR_TEXT, COLOR_TEXT, FORMAT_TEXT } from './constants/colors';
import Object from './constants/object';
import { genDoc } from './utils/doc';
import { readFileSync, writeFile } from 'fs';
import * as AppConfig from './constants/appConfig.json';
import axios from 'axios';

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
export const doc = new genDoc();
app.use(express.json());
app.use(cors());

CommandManager();
pusherManager.void();

app.listen(APPPort, () => {
  writeFile("../../.doc/Writerside/topics/Commands.md", doc.getDoc()[0], function (err) {
    if (err) {
      return console.error(err);
    }
    if (AppConfig.DetailLogs) {
      console.log(BG_COLOR_TEXT.YELLOW + COLOR_TEXT.BLACK + "Documentation for commands created!" + FORMAT_TEXT.RESET);
    }
    writeFile("../../.doc/Writerside/topics/Pusher.md", doc.getDoc()[1], function (err) {
      if (err) {
        return console.error(err);
      }
      if (AppConfig.DetailLogs) {
        console.log(BG_COLOR_TEXT.YELLOW + COLOR_TEXT.BLACK + "Documentation for pusher created!" + FORMAT_TEXT.RESET);
      }
      writeFile("../../.doc/Writerside/snippet/AppConfig.json", readFileSync("../constants/AppConfig.json", "utf8"), function (err) {
        if (err) {
          return console.error(err);
        }
        if (AppConfig.DetailLogs) {
          console.log(BG_COLOR_TEXT.YELLOW + COLOR_TEXT.BLACK + "Documentation for AppConfig.json created!" + FORMAT_TEXT.RESET);
        }
        console.log(BG_COLOR_TEXT.GREEN + COLOR_TEXT.BLACK + `Server is running on port ${APPPort}` + FORMAT_TEXT.RESET);
        require("./commandManager/commands/update").run(null, null);

        const options = {
          method: 'GET',
          url: 'https://api.lifx.com/v1/lights/all',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer `
          }
        };

        axios
          .request(options)
          .then(function (response) {
            writeFile("../lifx.json", JSON.stringify(response.data, null, 2), function (err) {
              console.log("sended");
            });
          })
          .catch(function (error) {
            writeFile("../lifx.json", JSON.stringify(error, null, 2), function (err) {
              console.error("error");
            });
          });
      });
    });
  });
});

export var inventory: Object[] = [];