import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


import { AppComponent } from './app.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { LobbyComponent } from './lobby/lobby.component';
import { PlayAreaComponent } from './play-area/play-area.component';


const appRoutes: Routes = [
  {path: 'main-menu', component : MainMenuComponent},
  {path: 'lobby', component : LobbyComponent},
  {path: 'play-area', component : PlayAreaComponent},
  {path: '**', component: MainMenuComponent}
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
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true}
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
