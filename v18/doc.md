### Points to Explain

1. File Identification: We identify the uploaded file based on its extension and dynamically set Monaco's language.

2. Minimap: We disabled the Monaco minimap using minimap: { enabled: false }.

3. Screen Size: The Monaco editor takes its size from the #editor HTML container, so we control the required width and height through CSS. automaticLayout: true makes Monaco adjust when the container changes size.