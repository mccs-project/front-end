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

export const myFetch = async(pathName: string, init?: RequestInit | undefined): Promise<Response> => {
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
