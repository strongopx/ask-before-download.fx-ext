
var userRuleList = {};

function userRuleListLoad(next) {
    storage.get("userRuleList").then((item) => {
        log("storage get item ", item);
        userRuleList = item["userRuleList"] || {};
        if (next)
            next(userRuleList);
    }, onError);
}

function isRegexEqual(ra, rb) {
    if (ra && !rb || !ra && rb)
        return false;
    if (!ra && !rb)
        return true;
    return ra.source === rb.source;
}

function isRuleEqual(ra, rb) {
    if (ra["action"] !== rb["action"] ||
        ra["mime-type"] !== rb["mime-type"] ||
        !isRegexEqual(ra["file-ext"], rb["file-ext"]))
        return false;
    return true;
}

function isRuleActionDiff(ra, rb) {
    return ra["action"] !== rb["action"] &&
        ra["mime-type"] === rb["mime-type"] &&
        isRegexEqual(ra["file-ext"], rb["file-ext"]);
}

function userHostRulesAdd(hostRules, rule) {
    for (let tmpRule of hostRules) {
        if (isRuleEqual(tmpRule, rule)) {
            return false;
        }
        if (isRuleActionDiff(tmpRule, rule)) {
            tmpRule.action = rule.action;
            return true;
        }
    }
    hostRules.push(rule);

    return true;
}

function userRuleListAdd(hostname, rule) {
    if (!userRuleList[hostname])
        userRuleList[hostname] = [];

    //userRuleList[hostname].push(rule);
    if (!userHostRulesAdd(userRuleList[hostname], rule)) {
        log("Add rule, already exist: ", hostname, ":", rule);
        return;
    }

    //log("userRuleList", userRuleList);
    storage.set({ userRuleList }).then(() => {
        log("storage set ok. Added ", hostname, ":", rule);
    }, onError);
}

function userHostRulesRemove(hostRules, rule) {
    for (let i = 0; i < hostRules.length; i++) {
        let tmpRule = hostRules[i];
        log(i, tmpRule);
        if (isRuleEqual(tmpRule, rule)) {
            log("userRuleListRemove found match.")
            hostRules.splice(i, 1);
            return true;
        }
    }
    return false;
}

function userRuleListRemove(hostname, rule) {
    let hostRules = userRuleList[hostname];
    if (!hostRules)
        return;

    if (!userHostRulesRemove(hostRules, rule)) {
        error("*** Remove rule, no match: ", hostname, ":", rule);
        return;
    }
    if (hostRules.length == 0)
        delete userRuleList[hostname];
    //log("userRuleList", userRuleList);
    storage.set({ userRuleList }).then(() => {
        log("storage set ok. Removed ", hostname, ":", rule);
    }, onError);

    return;
}
