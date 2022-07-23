import { Box, Card, CardActionArea, CardContent, Divider, FormControl, Grid, MenuItem, NativeSelect, Select, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eldorado } from "../../lib/Eldorado";
import { Util } from "../../lib/Util";
import { HallsResponseBody, MachineListResponseBody } from "../../shared/api/interfaces";
import PersonIcon from '@mui/icons-material/Person';
import { MachineType } from "../../shared/enum/Eldorado";

type HallCardProps = {
    hallName: string;
    openTime: Date;
    closeTime: Date;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};
const HallCard: React.FC<HallCardProps> = ({ hallName, openTime, closeTime, onClick })=>{
    return (
        <Card>
            <CardActionArea onClick={onClick}>
                <CardContent>
                    <Typography variant="subtitle1">{hallName}</Typography>
                    <Typography variant="body2">開店日時： {openTime.toLocaleString()}</Typography>
                    <Typography variant="body2">閉店日時： {closeTime.toLocaleString()}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

/** ホール選択コンポーネント */
const SelectHall: React.FC = ()=>{
    const navigation = useNavigate();
    const [halls, setHalls] = useState<HallsResponseBody["halls"]|undefined>();

    const location = useLocation();
    console.log(location.state);
    useEffect(()=>{
        (async()=>{
            //  各ホールIDにおける最新の情報を取得
            const res: HallsResponseBody = await Eldorado.getLatestHalls();
            setHalls(res.halls);
        })();
    }, []);

    return (
        <>
        <Grid container spacing={2} padding={2}>
                {halls?.map(hall=>{
                    const cardProps = {
                        hallName: hall.hall_name,
                        openTime: Util.toDate(hall.open_time),
                        closeTime: Util.toDate(hall.close_time),
                        onClick: ()=>{
                            console.log(`${hall.hall_id}`);
                            navigation(`?hallid=${hall.hall_id}`, { state: { a: "bbb" }});
                        },
                    } as HallCardProps;

                    return (
                        <Grid item xs={12} sm={6} md={4} key={hall.hall_id} >
                            <HallCard {...cardProps} />
                        </Grid>
                    );
                })}
        </Grid>
        </>
    );
};


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
        <Card sx={{minWidth: 55,  padding: 1}}>
            <Box sx={{ display: "flex", alignItems: "flex-end"}}>
                <Box>{no}番</Box>
                {userId > 0 ? <PersonIcon fontSize="small" sx={{ position: "absolute", right: "8px" }}/> : <></>}
            </Box>
            { children && <><Divider sx={{marginY: 0.5}} />{children}</> }

        </Card>
            </CardActionArea>
    );
}

/** フロア画面のようなレイアウト。マシンをクリックすることで詳細を確認できる */
const EldoradoFloor: React.FC = () => {

    return <div></div>
};


export const EldoradoContent: React.FC = () => {

    const [hallsResponse, setHallsResponse] = useState<HallsResponseBody|undefined>();
    const [selectedHallId, setSelectedHallId] = useState<number|undefined>();   //  Selectコンポーネントで選択されているホールID
    const [machineListResponse, setMachineListResponse] = useState<MachineListResponseBody|undefined>();

    useEffect(()=>{(async()=>{
        //  過去1日分取得
        const now = new Date();
        let hallsTmp = await Eldorado.getHalls(new Date(now.getFullYear(), now.getMonth(), now.getDate() -1, now.getHours(), now.getMinutes()));
        //  開店時間の降順でソート
        hallsTmp.halls.sort((a,b)=>b.open_time - a.open_time);
        setHallsResponse(hallsTmp);
        setSelectedHallId(hallsTmp.halls[0].hall_id);
    })();}, []);

    useEffect(()=>{(async()=>{
        const machineListTmp = await Eldorado.getMachineList("e01a7c26-5377-406d-b0ab-bbe7fa14fd82");
        //  machinesをmachine_noの昇順にソートした状態で格納
        machineListTmp.machines.sort((a,b)=>a.machine_no - b.machine_no);
        setMachineListResponse(machineListTmp);
    })();}, []);

    //  画面で表示される形の台番号の2次元配列
    //      [[8,7,6,5,4,3,2,1][16,15,...10,9]...[40,39,...34,33]]
    const machineNoListForDisplay = useMemo(()=>{
        //  1から40の配列を作る
        const machineNoTmp = [...Array(40)].map((_,i)=>i+1);
        //  島（1列8台）ずつに分割
        let linesTmp = machineNoTmp.reduce((p,c)=>{
            p[Math.floor((c-1) / 8)].push(c);
            return p;
        }, [[],[],[],[],[]] as number[][]);
        //  島の一番右が1となるように配列を逆順に変換
        return linesTmp.map(line=>line.reverse());
    }, []);
    
    return (
        <Grid container spacing={1} sx={{height: "100%", minWidth: "720px"}}>
            
            {/* マシンを並べる領域 */}
            <Grid item xs={12} lg={8} key={"{E2248DE7-A6FA-48C6-9D4D-70868E056597}"}>
            <Grid container spacing={1}>
                
                <Grid item xs={12} lg={8} key={"{F24A5520-3689-4101-B039-F4D7FE2D2FAF}"}>
                <FormControl sx={{ m: 1, minWidth: "200px" }} size="small">
                    <Select sx={{}} value={selectedHallId ?? ""}>
                        {
                            hallsResponse && hallsResponse.halls.map(h=>{
                                return <MenuItem value={h.hall_id} key={`${h.hall_id}`}>{h.hall_name}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
                </Grid>
            {
                machineListResponse && machineNoListForDisplay.map((line, i)=>{
                    return <Grid item xs={12} key={`{F905F226-285B-4736-A6B6-205FEFA0B8BA}-${i}`}><Grid container spacing={1} >
                        {line.map(no=>{
                            const machine = machineListResponse.machines[no-1];  //  昇順に格納しているので、no-1がindex
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
                            })(machineListResponse.machine_type);
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
            <Card sx={{width: "100%", height: "100%", padding: 1, boxSizing: "border-box"}}>[TODO: 詳細をここに表示]</Card>
            </Grid>
        </Grid>
    );
};