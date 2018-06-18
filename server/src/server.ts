import * as express from "express";
import {Server, Path, GET, PathParam} from "typescript-rest";
import {SomethingController} from './something/SomethingController';
import {MatchMakerService} from './matchmaker/services/MatchMakerService';
 
let app: express.Application = express();
Server.buildServices(app, SomethingController);

const matchMaker = new MatchMakerService(app, Number(process.env.PORT) || 80);


 