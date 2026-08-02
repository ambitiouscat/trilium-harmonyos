async function e(e,t){switch(e){case`html`:{let{default:e}=await import(`./html-TdbfMSHl.js`);return new e(t,{contentCss:`@import "ckeditor5/ckeditor5-content.css";\r
\r
.printed-content .ck-widget__selection-handle, .printed-content .ck-widget__type-around { /* gets rid of triangles: https://github.com/zadam/trilium/issues/1129 */\r
    display: none;\r
}\r
\r
.page-break {\r
    page-break-after: always;\r
}\r
\r
.printed-content .page-break:after,\r
.printed-content .page-break > * {\r
    display: none !important;\r
}\r
\r
.ck-content li p {\r
    margin: 0 !important;\r
}\r
\r
.admonition {\r
    --accent-color: var(--card-border-color);\r
    border: 1px solid var(--accent-color);\r
    box-shadow: var(--card-box-shadow);\r
    background: var(--card-background-color);\r
    border-radius: 0.5em;\r
    padding: 1em;\r
    margin: 1.25em 0;\r
    position: relative;\r
    padding-inline-start: 2.5em;\r
    overflow: hidden;\r
}\r
\r
.admonition p:last-child {\r
    margin-bottom: 0;\r
}\r
\r
.admonition p, h2 {\r
    margin-top: 0;\r
}\r
\r
.admonition.note { --accent-color: #69c7ff; }\r
.admonition.tip { --accent-color: #40c025; }\r
.admonition.important { --accent-color: #9839f7; }\r
.admonition.caution { --accent-color: #ff2e2e; }\r
.admonition.warning { --accent-color: #e2aa03; }\r
\r
.admonition::before {\r
    color: var(--accent-color);\r
    font-family: boxicons !important;\r
    position: absolute;\r
    top: 1em;\r
    inset-inline-start: 1em;\r
}\r
\r
.admonition.note::before { content: "\\eb21"; }\r
.admonition.tip::before { content: "\\ea0d"; }\r
.admonition.important::before { content: "\\ea7c"; }\r
.admonition.caution::before { content: "\\eac7"; }\r
.admonition.warning::before { content: "\\eac5"; }`})}case`markdown`:{let{default:e}=await import(`./markdown-C8VLA1Ol.js`);return new e(t)}default:throw Error(`Unsupported export format: '${e}'`)}}export{e as standaloneZipExportProviderFactory};