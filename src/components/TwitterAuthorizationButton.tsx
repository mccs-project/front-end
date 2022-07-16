import ToggleButtonBase from "./ToggleButtonBase";

interface TwitterAuthorizationButtonProps {
    isConnected: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

/** Twitterの認可を行うボタン */
const TwitterAuthorizationButton = (props: TwitterAuthorizationButtonProps) => {

    const buttonText = props.isConnected ? "Twitter の接続を解除" : "Twitter に接続";

    return (
        <ToggleButtonBase isActive={props.isConnected} onClick={props.onClick} text={buttonText} />
    );
};

export default TwitterAuthorizationButton;