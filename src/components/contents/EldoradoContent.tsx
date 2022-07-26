import { Box, Card, CardActionArea, CardContent, Divider, FormControl, Grid, MenuItem, NativeSelect, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eldorado } from "../../lib/Eldorado";
import { Util } from "../../lib/Util";
import { FloorsResponseBody, HallsResponseBody, MachineListResponseBody as MachinesResponseBody } from "../../shared/api/interfaces";
import PersonIcon from '@mui/icons-material/Person';
import { MachineType } from "../../shared/enum/Eldorado";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { WebSocketClientBase } from "../../lib/WebSocketClient";
import { IWsMessage, WsEldoradoSubscribeEventRequest, WsInitializeRequest } from "../../shared/api/WebSocketMessage";
import { WebSocketCommand } from "../../shared/api/WebSocketCommnad";



type FloorMachineCardProps = {
    children?: React.ReactNode;
    no: number;
    userId: number;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

/** フロアのレイアウトで並べる時のカード */
const FloorMachineCard: React.FC<FloorMachineCardProps> = ({children, no, userId, onClick}) =>{
    return (
        <CardActionArea onClick={onClick} sx={{height: "100%"}}>
        <Card sx={{minWidth: 55,  padding: 0.75}}>
            <Box sx={{ display: "flex", alignItems: "flex-end"}}>
                <Box>{no}番</Box>
                {userId > 0 ? <PersonIcon fontSize="small" sx={{ position: "absolute", right: "8px" }}/> : <></>}
            </Box>
            { children && <><Divider sx={{marginY: 0.25}} />{children}</> }

        </Card>
            </CardActionArea>
    );
}


class EldoradoContentWsClient extends WebSocketClientBase {
    constructor() {
        super();
        this.on("initialized", ()=>{ this.onInitialize(); });
    }
    private async onInitialize(): Promise<void> {
        this.send(new WsEldoradoSubscribeEventRequest());
    }
    protected async onMessage(message: IWsMessage): Promise<void> {
        if(message.command === WebSocketCommand.ELDORADO_MACHINE_DETAIL_UPDATED) {
            this.onMachineDetailUpdated?.apply(this);
        }
    }

    public onMachineDetailUpdated: (()=>void)|undefined;
}

type EldoradoContentState = {
    selectedHallId?: number;
    selectedHallUuid?: string;
    selectedFloorUuid?: string;
    hallsResponse?: HallsResponseBody;
    floorsResponse?: FloorsResponseBody;
    machinesResponse?: MachinesResponseBody;
};

export const EldoradoContent: React.FC = () => {

    const [state, setState] = useState<EldoradoContentState>({});
    const webSocket = useRef<EldoradoContentWsClient|undefined>();

    //  初回表示時
    useEffect(()=>{(async()=>{
        //  過去1日分取得
        const now = new Date();
        let hallsTmp = await Eldorado.getHalls(new Date(now.getFullYear(), now.getMonth(), now.getDate() -1, now.getHours(), now.getMinutes()));
        //  開店時間の降順でソート
        hallsTmp.halls.sort((a,b)=>b.open_time - a.open_time);
        setState(s=>({
            ...s,
            hallsResponse: hallsTmp,
            selectedHallId: hallsTmp.halls[0].hall_id,
            selectedHallUuid: hallsTmp.halls[0].hall_uuid,
        }));

        //  WebSocket接続
        webSocket.current = new EldoradoContentWsClient();

        //  cleanup
        return ()=>{ webSocket.current?.close(); }
    })();}, []);

    //  日付含むホールが変更された時
    useEffect(()=>{(async()=>{
        const selectedHallUuid = state.selectedHallUuid;
        if(selectedHallUuid === undefined) {
            setState(s=>({...s, floorsResponse: undefined}));
        }
        else {
            const res = await Eldorado.getFloors(selectedHallUuid);
            //  フロアNoの昇順でソート
            res.floors.sort((a,b)=>a.floor_no - b.floor_no);
            setState(s=>({
                ...s,
                floorsResponse: res,
                selectedFloorUuid: res.floors[0].floor_uuid,
            }));
        }
    })();}, [state.selectedHallUuid]);

    //  選択されているフロアが変更された時
    useEffect(()=>{(async()=>{
        
        const selectedFloorUuid: string|undefined = state.selectedFloorUuid;
        
        //  マシン一覧の更新処理を定義
        const updateMachinesResponse = async()=>{
            const machinesTmp = selectedFloorUuid ? await Eldorado.getMachines(selectedFloorUuid).catch(err=>{ console.log(err); return undefined; }) : undefined;
            machinesTmp?.machines.sort((a,b)=>a.machine_no - b.machine_no);
            setState(s=>({...s, machinesResponse: machinesTmp}));
        };

        //  マシン一覧の更新
        updateMachinesResponse();

        //  WebSocketのマシン詳細更新通知時の処理を変更
        webSocket.current!.onMachineDetailUpdated = ()=>{ updateMachinesResponse(); };

    })();}, [state.selectedFloorUuid]);

    //  画面で表示される形の台番号の2次元配列
    //      [[8,7,6,5,4,3,2,1][16,15,...10,9]...[40,39,...34,33]]
    const machineNoListForDisplay = useMemo(()=>{
        //  1から40の配列を島（1列8台）ずつに分割
        let linesTmp = [...Array(40)].map((_,i)=>i+1).reduce((p,c)=>{
            p[Math.floor((c-1) / 8)].push(c);
            return p;
        }, [[],[],[],[],[]] as number[][]);
        //  島の一番右が1となるように配列を逆順に変換
        return linesTmp.map(line=>line.reverse());
    }, []);

    const hallChange = (event: SelectChangeEvent) => {
        setState(s=>({...s, selectedHallId: Number(event.target.value)}));
    };
    const dateChange = (event: SelectChangeEvent) => {
        setState(s=>({...s, selectedHallUuid: event.target.value}));
    };
    const floorChange = (event: SelectChangeEvent) => {
        setState(s=>({...s, selectedFloorUuid: event.target.value}));
    };

    const hallSelectItems = useMemo(() => {
        if(state.hallsResponse === undefined) { return undefined; }
        const hallsResponse = state.hallsResponse;
        //  重複無しのホールIDでMenuItemの配列を作成
        return Array.from(new Set(hallsResponse.halls.map(h=>h.hall_id))).map(hallId=>{
            return <MenuItem value={hallId} key={`${hallId}`}>{hallsResponse.halls.find(h=>h.hall_id === hallId)!.hall_name}</MenuItem>;
        });
    }, [state.hallsResponse]);

    const dateSelectItems = useMemo(() => {
        const hallsResponse = state.hallsResponse;
        const selectedHallId = state.selectedHallId;
        return hallsResponse && hallsResponse.halls.filter(h=>h.hall_id === selectedHallId).map(h=>{
            return <MenuItem value={h.hall_uuid} key={`${h.hall_uuid}`}>{format(Util.toDate(h.open_time), `MM/dd (E)`, {locale: ja})}</MenuItem>
        });
    }, [state.hallsResponse, state.selectedHallId]);
    
    const floorSelectItems = useMemo(() => {
        const floorsResponse = state.floorsResponse;
        return floorsResponse && floorsResponse.floors.map(f=>{
            return <MenuItem value={f.floor_uuid} key={`${f.floor_uuid}`}>
                {`${f.floor_no}F ${f.machine_name} ${f.rate/100}EP ${f.exchange_rate/10}%`}
            </MenuItem>
        });
    }, [state.floorsResponse]);
    


    return (
        <Grid container spacing={1} sx={{height: "100%", minWidth: "720px"}}>
            
            {/* マシンを並べる領域 */}
            <Grid item xs={12} lg={8} key={"{E2248DE7-A6FA-48C6-9D4D-70868E056597}"}>
            <Grid container spacing={1}>
                
                <Grid item xs={12} lg={8} key={"{F24A5520-3689-4101-B039-F4D7FE2D2FAF}"}>
                    <Box sx={{whiteSpace: "nowrap"}}>
                    {/* ホール選択 */}
                    <FormControl sx={{ m: 1, minWidth: "200px" }} size="small">
                        <Select value={state.selectedHallId ? `${state.selectedHallId}`: ""} onChange={hallChange}>
                            { hallSelectItems }
                        </Select>
                    </FormControl>
                    {/* 日付選択 */}
                    <FormControl sx={{ m: 1, minWidth: "100px" }} size="small">
                        <Select value={state.selectedHallUuid ?? ""} onChange={dateChange}>
                            { dateSelectItems }
                        </Select>
                    </FormControl>
                    {/* フロア選択 */}
                    <FormControl sx={{ m: 1, minWidth: "100px" }} size="small">
                        <Select value={state.selectedFloorUuid ?? ""} onChange={floorChange}>
                            { floorSelectItems }
                        </Select>
                    </FormControl>
                    </Box>
                </Grid>
            {
                state.machinesResponse && machineNoListForDisplay.map((line, i)=>{
                    return <Grid item xs={12} key={`{F905F226-285B-4736-A6B6-205FEFA0B8BA}-${i}`}><Grid container spacing={1} >
                        {line.map(no=>{
                            const machine = state.machinesResponse!.machines[no-1];  //  昇順に格納しているので、no-1がindex
                            const machineCardProps: FloorMachineCardProps = {
                                no: no,
                                userId: machine.usr_id,
                            }
                            const totalSpinCount: number|undefined = machine.slot_detail?.total_spin_count ?? machine.pachinko_detail?.total_spin_count ?? undefined;
                            const medalOrBall: number|undefined = machine.slot_detail?.medal ?? machine.pachinko_detail?.ball ?? undefined;
                            const medalOrBallUnitText: string = ((machineType) => {
                                switch(machineType) {
                                    case MachineType.SLOT: return "枚";
                                    case MachineType.PACHINKO: return "玉";
                                    default: throw new Error("{A092BA60-0F43-4012-A05D-4AC0AC381ED9}");
                                }
                            })(state.machinesResponse!.machine_type);
                            return <Grid item xs key={machine.machine_uuid}>
                                <FloorMachineCard {...machineCardProps}>
                                    <Box sx={{textAlign: "right", whiteSpace: "nowrap"}}>{totalSpinCount ?? "-"} 回転</Box>
                                    <Box sx={{ textAlign: "right", color: (medalOrBall && medalOrBall < 0) ? "red": "inherit"} }>{medalOrBall ?? "-"} {medalOrBallUnitText}</Box>
                                </FloorMachineCard>
                            </Grid>;
                        })}
                    </Grid></Grid>
                })
            }
            </Grid>
            </Grid>
            {/* 詳細情報を表示する領域 */}
            {/* 画面サイズがlg(1200px)未満の時は最大幅で縦に並べる */}
            <Grid item xs={12} lg={4} sx={{height: "100%"}} key={"{20A6C754-196B-458C-B337-A774E8E8181C}"}>
            {/* <Card sx={{width: "100%", height: "100%", padding: 1, boxSizing: "border-box"}}>[TODO: 詳細をここに表示]</Card> */}
            </Grid>
        </Grid>
    );
};