import { Component } from "@angular/core";
import { WebSocketAPI } from "src/app/shared/utils/websocket-api";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "mig-credit-ng";
  // webSocketAPI: WebSocketAPI;
  // greeting: any;
  // name: string;
  // ngOnInit() {
  //   this.webSocketAPI = new WebSocketAPI();
  // }

  // connect() {
  //   this.webSocketAPI._connect();
  // }

  // disconnect() {
  //   this.webSocketAPI._disconnect();
  // }

  // sendMessage() {
  //   this.webSocketAPI._send(this.name);
  // }

  // handleMessage(message) {
  //   this.greeting = message;
  // }
}
