import ReconnectingWebSocket, { Message } from "reconnecting-websocket";
import { WebSocketMessage } from "../shared/api/interfaces";
import { Env } from "./Env";

export class WebSocketClient {

    private _ws: ReconnectingWebSocket;
    public constructor(url: string) {
        this._ws = new ReconnectingWebSocket(this.getServerUrl(url));

        this._ws.onmessage = async(event: MessageEvent<any>)=>{ await this.onMessage(event); };
    }
    private getServerUrl(url: string): string {
        //  NODE_ENVがdevelopmentかつ、モックサーバーを起動しない場合は宛先のサーバーを環境変数の内容で上書き
        if(Env.isDevelopment && Env.useMockServer === false) {
            return `${new URL(url).protocol}//${Env.devApiServerHostName}:${Env.devApiServerPort}${new URL(url).pathname}`;
        }
        //  それ以外はそのまま返す
        else {
            return url;
        }
    }

    private async onMessage(event: MessageEvent<any>): Promise<void> {
        const message: WebSocketMessage = JSON.parse(event.data);
        if(message === undefined || message.data === undefined || message.command === undefined) {
            console.error(message);
            throw new Error("{5D343596-B940-4455-AB71-811B60D04090}");
        }

        //  TODO 
        console.log(JSON.stringify(message.data));
    }

    public send(data: WebSocketMessage): void {
        this._ws.send(JSON.stringify(data));
    }
    public close(code?: number, reason?: string): void {
        this._ws.close(code, reason);
    }
}