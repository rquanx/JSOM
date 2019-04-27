import {
    PnpNode
} from "sp-pnp-node";
import {
    sp
} from "@pnp/sp";

let SP = {};


/**
 * 上传文件，创建item
 * @param {*} file 
 * @param {*} name 
 * @param {*} folderUrl 
 * @param {*} attributesObj 
 * @param {*} success 
 * @param {*} error 
 */
SP.createLibraryItem = function createLibraryItem(file, name, folderUrl, attributes, success, error) {
    let uploadFile = sp.web.getFolderByServerRelativeUrl(folderUrl).files.add(name, file, true);
    if (attributes && Object.keys(attributes).length > 0) {
        uploadFile.then(f => {
            f.file.getItem()
                .then(item => {
                    var obj = toPNPObj(attributes);
                    item.update(obj)
                        .then(success, error)
                        .catch(error);
                })
                .catch(error);
        }).catch(error);
    } else {
        uploadFile.then(success, error);
    }
}


SP.initial = function spInitial(siteInfo) {
    sp.setup({
        sp: {
            headers: {
                Accept: "application/json;odata=verbose",
            },
            fetchClientFactory: () => new PnpNode(siteInfo),
            baseUrl: siteInfo.siteUrl
        }
    });
}

/**
 * 
 * @param {string} name 
 */
SP.checkListIsExist =  async function checkListIsExist(name) {
    let result = false;
    try{
        await sp.web.lists.getByTitle(name).get();
        result = true;
    }
    catch(e) {

    }
    finally {
        return result;
    }
}


/**
 * @param {string[]} paths
 * @param {string} name
 */
SP.createFolder = function createFolder(paths,name) {
    let folders = sp.web.folders;
    paths.forEach((item) => {
        folders = folders.getByName(item).folders;
    });
    folders.add();
}

SP.uploadFile = function uploadFile() {
    sp.web.folders.getByName().files.add()
}

export {SP,sp};