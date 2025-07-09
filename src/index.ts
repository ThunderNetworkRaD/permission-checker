import { checkList } from "./list";
import { checkSingle } from "./single";

export default {
    checkList,
    checkSingle
};

// Also export as named exports for better tree-shaking
export { checkList, checkSingle };
