import { ApiPath } from "../shared/api/Path";
import { SessionStorageKyes } from "./SessionStorageKyes";
import { Util } from "./Util";

/**
 * TwitterのOAuth2.0認証を行うためのクラス
 * Note: ブラウザ側の処理記述
 */
export class TwitterOAuth2 {
    private readonly TWITTER_AUTH_URL = "https://twitter.com/i/oauth2/authorize";
    private static readonly REDIRECT_PATH_NAME = "/callback/twitter";
    private readonly CLIENT_ID: string = "SGFnYWloVVFHdG4zeUdEenJKcHo6MTpjaQ";
    private readonly RANDOM_STR_LEN = 80;   //  ランダム文字列で生成する長さ
    private readonly SCOPES = ["users.read", "tweet.read", "offline.access"];
    private readonly CODE_CHALLENGE_METHOD: "s256"|"plain" = "plain";   //  TODO: s256が推奨される

    /** OAuthのリダイレクト先のURLかどうかを返します */
    public static isRedirectUrl(url: string): boolean {
        return new URL(url).pathname === this.REDIRECT_PATH_NAME;
    }

    /** OAuthのリダイレクト先（ローカルサーバー）での処理を行います */
    public async onRedirectUrl(): Promise<void> {
        //  現在のURLがリダイレクト先でない場合は例外
        if(TwitterOAuth2.isRedirectUrl(window.location.href) === false) { throw new Error("{B62B571C-2DA0-49D2-8924-171B6735DDA1}"); }

        
        const code: string = this.getCodeFromRedirectPage();
        const codeVerifier: string|null = this.popCodeVerifierFromSessionStorage();
        if(codeVerifier === null) { throw new Error("{A799D88A-D023-4645-9CFD-273257263720}"); }

        //  AccessKey取得テスト
        this.getAccessKeyTest(code, codeVerifier);
        //  現在のURLをルートに戻す
        window.history.replaceState(null, "", "/");
    }

    /**
     * Twitterの認可画面に遷移します。
     */
    public async authorize(): Promise<void> {

        //  ランダム文字列を取得する処理を定義
        const getRandomString = () => { return Util.getRandomString(this.RANDOM_STR_LEN); };

        //  各パラメータを生成
        const state = getRandomString();
        const codeVerifier = getRandomString();
        console.log(`TwitterOAuth2::authorize() codeVerifier: ${codeVerifier}`);
        const codeChallenge: string = await (async (codeVerifier: string)=>{
            switch(this.CODE_CHALLENGE_METHOD) {
                case "plain": return codeVerifier;
                case "s256": {
                    return await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier))
                    .then(hashBuffer => {
                        const hashArray = Array.from(new Uint8Array(hashBuffer));
                        const hashHex = hashArray.map(function (b) { return b.toString(16).padStart(2, '0') }).join('');
                        return hashHex;
                    });
                }
                default: throw new Error("{F2904504-DA45-4B6E-88EF-C8E36DC2A049}");
            }
        })(codeVerifier);
        console.log(`TwitterOAuth2::authorize() codeChallenge: ${codeChallenge}`);
        

        //  作成したstateとcode_verifierとcode_challengeを保存
        this.setStateToSessionStorage(state);
        this.setCodeVerifierToSessionStorage(codeVerifier);

        //  遷移先URLのパラメータ部分を作成
        const urlParams = new URLSearchParams({
            "response_type": "code",
            "client_id": this.CLIENT_ID,
            "redirect_uri": this.getRedirectUrl(),
            "scope": this.SCOPES.join(" "),
            "state": state,
            "code_challenge": codeChallenge,
            "code_challenge_method": this.CODE_CHALLENGE_METHOD
        } as any).toString();
        //  遷移先のURL
        const url = `${this.TWITTER_AUTH_URL}?${urlParams}`;

        //  認可画面に遷移
        console.log(url);
    }

    /** 認可画面からリダイレクトされた画面で認可用のコードを取得します */
    private getCodeFromRedirectPage(): string {
        
        //  保存してあるstateを取得
        const state = this.popStateFromSessionStorage();
        //  取得出来ない場合は例外
        if(state === null) { throw new Error("{AA750339-0AE4-49B8-999D-689F91EA1F1F}"); }

        //  現在のURLからパラメータを取得
        const url = new URL(window.location.href);
        //  URLにパラメータがない場合は例外
        if(url.search.length <= 1) { throw new Error(`{50A329C9-6AFC-4A91-825D-80EA18EABD91} url.search.length: ${url.search.length}`); }
        //  URLパラメータをkey-valueオブジェクトに変換
        const paramsObj = url.search.substring(1).split("&").reduce((prev,current)=>{
            const [k,v] = current.split("=");
            prev[k] = v;
            return prev;
        }, {} as any);

        //  保存していたstateと比較して一致しない場合は例外
        if(state !== paramsObj["state"]) { throw new Error(`{DBDFF6A2-AED8-45D5-A26D-CA41E22DD66F} state: ${state}, paramsObj["state"]: ${paramsObj["state"]}`); }
        //  codeパラメータが存在しない場合は例外
        const code = paramsObj["code"] as string|undefined;
        if(code === undefined || code.length === 0) { throw new Error(`{B315A697-204C-4822-A8A0-1236371E2908} code: ${code}`); }
        
        return code;
    }

    /**
     * AccessKey(+RefreshKey)を取得します
     * TODO: バックエンド側へ移動
    */
    public async getAccessKeyTest(authorizationCode: string, codeVerifier: string): Promise<void> {
        console.log("TwitterOAuth2::getAccessKeyTest()");
        console.log(`authorizationCode: ${authorizationCode}`);
        console.log(`codeVerifier: ${codeVerifier}`);

        let bodyStr = new URLSearchParams({
            "code": authorizationCode,
            "grant_type": "authorization_code",
            "client_id": this.CLIENT_ID,
            "redirect_uri": this.getRedirectUrl(),
            "code_verifier": codeVerifier
        }).toString();
        console.log(`bodyStr2[2]: ${bodyStr}`);

        
        fetch(ApiPath.TWITTER_OAUTH2_TOKEN, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: bodyStr
        }).then(async response=>{
            console.log(response);
            const responseBody: {
                "token_type":string,
                "expires_in":number,
                "access_token":string,
                "scope":string,
                "refresh_token":string
            } = await response.json();
            // response.text().then(console.log);
        });
    }

    private getRedirectUrl(): string {
        return new URL(window.location.href).origin + TwitterOAuth2.REDIRECT_PATH_NAME;
    }

    /** セッションストレージにstateの値を保存します */
    private setStateToSessionStorage(state: string): void {
        sessionStorage.setItem(SessionStorageKyes.TWITTER_STATE, state);
    }
    /** セッションストレージにcode_verifierの値を保存します */
    private setCodeVerifierToSessionStorage(codeVerifier: string): void {
        sessionStorage.setItem(SessionStorageKyes.TWITTER_CODE_VERIFIER, codeVerifier);
    }

    /** セッションストレージからstateの値を取り出します */
    private popStateFromSessionStorage(): string|null {
        const state = sessionStorage.getItem(SessionStorageKyes.TWITTER_STATE);
        sessionStorage.removeItem(SessionStorageKyes.TWITTER_STATE);
        return state;
    }
    /** セッションストレージからcode_verifierの値を取り出します */
    private popCodeVerifierFromSessionStorage(): string|null {
        return sessionStorage.getItem(SessionStorageKyes.TWITTER_CODE_VERIFIER);
    }
}