import { CircularProgress, IconButton, MenuItem, MenuList, Popover } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { LoadingIcon, MetaMaskIcon, TwitterMeIcon } from "./icons";
import { TwitterUsersMeResponseBody } from "../shared/api/interfaces";
import { LocalApi } from "../lib/RestApi";
import { TwitterOAuth2 } from "../lib/TwitterOAuth2";

type AccountButtonProps = {
    children?: React.ReactNode;
    icon: React.ReactNode;
}



export const AccountButton: React.FC<AccountButtonProps> = ({ children, icon }: AccountButtonProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton onClick={handleClick}>
                {icon}
            </IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
            >
                {children}
            </Popover>
        </>
    );
}


export const TwitterAccountButton = () => {

    const [me, setMe] = useState<TwitterUsersMeResponseBody|undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        (async()=>{
            //  twitterの認可ページからリダイレクトされている場合
            if(TwitterOAuth2.isRedirectUrl(window.location.href)) {
              await new TwitterOAuth2().onRedirectUrl();
            }
            //  自身の情報を取得
            const meData: TwitterUsersMeResponseBody|undefined = await LocalApi.getTwitterUsersMe()
            .catch(err=>{ console.error(err); return undefined; });

            setMe(meData);
            setLoading(false);
        })();
    }, []);

    const authorize = useCallback(async()=>{
        await new TwitterOAuth2().authorize();
    }, []);


    return (
        <AccountButton icon={loading ? <LoadingIcon fontSize="large"/> : <TwitterMeIcon me={me} fontSize="large" />}>
            {
                loading ? undefined : me ?
                //  接続している時 
                <MenuList>
                   <MenuItem onClick={()=>alert("TODO 切断処理実装")}>切断</MenuItem>
                </MenuList>
                // 切断している時
                :<MenuList>
                    <MenuItem onClick={authorize}>接続</MenuItem>
                </MenuList>
            }
        </AccountButton>
    );
};

export const MetaMaskAccountButton = ()=>{

    return (
        <AccountButton icon={<MetaMaskIcon fontSize="large" />}></AccountButton>
    );
};