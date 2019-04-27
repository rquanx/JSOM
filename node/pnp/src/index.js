import {
    SP,
    sp
} from "./services/pnp";
let Plugins = [];

/**
 * 
 * @param {{ localPath: string,list: string,folderPath: string,enable: boolean}} backupInfo 
 */
async function backup(backupInfo, message) {
    // pnp.web.folders.getByName("InvalidLibrary").folders.getByName("p2018110014").files.getByName("NoData.png").get().then((data)=>{console.log(data)},(d)=>{console.log("error is iiii",d)})
}

/**
 * 
 * @param { {localPath: string,list: string,folderPath: string} } deployInfo 
 */
async function deployFile(deployInfo, message) {

}

/**
 * 
 * @param {{ backupInfo: { localPath: string,list: string,folderPath: string,enable: boolean},deployInfo: { localPath: string,list: string,folderPath: string} }} fileInfo 
 */
async function deployItem(fileInfo) {
    let Message = {
        BackupList: false,
        DeployList: false,
        Backup: {},
        Deploy: {

        }
    };
    try {
        // 判断源文件和文件夹是否存在
        // 判断备份文件夹是否存在
        await SP.checkListIsExist(fileInfo.backupInfo.list);
        Message.BackupList = true;
        await SP.checkListIsExist(fileInfo.deployInfo.list);
        Message.DeployList = true;
        await backup(fileInfo.backupInfo, Message);

        await deployFile(fileInfo.deployInfo, Message);
    } catch (e) {

    } finally {
        return Message;
    }
}

/**
 * 
 * @param {{ plugins: any[] ,fileInfo: [{ backupInfo: { localPath: string,list: string,folderPath: string,enable: boolean},deployInfo: { localPath: string,list: string,folderPath: string} }], siteInfo: {siteUrl: string,authOptions: {username: string,password: string,domain: string}}}} config 
 */
function initial(siteInfo, plugins) {
    SP.initial(siteInfo);
    plugins.forEach((item) => {
        Plugins.push(new item(sp));
    });
}

/**
 * 
 * @param {{ plugins: any[] ,fileInfo: [{ backupInfo: { localPath: string,list: string,folderPath: string,enable: boolean},deployInfo: { localPath: string,list: string,folderPath: string} }], siteInfo: {siteUrl: string,authOptions: {username: string,password: string,domain: string}}}} config 
 */
function deploy(config) {
    let taskList = [];
    initial(config.siteInfo, config.plugins);

    config.fileInfo.forEach((item) => {
        taskList.push(deployItem(item));
    });
    Promise.all(taskList).then();

}

export default deploy;