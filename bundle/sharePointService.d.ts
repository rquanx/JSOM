import CamlXmlBuilder from "./camlXmlBuilder";

declare class SharePointService {
    constructor(site?: string, listTitle?: string, listId?: string);
    ServiceInfo: SharePointService.ServiceInfo;
    /**
     * 设置读取的表名
     * @param  title
     */
    setListTitle(title: string): SharePointService;

    /**
     * 读取当前用户数据
     * result.data = user or result.data = errorMessage 
     */
    getCurrentUser(): Promise<SharePointService.ResultMessage>;

    /**
     * //根据caml语句和要获取的属性，返回用户信息
     * @param  caml 
     * @param  fields 空数组时查询所有字段，目前代码不支持取特定字段且取位置信息，如需获取位置必须要获取全部字段
     */
    getSiteUserInfo(caml: any, fields: string[]): Promise<SharePointService.ResultMessage>;

    /**
     * 根据caml语句和要获取的属性，返回列表
     * @param  caml 
     * result.data = { haveNext: boolean, data: items[] } or result.data = errorMessage 
     * @param  fields 空数组时查询所有字段，目前代码不支持取特定字段且取位置信息，如需获取位置必须要获取全部字段
     * @param  pageInfo 定位信息 
     */
    getListItem(caml: any, fields: string[], pageInfo?: string): Promise<SharePointService.ResultMessage>;

    /** 
     * 根据传入的对象和id，更新指定的列表项
     * @param  id 
     * @param  attributes
     */
    updateListItemById(id: string | number, attributes: SharePointService.IAttributesDic): Promise<SharePointService.ResultMessage>;

    /** 
     * 根据传入的caml，更新第一项
     * @param  caml 
     * @param  attributes
     */
    updateListItemByCaml(caml: any, attributes: SharePointService.IAttributesDic): Promise<SharePointService.ResultMessage>;

    /** 
     * 根据传入的idList，更新所有项
     * @param  idList 
     * @param  attributesList
     */
    updateListItemsByIdList(idList: string[] | number[], attributesList: SharePointService.IAttributesDic[]): Promise<SharePointService.ResultMessage>;

    /** 
     * 根据传入的caml，更新所有项
     * @param  caml 
     * @param  attributes
     */
    updateListItemsByCaml(caml: any, attributes: SharePointService.IAttributesDic): Promise<SharePointService.ResultMessage>;


    /** 
     * 根据传入id删除列表项
     * @param id 
     */
    deleteListItemById(id: string | number): Promise<SharePointService.ResultMessage>;

    /** 
     * 根据caml批量删除
     * @param  caml 
     */
    deleteListItemsByCaml(caml: any): Promise<SharePointService.ResultMessage>;

    /** 
     * 根据idList批量删除   待测试
     * @param  idList
     */
    deleteListItemsByIdList(idList: string[] | number[]): Promise<SharePointService.ResultMessage>;

    /** 
     * 根据传入的对象，创建列表项
     * @param  attributesObj
     * @param  folderName 默认加到列表根路径下，如果多层文件夹也要多层
     */
    createListItem(attributesObj: SharePointService.IAttributesDic, folderName: string): Promise<SharePointService.ResultMessage>;

    /** 
     * 检查用户是否在此用户组
     * @param  groupName 要检查的组名
     */
    isCurrentUserMemberOfGroup(groupName: string): Promise<SharePointService.ResultMessage>;

    /** 
     * 检查用户是否在此用户组
     * @param  userId 用户Id
     * @param  groupName 要检查的组名
     */
    isUserMemberOfGroup(userId: string | number, groupName: string): Promise<SharePointService.ResultMessage>;
    /** 
     * 获取所有在此用户组的用户
     * @param  groupName 要检查的组名
     */
    getUserOfGroup(groupName: string): Promise<SharePointService.ResultMessage>;

    /** 
     * 更新文档库item，可更新文件,待完善
     * @param  id item的id
     * @param  newFileName 文件新名字
     * @param  arrayBuffer 二进制文件数据
     * @param  attributesObj 更新的字段值
     * @param  isNewFileName  是否重命名
     */
    updateDocumentLibraryItemById(id: string | number, newFileName: string, arrayBuffer: ArrayBuffer, attributesObj: SharePointService.IAttributesDic, isNewFileName?: boolean): Promise<SharePointService.ResultMessage>;

    /** 
     * 重写文件,待完善
     * @param  arrayBuffer 二进制文件数据
     * @param  fileUrl 文件夹路径
     * @param  folderName  文件夹名
     */
    overWriteFile(arrayBuffer: ArrayBuffer, fileUrl: string, folderName: string): Promise<SharePointService.ResultMessage>;

    /** 
     * 创建文档库Item,待完善
     * @param  fileUrl 文件路径
     * @param  arrayBuffer 二进制文件数据
     * @param  folderName  文件夹名
     * @param  attributesObj 字段数据
     */
    createDocumentLibraryItem(fileUrl: string, arrayBuffer: ArrayBuffer, folderName: string, attributesObj: SharePointService.IAttributesDic): Promise<SharePointService.ResultMessage>;

    /** 
     * 创建文件夹,暂时只支持在根路径下创建,待完善
     * @param  folderName 文件夹名
     * @param  attributesObj 字段数据
     */
    createFolder(folderName: string, attributesObj: SharePointService.IAttributesDic): Promise<SharePointService.ResultMessage>;

    /** 
     * 设置要更新的字段数据
     * @param  newItem
     * @param  attributesObj
     */
    static setListItem(newItem: any, attributesObj: SharePointService.IAttributesDic): void;


    /** 
     * 获取列表对象
     * @param {SharePointService.ServiceInfo} info
     */
    static getList(info: SharePointService.ServiceInfo): any;


    /** 
     * 获取camlQuery设置
     * @param  caml
     * @param  pageInfo
     */
    static getCamlQuery(caml: any, pageInfo: string): any;

}

declare namespace SharePointService {

    class ServiceInfo {
        constructor(site?: string, listTitle?: string, listId?: string);
        site: string;
        listTitle: string;
        context: any;
        web: any;
        currentContext: any;
        currentWeb: any;
    }

    class ResultMessage {
        constructor(success: string, data: any, message?: string);
        success: boolean;
        data: any;
        message: string;
    }

    interface IAttributes {
        type: string,
        value: string
    }

    interface IAttributesDic {
        [field: string]: IAttributes
    }
}

export default SharePointService;