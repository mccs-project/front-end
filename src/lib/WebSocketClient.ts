import ReconnectingWebSocket, { Message } from "reconnecting-websocket";
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
        console.log(event.data);
        //  TODO 
    }

    public send(data: Message): void {
        this._ws.send(data);
    }
    public close(code?: number, reason?: string): void {
        this._ws.close(code, reason);
    }
}