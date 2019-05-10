export const funList = ["getCurrentUser", "getSiteUserInfo", "getListItem", "getListItemById", "updateListItemById",
    "updateListItemByCaml", "updateListItemsByIdList", "updateListItemsByCaml", "deleteListItemById",
    "deleteListItemsByCaml", "deleteListItemsByIdList", "createListItem", "createListItems", "isCurrentUserMemberOfGroup",
    "isUserMemberOfGroup", "getUsersOfGroup", "updateDocumentLibraryItemById", "overWriteFile",
    "createDocumentLibraryItem", "createFolder", "checkSitePermission", "checkListPermission",
    "renderListData", "getListGUID", "getFileById"
];

export let Config = {
    before: [],
    after: []
}

function beforeExecu() {
    Config.before.forEach((i) => {
        typeof i === "function" && i();
    })
}

function afterExecu(v) {
    Config.after.forEach((i) => {
        typeof i === "function" && i();
    })
    return v;
}

export const aop = (target, name) => {
    let value = target[name];
    Object.defineProperty(target, name, {
        get: function () {
            return (...arg) => {
                beforeExecu();
                let r = value.apply(this, arg);
                return r.then(afterExecu, afterExecu)
            }
        }
    });
};