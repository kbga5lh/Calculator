export function parseTree(tokens) {
    const operations = [
        ['+', '-'],
        ['*', '/'],
    ];

    function parseNode(leftIndex, rightIndex) {
        if (tokens[leftIndex] == '(' && tokens[rightIndex] == ')')
            return parseNode(leftIndex + 1, rightIndex - 1);

        let openedBrackets = 0;
        for (let w in operations) {
            for (let i = rightIndex; i >= leftIndex; --i) {
                if (tokens[i] == ')')
                    openedBrackets++;
                else if (tokens[i] == '(')
                    openedBrackets--;
                if (openedBrackets == 0 && operations[w].includes(tokens[i])) {
                    let l = parseNode(leftIndex, i - 1);
                    let r = parseNode(i + 1, rightIndex);
                    return {
                        left: l,
                        operation: tokens[i],
                        right: r
                    };
                }
            }
        }
        return parseFloat(tokens[leftIndex]);
    }
    return parseNode(0, tokens.length - 1);
}

export function isToken(c) {
    return ['/', '*', '+', '-', '(', ')'].includes(c);
}

export function isOperation(c) {
    return ['/', '*', '+', '-'].includes(c);
}

export function isNumeric(c) {
    return c == '.' || (c >= '0' && c <= '9');
}

export function parseTokens(inputText) {
    let result = [];
    let currentValue = "";
    for (let pointer in inputText) {
        if (currentValue
            && (isToken(inputText[pointer]) || isToken(currentValue))
            && !(currentValue == "-" && isNumeric(inputText[pointer]) && (pointer == 1 || inputText[pointer - 2] == '('))) {
            result.push(currentValue);
            currentValue = "";
        }
        currentValue += inputText[pointer];
    }
    if (currentValue)
        result.push(currentValue);
    return result;
}

export function calculateNode(node) {
    if (typeof node == "number")
        return node;

    let l = parseFloat(calculateNode(node.left));
    let r = parseFloat(calculateNode(node.right));

    return executeOperation(node.operation, l, r);
}

export function executeOperation(op, l, r) {
    switch (op) {
        case '*':
            return l * r;
        case '/':
            return l / r;
        case '+':
            return l + r;
        case '-':
            return l - r;
        default:
            return new Error("unknown operation: " + node.operation);
    }
}