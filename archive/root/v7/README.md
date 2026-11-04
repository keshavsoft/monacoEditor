# 🚀 Monaco Editor v7 - byExtension Architecture & Settings Suite

> **Modular Multi-Extension Monaco Editor Workspace with Live Babel AST Mouse Hover Error Tooltips, Dedicated Settings Page & How to Use Guide**

---

## 🌟 Key Architecture & Features in v7

- **📁 `byExtension` Directory Structure**: Dedicated subfolders for each supported file extension (`jsFiles/`, `htmlFiles/`).
- **🛡️ Babel AST Error Parsing**: Integrated `@babel/standalone` CDN with `errorRecovery: true`.
- **🔍 Red Squiggly Lines & Mouse Hover Tooltips**: Uses `monaco.editor.setModelMarkers(model, "babel", markers)` to render error tooltips on hover.
- **⚙️ Dedicated Settings Page (`settings.html`)**: Allows configuring Font Size, Font Family, Tab Size, Word Wrap, Line Numbers, Minimap, Themes, and Code Assistance.
- **💾 LocalStorage Preferences Persistence**: Automatically loads user preferences into Monaco Editor on initialization.
- **📊 Live HTML Statistics Counter**: Real-time counting of `IDs`, `Classes`, and `HTML Tags` in footer statusbar.
- **📖 Dedicated User Guide (`howToUse.html`)**: Comprehensive guide with keyboard shortcuts and feature overviews.

---

## 📂 Version 7 Project Directory Map

```text
v7/
├── index.html                       # Master byExtension Portal Hub
├── README.md                        # Complete Technical Documentation for v7
├── style.css                        # Modern Dark Theme Stylesheet
├── jsFiles/
│   ├── index.html                   # Dedicated JS Editor (Monaco + Babel AST Error Markers)
│   ├── app.js                       # JS Application Logic & setModelMarkers Parser
│   ├── settings.html                # Dedicated JS Editor Settings Page
│   └── howToUse.html                # JS Editor User Guide & Shortcuts
└── htmlFiles/
    ├── index.html                   # Dedicated HTML Editor (Monaco + Live HTML Stats)
    ├── app.js                       # HTML Application Logic & Regex Counter
    ├── settings.html                # Dedicated HTML Editor Settings Page
    └── howToUse.html                # HTML Editor User Guide & Shortcuts
```

---

## 🧪 Testing Version 7

1. Start HTTP server on port 3004:
   ```bash
   python -m http.server 3004
   ```
2. Portal Hub: `http://localhost:3004/index.html`
3. JS Editor: `http://localhost:3004/jsFiles/index.html`
4. HTML Editor: `http://localhost:3004/htmlFiles/index.html`
