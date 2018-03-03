
var userRuleList = {};

function userRuleListLoad(next) {
    storage.get("userRuleList").then((item) => {
        log("storage get item ", item);
        userRuleList = item["userRuleList"] || {};
        if (next)
            next(userRuleList);
    }, onError);
}

function userRuleListAdd(hostname, item) {
    if (!userRuleList[hostname])
        userRuleList[hostname] = [];

    userRuleList[hostname].push(item);
    //log("userRuleList", userRuleList);
    storage.set({ userRuleList }).then(() => {
        log("storage set ok.", hostname, ":", item);
    }, onError);
}

function isRuleEqual(ra, rb) {
    return ra["action"] == rb["action"] &&
        ra["mime-type"] == rb["mime-type"] &&
        ra["file-ext"] == rb["file-ext"];
}

function userRuleListRemove(hostname, rule) {
    let ruleList = userRuleList[hostname];
    if (!ruleList)
        return;
    let found = false;
    for (let i = 0; i < ruleList.length; i++) {
        let e = ruleList[i];
        log(i, e);
        if (isRuleEqual(e, rule)) {
            found = true;
            log("userRuleListRemove found match.")
            ruleList.splice(i, 1);
            break;
        }
    }
    if (!found) {
        error("*** No existing rule match the request one: ", hostname, ":", rule);
        return;
    }
    if (ruleList.length == 0)
        delete userRuleList[hostname];
    //log("userRuleList", userRuleList);
    storage.set({ userRuleList }).then(() => {
        log("storage set ok. Removed ", hostname, ":", rule);
    }, onError);
    return;
}
