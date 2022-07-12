
export class Env {

    /** developmentモードで起動しているかどうかを取得します */
    public static get isDevelopment(): boolean {
        return process.env.NODE_ENV === "development";
    }

    /** 開発環境で使うAPIサーバーのホスト名（非モック使用時） */
    public static get devApiServerHostName(): string {
        if(Env.isDevelopment === false) { throw new Error("{21482732-FA58-4C19-BA52-77706CB135A0}"); }
        return Env.getString("REACT_APP_DEV_API_SERVER_HOST_NAME");
    }

    /** 開発環境で使うAPIサーバーのポート（非モック使用時） */
    public static get devApiServerPort(): number {
        if(Env.isDevelopment === false) { throw new Error("{D669AE81-0297-43C2-B97F-66091CED5FF5}"); }
        return Env.getNumber("REACT_APP_DEV_API_SERVER_PORT");
    }

    /** MockServerを利用するかどうかを取得します */
    public static get useMockServer(): boolean {
        return Env.getBoolean("REACT_APP_USE_MOCK_SERVER");
    }

    private static getNumber(key: string): number {
        return Number(Env.getString(key));
    }

    private static getString(key: string): string {
        const envVal: string|undefined = process.env[key];
        if(envVal === undefined) { throw new Error(`{56560609-FEFF-46F0-A22E-783ECF2F3111} key: ${key}`); }
        return envVal;
    }

    private static getBoolean(key: string): boolean {
        const envVal: string|undefined = process.env[key];
        return envVal !== undefined && envVal.toLowerCase().trim() === "true";
    }
}