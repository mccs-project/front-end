import { Button } from '@mui/material';
import { styled } from '@mui/material/styles'

/** スタイルを適用したボタン */
const CustomButton = styled(Button)({
    textTransform: 'none',
});

interface ToggleButtonBaseProps {
    isActive: boolean;
    text: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}
const ToggleButtonBase = (props: ToggleButtonBaseProps) => {
    return (
        <CustomButton variant={"contained"} color={props.isActive ? "inherit" : "primary"} onClick={props.onClick}>{props.text}</CustomButton>
    );
};

export default ToggleButtonBase;