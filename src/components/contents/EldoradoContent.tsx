import { ButtonBase, Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eldorado } from "../../lib/Eldorado";
import { Util } from "../../lib/Util";
import { HallsResponseBody } from "../../shared/api/interfaces";
import { ApiPath } from "../../shared/api/Path";


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

export const EldoradoContent: React.FC = () => {
    return (
        <SelectHall />
    );
};