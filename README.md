# mds-rock-paper-scissors

This project takes the classic game of rock, paper, scissors and takes it ONE STEP FURTHER!!!

The project uses socket.io (websockets) to match players, make match decisions and relay those decisions back to the players, players can win, lose or draw.

Both projects are written in TypeScript, the front-end is written in Angular and the server is a node application.

This application is written just as a little bit of fun, and as a teaching aid, feel free to fork it and make your own version, or play along if you happen to catch one of my livestreams at https://www.twitch.tv/programminginprogress or watch highlights and previous recorded streams at https://www.youtube.com/user/ProgrammerInProgress

## Running the app

First things first, I decided to make this project a mono-repo, so there are separate steps for running the server and the client.

### running the client

1.  In the project root type: `cd client`

2.  do an `npm install`

3.  type `ng serve`

4.  navigate to `localhost:4200 in your browser`

#### For more information about running angular projects, consult the README in the `client folder` or go to the angular-cli documentation page https://github.com/angular/angular-cli/wiki to troubleshoot any issues.

### Running the server

1.  In the project root type `cd server`

2.  do an `npm install`

3.  Type `npm run build` in the terminal to generate a build in the dist folder (this will turn the TypeScript project into an executable JavaScript project, but will also generate sourcemaps that will allow you to debug the TypeScript)

4.  Type `npm start` in the terminal to begin serving, the app will look for the environment variable process.env.PORT, but if it can't find that variable, it will default to port 80

### Deploying

To follow soon, after I do the demo video!
