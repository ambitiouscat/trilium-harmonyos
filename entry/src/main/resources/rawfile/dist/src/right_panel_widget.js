import{tt as e}from"./hooks.js";var t=`
<div class="card widget">
    <div class="card-header">
        <div class="card-header-title"></div>
        <div class="card-header-buttons"></div>
    </div>

    <div id="[to be set]" class="body-wrapper">
        <div class="card-body"></div>
    </div>
</div>`,n=class extends e{$bodyWrapper;$body;$title;$buttons;get widgetTitle(){return`Untitled widget`}get widgetButtons(){return[]}get help(){return{}}constructor(){super(),this.child(...this.widgetButtons)}doRender(){this.$widget=$(t),this.contentSized(),this.$widget.find(`[data-target]`).attr(`data-target`,`#${this.componentId}`),this.$bodyWrapper=this.$widget.find(`.body-wrapper`),this.$bodyWrapper.attr(`id`,this.componentId),this.$body=this.$bodyWrapper.find(`.card-body`),this.$title=this.$widget.find(`.card-header .card-header-title`),this.$title.text(this.widgetTitle),this.$buttons=this.$widget.find(`.card-header .card-header-buttons`),this.$buttons.empty();for(let e of this.children)this.$buttons.append(e.render());let e=this.doRenderBody();typeof e==`object`&&`catch`in e?this.initialized=e.catch(e=>{this.logRenderingError(e)}):this.initialized=Promise.resolve()}doRenderBody(){}};export{n as t};