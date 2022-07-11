//  srcフォルダ内にsharedのシンボリックリンクを貼るスクリプト
//  
//  【前提条件】
//  ・以下のフォルダ構成になっていること
//    mccs-project
//    ├─common-lib
//    └─[本プロジェクト]
//      └─src
//  ・プロジェクトのルートで実行すること

const { exec } = require("child_process");
const fs = require("fs");
const path = require('path');

const projectRoot = process.cwd();

//  shared作成後のパスが存在する場合は処理抜け（何もしない）
const sharedDirPath = path.join(projectRoot, "src", "shared");
if (fs.existsSync(sharedDirPath)) {
    return;
}

//  このプロジェクトのフォルダと同じ階層にcommon-sharedが存在しない場合は異常終了させる
const sharedRepoPath = path.join(projectRoot, "/../common-shared");
if(fs.existsSync(sharedRepoPath) == false) {
    console.error(`『${sharedRepoPath}』 is not exists.`);
    throw new Error("{B0071D43-9F12-4B13-94AF-163F990DCC0C}");
}

//  シンボリックリンクの作成
//  Windowsの場合、出力が文字化けするが、ライブラリを別途インストールしたくないため無視
exec("npm link ../common-shared", (err, stdout, stderr) => {
    if(err) { throw err; }
    console.log(stdout);

    //  シンボリックリンクを移動
    const mvCmd = process.platform === "win32" ? "move" : "mv";
    exec(`${mvCmd} ${path.join(projectRoot, "node_modules", "mccs-common-shared")} ${path.join(projectRoot, "src", "shared")}`, (err, stdout, stderrr) =>{
        if(err) { throw err; }
        console.log(stdout);

        //  npm iでnode_modules内のpackage-lock.jsonに記載されているlinkを除去
        exec("npm i", (err, stdout, stderr)=>{
            if(err) { throw err; }
            console.log(stdout);
        });
    });
});
