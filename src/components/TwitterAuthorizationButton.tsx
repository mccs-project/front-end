import { Button } from '@mui/material';
import { styled } from '@mui/material/styles'

export interface TwitterAuthorizationButtonProps {
    isConnected: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
}

/** スタイルを適用したボタン */
const CustomButton = styled(Button)({
    textTransform: 'none',
});


/** Twitterの認可を行うボタン */
const TwitterAuthorizationButton = (props: TwitterAuthorizationButtonProps) => {
    //  ボタンクリック時の動作
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if(props.isConnected) {
            props.onDisconnect();   
        }
        else {
            props.onConnect();
        }
        console.log(event.target);
    };

    const buttonText = props.isConnected ? "Twitter の接続を解除" : "Twitter に接続";
    const buttonColor = props.isConnected ? "inherit" : "primary"

    return (
        <div>
            <CustomButton variant={"contained"} color={buttonColor} onClick={handleClick}>{buttonText}</CustomButton>
        </div>
    );
}


export default TwitterAuthorizationButton;