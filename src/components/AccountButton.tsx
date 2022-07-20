import { Button, CircularProgress, createTheme, IconButton, ListItemIcon, MenuItem, MenuList, Popover, ThemeProvider } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoadingIcon, MetaMaskIcon, TwitterMeIcon } from "./icons";
import { TwitterUsersMeResponseBody } from "../shared/api/interfaces";
import { LocalApi } from "../lib/RestApi";
import { TwitterOAuth2 } from "../lib/TwitterOAuth2";
import { MetaMask } from "../lib/MetaMask";
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import "./AccountButtons.css";

type AccountButtonProps = {
    children?: React.ReactNode;
    icon: React.ReactNode;
    text?: string;
}


const accountButtonTheme = createTheme({
    typography: {
        button: {
            textTransform: "none",  //  小文字を大文字にしない
        }
    },
    shape: {
        borderRadius: 20,   //  角を丸くする
    },
  });

export const AccountButton: React.FC<AccountButtonProps> = ({ children, icon, text }: AccountButtonProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const anchorRef = useRef<HTMLDivElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(anchorRef?.current);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    return (
        <>
            <span ref={anchorRef} className={"account-button"}>
            {
                //  テキストありの場合はButton
                text ? <ThemeProvider theme={accountButtonTheme}>
                    <Button onClick={handleClick} startIcon={icon} variant="outlined">{text}</Button>
                </ThemeProvider>
                //  テキスト無しの場合はIconButtton
                : <IconButton onClick={handleClick}>
                    {icon}
                </IconButton>
            }
            </span>
            {   //  アイコンをクリックした時のポップアップ
                children && 
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
                    onClick={handleClose}
                    style={{marginTop: 10}}
                >
                    {children}
                </Popover>
            }
        </>
    );
}


export const TwitterAccountButton: React.FC = () => {

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
                   <MenuItem onClick={()=>{ /** TODO */ }}><ListItemIcon><PersonOffIcon /></ListItemIcon>切断（Twitter）</MenuItem>
                </MenuList>
                // 切断している時
                :<MenuList>
                    <MenuItem onClick={authorize}><ListItemIcon><PersonIcon /></ListItemIcon>接続（Twitter）</MenuItem>
                </MenuList>
            }
        </AccountButton>
    );
};



export const MetaMaskAccountButton: React.FC = ()=>{

    const [loading, setLoading] = useState(true);
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean|undefined>();
    const [account, setAccount] = useState<string>();
    const [displayAccount, setDisplayAccount] = useState<string>();

    //  MetaMaskを接続する関数
    const connect = useCallback(async()=>{
        const accounts: string[] = await MetaMask.requestAccounts();
        setAccount(accounts.length > 0 ? accounts[0] : undefined);
    }, []);

    //  アカウントが変更されたら表示用のアカウント文字列(0x123...9876)を更新
    useEffect(()=>{
        setDisplayAccount(account ? `${account.slice(0, 5)}...${account.slice(-4)}` : undefined);
    }, [account]);

    useEffect(()=>{
        (async()=>{
            //  MetaMaskがインストールされているか確認
            const installed: boolean = await MetaMask.isInstalled();
            setIsMetaMaskInstalled(installed);

            //  MetaMaskがインストールされている場合、接続済みのアカウントを取得
            if(installed) {
                const accounts: string[] = await MetaMask.accounts();
                setAccount(accounts.length > 0 ? accounts[0] : undefined);
            }
            setLoading(false);
        })();
    }, []);

    return (
        <AccountButton text={displayAccount} icon={loading ? <LoadingIcon fontSize="large"/> : <MetaMaskIcon fontSize="large" />}>
            {
                //  MetaMaskがインストールされていない場合
                !isMetaMaskInstalled ?
                <MenuList><MenuItem onClick={()=>{ MetaMask.openDownloadPage(); }}><ListItemIcon><OpenInNewIcon /></ListItemIcon>
                    MetaMaskをインストール
                </MenuItem></MenuList>
                //  MetaMaskインストール済み、未接続の場合
                : !account ?
                <MenuList><MenuItem onClick={connect}><ListItemIcon><LinkIcon /></ListItemIcon>
                    接続（MetaMask）
                </MenuItem></MenuList>
                //  MetaMask接続済みの場合（切断はMetaMask側で実施のためポップアップ不要）
                : undefined
            }
        </AccountButton>
    );
};