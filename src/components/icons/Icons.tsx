import "./Icon.css";
import { TwitterUsersMeResponseBody } from "../../shared/api/interfaces";
import TwitterIcon from '@mui/icons-material/Twitter';
import { CircularProgress } from "@mui/material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

type fontSize = "small" | "medium" | "large"; 

type LoadingIconProps = {
    fontSize?: fontSize;
};

type ImageIconProps = {
    src: string;
    alt?: string;
    fontSize?: fontSize;
    /** 画像を円形に切り抜く場合はtrue */
    trimToCircle?: boolean;
};

type MetaMaskIconProps = {
    fontSize?: fontSize;
};

type TwitterMeIconProps = {
    fontSize?: fontSize;
    me?: TwitterUsersMeResponseBody;
};



export const LoadingIcon: React.FC<LoadingIconProps> = ({fontSize}: LoadingIconProps)=> {
    const size: number = ((fontSize)=>{
        if(fontSize === undefined) { throw new Error("{ACC5ADFF-E7E0-4556-A11D-A04042F9A162}"); }
        switch(fontSize) {
            case "large": return 32;
            //  他のプロパティは必要時に実装
            default: throw new Error("{278A653E-7B8B-4B3B-AE97-33801E39278E}");
        }
    })(fontSize);
    
    return <CircularProgress size={size}/>;
};

const ImageIcon: React.FC<ImageIconProps> = ({ src, alt, fontSize, trimToCircle }: ImageIconProps) => {
    const size: number = ((fontSize): number=>{
        if(fontSize === undefined) { return 24; }
        switch(fontSize) {
            case "large": return 36;
            case "medium": return 24;
            case "small": return 16;
            default: throw new Error("{E8AF8400-96F3-4F3E-96C4-DCF333F1AC1D}");
        }
    })(fontSize);

    const className: string|undefined = trimToCircle ? "trim-image-to-circle": undefined;
    return <img src={src} alt={alt} width={size} className={className}></img>
};


/** MetaMaskのアイコン */
export const MetaMaskIcon: React.FC<MetaMaskIconProps> = ({ fontSize }: MetaMaskIconProps) => {
    //  ウォレットのアイコンで代用
    return <AccountBalanceWalletIcon fontSize={fontSize}></AccountBalanceWalletIcon>
};


/**
 * Twitter（自身）のアイコン
 * Note: 自身の情報(me)がない場合はTwitter社のアイコンを返す
*/
export const TwitterMeIcon: React.FC<TwitterMeIconProps> = ({ me, fontSize }: TwitterMeIconProps) => {
    return (me 
        ? <ImageIcon src={`${me.profile_image_url}`} alt={me.name} fontSize={fontSize} trimToCircle={true} />
        // : <TwitterIcon sx={{color:"#55acee"}} fontSize={fontSize} />
        : <TwitterIcon fontSize={fontSize} />
    );
};