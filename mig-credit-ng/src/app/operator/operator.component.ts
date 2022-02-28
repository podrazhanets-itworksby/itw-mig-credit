import { Component, OnInit } from "@angular/core";
import { NewData } from "src/app/shared/model/new-data.model";
import { WebSocketAPI } from "src/app/shared/utils/websocket-api";

@Component({
  selector: "itw-operator",
  templateUrl: "./operator.component.html",
  styleUrls: ["./operator.component.scss"],
})
export class OperatorComponent implements OnInit {
  private sessionId: string;
  webSocketAPI: WebSocketAPI;

  public ngOnInit(): void {
    this.webSocketAPI = new WebSocketAPI();
    this.webSocketAPI._connect();
  }

  public sendData(): void {
    const data = new NewData();
    data.fieldName = "lastname";
    data.fieldValue = "Петров";
    data.sessionId = "1234";
    this.webSocketAPI._send(JSON.stringify(data));
  }
}
