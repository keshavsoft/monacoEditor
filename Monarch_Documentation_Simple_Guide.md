# Monarch Documentation — Simple Guide

Official documentation: https://microsoft.github.io/monaco-editor/monarch-static.html

## 1. What is Monarch?

- Monarch is the tokenizer and syntax-highlighting system used with Monaco Editor.
- It helps Monaco understand different parts of source code.
- It identifies keywords, strings, numbers, comments, operators, identifiers, and other tokens.
- Monaco then uses these token types to display syntax highlighting.

### Simple flow

```text
Source Code
    ↓
Monarch Tokenizer
    ↓
Identify tokens
    ↓
Assign token types
    ↓
Monaco Editor
    ↓
Syntax Highlighting
```

---

## 2. What is a Language Definition?

- A language definition describes the syntax rules of a language.
- We can define keywords, operators, brackets, tokenizer rules, and other language properties.
- Monarch uses this definition to understand the source code.

Example:

```javascript
return {
    keywords: [
        "if",
        "else",
        "for",
        "return"
    ],

    tokenizer: {
        root: [
            // rules
        ]
    }
};
```

**Tell sir:**

> A language definition tells Monarch what the language contains and how the language should be recognized.

---

## 3. `ignoreCase`

```javascript
ignoreCase: true
```

- It controls whether uppercase and lowercase are treated as the same.
- For example, `return`, `RETURN`, and `Return` can be treated as the same keyword when case is ignored.
- The default is `false`.

---

## 4. `defaultToken`

```javascript
defaultToken: "source"
```

- This is the token type used when no specific rule matches.
- During development, `defaultToken: "invalid"` can help identify text that was not tokenized as expected.

---

## 5. `brackets`

Brackets can be defined like this:

```javascript
brackets: [
    ["{", "}", "delimiter.curly"],
    ["[", "]", "delimiter.square"],
    ["(", ")", "delimiter.parenthesis"]
]
```

- This tells Monarch about matching brackets.
- It helps Monaco understand `{}`, `[]`, and `()`.
- Bracket information can also help with bracket matching and indentation.

---

## 6. `tokenizer`

The tokenizer is the most important part.

```javascript
tokenizer: {
    root: [
        // rules
    ]
}
```

- The tokenizer reads the source code.
- It breaks the code into recognizable tokens.
- It uses rules and regular expressions to find patterns.
- Each matched pattern receives a token type.

Example:

```javascript
const name = "Srinivas";
```

Possible tokens:

```text
const       → keyword
name        → identifier
=           → operator
"Srinivas"  → string
;           → delimiter
```

**Tell sir:**

> The tokenizer performs the lexical analysis. It reads the source code and divides it into tokens.

---

## 7. What is a Token?

- A token is a recognized piece of source code.
- Different parts of code can have different token types.

Example:

```javascript
function hello() {
    return "Hi";
}
```

Monarch can identify:

```text
function → keyword
hello    → identifier
(        → delimiter
)        → delimiter
{        → bracket
return   → keyword
"Hi"     → string
```

---

## 8. Token Classes

Common token classes include:

```text
keyword
identifier
string
number
comment
operator
type
constant
variable
attribute
delimiter
```

- These token classes describe what each part of the source code represents.
- Monaco's theme can use these token classifications for syntax highlighting.

---

## 9. States

Tokenizer rules can be organized into states.

Example:

```javascript
tokenizer: {
    root: [
        // normal code
    ],

    string: [
        // string rules
    ],

    comment: [
        // comment rules
    ]
}
```

- A state represents the current context while Monarch is reading code.
- For example, normal code and the inside of a string can have different rules.

Simple flow:

```text
Normal Code
    ↓
"Hello
    ↓
String State
    ↓
Hello
    ↓
"
    ↓
Back to Normal Code
```

---

## 10. Rules

A Monarch rule normally contains:

```text
[regular expression, action]
```

Example:

```javascript
[/\d+/, "number"]
```

- The regular expression finds the pattern.
- The action assigns the token type.

For example:

```text
123 → number
```

---

## 11. Regular Expressions

Monarch uses regular expressions to recognize patterns.

Example:

```javascript
/\d+/
```

- This can match one or more digits.

Example:

```javascript
/"[^"]*"/
```

- This can match text inside double quotes.

So:

```javascript
"Hello"
```

can be identified as a string.

---

## 12. Actions

An action tells Monarch what to do after a pattern is matched.

Example:

```javascript
[/return/, "keyword"]
```

Here:

```text
/return/ → pattern
keyword  → token/action
```

So:

```text
return → keyword
```

---

## 13. Keywords

Keywords can be listed:

```javascript
keywords: [
    "if",
    "else",
    "for",
    "while",
    "return",
    "function"
]
```

- These are reserved or special words in the language definition.
- The tokenizer can check matched words against this list.

Example:

```javascript
return name;
```

Result:

```text
return → keyword
name   → identifier
```

---

## 14. `@keywords`

`@keywords` can be used inside cases.

Example:

```javascript
[
    /[a-zA-Z_$][\w$]*/,
    {
        cases: {
            "@keywords": "keyword",
            "@default": "identifier"
        }
    }
]
```

Meaning:

1. Find a word.
2. Check whether the word exists in the `keywords` list.
3. If it exists, classify it as a `keyword`.
4. Otherwise, classify it as an `identifier`.

Example:

```text
return → keyword
username → identifier
```

---

## 15. `@default`

Example:

```javascript
"@default": "identifier"
```

- If the matched word is not a keyword or another special case, it can be treated as an identifier.

Example:

```javascript
const username = "Srinivas";
```

Possible result:

```text
const     → keyword
username  → identifier
```

---

## 16. Comments

Monarch can define rules for comments.

Single-line example:

```javascript
// Hello
```

Multi-line example:

```javascript
/*
   Hello
*/
```

- These can be assigned the `comment` token class.
- A separate state can be used for multi-line comments.

---

## 17. Strings

Strings can have their own tokenizer state.

Example:

```javascript
"Hello World"
```

- Monarch can enter a string state when it finds the opening quote.
- It processes the contents using string rules.
- When the closing quote is found, it can return to the previous state.

---

## 18. `next`

`next` changes the tokenizer state.

Example:

```javascript
[
    /\/\*/,
    "comment",
    "@comment"
]
```

Simple meaning:

```text
Find /* 
   ↓
Mark it as comment
   ↓
Move to @comment state
```

This is useful when the rest of the text needs different rules.

---

## 19. `@pop`

`@pop` returns to the previous tokenizer state.

Simple flow:

```text
Normal State
    ↓
Comment State
    ↓
Comment ends
    ↓
@pop
    ↓
Normal State
```

This is useful for strings and comments.

---

## 20. Operators

Operators can be defined:

```javascript
operators: [
    "=",
    "+",
    "-",
    "*",
    "/",
    "==",
    "!="
]
```

Example:

```javascript
a + b
```

Possible tokens:

```text
a → identifier
+ → operator
b → identifier
```

---

## 21. Numbers

A simple number rule can be:

```javascript
[/\d+/, "number"]
```

Example:

```javascript
let age = 25;
```

Possible tokens:

```text
let → keyword
age → identifier
=   → operator
25  → number
```

---

## 22. `include`

`include` allows rules from another state to be reused.

Example:

```javascript
{
    include: "@whitespace"
}
```

- This avoids repeating the same rules.
- It helps keep a language definition organized.

---

## 23. Inspect Tokens

Monaco provides a way to inspect how a token was classified.

In Monaco Editor:

```text
F1
 ↓
Developer: Inspect Tokens
```

It can show information about the selected token, including its language and token information.

**Tell sir:**

> Inspect Tokens helps us understand how Monaco interpreted a particular piece of source code.

---

# 24. Complete Example

Here is a small Monarch language definition:

```javascript
return {
    keywords: [
        "if",
        "else",
        "return",
        "function",
        "const"
    ],

    operators: [
        "=",
        "+",
        "-",
        "*",
        "/"
    ],

    tokenizer: {
        root: [
            [
                /[a-zA-Z_$][\w$]*/,
                {
                    cases: {
                        "@keywords": "keyword",
                        "@default": "identifier"
                    }
                }
            ],

            [/\d+/, "number"],

            [/"[^"]*"/, "string"],

            [/[+\-*\/=]/, "operator"]
        ]
    }
};
```

If the editor contains:

```javascript
const name = "Srinivas";
```

Monarch can classify it as:

```text
const      → keyword
name       → identifier
=          → operator
"Srinivas" → string
```

---

# 25. How Monarch Works — Final Story

The complete process is:

```text
1. We define a language
          ↓
2. We define keywords and operators
          ↓
3. We create tokenizer rules
          ↓
4. Tokenizer reads source code
          ↓
5. Regular expressions find patterns
          ↓
6. Actions assign token types
          ↓
7. States handle different contexts
          ↓
8. Monaco receives the token information
          ↓
9. Monaco's theme displays syntax highlighting
```

## Important terms to remember

| Term | Simple meaning |
|---|---|
| Monarch | Tokenizer/language syntax system |
| Language Definition | Rules describing a language |
| Tokenizer | Reads and splits source code into tokens |
| Token | A recognized piece of code |
| Rule | Pattern + action |
| Regex | Pattern used to find text |
| Action | Tells Monarch the token type |
| Keyword | Special language word |
| State | Current parsing context |
| `@keywords` | Checks whether a word is a keyword |
| `@default` | Fallback case |
| `next` | Moves to another state |
| `@pop` | Returns to previous state |
| `include` | Reuses rules |
| Inspect Tokens | Shows how Monaco classified a token |

## Official Reference

https://microsoft.github.io/monaco-editor/monarch-static.html
