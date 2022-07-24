import { FloorsResponseBody, HallsRequestBody, HallsResponseBody, MachineListResponseBody } from "../shared/api/interfaces";
import { LocalApi } from "./RestApi";
import { Util } from "./Util";


export class Eldorado {
    public static async getHalls(startDateTime?: Date, endDateTime?: Date): Promise<HallsResponseBody> {
        const requestBody: HallsRequestBody = {
            start_time: startDateTime ? Util.toUnixTime(startDateTime) : undefined,
            end_time: endDateTime ? Util.toUnixTime(endDateTime) : undefined,
        };
        return LocalApi.getEldoradoHalls(requestBody);
    }

    public static async getFloors(hallUuid: string): Promise<FloorsResponseBody> {
        return LocalApi.getFloors({hall_uuid: hallUuid});
    }

    public static async getMachineList(floorUuid: string): Promise<MachineListResponseBody> {
        return LocalApi.getMachineList({ floor_uuid: floorUuid });
    }
}