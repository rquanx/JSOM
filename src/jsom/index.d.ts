import ResultMessage from "../result";
import ServiceInfo from "../info";
declare namespace JSOM {
    class JSOM {
        constructor(site?: string, listTitle?: string, listId?: string);
        private ServiceInfo: ServiceInfo;


        static create(site?: string, listTitle?: string, listId?: string);

        /**
         * 设置读取的表名
         * @param  title
         */
        setListTitle(title: string): JSOM;

        /**
         * 刷新
         */
        refresh()

        /**
         * 设置读取的表名
         * @param  id
         */
        setListID(id: string): JSOM;

        /**
         * 读取当前用户数据
         * result.data = user or result.data = errorMessage 
         */
        getCurrentUser(): Promise<ResultMessage>;

        /**
         * //根据caml语句和要获取的属性，返回用户信息
         * @param  caml 
         * @param  fields 空数组时查询所有字段，目前代码不支持取特定字段且取位置信息，如需获取位置必须要获取全部字段
         */
        getSiteUserInfo(caml: any, fields: string[]): Promise<ResultMessage>;

        /**
         * 根据caml语句和要获取的属性，返回列表
         * @param  caml 
         * result.data = { haveNext: boolean, data: items[] } or result.data = errorMessage 
         * @param  fields 空数组时查询所有字段，目前代码不支持取特定字段且取位置信息，如需获取位置必须要获取全部字段
         * @param  pageInfo 定位信息 
         */
        getListItem(caml: any, fields: string[], pageInfo?: string): Promise<ResultMessage>;


        /**
         * 根据id获取item项
         * @param {string | number} id 
         * result.data = { haveNext: boolean, data: items[] } or result.data = errorMessage
         * 是否可以增加include? 
         */
        getListItemById(id: string | number): Promise<ResultMessage>;


        /** 
         * 根据传入的对象和id，更新指定的列表项
         * @param  id 
         * @param  attributes
         */
        updateListItemById(id: string | number, attributes: JSOM.IAttributesDic): Promise<ResultMessage>;

        /** 
         * 根据传入的idList，更新所有项
         * @param  idList 
         * @param  attributesList
         */
        updateListItemsByIdList(idList: string[] | number[], attributesList: JSOM.IAttributesDic[]): Promise<ResultMessage>;

        /** 
         * 根据传入的caml，更新所有项
         * @param  caml 
         * @param  attributes
         */
        updateListItemsByCaml(caml: any, attributes: JSOM.IAttributesDic): Promise<ResultMessage>;


        /** 
         * 根据传入id删除列表项
         * @param id 
         */
        deleteListItemById(id: string | number): Promise<ResultMessage>;

        /** 
         * 根据caml批量删除
         * @param  caml 
         */
        deleteListItemsByCaml(caml: any): Promise<ResultMessage>;

        /** 
         * 根据idList批量删除   待测试
         * @param  idList
         */
        deleteListItemsByIdList(idList: string[] | number[]): Promise<ResultMessage>;

        /** 
         * 根据传入的对象，创建列表项
         * @param  folderPath 默认加到列表根路径下，如果多层文件夹也要多层
         * @param  attributesObj
         */
        createListItem(folderPath: string, attributesObj: JSOM.IAttributesDic): Promise<ResultMessage>;

        /** 
         * 检查当前用户是否在此用户组
         * @param  groupName 要检查的组名
         */
        isCurrentUserMemberOfGroup(groupName: string): Promise<ResultMessage>;

        /** 
         * 检查用户是否在此用户组
         * @param  userId 用户Id
         * @param  groupName 要检查的组名
         */
        isUserMemberOfGroup(userId: string | number, groupName: string): Promise<ResultMessage>;
        /** 
         * 获取所有在此用户组的用户
         * @param  groupName 要检查的组名
         */
        getUsersOfGroup(groupName: string): Promise<ResultMessage>;

        /** 
         * 更新文档库item，可更新文件,待完善
         * @param  id item的id
         * @param  newFileName 文件新名字
         * @param  arrayBuffer 二进制文件数据
         * @param  attributesObj 更新的字段值
         * @param  isNewFileName  是否重命名
         */
        updateDocumentLibraryItemById(id: string | number, newFileName: string, arrayBuffer: ArrayBuffer, attributesObj: JSOM.IAttributesDic, isNewFileName?: boolean): Promise<ResultMessage>;

        /** 
         * 重写文件,待完善
         * @param  arrayBuffer 二进制文件数据
         * @param  fileName 文件名
         * @param  folderName  文件夹名,路径
         */
        overWriteFile(arrayBuffer: ArrayBuffer, fileName: string, folderName: string): Promise<ResultMessage>;

        /** 
         * 创建文档库Item,待完善
         * @param  fileName 文件名
         * @param  arrayBuffer 二进制文件数据
         * @param  folderName  文件夹名,路径
         * @param  attributesObj 字段数据
         */
        createDocumentLibraryItem(fileName: string, arrayBuffer: ArrayBuffer, folderName: string, attributesObj: JSOM.IAttributesDic): Promise<ResultMessage>;

        /** 
         * 创建文件夹,暂时只支持在根路径下创建,待完善
         * @param  folderName 文件夹名
         * @param  attributesObj 字段数据
         */
        createFolder(folderName: string, attributesObj: JSOM.IAttributesDic): Promise<ResultMessage>;

        /** 
         * 检查用户在当前设置的站点下的权限
         * @param {any} permission 权限枚举
         */
        checkSitePermission(permission): Promise<ResultMessage>;

        /** 
         * 检查用户在当前设置的列表下的权限
         * @param {any} permission 权限枚举
         */
        checkListPermission(permission): Promise<ResultMessage>;

        /** 
         * 读取视图数据  
         * @param {*} caml   
         */
        renderListData(caml?: any): Promise<ResultMessage>;

        /**
         * 读取指定列表GUID
         */
        getListGUID(): Promise<ResultMessage>;

        /** 
         * 设置要更新的字段数据
         * @param  item
         * @param  attributesObj
         */
        static setListItem(item: any, attributesObj: JSOM.IAttributesDic): void;


        /** 
         * 获取列表对象
         * @param {ServiceInfo} info
         */
        static getList(info: ServiceInfo): any;


        /** 
         * 获取camlQuery设置
         * @param  caml
         * @param  pageInfo
         */
        static getCamlQuery(caml?: any, pageInfo?: string): any;

        static IncludeType: {
            DisplayName: "DisplayName", // 显示名称?
            EffectiveBasePermissions: "EffectiveBasePermissions", // 权限？
            HasUniqueRoleAssignments: "HasUniqueRoleAssignments", // 
            RoleAssignments: "RoleAssignments" // 
        }
    }



    interface IAttributes {
        type: string,
        value: string
    }

    interface IAttributesDic {
        [field: string]: IAttributes
    }

    interface IUser {
        get_title: any;
        get_id: any;
    }

    interface ILookup {
        get_value: any;
        get_id: any;
    }
}
export default JSOM.JSOM;