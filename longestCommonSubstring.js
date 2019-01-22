
display("I like cats", "I like dogs");

function display(a, b) {
    const container = document.querySelector("#container");

    const common = findLongestCommonSubstring(a, b);

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
}


function findLongestCommonSubstring(str1, str2) {
    const memo = [[]]; // todo memoize this code so we stop repeating work
    const longestCommonArray = helper(str1.split(""), str2.split(""), 0, 0);
    return longestCommonArray.join("");
}

function helper(arr1, arr2, i1, i2) {
    if (arr1.length === i1 || arr2.length === i2) {
        return [];
    }
    if (arr1[i1] === arr2[i2]) {
        return [arr1[i1], ...helper(arr1, arr2, i1 + 1, i2 + 1)];
    }

    const result1 = helper(arr1, arr2, i1 + 1, i2);
    const result2 = helper(arr1, arr2, i1, i2 + 1);
    return result1.length > result2.length ? result1 : result2;
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












