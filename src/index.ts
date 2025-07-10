import * as checkSingle from "./single.js";
import * as checkList from "./list.js";
import * as evaluate from "./evaluate.js";
import * as fill from "./fill.js";
import * as replace from "./replace.js";

export default {
    ...checkSingle,
    ...checkList,
    ...evaluate,
    ...fill,
    ...replace
}

export { 
    checkSingle,
    checkList,
    evaluate,
    fill,
    replace
}