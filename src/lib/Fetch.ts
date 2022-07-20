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
        //  ローカルサーバーのAPIへアクセスする場合
        if(pathName.startsWith(ApiPath.API_ROOT_PATH_NAME)) {

            //  保持しているトークンをヘッダに追加
            init = init ?? {};
            init.headers = appendAuthorizationHeader(init.headers);

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
        }
        else {
            //  一旦未対応として例外を投げておく
        }

        return fetch(pathName, init);
};

// export class Fetch {
//     public static getOverrideFetch(): (input: RequestInfo | URL, init?: RequestInit | undefined)=>Promise<Response> {
//         const fetchOrg = window.fetch;
//         return (input: RequestInfo | URL, init?: RequestInit | undefined) => {

//             //  ローカルサーバーのAPIへアクセスする場合
//             if(input.toString().startsWith(ApiPath.API_ROOT_PATH_NAME)) {

//                 //  保持しているトークンをヘッダに追加
//                 init = init ?? {};
//                 init.headers = this.appendAuthorizationHeader(init.headers);

//                 //  POSTの場合は『Content-Type: application/json』のヘッダを追加
//                 if(init.method?.toUpperCase() === "POST") {
//                     init.headers = {
//                         ...init.headers,
//                         "Content-Type": "application/json",
//                     };
//                 }

//                 //  NODE_ENVがdevelopmentかつ、モックサーバーを起動しない場合は宛先のサーバーを環境変数の内容で上書き
//                 if(Env.isDevelopment && Env.useMockServer === false) {
//                     input = `${new URL(window.location.href).protocol}//${Env.devApiServerHostName}:${Env.devApiServerPort}${input.toString()}`;
//                 }
//             }

//             return fetchOrg(input, init);
//         }
//     }

    
//     private static appendAuthorizationHeader(header: HeadersInit | undefined): HeadersInit|undefined {

//         const token: string|undefined = new Token().getFromStorage();

//         //  トークンが取得できた場合は『Authorization』ヘッダを追加
//         if(token !== undefined) {
//             const authObj = { "Authorization": "Bearer " + token };
//             return (header === undefined)
//                 ? authObj
//                 : { ...header, ...authObj }
//         }
//         //  トークンが取得できない場合はヘッダをそのまま返す
//         else {
//             return header;
//         }
//     }
// }