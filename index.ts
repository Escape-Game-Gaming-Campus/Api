import express, { Express } from 'express';
import cors from 'cors';
import CommandManager from "./commandManager/commandManager";
import pusherManager from './pusherManager/pusherManager';
import { BG_COLOR_TEXT, COLOR_TEXT, FORMAT_TEXT } from './constants/colors';
import Object from './constants/object';
import { genDoc } from './utils/doc';
import { readFileSync, writeFile } from 'fs';
import * as AppConfig from './constants/appConfig.json';
import lights from './utils/lights';
import { getLightbulbs } from './utils/lightbulbs';


const Pusher = require("pusher");
            
export const pusher = new Pusher({
  appId: AppConfig.PUSHER.APP_ID,
  key: AppConfig.PUSHER.KEY,
  secret: AppConfig.PUSHER.SECRET,
  cluster: AppConfig.PUSHER.CLUSTER,
  useTLS: AppConfig.PUSHER.USE_TLS
});

export var app: Express = express();
export const APPPort = 3001;
export const doc = new genDoc();
app.use(express.json());
app.use(cors());

app.listen(APPPort, () => {
  lights.getLights(() => {
    writeFile("../../.doc/Writerside/topics/Commands.md", doc.getDoc()[0], function (err) {
      if (err && AppConfig.DetailLogs) {
        console.error(err);
      }
      else if (AppConfig.DetailLogs) {
        console.log(BG_COLOR_TEXT.YELLOW + COLOR_TEXT.BLACK + "Documentation for commands created!" + FORMAT_TEXT.RESET);
      }
      writeFile("../../.doc/Writerside/topics/Pusher.md", doc.getDoc()[1], function (err) {
        if (err && AppConfig.DetailLogs) {
          console.error(err);
        }
        else if (AppConfig.DetailLogs) {
          console.log(BG_COLOR_TEXT.YELLOW + COLOR_TEXT.BLACK + "Documentation for pusher created!" + FORMAT_TEXT.RESET);
        }
        writeFile("../../.doc/Writerside/snippet/AppConfig.json", readFileSync("../constants/AppConfig.json", "utf8"), function (err) {
          if (err && AppConfig.DetailLogs) {
            console.error(err);
          }
          else if (AppConfig.DetailLogs) {
            console.log(BG_COLOR_TEXT.YELLOW + COLOR_TEXT.BLACK + "Documentation for AppConfig.json created!" + FORMAT_TEXT.RESET);
          }

          writeFile("../../3Dverse/src/_3dverseEngine/AppConfig.json", readFileSync("../constants/AppConfig.json", "utf8"), function (err) {
            if (err && AppConfig.DetailLogs) {
              console.error(err);
            }
            else if (AppConfig.DetailLogs) {
              console.log(BG_COLOR_TEXT.YELLOW + COLOR_TEXT.BLACK + "AppConfig.json duplicated for the front" + FORMAT_TEXT.RESET);
            }

            pusherManager.setUp();
            getLightbulbs.setUp();
            CommandManager();

            console.log(BG_COLOR_TEXT.GREEN + COLOR_TEXT.BLACK + `Server is running on port ${APPPort}` + FORMAT_TEXT.RESET + '\n');
            require("./commandManager/commands/update").run(null, null);
          });
        });
      });
    });
  });
});

export var inventory: Object[] = [];