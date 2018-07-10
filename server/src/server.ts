import * as express from "express";
import { MatchMakerService } from "./matchmaker/services/MatchMakerService";

let app: express.Application = express();
const matchMaker = new MatchMakerService(app, Number(process.env.PORT) || 3000);
