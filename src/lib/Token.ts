import { TokenResponseBody } from "../shared/api/interfaces";
import { LocalStorageKeys } from "./LocalStorageKeys";
import { Env } from "./Env";
import { LocalApi } from "./RestApi";

export class Token {

    /** トークンを更新します。 */
    public async refresh(): Promise<void> {

        //  ローカルサーバーからトークンを取得
        const responseBody: TokenResponseBody = await LocalApi.getToken();
        if(responseBody === undefined) { throw new Error("{148AE973-5799-4F9E-8132-DA8D9424BAC1}"); }

        //  ストレージに格納
        this.setToStorage(responseBody.token);
    }

    /** トークンをLocalStorageに格納する際のキーを取得します。 */
    private getLocalStorageKey(): string {
        //  モックサーバーの時はキーを変更する
        //  （同一のブラウザでローカルサーバーとモックサーバー両方を使うとキーが上書きされてしまうため）
        return `${Env.useMockServer?"mock_":""}${LocalStorageKeys.TOKEN}`;
    }

    /** ストレージに保管しているトークンを取得します。 */
    public getFromStorage(): string|undefined {
        const token: string|null = localStorage.getItem(this.getLocalStorageKey());
        return token === null ? undefined : token;
    }

    private setToStorage(token: string): void {
        localStorage.setItem(this.getLocalStorageKey(), token);
    }
}