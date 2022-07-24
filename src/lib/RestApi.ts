import { FloorsRequestBody, FloorsResponseBody, HallsRequestBody, HallsResponseBody, MachineListRequestBody, MachineListResponseBody, TokenResponseBody, TwitterOAuth2AccessUrlResponseBody, TwitterTokenRequestBody, TwitterUsersMeResponseBody } from "../shared/api/interfaces";
import { ApiPath } from "../shared/api/Path";
import { Env } from "./Env";
import { Token } from "./Token";


const appendAuthorizationHeader = (header: HeadersInit | undefined): HeadersInit|undefined => {

    const token: string|undefined = new Token().getFromStorage();

    //  トークンが取得できた場合は『Authorization』ヘッダを追加
    if(token !== undefined) {
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

const myFetch = async(pathName: string, init?: RequestInit | undefined): Promise<Response> => {
        //  ローカルサーバーのAPI以外は例外
        if(!pathName.startsWith(ApiPath.API_ROOT_PATH_NAME)) {
            throw new Error("{0B78E9FE-6F89-43AB-9D19-E3A1BA1E58F1}");
        }

        //  保持しているトークンをヘッダに追加
        init = init ?? {};
        init.headers = appendAuthorizationHeader(init.headers);

        //  トークン取得時以外でトークンが付与されていな場合は例外
        if(pathName !== ApiPath.TOKEN && !(init.headers && (init.headers as any)["Authorization"].startsWith("Bearer"))) {
            throw new Error("{5F19CDCC-1872-4568-B0A0-81F04B5614F8}");
        }

        //  POSTの場合は『Content-Type: application/json』のヘッダを追加
        if(init.method?.toUpperCase() === "POST") {
            init.headers = {
                ...init.headers,
                "Content-Type": "application/json",
            };
        }

        //  NODE_ENVがdevelopmentかつ、モックサーバーを起動しない場合は宛先のサーバーを環境変数の内容で上書き
        if(Env.isDevelopment && Env.useMockServer === false) {
            pathName = `${new URL(window.location.href).protocol}//${Env.devApiServerHostName}:${Env.devApiServerPort}${pathName.toString()}`;
        }

        return fetch(pathName, init);
};


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

    public static async postTwitterOAuth2Token(requestBody: TwitterTokenRequestBody){
        const response = await myFetch(ApiPath.TWITTER_OAUTH2_TOKEN, {
            method: "POST",
            body: JSON.stringify(requestBody),
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

    public static async getEldoradoHalls(requestBody: HallsRequestBody): Promise<HallsResponseBody> {
        const response = await myFetch(ApiPath.ELDORADO_HALLS, { method: "POST", body: JSON.stringify(requestBody) });
        return response.json();
    }

    /** 指定したホールのフロア一覧を取得します。 */
    public static async getFloors(requestBody: FloorsRequestBody): Promise<FloorsResponseBody> {
        const response = await myFetch(ApiPath.ELDORADO_FLOORS, { method: "POST", body: JSON.stringify(requestBody) });
        return response.json();
    }

    public static async getMachineList(requestBody: MachineListRequestBody): Promise<MachineListResponseBody> {
        const response = await myFetch(ApiPath.ELDORADO_MACHINE_LIST, { method: "POST", body: JSON.stringify(requestBody) });
        return response.json();
    }
}