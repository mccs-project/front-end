import { RestRequest } from "msw";
import { HallsRequestBody, HallsResponseBody } from "../../shared/api/interfaces";


const halls: HallsResponseBody["halls"] = [
    {
        hall_id: 100100002,
        hall_uuid: "0eef873d-6beb-4735-99a3-5909bdc521b6",
        open_time: 1658451600,
        close_time: 1658494800,
        open_day: 20220722,
        hall_name: "ELDORADO WEST",
    },
    {
        hall_id: 100100003,
        hall_uuid: "e8a3d990-9b27-43aa-8e09-d2c7dce92c35",
        open_time: 1658322000,
        close_time: 1658361600,
        open_day: 20220720,
        hall_name: "ELDORADO EAST",
    },
];

export class MockEldorado {

    public static async getHalls(req: RestRequest): Promise<HallsResponseBody> {

        const requestBody = req.body as HallsRequestBody;
        //  リクエストのパラメータを取得
        const startTimeUnix: number|undefined = requestBody.start_time ?? undefined;
        const endTimeUnix: number|undefined = requestBody.end_time ?? undefined;
        //  期間でフィルタ
        const halls_result = halls.filter(h=>{
            if(startTimeUnix && h.close_time < startTimeUnix) return false;
            if(endTimeUnix && endTimeUnix < h.open_time) return false;
            return true;
        });

        return {
            halls: halls_result,
        }
    }

    public static async getLatestHalls(): Promise<HallsResponseBody> {
        //  各ホールIDにおける最新を取得
        const halls_result = halls.filter(hall=>{
            return hall.close_time === Math.max(...halls.filter(h=>h.hall_id === hall.hall_id).map(h=>h.close_time))
        });

        return {
            halls: halls_result,
        };
    }
}