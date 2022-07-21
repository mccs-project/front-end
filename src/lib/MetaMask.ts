import detectEthereumProvider from "@metamask/detect-provider";
//  https://stackoverflow.com/questions/65504958/web3-js-extending-the-window-interface-type-definitions


export class MetaMask {

    private constructor() { }

    /** MetaMaskのダウンロードページを開きます */
    public static async openDownloadPage(): Promise<void> {
        window.open("https://metamask.io/download/");
    }


    /** MetaMaskがインストールされているかどうかを返します */
    public static async isInstalled(): Promise<boolean> {

        return await this.getEthereum()
            .then(eth=>Boolean(eth))
            .catch(_=>false);
    }


    /** 接続済みアカウント一覧を取得します。 */
    public static async accounts(): Promise<string[]> {
        return await MetaMask.request({ method: 'eth_accounts' });
    }


    /** MetaMaskへ接続リクエストを行います */
    public static async requestAccounts(): Promise<string[]> {
        return await MetaMask.request({ method: 'eth_requestAccounts' });
    }


    private static async request(param: any) {
        return (await this.getEthereum()).request(param);
    }


    private static async getEthereum(): Promise<any> {
        const provider = await detectEthereumProvider();
        if (provider !== window.ethereum) {
            throw new Error("{ECA50276-363F-47AA-BC2C-AEAB90E8CB32}");
        }
        
        return provider;
    }
}