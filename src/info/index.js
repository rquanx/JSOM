'use strict';

class ServiceInfo {
    /**
     * @constructor 
     * @param {string} site 根据site获取clientContext,为空则默认取当前站点
     * @param {string} listTitle 设置默认操作列表名
     * @param {string} listId  设置默认操作列表id
     */
    constructor(site = "", listTitle = "", listId = "") {
        this.site = site;
        this.listTitle = listTitle;
        this.listId = listId;
        this.context = site ? new SP.ClientContext(site) : SP.ClientContext.get_current();
        this.web = this.context.get_web();
        this.currentContext =  SP.ClientContext.get_current();
        this.currentWeb = this.currentContext.get_web();
    }
}

export default ServiceInfo;
