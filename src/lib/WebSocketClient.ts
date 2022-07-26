import ReconnectingWebSocket, { Message } from "reconnecting-websocket";
import { WebSocketCommand } from "../shared/api/WebSocketCommnad";
import { IWsMessage, WsResponseBase, WsInitializeRequest } from "../shared/api/WebSocketMessage";
import { Env } from "./Env";
import { Token } from "./Token";

export abstract class WebSocketClientBase {

    private _ws: ReconnectingWebSocket;
    private _initialized: boolean = false;
    
    public constructor() {
        const url: string = new URL("ws" + window.location.href.substring(4)).origin;
        this._ws = new ReconnectingWebSocket(this.getServerUrl(url));

        this._ws.onmessage = async(event: MessageEvent<any>)=>{ await this._onMessage(event); };
        this._ws.onopen = async() => { this._initialized = false; this._initialize(); };
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

    private async _initialize(): Promise<void> {
        if(this._initialized) { throw new Error("{7ADED48A-D754-488C-85D2-3A218BA969B8}"); }

        const retryInitialize = async()=>{
            if(this._initialized) { return; }
            const token: string|undefined = new Token().getFromStorage();
            if(token) {
                this.send(new WsInitializeRequest({ token }));
            }
            await new Promise(resolve=>{ setTimeout(resolve, 2000); });
            if(this._initialized === false) {
                retryInitialize();
            }
        };
        retryInitialize();
    }

    private async _onMessage(event: MessageEvent<any>): Promise<void> {
        const message: IWsMessage = JSON.parse(event.data);
        if(message.command === WebSocketCommand.INITIALIZE_RESPONSE) {
            const initializeCommand: WsResponseBase = message as WsResponseBase;
            if(initializeCommand.status === 200) {
                this._initialized = true;
                this._onInitialized?.apply(this);
            }
            else {
                console.log("{8C470312-F8A4-4A0F-A8BF-8FD413177033}");
                console.log(`WebSocketClientBase::_onMessage() initializeCommand.status: ${initializeCommand.status}`);
            }
        }
        else {
            this.onMessage(message);
        }
    }
    protected abstract onMessage(message: IWsMessage): Promise<void>;

    private _onInitialized: (()=>void)|undefined = undefined;
    public on(eventType: "initialized", callback: ()=>void): void {
        switch(eventType) {
            case "initialized":
                this._onInitialized = callback;
                break;
            default:
                //  未実装
                throw new Error("{E4D6C17D-C958-4BCC-BBFE-B5DC96221E88}");
        }
    }

    public send(data: IWsMessage): void {
        this._ws.send(JSON.stringify(data));
    }
    public close(code?: number, reason?: string): void {
        this._ws.close(code, reason);
    }
}