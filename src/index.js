import JSOM from "./jsom";
import {
    aop,
    funList,
    Config
} from "./config";

JSOM["Config"] = ({
    before = undefined,
    after = undefined
}) => {
    before && Config.before.push(before);
    after && Config.after.push(after);
}

funList.forEach(key => {
    aop(JSOM.prototype, key);
});

export default JSOM;