import {
    LookupType
} from "./enum";

export function getItemPath(info, path) {
    if (!path) {
        return "";
    }

    let url = info.context.get_url();
    let folderPath = `Lists/${info.listTitle}/${path}`;
    if (url[url.length - 1] === "/") {
        folderPath = `${url}${folderPath}`;
    } else {
        folderPath = `${url}/${folderPath}`;
    }
    return folderPath;
    itemCreateInfo.set_folderUrl(folderPath);
}

/** 
 * 设置要更新的字段数据
 * @param {any} item
 * @param { [field: string]:{ type: string, value: string} }  attributes
 * 
 * 日期需要toISOString() "2019-04-13T15:34:17.511Z"
 */
export function setListItem(item, attributes) {
    attributes && Object.keys(attributes).forEach((key) => {
        const obj = attributes[key];
        let value = obj.value;
        let type = obj.type ? obj.type : "";
        if (LookupType[type.toLowerCase()]) {
            if (typeof (value) !== "object") {
                value = setLookup(value);
            } else {
                value = value.map((v) => {
                    return setLookup(v);
                });
            }
        }
        item.set_item(key, value);
    });
};


/** 
 * 获取列表对象
 * @param {any} info
 */
export function getList(info) {
    if (!info.listTitle && !info.listId) {
        throw new Error("listTitle and listId is undefined");
    }
    return info.listTitle ? info.web.get_lists().getByTitle(info.listTitle) : info.web.get_lists().getById(info.listId);
}

/** 
 * 获取camlQuery设置
 * @param {any} caml
 * @param {string} pageInfo
 */
export function getCamlQuery(caml = "", pageInfo = "") {
    let camlQuery = new SP.CamlQuery();
    let xml = caml;
    if (typeof (caml) === "object") {
        let folder = caml.GetFolder ? caml.GetFolder() : "";
        if (folder) {
            camlQuery.set_folderServerRelativeUrl(folder);
        }
        xml = caml.ToString();
    }
    camlQuery.set_viewXml(xml);
    if (pageInfo) {
        let position = new SP.ListItemCollectionPosition();
        position.set_pagingInfo(pageInfo);
        camlQuery.set_listItemCollectionPosition(position);
    }
    return camlQuery;
}


/**
 * 设置查阅项
 * @param {any} value
 */
function setLookup(value) {
    let lkfieldsomthing = new SP.FieldLookupValue();
    lkfieldsomthing.set_lookupId(value);
    return lkfieldsomthing;
}