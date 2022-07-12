import { ApiPath } from "../shared/api/Path";
import { Token } from "./Token";


export class Fetch {
    public static getOverrideFetch(): (input: RequestInfo | URL, init?: RequestInit | undefined)=>Promise<Response> {
        const fetchOrg = window.fetch;
        return (input: RequestInfo | URL, init?: RequestInit | undefined) => {

            //  ローカルサーバーのAPIへアクセスする場合は保持しているトークンをヘッダに追加
            if(input.toString().startsWith(ApiPath.API_ROOT)) {
                init = init ?? {};
                init.headers = Token.appendAuthorizationHeader(init?.headers);
            }

            return fetchOrg(input, init);
        }
    }
}