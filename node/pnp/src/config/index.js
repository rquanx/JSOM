const ContentType = {
    File: "file",
    Folder: "Folder"
}

const siteInfo = {
    siteUrl: "http://192.168.20.40:8110",
    authOptions: {
        username: "username",
        password: "password",
        domain: "mscdev.com"
    }
}

const plugins = [];

const fileInfo = [{
        deployInfo: {
            localPath: "C:/Users/runquan.tan.MEDALSOFT/Desktop/ServiceMe.Apps.RecordManagement/build/js/",
            list: "Style Library", 
            folderPath: "ServiceMe.Apps.RecordManagement/js",
            type: ContentType.Folder
        },
        backupInfo: {
            enable: false,
            localPath: "",
            list: "Style Library",
            folderPath: "ServiceMe.Apps.RecordManagement/js",
            type: ContentType.Folder
        }
    }
];




const config = {
    siteInfo,
    fileInfo,
    plugins
}

module.exports = {
    config
}