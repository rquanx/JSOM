'use strict';
var SPItemService = function () {};

SPItemService.Fields = {};

/**
 * 根据设置字段fileds将对应的数据读取出来
 * @param {any} data 列表项数据 查阅项:{ id: value}   时间:{ value: format("yyyy-MM-dd HH:mm"),original: 原始的值 } Url对象: {description: value.get_description(),  url: value.get_url(), typeId: value.get_typeId()}
 * @param {(key:string,value: any) => any} filter 筛选处理函数,不需要特殊处理可以不传
 */
SPItemService.getItemData = function (data, filter = undefined) {
  filter = filter && typeof (filter) === "function" ? filter : undefined;
  var Fields = this.Fields;
  var keys = [];
  if (Fields) {
    keys = Object.keys(Fields);
  } else {
    keys = Object.keys(data);
  }
  var obj = {};
  for (var i in keys) {
    var key = keys[i];
    if (filter) {
      obj[key] = filter(key, SPItemService.getItemValue(data[key]));
    } else {
      obj[key] = SPItemService.getItemValue(data[key]);
    }
  }
  return obj;
};

/**
 * 设置更新的字段数据
 * @param {string | string[] | number | number[]} value 
 * @param {string} type 更新的类型text/lookupValue
 */
SPItemService.setUpdateObj = function (value, type) {
  return {
    value: value,
    type: type
  }
};

SPItemService.attributesObjToPNPObj = function (attributesObj) {
  var obj = {};
  for (var i in attributesObj) {
    if (attributesObj[i].type === "lookupValue") {
      obj[i + "Id"] = attributesObj[i].value;
    } else {
      obj[i] = attributesObj[i].value;
    }
  }
  return obj;
};

SPItemService.setLookupObj = function (id, value = "") {
  return {
    id: id,
    value: value
  }
};

SPItemService.getLookupObj = function (value) {
  var result = null;
  if (value) {
    result = {
      id: value.get_lookupId(),
      value: value.get_lookupValue()
    }
  }
  return result;
};

SPItemService.getDateTimeObj = function (value) {
  var result = null;
  if (value) {
    result = {
      value: value.format("yyyy-MM-dd HH:mm"),
      original: value
    }
  }
  return result;
};

SPItemService.getUrlObj = function (value) {
  var result = null;
  if (value) {
    result = {
      description: value.get_description(),
      url: value.get_url(),
      typeId: value.get_typeId()
    }
  }
  return result;
};

SPItemService.getItemValue = function (value) {
  var type = typeof (value);
  var result = value;
  if (value === null || value === undefined) {
    result = undefined;
  } else if (type !== "object") {
    result = value;
  } else {
    if (!value.length) {
      if (value.get_lookupId && typeof value.get_lookupId === "function") {
        result = this.getLookupObj(value);
      } else if (value.get_url && typeof value.get_url === "function") {
        result = this.getUrlObj(value);
      } else {
        try {
          result = this.getDateTimeObj(value);
        } catch (e) {
          result = value;
        }
      }
    } else {
      var len = 0;
      try {
        var valueArray = new Array();
        len = value.length;
        for (var i = 0; i < len; i++) {
          valueArray.push(this.getLookupObj(value[i]));
        }
        result = valueArray;
      } catch (e) {
        try {
          var valueArray = new Array();
          len = value.length;
          for (var i = 0; i < len; i++) {
            valueArray.push(this.getDateTimeObj(value[i]));
          }
          result = valueArray;
        } catch (e) {
          result = value;
        }
      }
    }
  }
  return result;
};

export default SPItemService;