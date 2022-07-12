import { RestRequest } from "msw";
import { Util } from "../../lib/Util";

export class MockToken {
    
    /** トークンの長さ */
    private readonly TOKEN_LENGTH: number = 80;

    public getResponse(req: RestRequest): TokenResponseBody {
        const auth = req.headers.get("Authorization");
        const token = auth?.replace("Bearer ", "").trim();
        console.log(`MockToken::getResponse() token: ${token}`);

        //  以下のいずれかの場合、新しいトークンを生成して返す
        //    ・Authorizationヘッダがない
        //    ・トークンが正しいフォーマットでない
        if(token === undefined || this.isTokenFormat(token) === false) {
            //  新しいランダム文字列を返す
            return { token: Util.getRandomString(this.TOKEN_LENGTH) };
        }
        else {
            //  トークンは有効なものとしてそのまま返す
            return { token: token };
        }
    }

    /** 指定したトークンが正常なフォーマットであるかどうかを返します */
    public isTokenFormat(token: string): boolean {
        return token.length === this.TOKEN_LENGTH;
    }
}