

export class Util {
    /**
     * 指定した長さのランダム文字列を取得します。
     * @param len 
     * @returns 
     */
    public static getRandomString(len: number): string {
        const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return Array.from(crypto.getRandomValues(new Uint8Array(len))).map((n) => S[n % S.length]).join('');
    }

    public static toUnixTime(datetime: Date): number {
        return Math.floor(datetime.getTime() / 1000);
    }

    public static toDate(unixTime: number): Date {
        return new Date(unixTime * 1000);
    }
}