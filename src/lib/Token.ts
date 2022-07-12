import { ApiPath } from "../shared/api/Path";
import { LocalStorageKeys } from "./LocalStorageKeys";

export class Token {
    public async refresh(): Promise<void> {
        const response = await fetch(ApiPath.TOKEN);

        const body = await response.json() as TokenResponseBody;

        if(body.token) {
            this.saveToken(body.token);
        }
        else {
            throw new Error("{148AE973-5799-4F9E-8132-DA8D9424BAC1}");
        }
    }

    public static appendAuthorizationHeader(header: HeadersInit | undefined): HeadersInit|undefined {

        const token: string|null = new Token().loadToken();

        //  トークンが取得できた場合は『Authorization』ヘッダを追加
        if(token !== null) {
            const authObj = { "Authorization": "Bearer " + token };
            return (header === undefined)
                ? authObj
                : { ...header, ...authObj }
        }
        //  トークンが取得できない場合はヘッダをそのまま返す
        else {
            return header;
        }
    }

    private loadToken(): string|null {
        return localStorage.getItem(LocalStorageKeys.TOKEN);
    }
    private saveToken(token: string): void {
        localStorage.setItem(LocalStorageKeys.TOKEN, token);
    }
}