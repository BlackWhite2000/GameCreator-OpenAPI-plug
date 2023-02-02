module OpenAPI {

    /**
     * GameCreator相关API
     */
    export class GC {

        /**
         * GC平台相关API
         */
        static Cloud = {

            /**
             * 是否是GC平台
             */
            get isInGCCloud(): boolean {
                return window.location.href.indexOf("gamecreator") != -1;
            },

            /**
             * 游戏ID
             */
            get GameID(): number {
                if (!OpenAPI.GC.Cloud.isInGCCloud) return 0;
                let p = window.location.href.split("releaseProject/").pop().split("/").shift().split("_");
                return parseInt(p[1]);
            },

            /**
             * 游戏名称
             */
            get GameName(): string {
                if (!OpenAPI.GC.Cloud.isInGCCloud) return null;
                let name = document.querySelector('title').innerText;
                let p = document.querySelector('meta[name="keywords"]').getAttribute('content');
                let remove = name + " | ";
                if (p.startsWith(remove)) {
                    p = p.replace(remove, '');
                }
                return p;
            },

            /**
             * 当前版本号
             */
            get GameVersion(): number {
                if (!OpenAPI.GC.Cloud.isInGCCloud) return 0;
                let p = window.location.href.split("releaseProject/").pop().split("/");
                return parseInt(p[1]);
            },

            /**
             * 作者ID
             */
            get AuthorUID(): number {
                if (!OpenAPI.GC.Cloud.isInGCCloud) return 0;
                let p = window.location.href.split("releaseProject/").pop().split("/").shift().split("_");
                return parseInt(p[0]);
            },

            /**
             * 作者名称
             */
            get AuthorName(): string {
                if (!OpenAPI.GC.Cloud.isInGCCloud) return null;
                let p = document.querySelector('title').innerText;
                return p;
            }

        }

        /**
         * 如果是编辑器则弹窗, 如果是发布后则输出
         */
        static isCloudLog(text: any): void {
            if (Config.RELEASE_GAME) {
                trace(text)
            } else {
                alert(text)
            }
        }
    }

}


