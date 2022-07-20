import { TwitterUsersMeResponseBody } from "../../shared/api/interfaces"


export class MockTwitter {

    public getUsersMe(): TwitterUsersMeResponseBody {
        return {
            name: "Nii",
            profile_image_url: "https://pbs.twimg.com/profile_images/1547204886437122049/QS4YGOO6_normal.jpg",
        };
    }
}