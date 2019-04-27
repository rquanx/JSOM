'use strict';
class ResultMessage {
    /**
     * @constructor
     * @param {boolean} success 调用是否成功
     * @param {any} data 结果数据或对象
     * @param {string} message 错误信息
     */
    constructor(success, data, message = "") {
        this.success = success;
        this.data = data;
        this.message = message;
    };  
}

export default ResultMessage;