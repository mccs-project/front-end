import { ApiPath } from "../shared/api/Path";
import { TokenResponseBody } from "../shared/api/interfaces";
import { LocalStorageKeys } from "./LocalStorageKeys";
import { myFetch } from "./Fetch";
import { Env } from "./Env";

export class Token {


    public async refresh(): Promise<void> {
        const response = await myFetch(ApiPath.TOKEN);

        const body = await response.json() as TokenResponseBody;

        if(body.token) {
            this.setToStorage(body.token);
        }
        else {
            throw new Error("{148AE973-5799-4F9E-8132-DA8D9424BAC1}");
        }
    }

    private getLocalStorageKey(): string {
        return `${Env.useMockServer?"mock_":""}${LocalStorageKeys.TOKEN}`;
    }

    public getFromStorage(): string|undefined {
        const token: string|null = localStorage.getItem(this.getLocalStorageKey());
        return token === null ? undefined : token;
    }
    private setToStorage(token: string): void {
        localStorage.setItem(this.getLocalStorageKey(), token);
    }
}