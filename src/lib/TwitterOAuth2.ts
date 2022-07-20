import { ApiPath } from "../shared/api/Path";
import { TwitterOAuth2AccessUrlResponseBody, TwitterTokenRequestBody } from "../shared/api/interfaces";
import { myFetch } from "./Fetch";

/**
 * TwitterのOAuth2.0認証を行うためのクラス
 * Note: ブラウザ側の処理記述
 */
export class TwitterOAuth2 {
    private static readonly REDIRECT_PATH_NAME = "/callback/twitter";

    /** OAuthのリダイレクト先のURLかどうかを返します */
    public static isRedirectUrl(url: URL|string): boolean {
        //  引数がstring型の場合はURLオブジェクトに変換
        url = typeof(url) === "string" ? new URL(url) : url;

        //  以下の条件に合致するURLはリダイレクト先とみなす
        //      ・PathNameが一致
        //      ・URLのパラメータにstateとcodeが存在
        return (
            url.pathname === this.REDIRECT_PATH_NAME &&
            url.searchParams.get("state") !== null &&
            url.searchParams.get("code") !== null
        );
    }

    /** OAuthのリダイレクト先（=ローカルサーバー）での処理を行います */
    public async onRedirectUrl(): Promise<void> {
        const currentUrl: URL = new URL(window.location.href);
        //  現在のURLがリダイレクト先でない場合は例外
        if(TwitterOAuth2.isRedirectUrl(currentUrl) === false) { throw new Error("{B62B571C-2DA0-49D2-8924-171B6735DDA1}"); }
        
        const code: string|null = currentUrl.searchParams.get("code");
        const state: string|null = currentUrl.searchParams.get("state");
        if(code === null) { throw new Error("{C18D2F96-E0BC-48DE-82F1-C1DC0BB1FBA9}"); }    //  fail safe
        if(state === null) { throw new Error("{344570DB-BF1C-449C-AA74-A3841A12051F}"); }    //  fail safe

        const body: TwitterTokenRequestBody = { code, state };
        const response = await myFetch(ApiPath.TWITTER_OAUTH2_TOKEN, {
            method: "POST",
            body: JSON.stringify(body),
        })

        //  現在のURLをルートに戻す
        window.history.replaceState(null, "", "/");
    }

    /**
     * Twitterの認可画面に遷移します。
     */
    public async authorize(): Promise<void> {

        //  認可ページのURLを取得
        const response = await myFetch(ApiPath.TWITTER_OAUTH2_ACCESS_URL);
        const body: TwitterOAuth2AccessUrlResponseBody = await response.json();
        const url: string = body.url;

        // //  認可画面に遷移
        window.location.href = url;
    }
}