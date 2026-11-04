# ⚙️ AST Grouping & Compiler Lifecycle Guide

This document explains how Babel parses JavaScript source code into `ast.program.body` and groups statement lines by `node.type`.

---

## 1. Compiler Execution Phases

```text
Source Code  ──►  Phase 1: Tokenizer  ──►  Phase 2: Scope Checker  ──►  Grouped AST Object
```

1. **Phase 1: Tokenizer**: Scans characters into valid keywords and string literals.
2. **Phase 2: Scope Checker**: Builds AST nodes and checks variable bindings.

---

## 2. AST Statement Grouping Algorithm

```javascript
const groupedOutput = {};

for (const node of ast.program.body) {
    const type = node.type;
    const line = sourceCode.slice(node.start, node.end).trim();

    if (!groupedOutput[type]) {
        groupedOutput[type] = [];
    }

    groupedOutput[type].push(line);
}
```

This converts code into structured JSON grouped by:
- `ImportDeclaration`
- `VariableDeclaration`
- `ExpressionStatement`
- `IfStatement`
- `ExportNamedDeclaration`
