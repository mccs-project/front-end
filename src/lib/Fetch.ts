import { ApiPath } from "../shared/api/Path";
import { Env } from "./Env";
import { Token } from "./Token";


export class Fetch {
    public static getOverrideFetch(): (input: RequestInfo | URL, init?: RequestInit | undefined)=>Promise<Response> {
        const fetchOrg = window.fetch;
        return (input: RequestInfo | URL, init?: RequestInit | undefined) => {

            //  ローカルサーバーのAPIへアクセスする場合
            if(input.toString().startsWith(ApiPath.API_ROOT_PATH_NAME)) {

                //  保持しているトークンをヘッダに追加
                init = init ?? {};
                init.headers = Token.appendAuthorizationHeader(init.headers);

                //  NODE_ENVがdevelopmentかつ、モックサーバーを起動しない場合は宛先のサーバーを環境変数の内容で上書き
                if(Env.isDevelopment && Env.useMockServer === false) {
                    input = `${new URL(window.location.href).protocol}//${Env.devApiServerHostName}:${Env.devApiServerPort}${input.toString()}`;
                }
            }

            return fetchOrg(input, init);
        }
    }
}