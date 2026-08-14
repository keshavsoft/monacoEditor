function getNodeDetails(node, source) {
    const baseDetails = {
        type: node.type,
        start: node.start,
        end: node.end,
        text: source.slice(node.start, node.end)
    };

    switch (node.type) {
        case "ImportDeclaration":
            return {
                ...baseDetails,
                lineType: node.type,
                raka: node.source?.value,
                poka: node.specifiers?.[0]?.local?.name,
                importedName: node.specifiers?.[0]?.imported?.name
            };

        case "VariableDeclaration":
            return {
                ...baseDetails,
                lineType: node.type,
                poka: node.declarations?.[0]?.id?.name
            };

        default:
            return {
                ...baseDetails,
                lineType: node.type
            };
    }
}

function processAst(ast, source) {
    return ast.program.body.map((node) => getNodeDetails(node, source));
}

export {
    getNodeDetails,
    processAst
};