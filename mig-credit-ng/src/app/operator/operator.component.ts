import { Component, OnInit } from "@angular/core";
import { NewData } from "src/app/shared/model/new-data.model";

@Component({
  selector: "itw-operator",
  templateUrl: "./operator.component.html",
  styleUrls: ["./operator.component.scss"],
})
export class OperatorComponent implements OnInit {
  private ws: WebSocket;
  private sessionId: string;

  public ngOnInit(): void {
    this.sessionId = "1234";
    this.ws = new WebSocket(`ws://localhost:9229/api/ws/update/websocket`);
  }

  public sendData(): void {
    const data = new NewData({
      fieldName: "test",
      fieldValue: "test value",
      sessionId: "1234",
    });
    this.ws.send(
      '{fieldName: "test", fieldValue: "test value", sessionId: "1234"}'
    );
  }
}
