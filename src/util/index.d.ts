
/**
 * 根据info和path设置文件夹路径
 * @param {ServiceInfo} info 
 * @param {string} path 
 */
export function getItemPath(info, path: string): string

/** 
 * 设置要更新的字段数据
 * @param  item
 * @param  attributesObj
 */
export function setListItem(item: any, attributesObj: JSOM.IAttributesDic): void;


/** 
 * 获取列表对象
 * @param {ServiceInfo} info
 */
export function getList(info: ServiceInfo): any;


/** 
 * 获取camlQuery设置
 * @param  caml
 * @param  pageInfo
 */
export function getCamlQuery(caml?: any, pageInfo?: string): any;

/**
 * 设置查阅项
 * @param {any} value
 */
function setLookup(value): any;