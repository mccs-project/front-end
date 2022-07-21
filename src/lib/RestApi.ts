import { TokenResponseBody, TwitterOAuth2AccessUrlResponseBody, TwitterTokenRequestBody, TwitterUsersMeResponseBody } from "../shared/api/interfaces";
import { ApiPath } from "../shared/api/Path";
import { myFetch } from "./Fetch";

export class LocalApi {

    /** 自分のTwitterアカウント情報を取得します */
    public static async getTwitterUsersMe(): Promise<TwitterUsersMeResponseBody> {
        const response = await myFetch(ApiPath.TWITTER_GET_USERS_ME);
        return await response.json();
    }

    /** トークンを取得します */
    public static async getToken(): Promise<TokenResponseBody> {
        const response = await myFetch(ApiPath.TOKEN);
        return await response.json();
    }

    public static async postTwitterOAuth2Token(postData: TwitterTokenRequestBody){
        const response = await myFetch(ApiPath.TWITTER_OAUTH2_TOKEN, {
            method: "POST",
            body: JSON.stringify(postData),
        })

        //  一旦応答のステータスが正常でない場合に例外を投げておく
        //  axiosに書換時消滅予定
        if(response.status < 200 || 300 <= response.status) {
            throw new Error("{EEE98679-3CAF-469E-9529-AD9E79550115}");
        }
    }


    /** Twitter OAuth2の認可ページのURLを取得します。 */
    public static async getTwitterOAuth2AccessUrl(): Promise<TwitterOAuth2AccessUrlResponseBody> {
        const response = await myFetch(ApiPath.TWITTER_OAUTH2_ACCESS_URL);
        return await response.json();
    }
}