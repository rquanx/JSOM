import ServiceInfo from "../info";
import ResultMessage from "../result";
import {
    getItemPath,
    setListItem,
    getList,
    getCamlQuery,
} from "../util";

import {
    IncludeType
} from "../util/enum";

'use strict';
class JSOM {
    /**
     * @constructor 
     * @param {string} [site = ""] 根据site获取clientContext,为空则默认取当前站点
     * @param {string} [listTitle = ""] 设置默认操作列表名
     * @param {string} [listId = ""]  设置默认操作列表id
     */
    constructor(site = "", listTitle = "", listId = "") {
        if (!this || this === window || !(this instanceof JSOM)) {
            throw new Error("JSOM is constructor not a function");
        }
        this.ServiceInfo = new ServiceInfo(site, listTitle, listId);
    };

    /**
     * 设置读取的表名
     * @param {string} title
     */
    setListTitle(title) {
        this.ServiceInfo.listTitle = title;
        return this;
    };

    /**
     * 刷新
     */
    refresh() {
        return JSOM.create(this.ServiceInfo.site, this.ServiceInfo.listTitle, this.ServiceInfo.listId);
    }


    /**
     * 读取当前用户数据
     * result.data = user or result.data = errorMessage 
     * @param {boolean} currentSite
     * @returns {Promise<ResultMessage>}
     */
    getCurrentUser(currentSite = true) {
        let info = this.ServiceInfo;

        function getUser(res, rej) {
            let context = info.context;
            let web = info.web;
            if (currentSite) {
                context = info.currentContext;
                web = info.currentWeb;
            }

            let user = web.get_currentUser(); // 读取当前用户
            context.load(user); // 加载当前用户
            context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, user);
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(getUser);
    };




    /**
     * //根据caml语句和要获取的属性，返回用户信息,实际是读取User Information List表
     * @param {any} caml 
     * @param {string[]} fields 空数组时查询所有字段，目前代码不支持取特定字段且取位置信息，如需获取位置要获取全部字段或使用caml限制返回字段
     * @returns {Promise<ResultMessage>}
     */
    getSiteUserInfo(caml = "", fields = []) {
        let info = this.ServiceInfo;

        function getItem(res, rej) {
            let olist = info.web.get_siteUserInfoList();
            let camlQuery = getCamlQuery(caml);
            let collListItem = olist.getItems(camlQuery);
            let include = "";
            if (fields && fields.length > 0) {
                include = `Include(${fields.join()})`;
                info.context.load(collListItem, include);
            } else {
                info.context.load(collListItem);
            }
            info.context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let data;
                let nextPageInfo = null;
                if (!fields || fields.length < 1) {
                    nextPageInfo = collListItem.get_listItemCollectionPosition()
                }

                let it = collListItem.getEnumerator();
                let dataArray = [];
                while (it.moveNext()) {
                    let item = it.get_current();
                    let dataObj = {};

                    if (include !== "") {
                        fields.forEach((field) => {
                            dataObj[field] = item.get_item(field);
                        });
                    } else {
                        dataObj = item.get_fieldValues();
                    }

                    dataArray.push(dataObj);
                }
                data = {
                    haveNext: nextPageInfo ? true : false,
                    nextPageInfo: nextPageInfo ? nextPageInfo.get_pagingInfo() : null,
                    data: dataArray
                };
                let result = new ResultMessage(true, data);
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(getItem);
    }



    /**
     * 根据caml语句、定位信息和要获取的属性，返回列表
     * @param {any} caml 搜索caml
     * result.data = { haveNext: boolean, data: items[] } or result.data = errorMessage 
     * @param {string} pageInfo 定位信息
     * @param {string[]} fields 需要获取字段,空数组代表获取全部字段，目前代码不支持取特定字段且取位置信息，如需获取位置要获取全部字段或使用caml限制返回字段
     * @returns {Promise<ResultMessage>}
     */
    getListItem(caml = "", pageInfo = "", fields = []) {
        let info = this.ServiceInfo;

        function getPageItem(res, rej) {

                let olist = getList(info);
                let camlQuery = getCamlQuery(caml, pageInfo);
                let collListItem = olist.getItems(camlQuery);
                let include = "";
                if (fields && fields.length > 0) {
                    include = `Include(${fields.join()})`;
                    info.context.load(collListItem, include);
                } else {
                    info.context.load(collListItem);
                }
                info.context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let data;
                let nextPageInfo = null;
                if (!fields || fields.length < 1) {
                    nextPageInfo = collListItem.get_listItemCollectionPosition()
                }
                let it = collListItem.getEnumerator();
                let dataArray = [];
                while (it.moveNext()) {
                    let item = it.get_current();
                    let dataObj = {};
                    if (include !== "") {
                        fields.forEach((field) => {
                            dataObj[field] = item.get_item(field);
                        });
                    } else {
                        dataObj = item.get_fieldValues();
                    }
                    dataArray.push(dataObj);
                }
                data = {
                    haveNext: nextPageInfo ? true : false,
                    nextPageInfo: nextPageInfo ? nextPageInfo.get_pagingInfo() : null,
                    data: dataArray
                };
                let result = new ResultMessage(true, data);
                res(result);
            }


            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }

        }
        return new Promise(getPageItem);
    };



    /**
     * 根据id获取item项
     * @param {string | number} id 
     * result.data = { haveNext: boolean, data: items[] } or result.data = errorMessage
     * 是否可以增加include? 
     * @returns {Promise<ResultMessage>}
     */
    getListItemById(id) {
        let info = this.ServiceInfo;

        function getItem(res, rej) {
            let context = info.context;
            let olist = getList(info);
            let oListItem = olist.getItemById(id);
            context.load(oListItem);
            context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, oListItem.get_fieldValues());
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(getItem);
    };



    /** 
     * 根据传入的对象和id，更新指定的列表项
     * @param {string | number} id 
     * @param { [field: string]:{ type: string, value: string} } } attributes
     * @returns {Promise<ResultMessage>}
     */
    updateListItemById(id, attributes) {
        let info = this.ServiceInfo;

        function updateItem(res, rej) {
            let oList = getList(info); //读取表
            let oListItem = oList.getItemById(id); //根据ID字段搜索表内容，唯一？			
            setListItem(oListItem, attributes);
            oListItem.update(); //设置数据更新
            info.context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, {});
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(updateItem);
    };


    /** 
     * 根据传入的caml，更新第一项
     * @param {any} caml 
     * @param { { [field: string]: {type: string, value: string} } } attributes
     * @returns {Promise<ResultMessage>}
     */
    updateListItemByCaml(caml = "", attributes = {}) {
        let info = this.ServiceInfo;

        function updateItem(res, rej) {
            let idList = new Array();
            let olist = getList(info);
            let camlQuery = getCamlQuery(caml);
            let collListItem = olist.getItems(camlQuery);
            info.context.load(collListItem);
            info.context.executeQueryAsync(updateItem, onError);

            function updateItem() {
                let ListItemToBeUpdated = collListItem.getEnumerator();
                let oList = getList(info);
                ListItemToBeUpdated.moveNext();
                let oItem = ListItemToBeUpdated.get_current();
                let id = oItem.get_id();
                idList.push(id);
                let oListItem = oList.getItemById(id);
                setListItem(oListItem, attributes);
                oListItem.update();
                info.context.executeQueryAsync(onSuccess, onError);
            };

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, idList);
                res(result);
            };

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(updateItem);
    };

    /** 
     * 根据传入的idList，更新所有项
     * @param {string[] | number[]} idList 
     * @param { [field: string]:{ type: string, value: string}[] } attributesList
     * @returns {Promise<ResultMessage>}
     */
    updateListItemsByIdList(idList, attributesList) {
        let info = this.ServiceInfo;

        function updateItems(res, rej) {
            let oList = getList(info); //读取表
            let count = 0;
            idList.forEach((id) => {
                let attributes = attributesList[count];
                let oListItem = oList.getItemById(id);
                setListItem(oListItem, attributes);
                oListItem.update();
                if (count < attributesList.length - 1) {
                    count++;
                }
            });
            info.context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, {});
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(updateItems);
    };


    /** 
     * 根据传入的caml，更新所有项
     * @param {any} caml 
     * @param { [field: string]:{ type: string, value: string}} attributes
     * @returns {Promise<ResultMessage>}
     */
    updateListItemsByCaml(caml, attributes) {
        let info = this.ServiceInfo;

        function updateItems(res, rej) {
            let olist = getList(info);
            let camlQuery = getCamlQuery(caml);
            let collListItem = olist.getItems(camlQuery);
            info.context.load(collListItem);
            info.context.executeQueryAsync(updateMultipleListItemsInSameObj, onError);

            function updateMultipleListItemsInSameObj() {
                let ListItemToBeUpdated = collListItem.getEnumerator();
                let oList = getList(info);
                while (ListItemToBeUpdated.moveNext()) {
                    let oItem = ListItemToBeUpdated.get_current();
                    let oListItem = oList.getItemById(oItem.get_id());
                    setListItem(oListItem, attributes);
                    oListItem.update();
                }
                info.context.executeQueryAsync(onSuccess, onError);
            };

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, {});
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(updateItems);
    };


    /** 
     * 根据传入id删除列表项
     * @param {string | number} id 
     * @returns {Promise<ResultMessage>}
     */
    deleteListItemById(id) {
        let info = this.ServiceInfo;

        function deleteItem(res, rej) {
            let list = getList(info);
            let listItem = list.getItemById(id);
            listItem.deleteObject();

            info.context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, {});
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(deleteItem);
    };

    /** 
     * 根据caml批量删除
     * @param {any} caml 
     * @returns {Promise<ResultMessage>}
     */
    deleteListItemsByCaml(caml) {
        let info = this.ServiceInfo;

        function deleteItems(res, rej) {
            let idList = [];
            let list = getList(info);
            let camlQuery = getCamlQuery(caml);
            let collListItem = list.getItems(camlQuery);
            info.context.load(collListItem);
            info.context.executeQueryAsync(deleteItem, onError);

            function deleteItem() {
                if (collListItem.get_count() > 0) {
                    let it = collListItem.getEnumerator();
                    while (it.moveNext()) {
                        let item = it.get_current();
                        let listItem = list.getItemById(item.get_id());
                        idList.push(item.get_id());
                        listItem.deleteObject();
                    }
                    info.context.executeQueryAsync(onSuccess, onError);
                } else {
                    onSuccess();
                }
            };

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, idList);
                res(result);
            };


            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(deleteItems);
    };

    /** 
     * 根据idList批量删除   待测试
     * @param {string[] | number[]} idList
     * @returns {Promise<ResultMessage>}
     */
    deleteListItemsByIdList(idList) {
        let info = this.ServiceInfo;

        function deleteItems(res, rej) {
            if (idList.length > 0) {
                let list = getList(info);
                idList.forEach((id) => {
                    let listItem = list.getItemById(id);
                    listItem.deleteObject();
                });
                info.context.executeQueryAsync(onSuccess, onError);
            } else {
                onSuccess();
            }

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, {});
                res(result);
            };



            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(deleteItems);
    }

    /** 
     * 根据传入的对象，创建列表项
     * @param { string } folderPath 默认加到列表根路径下，如果多层文件夹也要多层
     * @param { [field: string]:{ type: string, value: string} } attributesObj
     * @returns {Promise<ResultMessage>}
     */
    createListItem(folderPath, attributesObj) {
        let info = this.ServiceInfo;

        function createItem(res, rej) {
            let list = getList(info);
            let itemCreateInfo = new SP.ListItemCreationInformation();
            let path = getItemPath(info, folderPath);
            path && itemCreateInfo.set_folderUrl(path);
            let newItem = list.addItem(itemCreateInfo);
            setListItem(newItem, attributesObj);
            newItem.update();
            info.context.load(newItem);
            info.context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, {
                    id: newItem.get_id()
                });
                res(result);
            };

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(createItem);
    };

    /** 
     * 根据传入的对象，创建列表项
     * @param { string } folderPath 默认加到列表根路径下，如果多层文件夹也要多层
     * @param { { [field: string]: {type: string, value: string} } } attributesList
     */
    createListItems(folderPath, attributesList) {
        let info = this.ServiceInfo;
        let newItems = [];

        function createItem(res, rej) {
            let list = getList(info);
            attributesList.forEach((item) => {
                let itemCreateInfo = new SP.ListItemCreationInformation();
                let path = getItemPath(info, folderPath);
                path && itemCreateInfo.set_folderUrl(path);
                let newItem = list.addItem(itemCreateInfo);
                setListItem(newItem, item);
                newItem.update();
                info.context.load(newItem);
                newItems.push(newItem);
            });
            info.context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, {
                    id: newItems.map((i) => i.get_id())
                });
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(createItem);
    };

    /** 
     * 检查当前用户是否在此用户组
     * @param { string } groupName 要检查的组名
     * @returns {Promise<ResultMessage>}
     */
    isCurrentUserMemberOfGroup(groupName) {
        let info = this.ServiceInfo;

        function checkUser(res, rej) {
            let context = info.context;
            let web = info.web;
            let currentUser = web.get_currentUser();
            context.load(currentUser);
            let groupUsers = web.get_siteGroups().getByName(groupName).get_users();
            context.load(groupUsers);
            context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let userInGroup = false;
                let groupUserEnumerator = groupUsers.getEnumerator();
                while (groupUserEnumerator.moveNext()) {
                    let groupUser = groupUserEnumerator.get_current();
                    if (groupUser.get_id() === currentUser.get_id()) {
                        userInGroup = true;
                        break;
                    }
                }
                let result = new ResultMessage(true, userInGroup);
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(checkUser);
    };

    /** 
     * 检查用户是否在此用户组
     * @param { string | number } userId 用户ID
     * @param { string } groupName 要检查的组名
     * @returns {Promise<ResultMessage>}
     */
    isUserMemberOfGroup(userId, groupName) {
        let info = this.ServiceInfo;

        function checkUser(res, rej) {
            let context = info.context;
            let web = info.web;
            let groupUsers = web.get_siteGroups().getByName(groupName).get_users();
            context.load(groupUsers);
            context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let userInGroup = false;
                let groupUserEnumerator = groupUsers.getEnumerator();
                while (groupUserEnumerator.moveNext()) {
                    let groupUser = groupUserEnumerator.get_current();
                    if (groupUser.get_id() == userId) {
                        userInGroup = true;
                        break;
                    }
                }
                let result = new ResultMessage(true, userInGroup);
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(checkUser);
    }
    /** 
     * 获取所有在此用户组的用户
     * @param { string } groupName 要检查的组名
     * @returns {Promise<ResultMessage>}
     */
    getUsersOfGroup(groupName) {
        let info = this.ServiceInfo;

        function checkUser(res, rej) {
            let context = info.context;
            let web = info.web;

            let group = web.get_siteGroups().getByName(groupName);
            context.load(group);

            let groupUsers = group.get_users();
            context.load(groupUsers);
            context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let userList = new Array();
                let groupData = {
                    Title: group.get_title(),
                    ID: group.get_id(),
                    groupData: group
                };
                let groupUserEnumerator = groupUsers.getEnumerator();
                while (groupUserEnumerator.moveNext()) {
                    let groupUser = groupUserEnumerator.get_current();
                    userList.push({
                        ID: groupUser.get_id(),
                        Title: groupUser.get_title(),
                        userData: groupUser
                    });
                }

                let result = new ResultMessage(true, {
                    userList: userList,
                    group: groupData
                });
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(checkUser);
    };

    /** 
     * 更新文档库item，可更新文件,待完善
     * 有大小限制，不大于2M,文件相关操作建议使用pnp.js
     * @param { string | number} id item的id
     * @param { string } newFileName 文件新名字
     * @param { any } arrayBuffer 二进制文件数据
     * @param { [field: string]:{ type: string, value: string}} attributesObj 更新的字段值
     * @param { string | number} isNewFileName  是否重命名
     * @returns {Promise<ResultMessage>}
     */
    updateDocumentLibraryItemById(id, newFileName, arrayBuffer, attributesObj, isNewFileName = false) {
        let self = this;
        let fileDir = "";

        function updateItem(res, rej) {
            self.getListItemById(id)
                .then(onGetDirComplete, onError);

            function onGetDirComplete(data) {
                let fileDirArray = data.data["FileDirRef"].split("/");
                if (fileDirArray.length > 1) {
                    fileDir = fileDirArray.pop();
                }
                if (isNewFileName) {
                    attributesObj["FileLeafRef"] = {
                        value: newFileName.split(".")[0],
                        type: "Text"
                    }
                }
                self.updateListItemById(id, attributesObj)
                    .then(onRenameComplete, onError)
            };

            function onRenameComplete(data) {
                self.overWriteFile(arrayBuffer, fileDir, newFileName)
                    .then(onSuccess, onError);
            };

            function onSuccess(data) {
                let result = new ResultMessage(data.success, data);
                res(result);
            };

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(updateItem);
    };

    /** 
     * 重写文件,待完善
     * 有大小限制，不大于1.5M,文件相关操作建议使用pnp.js
     * @param { any } arrayBuffer 二进制文件数据
     * @param { string } fileName 文件夹名
     * @param { string } folderName  文件夹名，路径
     * @returns {Promise<ResultMessage>}
     */
    overWriteFile(arrayBuffer, fileUrl, folderName) {
        let info = this.ServiceInfo;

        function overWrite(res, rej) {
            let clientContext = info.context;
            let oList = getList(info);

            let bytes = new Uint8Array(arrayBuffer);
            let i, out = '';
            let bytesLength = bytes.length;
            for (i = 0; i < bytesLength; i += 1) {
                out += String.fromCharCode(bytes[i]);
            }
            let base64 = btoa(out);

            let createInfo = new SP.FileCreationInformation();
            createInfo.set_content(base64);
            createInfo.set_url(fileUrl);
            createInfo.set_overwrite(true);

            let newFile;
            if (folderName) {
                // 根据url添加
                newFile = oList.get_rootFolder().get_folders().getByUrl(`${info.listTitle}/${folderName}`).get_files().add(createInfo);
            } else {
                // 在根目录添加
                newFile = oList.get_rootFolder().get_files().add(createInfo);
            }

            clientContext.load(newFile);
            clientContext.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, {});
                res(result);
            };

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(overWrite);
    };

    /** 
     * 创建文档库Item,待完善
     * 有大小限制，不大于1.5M,文件相关操作建议使用pnp.js
     * @param { string } fileName 文件名
     * @param { any } arrayBuffer 二进制文件数据
     * @param { string } folderName  文件夹名,路径
     * @param { [field: string]:{ type: string, value: string} } attributesObj 字段数据
     * @returns {Promise<ResultMessage>}
     */
    createDocumentLibraryItem(fileName, arrayBuffer, folderName, attributesObj) {
        let info = this.ServiceInfo;

        function createItem(res, rej) {
            let clientContext = info.context;
            let oList = getList(info);
            //Convert the file contents into base64 data  
            let bytes = new Uint8Array(arrayBuffer);
            let i, out = '';
            let bytesLength = bytes.length;
            for (i = 0; i < bytesLength; i += 1) {
                out += String.fromCharCode(bytes[i]);
            }
            let base64 = btoa(out);
            //Create FileCreationInformation object using the read file data  
            let createInfo = new SP.FileCreationInformation();
            createInfo.set_content(base64);
            createInfo.set_url(fileName);
            let newFile;
            if (folderName) {
                // 根据url添加
                newFile = oList.get_rootFolder().get_folders().getByUrl(`${info.listTitle}/${folderName}`).get_files().add(createInfo);
            } else {
                // 在根目录添加
                newFile = oList.get_rootFolder().get_files().add(createInfo);
            }
            let myListItem = newFile.get_listItemAllFields();
            setListItem(myListItem, attributesObj);
            myListItem.update();
            clientContext.load(myListItem);
            clientContext.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, {
                    id: myListItem.get_id()
                });
                res(result);
            };

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(createItem);
    };


    /** 
     * 创建文件夹,暂时只支持在根路径下创建,待完善
     * @param { string } path 路径,如果在根路径，为false即可， "/site/listTitle/path" 
     * @param { string } name 文件夹名
     * @param { [field: string]:{ type: string, value: string} } attributesObj 字段数据
     * @returns {Promise<ResultMessage>}
     */
    createFolder(path, name, attributesObj = {}) {
        let info = this.ServiceInfo;

        function createItem(res, rej) {
            let clientContext = info.context;
            let oList = getList(info);
            let itemCreateInfo = new SP.ListItemCreationInformation();
            path = getItemPath(info, path);
            path && itemCreateInfo.set_folderUrl(path);
            itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
            itemCreateInfo.set_leafName(name);
            let oListItem = oList.addItem(itemCreateInfo);
            setListItem(oListItem, attributesObj);
            oListItem.update();
            clientContext.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, {});
                res(result);
            };

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(createItem);
    };

    /** 
     * 检查用户在当前设置的站点下的权限
     * @param {any} permission 权限枚举 SP.PermissionKind
     * @returns {Promise<ResultMessage>}
     */
    checkSitePermission(permission) {
        let info = this.ServiceInfo;

        function checkPermission(res, rej) {
            let clientContext = info.context;
            let oWebsite = info.web;
            let basePerm = new SP.BasePermissions();
            basePerm.set(permission);
            let usPermission = oWebsite.doesUserHavePermissions(basePerm);

            clientContext.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, usPermission.get_value());
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(checkPermission);
    }

    /** 
     * 检查用户在当前设置的列表下的权限
     * @param {any} permission 权限枚举 SP.PermissionKind
     * @returns {Promise<ResultMessage>}
     */
    checkListPermission(permission) {
        let info = this.ServiceInfo;

        function checkPermission(res, rej) {
            let clientContext = info.context;
            let list = getList(info);
            clientContext.load(list, IncludeType.EffectiveBasePermissions);
            clientContext.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, list.get_effectiveBasePermissions().has(permission));
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(checkPermission);
    }


    /** 
     * 读取视图数据  
     * @param {*} caml  
     * @returns {Promise<ResultMessage>}
     */
    renderListData(caml = "") {
        let info = this.ServiceInfo;

        function render(res, rej) {
            let context = info.context;
            let camlStr = typeof caml === "string" ? caml : caml.ToString();
            let groupByData = getList(info).renderListData(camlStr);
            context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let data = groupByData ? JSON.parse(groupByData.m_value) : undefined;
                let result = new ResultMessage(true, data);
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(render);
    }

    /**
     * 读取指定列表GUID
     * @returns {Promise<ResultMessage>}
     */
    getListGUID() {
        let info = this.ServiceInfo;

        function getLsitID(res, rej) {
            let olist = getList(info);
            info.context.load(olist, 'Id');
            info.context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, olist.get_id());
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(getLsitID);
    };

    /**
     * 根据文件guid获取到item项数据
     * @param {*} uniqueId  文件guid 
     * @returns {Promise<ResultMessage>}
     */
    getFileById(uniqueId) {
        let info = this.ServiceInfo;

        function getLsitID(res, rej) {
            let file = info.web.getFileById(uniqueId);
            let listItem = file.get_listItemAllFields();
            // info.context.load(file);
            info.context.load(listItem);
            info.context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let data = listItem.get_fieldValues();
                let result = new ResultMessage(true, data);
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(getLsitID);
    }

    getItemAttachments(caml) {
        let info = this.ServiceInfo;

        function getAttachments(res, rej) {
            let results = [];
            let resultCount = 0;
            let ctx = info.context;
            let list = getList(info);
            let camlQuery = getCamlQuery(caml);
            let oListItems = list.getItems(camlQuery);
            ctx.load(oListItems);
            ctx.executeQueryAsync(getItems, onError)

            function getItems() {
                resultCount = oListItems.get_count();
                let oListItemEnumerators = oListItems.getEnumerator();
                while (oListItemEnumerators.moveNext()) {
                    let item = oListItemEnumerators.get_current();
                    let attachmentFiles = item.get_attachmentFiles();
                    results.push(item.get_fieldValues());
                    ctx.load(attachmentFiles);
                    ctx.executeQueryAsync(getAttachmentsSuccess(results.length - 1), getAttachmentsError(results.length - 1));
                }
            }

            function getAttachmentsSuccess(count) {
                return function () {
                    results[count].AttachmentList = [];
                    if (attachmentFiles.get_count() > 0) {
                        var attachmentsItemsEnumerator = attachmentFiles.getEnumerator();
                        while (attachmentsItemsEnumerator.moveNext()) {
                            var attachitem = attachmentsItemsEnumerator.get_current();
                            results[count].AttachmentList.push(attachitem);
                            // var fileName = attachitem.get_fileName();
                            // var filepath = attachitem.get_path();
                            // var serverPath = attachitem.get_serverRelativePath();
                            // var serverUrl = attachitem.get_serverRelativeUrl();
                            // var objetctData = attachitem.get_objectData();
                            // var typedObj = attachitem.get_typedObject();
                        }
                    }
                    done(onSuccess);
                }
            }

            function getAttachmentsError(count) {
                return function (sender, args) {
                    results[count].AttachmentList = undefined;
                    done(onError);
                }
            }

            function done(fn) {
                resultCount--;
                if (resultCount < 1) {
                    fn(sender, args);
                }
            }


            function onSuccess(sender, args) {
                let result = new ResultMessage(true, results);
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }

        }

        return new Promise(getAttachments);
    }

    fileCheckIn() {
        // item.File.CheckIn("", CheckinType.MajorCheckIn);
    }

    fileCheckOut() {
        // item.File.CheckOut();
    }

    filePublish() {
        // item.File.Publish("");

    }
}

JSOM.Config = undefined;

/**
 * 创建JSOM操作对象
 */
JSOM.create = function (site = "", listTitle = "", listId = "") {
    return new JSOM(site, listTitle, listId);
}

export default JSOM;