import{o as e}from"./rolldown-runtime-DAXXjFlN.js";import{dr as t,ir as n,r,t as i}from"./abstract_provider-C1QZyApg.js";var a=e(r());t();var o=class extends i{constructor(e,t){super(e),this.navigationMeta=null,this.indexMeta=null,this.cssMeta=null,this.options=t??{}}prepareMeta(e){this.zipExportOptions?.skipExtraFiles||(this.navigationMeta={noImport:!0,dataFileName:`navigation.html`},e.files.push(this.navigationMeta),this.indexMeta={noImport:!0,dataFileName:`index.html`},e.files.push(this.indexMeta),this.cssMeta={noImport:!0,dataFileName:`style.css`},e.files.push(this.cssMeta))}prepareContent(e,t,r){if(r.format===`html`&&typeof t==`string`){if(!t.substr(0,100).toLowerCase().includes(`<html`)&&!this.zipExportOptions?.skipHtmlTemplate){if(!r?.notePath?.length)throw Error(`Missing note path.`);let i=`${`../`.repeat(r.notePath.length-1)}style.css`,a=n(e);t=`<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="${i}">
    <base target="_parent">
    <title data-trilium-title>${a}</title>
</head>
<body>
    <div class="content">
    <h1 data-trilium-h1>${a}</h1>

    <div class="ck-content">${t}</div>
    </div>
</body>
</html>`}return t.length<1e5&&(t=a.default.prettyPrint(t,{indent_size:2})),t=this.rewriteFn(t,r),t}return t}afterDone(e){if(!this.zipExportOptions?.skipExtraFiles){if(!this.navigationMeta||!this.indexMeta||!this.cssMeta)throw Error(`Missing meta.`);this.#t(e,this.navigationMeta),this.#n(e,this.indexMeta),this.#r(e,this.cssMeta)}}#e(e,t){let r=`<li>`,i=n(`${t.prefix?`${t.prefix} - `:``}${t.title}`);if(t.dataFileName&&t.noteId){let n=this.getNoteTargetUrl(t.noteId,e);r+=`<a href="${n}" target="detail">${i}</a>`}else r+=i;if(t.children&&t.children.length>0){r+=`<ul>`;for(let n of t.children)r+=this.#e(e,n);r+=`</ul>`}return`${r}</li>`}#t(e,t){if(!t.dataFileName)return;let n=`<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <ul>${this.#e(e,e)}</ul>
    </body>
    </html>`,r=n.length<1e5?a.default.prettyPrint(n,{indent_size:2}):n;this.archive.append(r,{name:t.dataFileName})}#n(e,t){let n,r=e;if(!t.dataFileName)return;for(;!n&&(r.dataFileName&&r.noteId&&(n=this.getNoteTargetUrl(r.noteId,e)),r.children&&r.children.length>0);)r=r.children[0];let i=`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<frameset cols="25%,75%">
    <frame name="navigation" src="navigation.html">
    <frame name="detail" src="${n}">
</frameset>
</html>`;this.archive.append(i,{name:t.dataFileName})}#r(e,t){t.dataFileName&&this.options.contentCss&&this.archive.append(this.options.contentCss,{name:t.dataFileName})}};export{o as default};