import * as express from 'express';
import { MatchMakerService } from './matchmaker/services/MatchMakerService';
import { SocketService } from './matchmaker/services/SocketService';
let app: express.Application = express();
const socketService = new SocketService(app, Number(process.env.PORT) || 80);
const matchMaker = new MatchMakerService(socketService);
