import SharePointService from "./SharePointService";
import CamlXmlBuilder from "./CamlXmlBuilder";

let sp = new SharePointService("","SealApplicationLibrary");
let caml = new CamlXmlBuilder();
let data;
sp.getCurrentUser().then(onSuccess, onError)
function onSuccess(result) {
    data = result;
    console.log(result);
}

function onError(result) {
    data = result
    console.log(result);
}

