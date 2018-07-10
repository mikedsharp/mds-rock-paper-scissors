import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { MainMenuComponent } from "./main-menu/main-menu.component";
import { LobbyComponent } from "./lobby/lobby.component";
import { PlayAreaComponent } from "./play-area/play-area.component";
import { MatchmakerModule } from "./matchmaker/matchmaker.module";
import { SocketService } from "./matchmaker/shared/services/socket.service";

const appRoutes: Routes = [
  { path: "main-menu", component: MainMenuComponent },
  { path: "lobby", component: LobbyComponent },
  { path: "play-area", component: PlayAreaComponent },
  { path: "**", component: MainMenuComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    LobbyComponent,
    PlayAreaComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true, useHash: true }),
    MatchmakerModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule {}
