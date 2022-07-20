import { TwitterUsersMeResponseBody } from "../shared/api/interfaces";
import { ApiPath } from "../shared/api/Path";
import { myFetch } from "./Fetch";

export class LocalApi {
    public static async getTwitterUsersMe(): Promise<TwitterUsersMeResponseBody> {
        const response = await myFetch(ApiPath.TWITTER_GET_USERS_ME);
        return await response.json();
    }
}