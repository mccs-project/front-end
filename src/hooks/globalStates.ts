import { atom, useRecoilState, useRecoilValue  } from "recoil";


//  ▼ Atomの定義  -----------------------------------------------------------------


/** Twitterに接続しているかどうか */
const isTwitterConnectedState = atom<boolean|undefined>({
    key: "{0638D650-5061-4E65-AE64-5697EB98AEB9}",
    default: undefined,
});

/** MetaMaskを接続しているかどうか */
const isMetaMaskConnectedState = atom<boolean|undefined>({
    key: "{C8261A9A-D94A-4F7B-936C-8D09AE9DA743}",
    default: undefined,
});

//  ▲ Atomの定義  -----------------------------------------------------------------

/** Twitterの接続状態を管理するためのカスタムフック */
export const useIsTwitterConnected = (): [boolean|undefined, (connected: boolean)=>void] => {
    
    const [isTwitterConnected, setIsTwitterConnected] = useRecoilState(isTwitterConnectedState);
    return [isTwitterConnected, setIsTwitterConnected];
}


/** Twitterの接続状態を取得するためのカスタムフック */
export const useIsTwitterConnectedValue = (): boolean|undefined => {
    const isTwitterConnected: boolean|undefined = useRecoilValue(isTwitterConnectedState);
    return isTwitterConnected;
}


/** MetaMaskの接続状態を管理するためのカスタムフック */
export const useIsMetaMaskConnected = (): [boolean|undefined, (connected: boolean)=>void] => {
    const [isMetaMaskConnected, setIsMetaMaskConnected] = useRecoilState(isMetaMaskConnectedState);
    return [isMetaMaskConnected, setIsMetaMaskConnected];
}


/** MetaMaskの接続状態を取得するためのカスタムフック */
export const useIsMetaMaskConnectedValue = (): boolean|undefined => {
    const isMetaMaskConnected: boolean|undefined = useRecoilValue(isMetaMaskConnectedState);
    return isMetaMaskConnected;
}
