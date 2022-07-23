import { RestRequest } from "msw";
import { HallsRequestBody, HallsResponseBody, MachineListRequestBody, MachineListResponseBody } from "../../shared/api/interfaces";

// const halls: HallsResponseBody["halls"] = require("./hoge.json");

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

// const machineList: MachineListResponseBody = {

// };

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

    public static async getMachineList(req: RestRequest): Promise<MachineListResponseBody> {
        const requestBody = req.body as MachineListRequestBody;

        return requestBody.floor_uuid === "cb8c8c45-5a5d-4a85-8fe2-61e217eca945"
            ? {"machine_name":"SecretRoses","machine_type":1,"win_type":"{\"bonus_count\":{\"BB\":\"bb_count\",\"RB\":\"rb_count\"}}","machines":[{"machine_uuid":"64be9707-38b6-4bd1-85e0-78675fa2107e","machine_no":1,"usr_id":0,"slot_detail":{"medal":-870,"bonus_history":[{"type":1,"spin":339}],"spin_count":462,"total_spin_count":801}},{"machine_uuid":"a60656c0-2aa3-4e22-b176-e960a42d281b","machine_no":2,"usr_id":0},{"machine_uuid":"5816886a-0aaa-4e45-b960-20857aa591bd","machine_no":3,"usr_id":5066},{"machine_uuid":"4fec1d72-344b-488a-834d-bd8106a6619b","machine_no":4,"usr_id":13599,"slot_detail":{"medal":2136,"bonus_history":[{"type":1,"spin":9},{"type":2,"spin":845},{"type":1,"spin":13},{"type":1,"spin":29},{"type":1,"spin":5},{"type":1,"spin":5},{"type":1,"spin":13},{"type":1,"spin":3},{"type":1,"spin":22},{"type":1,"spin":30},{"type":1,"spin":6},{"type":1,"spin":8},{"type":1,"spin":26},{"type":1,"spin":141},{"type":1,"spin":46},{"type":2,"spin":251}],"spin_count":0,"total_spin_count":1452}},{"machine_uuid":"ac803aeb-be51-4b73-b67b-aa9f21d0ed7c","machine_no":5,"usr_id":0},{"machine_uuid":"375d19ee-d50a-40cc-ae87-866492705ddf","machine_no":6,"usr_id":18247,"slot_detail":{"medal":3083,"bonus_history":[{"type":1,"spin":28},{"type":1,"spin":34},{"type":1,"spin":7},{"type":1,"spin":6},{"type":1,"spin":28},{"type":1,"spin":6},{"type":1,"spin":28},{"type":1,"spin":14},{"type":1,"spin":29},{"type":1,"spin":16},{"type":1,"spin":9},{"type":1,"spin":19},{"type":1,"spin":21},{"type":1,"spin":27},{"type":2,"spin":12},{"type":1,"spin":194},{"type":2,"spin":283},{"type":1,"spin":445}],"spin_count":35,"total_spin_count":1241}},{"machine_uuid":"19b68a1d-ace5-462a-b806-00c9cebe53a4","machine_no":7,"usr_id":0,"slot_detail":{"medal":-800,"bonus_history":[{"type":1,"spin":598}],"spin_count":131,"total_spin_count":729}},{"machine_uuid":"0be673dc-53f7-4b8b-99ac-b5b6ca217a84","machine_no":8,"usr_id":389,"slot_detail":{"medal":-1708,"bonus_history":[{"type":1,"spin":5},{"type":1,"spin":1153},{"type":1,"spin":450}],"spin_count":100,"total_spin_count":1708}},{"machine_uuid":"03f9bc06-1294-46ad-b7bf-86ff1fa6e926","machine_no":9,"usr_id":951},{"machine_uuid":"86e8b9a9-251f-4d0f-bbeb-21a8290e33f2","machine_no":10,"usr_id":7708},{"machine_uuid":"e10805cf-21f6-468e-b20a-10345e77381f","machine_no":11,"usr_id":19206},{"machine_uuid":"f5f90b98-aaa4-4ed8-910a-ae3931136440","machine_no":12,"usr_id":13165},{"machine_uuid":"efacb684-4d06-4d24-8341-456af88b6d75","machine_no":13,"usr_id":20131},{"machine_uuid":"46ef6ec7-f068-472d-b70d-00e955c554e1","machine_no":14,"usr_id":7713},{"machine_uuid":"7edc3304-1cae-4e23-a072-a8f577587a2a","machine_no":15,"usr_id":20308},{"machine_uuid":"8c50a4d4-a81f-45d1-a2e7-188f26a4de7e","machine_no":16,"usr_id":0},{"machine_uuid":"3c33fafc-45d3-40ce-a364-969c64f11aeb","machine_no":17,"usr_id":20529},{"machine_uuid":"f67ded7f-52cc-4d81-9665-4d35788f80aa","machine_no":18,"usr_id":7762},{"machine_uuid":"39c8d132-2103-4974-abe9-c67ea9ec73a2","machine_no":19,"usr_id":4492},{"machine_uuid":"a690d9ef-3435-4aad-8328-ab98bcd2e0a3","machine_no":20,"usr_id":11537},{"machine_uuid":"d2409b50-39e5-43bb-b4b6-e70d2edb4b9f","machine_no":21,"usr_id":2403},{"machine_uuid":"346d0763-f38b-461d-bf2f-46cbf1a19fcd","machine_no":22,"usr_id":0},{"machine_uuid":"91cb4f6a-32c7-44d8-8e2e-9e9fd3eda0b4","machine_no":23,"usr_id":3806},{"machine_uuid":"4d2afc8f-0ffe-4b5d-857a-59753f974d58","machine_no":24,"usr_id":8825},{"machine_uuid":"c49f53e0-4a43-49de-b800-e3d266da8468","machine_no":25,"usr_id":15774},{"machine_uuid":"ccab99dc-46f7-496e-8f8d-4285323d6735","machine_no":26,"usr_id":5550},{"machine_uuid":"bf5f7857-2819-49ad-a4c1-a2a251fb2a48","machine_no":27,"usr_id":11198},{"machine_uuid":"62919061-4c14-4fca-b0e7-edc56ab6b1af","machine_no":28,"usr_id":4847},{"machine_uuid":"9e2c5e7e-3e25-4fd8-bc72-c93324857f7a","machine_no":29,"usr_id":4278},{"machine_uuid":"0e70549a-8897-41ac-b462-da1bde81d6b5","machine_no":30,"usr_id":15458},{"machine_uuid":"e7ad900e-7d3d-4cee-9476-6b8e813e9818","machine_no":31,"usr_id":7709},{"machine_uuid":"36237da7-bed0-4327-b350-4dfb1623a573","machine_no":32,"usr_id":11089},{"machine_uuid":"9b2c1c04-1d99-44cd-9c80-d06dea1ce2a4","machine_no":33,"usr_id":8530},{"machine_uuid":"28103eb2-6a83-4a4d-a665-d9cbc479137c","machine_no":34,"usr_id":19379},{"machine_uuid":"feca761c-23ea-42cb-aa70-9f3d6d2d0938","machine_no":35,"usr_id":4488},{"machine_uuid":"592c2fa2-8fbe-47d0-82f1-93afafbb9c71","machine_no":36,"usr_id":0},{"machine_uuid":"6472af69-8c06-4a13-8bd4-4369e3ecb8c2","machine_no":37,"usr_id":20134},{"machine_uuid":"7e0012ab-95b2-4e15-be5f-606a7affc382","machine_no":38,"usr_id":8197},{"machine_uuid":"ddeaf2bf-03e5-453f-9c24-aef4f3209b0c","machine_no":39,"usr_id":17038},{"machine_uuid":"151fb638-16b6-433a-833e-ce270c051672","machine_no":40,"usr_id":0}]}
            : {"machine_name":"COSMOAttack","machine_type":2,"win_type":"{\"bonus_count\":{\"Number of Jackpot\":\"total_count\",\"Highest number of win in a row\":\"continue\"}}","machines":[{"machine_uuid":"838c4575-0b92-448a-a47f-abf00d9cece1","machine_no":1,"usr_id":15882,"pachinko_detail":{"ball":-4460,"bonus_history":[{"type":1,"spin":321,"continue":1},{"type":3,"spin":102,"continue":2},{"type":3,"spin":571,"continue":2},{"type":1,"spin":3,"continue":1},{"type":1,"spin":38,"continue":1},{"type":3,"spin":29,"continue":2},{"type":3,"spin":66,"continue":3},{"type":1,"spin":323,"continue":1},{"type":1,"spin":263,"continue":1}],"spin_count":42,"total_spin_count":1758}},{"machine_uuid":"5be54674-fbd1-4fa0-b263-88b9dc2287b8","machine_no":2,"usr_id":15574,"pachinko_detail":{"ball":-13070,"bonus_history":[{"type":3,"spin":619,"continue":2},{"type":1,"spin":54,"continue":1},{"type":3,"spin":162,"continue":3}],"spin_count":698,"total_spin_count":1533}},{"machine_uuid":"c118f786-81b8-4f90-9182-589a63b5e8a6","machine_no":3,"usr_id":15881,"pachinko_detail":{"ball":9500,"bonus_history":[{"type":3,"spin":716,"continue":17},{"type":3,"spin":138,"continue":5}],"spin_count":822,"total_spin_count":1676}},{"machine_uuid":"8ad40316-7d14-4dc8-81f8-a92b6002641a","machine_no":4,"usr_id":15572,"pachinko_detail":{"ball":-17010,"bonus_history":[{"type":1,"spin":65,"continue":1},{"type":3,"spin":314,"continue":2},{"type":1,"spin":265,"continue":1}],"spin_count":918,"total_spin_count":1562}},{"machine_uuid":"e2415ae5-d1c1-47c7-971f-abb787501695","machine_no":5,"usr_id":15891,"pachinko_detail":{"ball":-19350,"bonus_history":[{"type":1,"spin":1114,"continue":1},{"type":1,"spin":311,"continue":1}],"spin_count":97,"total_spin_count":1522}},{"machine_uuid":"762d188d-4198-4d9f-acf7-6760460e08d6","machine_no":6,"usr_id":20327},{"machine_uuid":"1b9d26fe-1920-43da-ae84-8b4464ddfb7c","machine_no":7,"usr_id":15876},{"machine_uuid":"14b7f013-0f96-430d-8318-d8296721c541","machine_no":8,"usr_id":20440},{"machine_uuid":"b1b70aca-c25f-4f14-a884-2b1dc7dcaf55","machine_no":9,"usr_id":0},{"machine_uuid":"7c402f89-deb3-4b64-8fc0-04b24ec0b08e","machine_no":10,"usr_id":18722},{"machine_uuid":"af1a2269-d3b6-49af-b8ec-d5f2012f7b78","machine_no":11,"usr_id":0},{"machine_uuid":"cc8b6c21-ccfb-4bc7-a292-1933cb2461bc","machine_no":12,"usr_id":15577},{"machine_uuid":"a872ab50-739f-4673-8aed-ce1053fc3f94","machine_no":13,"usr_id":15883},{"machine_uuid":"6d801de5-0fe7-4e32-8efd-da49c5423c83","machine_no":14,"usr_id":15890},{"machine_uuid":"5c3de4e1-f8a3-474a-b884-75e4f646a14c","machine_no":15,"usr_id":20439},{"machine_uuid":"92328b38-0f60-41db-9652-29e7a66c49c8","machine_no":16,"usr_id":15878},{"machine_uuid":"cce03d9f-0704-45a0-84c9-a88c64cd8466","machine_no":17,"usr_id":0},{"machine_uuid":"1d0dd38d-3fa5-41b1-ab4b-c36ea79ad5d6","machine_no":18,"usr_id":15579},{"machine_uuid":"39a3c5d8-41fb-4753-8f29-cbbe72c86949","machine_no":19,"usr_id":18643},{"machine_uuid":"c5b1406b-36f9-4ca9-ba02-ae78c8d68da9","machine_no":20,"usr_id":15880},{"machine_uuid":"dcd7a3cf-32a3-413d-aedb-8d591818c92b","machine_no":21,"usr_id":0},{"machine_uuid":"7fcc26c2-c605-41cb-8c71-cbaff6aa07d2","machine_no":22,"usr_id":0},{"machine_uuid":"b67d18d3-096f-4b4d-95c2-60b153c43ef5","machine_no":23,"usr_id":15879},{"machine_uuid":"3b2a0e5c-6838-4916-b9ed-e87fe01f4237","machine_no":24,"usr_id":0},{"machine_uuid":"ef39a006-31a3-4148-bf8d-5ad1f5f94655","machine_no":25,"usr_id":6417},{"machine_uuid":"066e5ae9-469d-4e5e-84f5-1f897cb52040","machine_no":26,"usr_id":15877},{"machine_uuid":"31de249b-a822-43e6-879c-48e3df95a89c","machine_no":27,"usr_id":0},{"machine_uuid":"f118a566-001a-4266-867b-255af100e30c","machine_no":28,"usr_id":0},{"machine_uuid":"b611e967-5e08-4f60-afb1-21e1b6022fd0","machine_no":29,"usr_id":15875},{"machine_uuid":"a1c4dc06-8a9d-4fa1-a252-a559e783c42c","machine_no":30,"usr_id":12250},{"machine_uuid":"b50cd20c-c507-4290-b466-3e84f019b811","machine_no":31,"usr_id":0},{"machine_uuid":"f8963c5f-3327-4cc3-8c66-1b4b81f5b3b0","machine_no":32,"usr_id":15525},{"machine_uuid":"712ec036-baa9-4fbd-87f3-83157b79695d","machine_no":33,"usr_id":0},{"machine_uuid":"dd94bff1-2344-4933-9be9-860ea447f64e","machine_no":34,"usr_id":0},{"machine_uuid":"174fdcce-6788-4dc5-86c5-fa83eaea5c90","machine_no":35,"usr_id":15874},{"machine_uuid":"ef5a307f-5bba-4288-b308-2f66988f6607","machine_no":36,"usr_id":15889},{"machine_uuid":"96e222b6-820b-4634-b98b-e8165c185596","machine_no":37,"usr_id":15587},{"machine_uuid":"e5814f07-76a6-4791-8da6-d45c1abdd82e","machine_no":38,"usr_id":8205},{"machine_uuid":"4a3f7a4a-c53e-4ac1-8b71-51da01035aa8","machine_no":39,"usr_id":3750},{"machine_uuid":"8e573501-8602-419d-a394-d7bc198564bb","machine_no":40,"usr_id":15873}]}
        ;
        // throw new Error();
    }
}