import { ApiPath } from "../shared/api/Path";
import { LocalStorageKeys } from "./LocalStorageKeys";

export class Token {
    public async refresh(): Promise<void> {
        const response = await fetch(ApiPath.TOKEN);

        const body = await response.json() as TokenResponseBody;

        this.saveToken(body.token);
    }

    public static appendAuthorizationHeader(header: HeadersInit | undefined): HeadersInit|undefined {

        const token: string|null = new Token().loadToken();
        if(header === undefined) {
            if(token) {
                return { "Authorization": "Bearer " + token };
            }
            else { return header; }
        }

        return { ...header, "Authorization": "Bearer " + token };
    }

    private loadToken(): string|null {
        return localStorage.getItem(LocalStorageKeys.TOKEN);
    }
    private saveToken(token: string): void {
        localStorage.setItem(LocalStorageKeys.TOKEN, token);
    }
}