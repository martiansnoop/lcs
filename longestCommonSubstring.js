
display("abcdefghi", "abcdxfghi");
display("I like cats", "I like dogs");
display("I like cats", "I like bats");
display("I like cats", "I like dinosaurs");
display("<a href='#' onclick='alert(1)'>click me!</a>", "nice try");
display("スポーツは大好き", "スポーツが大好き");

function display(a, b) {
    const container = document.querySelector("#container");

    const common = findLongestCommonSubstring(a, b);
    console.log(a, b, common);

    const processedA = process(a, common);
    const domNodesA = makeDomNodes(processedA, "removed");
    const pA = document.createElement("p");
    domNodesA.forEach(node => pA.appendChild(node));
    container.appendChild(pA);

    const processedB = process(b, common);
    const domNodesB = makeDomNodes(processedB, "added");
    const pB = document.createElement("p");
    domNodesB.forEach(node => pB.appendChild(node));
    container.appendChild(pB);

    container.appendChild(document.createTextNode("--------"))
}


function findLongestCommonSubstring(str1, str2) {
    const memo = initMemo(str1, str2);
    const longestCommonArray = helper(str1.split(""), str2.split(""), 0, 0, memo);
    return longestCommonArray.join("");
}

function helper(arr1, arr2, i1, i2, memo) {
    if (arr1.length === i1 || arr2.length === i2) {
        return [];
    }
    if (memo[i1][i2] !== undefined) {
        return memo[i1][i2];
    }
    if (arr1[i1] === arr2[i2]) {
        const result =[arr1[i1], ...helper(arr1, arr2, i1 + 1, i2 + 1, memo)];
        memo[i1][i2] = result;
        return result;
    }

    const result1 = helper(arr1, arr2, i1 + 1, i2, memo);
    const result2 = helper(arr1, arr2, i1, i2 + 1, memo);

    const result = result1.length > result2.length ? result1 : result2;
    memo[i1][i2] = result;
    return result;
}

// I'm too lazy to search for the ninja one-liner that doubtlessly exists for this:
function initMemo(str1, str2) {
    const out = [];
    for (let i = 0; i < str1.length; i++) {
        // this array is going to be filled in out of order
        out[i] = [];
    }
    return out;
}

// This `process` function has a terrible name, but its goal is to take the string and the
// longest common substring, and break the string apart into parts that are in the common
// substring and parts that aren't.
//
// If the original string is "I like cats" and the common substring is "I like s" (i.e.
// "cats" has been changed to another animal) the output will look like this:
// [ { content: "I like ", type: "same"}, {content: "cat", type: "different"}, {content: "s", type: "same"}  ]
function process(str, common) {
    const output = [];
    let buffer = [];
    let state = "same";
    let s = 0, c = 0;
    // common is expected to be shorter or equal to str
    while (s < str.length) { // check this
        if (state === "same") {
            if (str[s] === common[c]) {
                buffer.push(str[s]);
                s++;
                c++;
            } else {
                output.push({ content: buffer.join(""), type: "same" });
                state = "different";
                buffer = [];
                buffer.push(str[s]);
                s++;
            }
        } else if (state === "different") {
            if (str[s] !== common[c]) {
                buffer.push(str[s]);
                s++;
            } else {
                output.push({ content: buffer.join(""), type: "different" })
                state = "same";
                buffer = [];
                buffer.push(str[s]);
                s++;
                c++;
            }

        } else {
            throw new Error("unexpected state", state);
        }
    }

    if (buffer.length > 0) {
        output.push({content: buffer.join(""), type: state});
    }
    return output;
}

function makeDomNodes(processed, accentClass) {
    return processed
        .map(part => {
            if (part.type === "same") {
                return document.createTextNode(part.content);
            } else {
                const newNode = document.createElement("span");
                newNode.classList.add(accentClass);
                newNode.textContent = part.content;
                return newNode;
            }
        });
}












