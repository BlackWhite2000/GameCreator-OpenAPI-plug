module OpenAPI {

    /**
     * CryptoJS
     */
    export class CryptoJS {

        /**
         * AES加密
         * @param {string} data 需要加密的数据
         * @param {string} key 密钥 必须16字符, 不可泄漏
         * @param {string} iv iv 必须16字符, 必须随机生成
         */
        static AES(data: string, key: string, iv: string): any {

            // 密钥
            let secretKey = OpenAPI_CryptoJS.enc.Utf8.parse(key);

            // iv
            let randomIv = OpenAPI_CryptoJS.enc.Utf8.parse(iv);

            // 加密CBC
            let encryptData = OpenAPI_CryptoJS.AES.encrypt(data, secretKey, {
                mode: OpenAPI_CryptoJS.mode.CBC,
                iv: randomIv,
                padding: OpenAPI_CryptoJS.pad.Pkcs7
            });

            return encryptData.toString();
        }

        /**
         * AES解密
         * @param {string} data 加密的数据
         * @param {string} key 密钥 必须16字符, 不可泄漏
         * @param {string} iv iv 必须16字符, 必须随机生成
         */
        static AES_DECRYPT(data: string, key: string, iv: string): any {

            // 密钥
            let secretKey = OpenAPI_CryptoJS.enc.Utf8.parse(key);

            // iv
            let randomIv = OpenAPI_CryptoJS.enc.Utf8.parse(iv);

            // 加密CBC
            let encryptData = OpenAPI_CryptoJS.AES.decrypt(data, secretKey, {
                mode: OpenAPI_CryptoJS.mode.CBC,
                iv: randomIv,
                padding: OpenAPI_CryptoJS.pad.Pkcs7
            });

            return encryptData.toString(OpenAPI_CryptoJS.enc.Utf8)
        }
    }
}