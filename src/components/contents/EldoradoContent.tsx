import { Box, Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eldorado } from "../../lib/Eldorado";
import { Util } from "../../lib/Util";
import { HallsResponseBody } from "../../shared/api/interfaces";
import PersonIcon from '@mui/icons-material/Person';

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
    no: number;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};
const FloorMachineCard: React.FC<FloorMachineCardProps> = ({no, onClick}) =>{

    return (
        <CardActionArea onClick={onClick} sx={{height: "100%"}}>
        <Card sx={{minWidth: 55, minHeight: 75, padding: 1}}>
            <Box sx={{ display: "flex", alignItems: "flex-end"}}>
                <Box>{no}番</Box>
                <Box component={"span"} sx={{ display:"inline-block", width: "auto", textAlign: "left"}}></Box>
                <PersonIcon fontSize="small" />
            </Box>
            
            <Typography variant="body2">BB: 1</Typography>
            <Typography variant="body2">RB: 1</Typography>

            {/* <CardContent> */}
            {/* <Typography variant="subtitle1">{no}</Typography> */}
            {/* </CardContent> */}
        </Card>
            </CardActionArea>
    );
}

/** フロア画面のようなレイアウト。マシンをクリックすることで詳細を確認できる */
const EldoradoFloor: React.FC = () => {

    return <div></div>
};


export const EldoradoContent: React.FC = () => {

    //  1から40の配列を作る
    const machineNoTmp = [...Array(40)].map((_,i)=>i+1);
    //  島（1列8台）ずつに分割
    let linesTmp = machineNoTmp.reduce((p,c)=>{
        p[Math.floor((c-1) / 8)].push(c);
        return p;
    }, [[],[],[],[],[]] as number[][]);
    //  島の一番右が1となるように配列を逆順に変換
    linesTmp = linesTmp.map(line=>line.reverse());
    console.log(JSON.stringify(linesTmp));
    
    return (
        // <SelectHall />
        <Grid container spacing={1} sx={{height: "100%"}}>
            {/* マシンを並べる領域 */}
            <Grid item xs={8}>
            <Grid container spacing={1}>
            {
                linesTmp.map(line=>{
                    return <Grid item xs={12}><Grid container spacing={1} >
                        {line.map(m=>{
                            return <Grid item xs><FloorMachineCard no={m}/></Grid>;
                        })}
                    </Grid></Grid>
                })
                // <Grid item xs sx={{width: "25%"}}><FloorMachineCard no={1}/></Grid>
            }
            </Grid>
            </Grid>
            {/* 詳細情報を表示する領域 */}
            <Grid item xs={4} sx={{height: "100%"}}>
                <Card sx={{width: "100%", height: "100%"}}>あああ</Card>
            </Grid>
        </Grid>
    );
};