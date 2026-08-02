import{a as e,l as t}from"./preact.module.js";import{A as n,o as r}from"./hooks.js";import{a as i}from"./i18n.js";import{a,d as o,i as s,l as c,s as l,t as u}from"./hooks.module.js";import{p as d,t as f}from"./compat.module.js";import{t as p}from"./jsxRuntime.module.js";import{t as m}from"./debounce.js";import{t as h}from"./NoItems.js";d(),o(),t();function g({className:t,title:n,css:i,cssVars:o,bodyClassName:s,children:c}){let d=u(null),[m,h]=l(null),g=r(),v=()=>{let e=d.current?.contentDocument?.body;e&&h(e)};return a(v,[]),a(()=>{let e=m?.ownerDocument;if(!e)return;let t=e.getElementById(`isolated-frame-style`);t||(t=e.createElement(`style`),t.id=`isolated-frame-style`,e.head.appendChild(t)),t.textContent=`:root { color-scheme: ${g}; }\n${_(o)}${i??``}`},[i,o,g,m]),a(()=>{m&&(m.className=s??``)},[s,m]),p(e,{children:[p(`iframe`,{ref:d,className:t,title:n,onLoad:v}),m&&f(c,m)]})}function _(e){if(!e?.length)return``;let t=getComputedStyle(document.documentElement),n=e.map(e=>[e,t.getPropertyValue(e).trim()]).filter(([,e])=>e).map(([e,t])=>`${e}: ${t};`).join(` `);return n?`:root { ${n} }\n`:``}var v=`/*\r
 * Styles for the isolated icon-pack preview iframe. Imported as a raw string (\`?raw\`) and combined\r
 * with the dynamically generated @font-face in IconPack.tsx, then injected into the frame's <head> —\r
 * it is intentionally NOT a side-effect import, so these rules never touch the host document.\r
 *\r
 * The \`.ip-glyph\` font family must match PREVIEW_FONT_FAMILY in IconPackPreview.tsx.\r
 * The CSS variables used here should be present in the PREVIEW_CSS_VARS array in IconPackPreview.tsx.\r
 */\r
\r
html,\r
body {\r
    margin: 0;\r
    height: 100%;\r
    user-select: none;\r
    /* Read-only previews (collection tiles) are clipped; interactive mode scrolls (see below). */\r
    overflow: hidden;\r
}\r
\r
body {\r
    color: var(--main-text-color, #000);\r
    padding: 0;\r
    box-sizing: border-box;\r
}\r
\r
body.interactive {\r
    overflow: auto;\r
    padding: 20px;\r
}\r
\r
.ip-grid {\r
    --icon-size: 24px;\r
    --icon-size-ratio: .85;\r
\r
    display: grid;\r
    grid-template-columns: repeat(auto-fill, var(--icon-size));\r
    gap: 8px;\r
    justify-content: start;\r
}\r
\r
body.interactive .ip-grid {\r
    --icon-size: 48px;\r
    --icon-size-ratio: .75;\r
}\r
\r
.ip-cell {\r
    width: var(--icon-size);\r
    height: var(--icon-size);\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    border-radius: 6px;\r
    cursor: default;\r
    /* Skip layout/paint for off-screen cells so large packs stay responsive. */\r
    content-visibility: auto;\r
    contain-intrinsic-size: var(--icon-size) var(--icon-size);\r
}\r
\r
/* Hover highlight only in interactive mode (off for read-only content-renderer previews). */\r
body.interactive .ip-cell:hover {\r
    background: var(--hover-item-background-color, rgba(127, 127, 127, 0.2));\r
    color: var(--hover-item-text-color);\r
    transform: scale(1.5);\r
    transition: transform 200ms ease-in-out,\r
                background 150ms ease-in-out;\r
}\r
\r
.ip-glyph {\r
    font-family: "tn-icon-pack-preview";\r
    font-size: calc(var(--icon-size) * var(--icon-size-ratio));\r
    line-height: 1;\r
}\r
\r
.ip-count {\r
    display: inline-block;\r
    position: absolute;\r
    right: 0;\r
    bottom: 0;\r
    padding: 4px 8px;\r
    border-radius: 6px;\r
    font-family: sans-serif;\r
    background: var(--accented-background-color, gray);\r
    font-size: .85rem;\r
}\r
\r
body.interactive .ip-count {\r
    position: fixed;\r
    right: 16px;\r
    bottom: 8px;\r
}`;o();var y=1500,b=250,x=[`--main-text-color`,`--hover-item-background-color`,`--hover-item-text-color`,`--accented-background-color`];function S({note:e,content:t,interactive:r=!0}){let[a]=n(e,`iconPack`),o=a??e.getLabelValue(`disabled:iconPack`),c=A(t,y),l=D(e),u=s(()=>w(c),[c]),d=s(()=>k(l),[l]);if(!u.ok)return p(`div`,{className:`icon-pack-preview`,children:p(h,{icon:`bx bx-error-circle`,text:i(`icon_pack.invalid_manifest`)})});if(!c.trim())return p(`div`,{className:`icon-pack-preview`});if(!u.icons.length)return p(`div`,{className:`icon-pack-preview`,children:p(h,{icon:`bx bx-images`,text:i(`icon_pack.no_icons`)})});let f=r?u.icons:u.icons.slice(0,b);return p(g,{className:`icon-pack-frame`,title:i(`icon_pack.preview_title`),css:d,cssVars:x,bodyClassName:r?`interactive`:void 0,children:[p(`div`,{className:`ip-grid`,children:f.map(e=>p(`div`,{className:`ip-cell`,title:r?C(o,e):void 0,children:p(`span`,{className:`ip-glyph`,children:e.glyph})},e.id))}),p(`div`,{className:`ip-count`,children:i(`icon_pack.count`,{count:u.icons.length})})]})}function C(e,t){let n=e?`${e} ${t.id}`:t.id,r=t.glyph.codePointAt(0);return i(`icon_pack.tooltip`,{class:n,code:r==null?``:`\\${r.toString(16)}`,terms:t.terms.join(`, `)})}function w(e){if(!e.trim())return{ok:!0,icons:[]};let t;try{t=JSON.parse(e)}catch{return{ok:!1}}let n=t?.icons;return!n||typeof n!=`object`?{ok:!1}:{ok:!0,icons:Object.entries(n).map(([e,t])=>{let n=t;return{id:e,glyph:typeof n?.glyph==`string`?T(n.glyph):``,terms:Array.isArray(n?.terms)?n.terms.filter(e=>typeof e==`string`):[]}})}}function T(e){let t=e.match(/^\\u?([0-9a-fA-F]{2,6})$/);if(t){let e=parseInt(t[1],16);if(!Number.isNaN(e)&&e<=1114111)return String.fromCodePoint(e)}return e}var E={"font/woff2":`woff2`,"font/woff":`woff`,"font/ttf":`truetype`};function D(e){let[t,n]=l(null);return c(()=>{let t=!1;return e.getAttachmentsByRole(`file`).then(e=>{if(t)return;let r=Object.keys(E).map(t=>e.find(e=>e.mime===t)).find(Boolean);n(r?{url:new URL(`api/attachments/download/${r.attachmentId}`,document.baseURI).href,format:E[r.mime]}:null)}).catch(()=>{t||n(null)}),()=>{t=!0}},[e]),t}var O=`tn-icon-pack-preview`;function k(e){return`${e?`@font-face { font-family: "${O}"; src: url("${e.url}") format("${e.format}"); font-display: block; }`:``}\n${v}`}function A(e,t){let[n,r]=l(e),i=s(()=>m(r,t),[t]);return c(()=>(i(e),i.clear),[e,i]),n}export{w as n,T as r,S as t};