import { checkList } from "./list.js";
import { checkSingle } from "./single.js";
import { evaluate } from "./evaluate.js";
import { fill } from "./fill.js";

export default {
    checkList,
    checkSingle,
    evaluate,
    fill,
};

// Also export as named exports for better tree-shaking
export { checkList, checkSingle, evaluate, fill };
