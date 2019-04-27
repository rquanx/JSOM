const JsomNode = require('sp-jsom-node').JsomNode;

let settings = {
    siteUrl: "http://192.168.20.40:8110",
    authOptions: {
        username: "username",
        password: "password",
        domain: "domain"
    },
    modules: ['core']   // 引入sp.js等模块，具体模块看github
};

(new JsomNode(settings)).init();

const ctx = SP.ClientContext.get_current();
const oWeb = ctx.get_web();
const oLists = oWeb.get_lists();
var olist = oLists.getByTitle("AppConfig");
var camlQuery = new SP.CamlQuery();
camlQuery.set_viewXml("");
var collListItem = olist.getItems(camlQuery);
ctx.load(collListItem);
ctx.executeQueryAsync(() => {
    console.log(collListItem);
}, (sender, args) => {
    console.log(args.get_message());
});