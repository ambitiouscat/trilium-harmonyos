import{Et as e,Tt as t,t as n}from"./abstract_provider-C1QZyApg.js";t();var r=class extends n{prepareMeta(){}prepareContent(t,n,r){return r.format===`markdown`&&typeof n==`string`&&(n=this.rewriteFn(n,r),n=e.toMarkdown(n),n.trim().length>0&&!n.startsWith(`# `)&&(n=`\
# ${t}\r
${n}`)),n}afterDone(){}};export{r as default};