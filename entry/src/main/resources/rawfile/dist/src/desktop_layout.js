const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./src5.js","./src4.js","./rolldown-runtime.js","./preload-helper.js","./src.js","./task_states.js","./dayjs.min.js","./isoWeek.js","./bootstrap.esm.js","./src.css","./EditableText.js","./preact.module.js","./app_context.js","./i18n.js","./theme.js","./hooks.module.js","./server.js","./toast.js","./jsxRuntime.module.js","./react_utils2.js","./options2.js","./purify.es.js","./app_context.css","./utils.js","./hooks.js","./compat.module.js","./mark2.js","./note_autocomplete.js","./debounce.js","./utils3.js","./task_states2.js","./sample_diagrams.js","./EditableText.css","./SidebarChat.js","./ActionButton.js","./Dropdown.js","./modal_focustrap.js","./FormList.js","./FormToggle.js","./FormToggle.css","./Icon.js","./FormList.css","./formatters.js","./RightPanelWidget.js","./ChatReadOnlyNotice.js","./Button.js","./shortcut_kbd.js","./NoItems.js","./NoItems.css","./CKEditor.js","./ChatMessage.js","./Trans.js","./context.js","./NoteLink.js","./libesm.js","./markdown_renderer.js","./ReadOnlyText.js","./RawHtml.js","./math.js","./math.css","./ReadOnlyText.css","./ChatMessage.css","./MarkdownCommons.css","./AddProviderModal.js","./Modal.js","./Modal.css","./Card.js","./Card.css","./FormTextBox.js","./Badge.js","./Badge.css","./OptionsRow.js","./OptionsRow.css","./FormCheckbox.js","./SelectableCard.js","./SelectableCard.css","./AddProviderModal.css","./ChatReadOnlyNotice.css","./SidebarChat.css","./math2.js","./Ribbon.js","./NoteActions.js","./bulk_action.js","./FormSelect.js","./NoteAutocomplete.js","./experimental_features2.js","./ribbon-interface.js","./split_editor_mode.js","./FormDropdownList.js","./note_types.js","./i18n2.js","./syntax_highlighting.js","./syntax_highlighting2.js","./OptionsSection.js","./OptionsSection.css","./FormText.js","./i18n.css","./ribbon-interface.css","./LinkButton.js","./LoadingSpinner.js","./Admonition.js","./Admonition.css","./FormTextArea.js","./attribute_detail.js","./values_input.js","./values_input.css","./attribute_detail.css","./AttributeHelp.js","./AttributeHelp.css","./FormFileUpload.js","./NoteActions.css","./NoteMap.js","./Slider.js","./src3.js","./ordinal.js","./init.js","./min.js","./isObject.js","./debounce2.js","./now.js","./colors.js","./NoteMap2.css","./Ribbon.css"])))=>i.map(i=>d[i]);
import{o as e,t}from"./rolldown-runtime.js";import{t as n}from"./preload-helper.js";import{a as r,l as i}from"./preact.module.js";import{a}from"./src.js";import{It as o,Kt as s,Rt as c,ct as l,dt as u,n as d,vt as f,wt as p,y as m,yt as h}from"./app_context.js";import{F as g,G as _,H as v,O as y,Q as ee,S as te,X as ne,Y as re,b as ie,c as ae,m as b,n as x,q as S,rt as C,tt as oe,v as se,w as ce}from"./hooks.js";import{r as w}from"./bootstrap.esm.js";import{L as T,N as le,S as ue,T as de,U as E,a as D,b as fe}from"./i18n.js";import{a as pe,d as O,f as k,i as me,l as A,s as j,t as M}from"./hooks.module.js";import{p as he,t as ge}from"./compat.module.js";import{t as _e}from"./server.js";import{t as N}from"./jsxRuntime.module.js";import{t as P}from"./options2.js";import{t as F}from"./purify.es.js";import{i as ve}from"./experimental_features2.js";import{t as I}from"./ActionButton.js";import{C as ye,S as be,T as xe,o as Se,t as Ce,w as we,x as L}from"./NoteActions.js";import{i as Te}from"./color_scheme.js";import{t as R}from"./Icon.js";import{_ as Ee,a as De,c as Oe,d as ke,f as Ae,g as je,h as Me,l as Ne,m as Pe,n as Fe,p as Ie,r as Le,s as Re,t as ze,u as Be,v as Ve}from"./layout_commons.js";import{n as He,t as Ue}from"./resizer.js";import{r as We}from"./NoteList.js";import{t as Ge}from"./Modal.js";import{t as Ke}from"./Button.js";import{a as qe,c as Je,d as Ye,f as Xe,i as Ze,l as Qe,u as $e}from"./PopupEditor.js";import{g as et,n as tt}from"./ribbon-interface.js";import{t as z}from"./RawHtml.js";import{t as B}from"./right_panel_widget.js";import{t as nt}from"./react-window.js";import{t as rt}from"./NoteDetail.js";import{t as it}from"./NoItems.js";import{t as at}from"./note_tree.js";import{t as ot}from"./AttributeList.js";import{n as V,t as st}from"./RightPanelWidget.js";import{t as ct}from"./highlights_list_options.js";O(),i();function lt(){let{note:e,noteId:t}=y(),[n,i]=j();S(`apiLogMessages`,({messages:e,noteId:n})=>{n===t&&i(e)}),A(()=>i(void 0),[e]);let a=e?.mime.startsWith(`application/javascript;env=`)&&n?.length;return N(`div`,{className:`api-log-widget ${a?``:`hidden-ext`}`,children:a&&N(r,{children:[N(I,{icon:`bx bx-x`,className:`close-api-log-button`,text:D(`api_log.close`),onClick:()=>i(void 0)}),N(`div`,{className:`api-log-container`,children:n.join(`
`)})]})})}O();function ut({isHorizontalLayout:e}){let[t,n]=j(P.is(`leftPaneVisible`));return S(`setLeftPaneVisibility`,({leftPaneVisible:e})=>{n(e??!t)}),A(()=>{Ue.setupLeftPaneResizer(t)},[t]),N(I,{className:`${e?`toggle-button`:`launcher-button`} left-pane-toggle-button ${t?`action-collapse`:`action-expand`}`,text:D(t?`left_pane_toggle.hide_panel`:`left_pane_toggle.show_panel`),triggerCommand:t?`hideLeftPane`:`showLeftPane`,icon:e?`bx bx-sidebar`:`bx bx-chevrons-left`,onContextMenu:Ve})}O();function H(){let[e,t]=j(P.is(`rightPaneVisible`));return S(`toggleRightPane`,k(()=>{t(e=>!e)},[])),N(I,{className:s(`toggle-button right-pane-toggle-button bx-flip-horizontal`,e?`action-collapse`:`action-expand`),text:D(`right_pane.toggle`),icon:`bx bx-sidebar`,triggerCommand:`toggleRightPane`})}var dt=class extends be{noteContext;thisElement;parentElement;resizeObserver;currentHeight=0;currentSafeMargin=NaN;constructor(){super(),this.class(`content-header-widget`),this.css(`contain`,`unset`),this.resizeObserver=new ResizeObserver(this.onResize.bind(this))}setNoteContextEvent({noteContext:e}){this.noteContext=e,this.init()}init(){if(this.parentElement=this.parent?.$widget.get(0),!this.parentElement){console.warn(`No parent set for <ContentHeader>.`);return}this.thisElement=this.$widget.get(0),this.resizeObserver.observe(this.thisElement),this.parentElement.addEventListener(`scroll`,this.updateSafeMargin.bind(this))}updateSafeMargin(){let e=Math.max(this.currentHeight-this.parentElement.scrollTop,0);e!==this.currentSafeMargin&&(this.currentSafeMargin=e,this.triggerEvent(`contentSafeMarginChanged`,{top:e,noteContext:this.noteContext}))}onResize(e){for(let t of e)t.target===this.thisElement&&(this.currentHeight=t.contentRect.height,this.updateSafeMargin())}},ft=class extends L{currentLeftPaneVisible;constructor(){super(`column`),this.currentLeftPaneVisible=P.is(`leftPaneVisible`),this.id(`left-pane`),this.css(`height`,`100%`),this.collapsible()}isEnabled(){return super.isEnabled()&&this.currentLeftPaneVisible}setLeftPaneVisibilityEvent({leftPaneVisible:e}){this.currentLeftPaneVisible=e??!this.currentLeftPaneVisible;let t=this.isEnabled();if(this.toggleInt(t),this.parent?.$widget.toggleClass(`left-pane-hidden`,!t),t)this.triggerEvent(`focusTree`,{});else{let e=d.tabManager.getActiveContext()?.ntxId;document.querySelector(`.note-split[data-ntx-id="${e}"]`)?.contains(document.activeElement)||this.triggerEvent(`focusOnDetail`,{ntxId:e})}P.save(`leftPaneVisible`,this.currentLeftPaneVisible.toString())}},pt=class extends L{rightPaneHidden;firstRender;constructor(){super(`column`),this.id(`right-pane`),this.css(`height`,`100%`),this.collapsible(),this.rightPaneHidden=!1,this.firstRender=!0}isEnabled(){return super.isEnabled()&&!this.rightPaneHidden&&this.children.length>0&&!!this.children.find(e=>e.isEnabled()&&e.canBeShown())}async handleEventInChildren(e,t){let n=super.handleEventInChildren(e,t);return[`activeContextChanged`,`noteSwitchedAndActivated`,`noteSwitched`].includes(e)&&(n?n.then(()=>this.reEvaluateRightPaneVisibilityCommand()):this.reEvaluateRightPaneVisibilityCommand()),n}reEvaluateRightPaneVisibilityCommand(){let e=!this.isHiddenInt(),t=this.isEnabled();(e!==t||this.firstRender)&&(this.toggleInt(t),Ue.setupRightPaneResizer(),this.firstRender=!1)}toggleRightPaneEvent(){this.rightPaneHidden=!this.rightPaneHidden,this.reEvaluateRightPaneVisibilityCommand()}};O();function mt(){let[e,t]=j(!1);return S(`showPasswordNotSet`,()=>t(!0)),N(Ge,{size:`md`,className:`password-not-set-dialog`,title:D(`password_not_set.title`),footer:N(Ke,{icon:`bx bx-lock`,text:D(`password_not_set.go_to_password_options`),onClick:()=>{t(!1),d.triggerCommand(`showOptions`,{section:`_optionsPassword`})}}),onHidden:()=>t(!1),show:e,children:[N(`p`,{children:D(`password_not_set.body1`)}),N(`p`,{children:D(`password_not_set.body2`)})]})}var ht=`<button class="button-widget bx"
      data-bs-toggle="tooltip"
      title=""></button>`,gt=class extends oe{settings;tooltip;isEnabled(){return!0}doRender(){this.$widget=$(ht),this.tooltip=new w(this.$widget[0],{html:!0,title:()=>this.getTitle()||``,trigger:`hover`,placement:ue(this.settings.titlePlacement),fallbackPlacements:[ue(this.settings.titlePlacement)]}),this.settings.onContextMenu&&this.$widget.on(`contextmenu`,e=>(this.tooltip.hide(),this.settings.onContextMenu&&this.settings.onContextMenu(e),!1)),super.doRender()}getTitle(){return typeof this.settings.title==`function`?this.settings.title():this.settings.title}refreshIcon(){for(let e of this.$widget[0].classList)e.startsWith(`bx-`)&&this.$widget.removeClass(e);let e=typeof this.settings.icon==`function`?this.settings.icon():this.settings.icon;e&&this.$widget.addClass(e)}initialRenderCompleteEvent(){this.refreshIcon()}icon(e){return this.settings.icon=e,this}title(e){return this.settings.title=e,this}titlePlacement(e){return this.settings.titlePlacement=e,this}onContextMenu(e){return this.settings.onContextMenu=e,this}},U=class extends gt{constructor(){super(),this.settings={titlePlacement:`right`,title:null,icon:null,onContextMenu:null}}doRender(){super.doRender(),this.settings.onClick?this.$widget.on(`click`,e=>{this.$widget.tooltip(`hide`),this.settings.onClick&&this.settings.onClick(this,e)}):console.warn(D(`onclick_button.no_click_handler`,{componentId:this.componentId}),this.settings),this.settings.onAuxClick&&this.$widget.on(`auxclick`,e=>{this.$widget.tooltip(`hide`),this.settings.onAuxClick&&this.settings.onAuxClick(this,e)})}onClick(e){return this.settings.onClick=e,this}onAuxClick(e){return this.settings.onAuxClick=e,this}},_t={USE_PROFILES:{html:!0,mathMl:!0},FORBID_TAGS:`script.style.iframe.object.embed.link.meta.base.noscript.template.form.input.textarea.button.select.option.div.p.h1.h2.h3.h4.h5.h6.blockquote.pre.section.article.aside.nav.header.footer.main.figure.figcaption.table.thead.tbody.tfoot.tr.th.td.ul.ol.li.dl.dt.dd.hr.img.video.audio.picture.canvas.svg.foreignObject`.split(`.`),FORBID_ATTR:[`onerror`,`onload`,`onclick`,`onmouseover`,`onfocus`,`onblur`,`onsubmit`,`onreset`,`onchange`,`oninput`,`onkeydown`,`onkeyup`,`onkeypress`],RETURN_DOM:!1,RETURN_DOM_FRAGMENT:!1},vt=`<div class="highlights-list-widget">
    <style>
        .highlights-list-widget {
            padding: 10px;
            contain: none;
            overflow: auto;
            position: relative;
        }

        .highlights-list > ol {
            padding-inline-start: 20px;
        }

        .highlights-list li {
            cursor: pointer;
            margin-bottom: 3px;
            text-align: justify;
            word-wrap: break-word;
            hyphens: auto;
        }

        .highlights-list li:hover {
            font-weight: bold;
        }
    </style>

    <span class="highlights-list"></span>
</div>`,yt=class extends B{$highlightsList;get widgetTitle(){return D(`highlights_list_2.title`)}get widgetButtons(){return[new U().icon(`bx-cog`).title(D(`highlights_list_2.options`)).titlePlacement(`left`).onClick(()=>d.tabManager.openContextWithNote(`_optionsTextNotes`,{activate:!0})).class(`icon-action`),new U().icon(`bx-x`).titlePlacement(`left`).onClick(e=>e.triggerCommand(`closeHlt`)).class(`icon-action`)]}isEnabled(){return super.isEnabled()&&this.note!=null&&this.note.type===`text`&&!this.noteContext?.viewScope?.highlightsListTemporarilyHidden&&this.noteContext?.viewScope?.viewMode==="default"}async doRenderBody(){this.$body.empty().append($(vt)),this.$highlightsList=this.$body.find(`.highlights-list`)}async refreshWithNote(e){this.noteContext?.viewScope?.highlightsListPreviousVisible?this.toggleInt(!0):this.toggleInt(!1);let t=JSON.parse(P.get(`highlightsList`));if(e?.isLabelTruthy(`hideHighlightWidget`)||!t.length){this.toggleInt(!1),this.triggerCommand(`reEvaluateRightPaneVisibility`);return}let n=null,r=-1;if(e&&this.note?.type===`text`){let i=await e.getNoteComplement();i&&`content`in i&&({$highlightsList:n,hlLiCount:r}=await this.getHighlightList(i.content,t))}this.$highlightsList.empty(),n&&this.$highlightsList.append(n),r>0?(this.toggleInt(!0),this.noteContext?.viewScope&&(this.noteContext.viewScope.highlightsListPreviousVisible=!0)):(this.toggleInt(!1),this.noteContext?.viewScope&&(this.noteContext.viewScope.highlightsListPreviousVisible=!1)),this.triggerCommand(`reEvaluateRightPaneVisibility`)}async getHighlightList(e,t){let n=/<span[^>]*style\s*=\s*[^>]*background-color:[^>]*?>[\s\S]*?<\/span>/gi,r=/<span[^>]*style\s*=\s*[^>]*[^-]color:[^>]*?>[\s\S]*?<\/span>/gi,i=/(<i>[\s\S]*?<\/i>|<em>[\s\S]*?<\/em>)/gi,a=/<strong>[\s\S]*?<\/strong>/gi,o=/<u>[\s\S]*?<\/u>/g,s=``,c=``;t.includes(`bgColor`)&&(s+=`,span[style*="background-color"]:not(section.include-note span[style*="background-color"])`,c+=`|${n.source}`),t.includes(`color`)&&(s+=`,span[style*="color"]:not(section.include-note span[style*="color"])`,c+=`|${r.source}`),t.includes(`italic`)&&(s+=`,i:not(section.include-note i)`,s+=`,em:not(section.include-note em)`,c+=`|${i.source}`),t.includes(`bold`)&&(s+=`,strong:not(section.include-note strong)`,c+=`|${a.source}`),t.includes(`underline`)&&(s+=`,u:not(section.include-note u)`,c+=`|${o.source}`),s=s.substring(1),c=`(${c.substring(1)})`;let l=new RegExp(c,`gi`),u=$(`<ol>`),d=-1,f=0;for(let t=null,n=0;(t=l.exec(e))!==null;n++){let e=t[0],r=t.index,i=l.lastIndex;if(!e.startsWith(`<strong><a href="#fnref`)){if(d!==-1&&r===d)u.children().last().append(F.sanitize(e,_t));else if($(e).text().trim())u.append($(`<li>`).html(F.sanitize(e,_t)).on(`click`,()=>this.jumpToHighlightsList(s,n))),f++;else continue;d=i}}return{$highlightsList:u,hlLiCount:f,findSubStr:s}}async jumpToHighlightsList(e,t){if(!this.noteContext)return;let n=await this.noteContext.isReadOnly(),r;if(n){let t=await this.noteContext.getContentElement();t&&(r=t.find(e).filter(function(){if(e.indexOf(`color`)>=0&&e.indexOf(`background-color`)<0){let e=this.style.color;return!($(this).prop(`tagName`)===`SPAN`&&e===``)}return!0}).filter(function(){let t=$(this);return t.parent(e).length===0&&t.parent().parent(e).length===0&&t.parent().parent().parent(e).length===0&&t.parent().parent().parent().parent(e).length===0}))}else{let t=(await this.noteContext.getTextEditor())?.editing.view.domRoots.values().next().value;t&&(r=$(t).find(e).filter(function(){let t=$(this);if(e.indexOf(`color`)>=0&&e.indexOf(`background-color`)<0){let e=this.style.color;return!(t.prop(`tagName`)===`SPAN`&&e===``)}return!0}).filter(function(){let t=$(this);return t.parent(e).length===0&&t.parent().parent(e).length===0&&t.parent().parent().parent(e).length===0&&t.parent().parent().parent().parent(e).length===0}))}r&&r[t]?r[t].scrollIntoView({behavior:`smooth`,block:`center`}):console.warn(`Unable to find the target element in the highlights list.`)}async closeHltCommand(){this.noteContext?.viewScope&&(this.noteContext.viewScope.highlightsListTemporarilyHidden=!0),await this.refresh(),this.triggerCommand(`reEvaluateRightPaneVisibility`),d.triggerEvent(`reEvaluateHighlightsListWidgetVisibility`,{noteId:this.noteId})}async showHighlightsListWidgetEvent({noteId:e}){this.noteId===e&&(await this.refresh(),this.triggerCommand(`reEvaluateRightPaneVisibility`),d.triggerEvent(`reEvaluateHighlightsListWidgetVisibility`,{noteId:this.noteId}))}async entitiesReloadedEvent({loadResults:e}){(this.noteId&&e.isNoteContentReloaded(this.noteId)||e.getAttributeRows().find(e=>e.type===`label`&&(e.name?.toLowerCase().includes(`readonly`)||e.name===`hideHighlightWidget`)&&C.isAffecting(e,this.note)))&&await this.refresh()}};O();function bt({loader:e}){let[t,n]=j(null);return A(()=>{let t=!1;return e().then(({default:e})=>{t||n(()=>e)}),()=>{t=!0}},[]),N(`div`,{className:`lazy-component`,children:t&&N(t,{})})}O();function xt(e,t){switch(t){case`togglePeek`:return e===`closed`?`peek`:`closed`;case`toggleDocked`:return e===`closed`?`docked`:`closed`;case`dock`:return`docked`;case`close`:return`closed`;case`dismiss`:return`closed`}}function St(e,t){return e===`docked`==(t===`docked`)?null:t===`docked`}function Ct(e){let[{mode:t,mounted:n},r]=j(()=>{let t=P.is(e);return{mode:t?`docked`:`closed`,mounted:t}}),i=k(e=>{r(t=>{let n=xt(t.mode,e),r;return r=n===`closed`?e===`togglePeek`||e===`dismiss`?t.mounted:!1:!0,{mode:n,mounted:r}})},[]),a=M(t);A(()=>{let n=a.current;if(n!==t){let r=St(n,t);r!==null&&P.save(e,r.toString()),a.current=t}},[t,e]);let o=k(()=>i(`togglePeek`),[i]),s=k(()=>i(`toggleDocked`),[i]),c=k(()=>i(`dock`),[i]),l=k(()=>i(`close`),[i]),u=k(()=>i(`dismiss`),[i]);return{mode:t,visible:t!==`closed`,mounted:n,togglePeek:o,toggleDocked:s,dock:c,close:l,dismiss:u}}var wt=`.gutter, .dropdown-menu, .tooltip, .modal, .modal-backdrop, .popover, .ck-balloon-panel, .ck-body, .flatpickr-calendar, .attr-detail, #context-menu-container, .form-autocomplete-dropdown, .aa-dropdown-menu`;function Tt(e,t){return e instanceof Element&&e.closest(t)!==null}function Et(e,t,{keepOpenSelector:n,focusSelector:r}){A(()=>{if(!e)return;let i=`${n}, ${wt}`,a=e=>{Tt(e.target,i)||t()},o=e=>{e.key===`Escape`&&!e.defaultPrevented&&(t(),r&&document.querySelector(r)?.focus())};return document.addEventListener(`pointerdown`,a,!0),document.addEventListener(`keydown`,o),()=>{document.removeEventListener(`pointerdown`,a,!0),document.removeEventListener(`keydown`,o)}},[e,t,n,r])}function Dt(){let e=b(`chatHighlights`),t=e?.highlights??[];return N(V,{id:`chat-highlights`,title:D(`llm_chat.highlights_title`,{count:t.length}),grow:!0,children:N(`div`,{className:`chat-highlights-list`,children:t.length>0?N(`ol`,{children:t.map(t=>N(`li`,{children:[N(`span`,{className:`chat-highlight-text`,role:`button`,tabIndex:0,onClick:()=>e?.scrollToHighlight(t.id),onKeyDown:n=>{(n.key===`Enter`||n.key===` `)&&(n.preventDefault(),e?.scrollToHighlight(t.id))},children:t.text}),N(I,{className:`chat-highlight-remove`,icon:`bx bx-x`,text:D(`llm_chat.highlight_remove`),onClick:n=>{n.stopPropagation(),(async()=>{await h.confirm(D(`llm_chat.highlight_remove_confirm`))&&e?.removeHighlight(t.id)})()}})]},t.id))}):N(`div`,{className:`no-highlights`,children:D(`llm_chat.highlights_empty`)})})})}he(),O(),i();function Ot(){let{note:e,noteContext:t}=x(),n=g(e,`type`),{isReadOnly:i}=se(e,t);return N(r,{children:[n===`text`&&i&&N(Pt,{}),n===`text`&&!i&&N(Mt,{})]})}function kt({shown:e,setShown:t}){return N(Ge,{className:`highlights-list-options-modal`,size:`md`,title:D(`highlights_list_2.modal_title`),show:e,onHidden:()=>t(!1),children:N(ct,{})})}function At({highlights:e,scrollToHighlight:t}){let[n]=ee(`highlightsList`),i=new Set(n||[]),a=e.filter(e=>{let{attrs:t}=e;return i.has(`bold`)&&t.bold||i.has(`italic`)&&t.italic||i.has(`underline`)&&t.underline||i.has(`color`)&&!!t.color||i.has(`bgColor`)&&!!t.background}),[o,s]=j(!1);return N(r,{children:[N(V,{id:`highlights`,title:D(`highlights_list_2.title_with_count`,{count:a.length}),contextMenuItems:[{title:D(`highlights_list_2.menu_configure`),uiIcon:`bx bx-cog`,handler:()=>s(!0)}],grow:!0,children:N(`span`,{className:`highlights-list`,children:a.length>0?N(`ol`,{children:a.map(e=>N(jt,{highlight:e,onClick:()=>t(e)},e.id))}):N(`div`,{className:`no-highlights`,children:D(`highlights_list_2.no_highlights`)})})}),ge(N(kt,{shown:o,setShown:s}),document.body)]})}function jt({highlight:e,onClick:t}){let n=M(null);return ce(n,[e.text]),N(`li`,{onClick:t,children:N(z,{containerRef:n,style:{fontWeight:e.attrs.bold?`700`:void 0,fontStyle:e.attrs.italic?`italic`:void 0,textDecoration:e.attrs.underline?`underline`:void 0,color:e.attrs.color,backgroundColor:e.attrs.background},html:e.text})})}function Mt(){let{note:e,noteContext:t}=x(),n=_(t),[r,i]=j([]);return A(()=>{if(!n)return;i(Nt(n));let e=()=>{n.model.document.differ.getChanges().some(e=>e.type===`insert`||e.type===`remove`||e.type===`attribute`&&(e.attributeKey===`bold`||e.attributeKey===`italic`||e.attributeKey===`underline`||e.attributeKey===`fontColor`||e.attributeKey===`fontBackgroundColor`))&&i(Nt(n))};return n.model.document.on(`change:data`,e),()=>n.model.document.off(`change:data`,e)},[n,e]),N(At,{highlights:r,scrollToHighlight:k(e=>{if(!n)return;let t=n.model.createPositionAt(e.textNode,`before`),r=n.editing.mapper.toViewPosition(t),i=n.editing.view.domConverter.viewPositionToDom(r);i&&(i.parent instanceof HTMLElement?i.parent.scrollIntoView():i.parent instanceof Text&&i.parent.parentElement?.scrollIntoView())},[n])})}function Nt(e){let t=[],n=e.model.document.getRoot();if(!n)return[];for(let{item:r}of e.model.createRangeIn(n).getWalker({ignoreElementEnd:!0})){if(!r.is(`$textProxy`)||!r.data.trim())continue;let n={bold:r.hasAttribute(`bold`),italic:r.hasAttribute(`italic`),underline:r.hasAttribute(`underline`),color:r.getAttribute(`fontColor`),background:r.getAttribute(`fontBackgroundColor`)};if(Object.values(n).some(Boolean)){let i=r.data;try{let t=e.model.createPositionAt(r.textNode,`before`),n=e.editing.mapper.toViewPosition(t),a=e.editing.view.domConverter.viewPositionToDom(n);a?.parent instanceof HTMLElement&&(i=a.parent.innerHTML)}catch{}t.push({id:T(),text:i,attrs:n,textNode:r.textNode,offset:r.startOffset})}}return t}function Pt(){let{noteContext:e}=x();return N(At,{highlights:Ft(ae(e)),scrollToHighlight:k(e=>{e.element.scrollIntoView()},[])})}function Ft(e){if(!e)return[];let t=[],n=new Set,r=e.querySelectorAll(`[style*="background-color"], [style*="color"]`);for(let e of r){if(n.has(e)||!e.textContent?.trim())continue;let r={bold:!!e.closest(`strong`),italic:!!e.closest(`em`),underline:!!e.closest(`u`),background:e.style.backgroundColor,color:e.style.color};Object.values(r).some(Boolean)&&(n.add(e),t.push({id:T(),text:e.innerHTML,element:e,attrs:r}))}let i=e.querySelectorAll(`strong, em, u, b, i`);for(let e of i){if(n.has(e)||Array.from(n).some(t=>t.contains(e))||!e.textContent?.trim())continue;let r={bold:e.matches(`strong, b`),italic:e.matches(`em, i`),underline:e.matches(`u`),background:e.style.backgroundColor,color:e.style.color};Object.values(r).some(Boolean)&&(n.add(e),t.push({id:T(),text:e.innerHTML,element:e,attrs:r}))}return t}var It={text:`bx bxs-comment-detail`,highlight:`bx bx-highlight`};function Lt(){let{note:e}=x(),t=g(e,`type`),n=g(e,`mime`),r=b(`pdfAnnotations`);return t!==`file`||n!==`application/pdf`||!r||r.annotations.length===0?null:N(V,{id:`pdf-annotations`,title:D(`pdf.annotations`,{count:r.annotations.length}),children:N(`div`,{className:`pdf-annotations-list`,children:r.annotations.map(e=>N(Rt,{annotation:e,onNavigate:r.scrollToAnnotation},e.id))})})}function Rt({annotation:e,onNavigate:t}){let n=e.contents?`bx bxs-comment-detail`:It[e.type]??`bx bx-comment`;return N(`div`,{className:`pdf-annotation-item`,onClick:()=>t(e.id,e.pageNumber),style:e.color?{backgroundColor:e.color}:void 0,children:[N(R,{icon:n}),N(`div`,{className:`pdf-annotation-info`,children:[e.highlightedText&&N(`div`,{className:`pdf-annotation-highlighted-text`,children:e.highlightedText}),e.contents&&N(`div`,{className:`pdf-annotation-contents`,children:e.contents}),e.author&&N(`div`,{className:`pdf-annotation-author`,children:e.author})]})]})}function zt(){let{note:e}=x(),t=g(e,`type`),n=g(e,`mime`),r=b(`pdfAttachments`);return t!==`file`||n!==`application/pdf`||!r||r.attachments.length===0?null:N(V,{id:`pdf-attachments`,title:D(`pdf.attachments`,{count:r.attachments.length}),children:N(`div`,{className:`pdf-attachments-list`,children:r.attachments.map(e=>N(Bt,{attachment:e,onDownload:r.downloadAttachment},e.id))})})}function Bt({attachment:e,onDownload:t}){let n=fe(e.size);return N(`div`,{className:`pdf-attachment-item`,onClick:()=>t(e.id),children:[N(R,{icon:`bx bx-paperclip`}),N(`div`,{className:`pdf-attachment-info`,children:[N(`div`,{className:`pdf-attachment-filename`,children:e.filename}),N(`div`,{className:`pdf-attachment-size`,children:n})]}),N(R,{icon:`bx bx-download`})]})}function Vt(){let{note:e}=x(),t=g(e,`type`),n=g(e,`mime`),r=b(`pdfLayers`);return t!==`file`||n!==`application/pdf`?null:r?.layers&&r.layers.length>0&&N(V,{id:`pdf-layers`,title:D(`pdf.layers`,{count:r.layers.length}),children:N(`div`,{className:`pdf-layers-list`,children:r.layers.map(e=>N(Ht,{layer:e,onToggle:r.toggleLayer},e.id))})})}function Ht({layer:e,onToggle:t}){return N(`div`,{className:`pdf-layer-item ${e.visible?`visible`:`hidden`}`,onClick:()=>t(e.id,!e.visible),children:[N(R,{icon:e.visible?`bx bx-show`:`bx bx-hide`}),N(`div`,{className:`pdf-layer-name`,children:e.name})]})}O();var Ut=180,W=2;function Wt(){let{note:e}=x(),t=g(e,`type`),n=g(e,`mime`),r=b(`pdfPages`);return t!==`file`||n!==`application/pdf`?null:r&&N(V,{id:`pdf-pages`,title:D(`pdf.pages`,{count:r?.totalPages||0}),grow:!0,children:N(Gt,{pagesData:r},e?.noteId)})}function Gt({pagesData:e}){let[t,n]=j(new Map),r=M(new Set),i=M(null),[a,o]=j(0);A(()=>{function e(e){let{pageNumber:t,dataUrl:r}=e.detail;n(e=>new Map(e).set(t,r))}return window.addEventListener(`pdf-thumbnail`,e),()=>{window.removeEventListener(`pdf-thumbnail`,e)}},[]),A(()=>{let e=i.current;if(!e)return;let t=new ResizeObserver(([e])=>{o(e.contentRect.height)});return t.observe(e),()=>t.disconnect()},[]);let s=k(n=>{!r.current.has(n)&&!t.has(n)&&e&&(r.current.add(n),e.requestThumbnail(n))},[e,t]);return!e||e.totalPages===0?N(`div`,{className:`no-pages`,children:`No pages available`}):N(`div`,{ref:i,className:`pdf-pages-list`,children:a>0&&N(nt,{rowComponent:Kt,rowCount:Math.ceil(e.totalPages/W),rowHeight:Ut,rowProps:{totalPages:e.totalPages,thumbnails:t,currentPage:e.currentPage,requestThumbnail:s,scrollToPage:e.scrollToPage},style:{height:a}})})}function Kt({index:e,style:t,...n}){let{totalPages:r,thumbnails:i,currentPage:a,requestThumbnail:o,scrollToPage:s}=n,c=e*W+1;return N(`div`,{style:t,className:`pdf-page-row`,children:Array.from({length:W},(e,t)=>c+t).filter(e=>e<=r).map(e=>N(qt,{pageNumber:e,isActive:e===a,thumbnail:i.get(e),requestThumbnail:o,scrollToPage:s},e))})}function qt({pageNumber:e,isActive:t,thumbnail:n,requestThumbnail:r,scrollToPage:i}){let a=M(!1);return A(()=>{!n&&!a.current&&(a.current=!0,r(e))},[e,n,r]),N(`div`,{className:`pdf-page-item ${t?`active`:``}`,onClick:()=>i(e),children:[N(`div`,{className:`pdf-page-thumbnail`,children:n?N(`img`,{src:n,alt:D(`pdf.pages_alt`,{pageNumber:e})}):N(`div`,{className:`pdf-page-loading`,children:D(`pdf.pages_loading`)})}),N(`div`,{className:`pdf-page-number`,children:e})]})}O();var Jt=8;function Yt({rightPaneVisible:e,onToggle:t}){let n=M(null),r=M(null),i=k(()=>{t();let e=n.current;e&&(w.getInstance(e)?.hide(),e.blur())},[t]),a=D(e?`right_pane.hide`:`right_pane.peek`);return v(n,me(()=>({title:a,placement:`left`,offset:()=>{let e=n.current?.getBoundingClientRect();return!e||r.current===null?[0,Jt]:[r.current-(e.top+e.height/2),Jt]}}),[a])),N(`button`,{ref:n,type:`button`,"aria-label":a,class:s(`right-pane-peek-button bx`,e?`bx-chevron-right`:`bx-chevron-left`,e?`right-pane-peek-button-action-collapse`:`right-pane-peek-button-action-expand`),onMouseEnter:e=>{r.current=e.clientY},onMouseLeave:()=>{r.current=null},onClick:i})}O();var Xt=[{id:`outline`,title:D(`right_pane.tab_outline`),icon:`bx bx-list-ul`,alwaysShown:!0},{id:`attributes`,title:D(`right_pane.tab_attributes`),icon:`bx bx-hash`},{id:`chat`,title:D(`right_pane.tab_chat`),icon:`bx bx-bot`},{id:`widgets`,title:D(`right_pane.tab_widgets`),icon:`bx bx-extension`}];function Zt({tabs:e,activeTabId:t,onSelect:n}){return N(`div`,{class:`right-pane-tabs`,children:N(`div`,{class:`btn-group right-pane-tab-group`,role:`tablist`,children:e.map(e=>N(Qt,{tab:e,active:e.id===t,onSelect:()=>n(e.id)},e.id))})})}function Qt({tab:e,active:t,onSelect:n}){let r=M(null);return v(r,{title:e.title,placement:`bottom`,fallbackPlacements:[`bottom`],animation:!1}),N(`button`,{ref:r,type:`button`,role:`tab`,"aria-selected":t,"aria-label":e.title,class:s(`right-pane-tab icon-action`,t&&`active`),onClick:n,children:N(`span`,{class:s(`right-pane-tab-icon tn-icon`,e.icon)})})}O(),i();function $t(){let{note:e,noteContext:t}=x(),n=g(e,`type`),r=g(e,`mime`),{isReadOnly:i}=se(e,t);return N(V,{id:`toc`,title:D(`toc.table_of_contents`),grow:!0,children:[(n===`text`&&i||n===`doc`)&&N(on,{}),n===`text`&&!i&&N(rn,{}),n===`file`&&r===`application/pdf`&&N(G,{}),n===`llmChat`&&N(G,{}),e?.isMarkdown()&&N(G,{})]})}function G(){let e=b(`toc`);return N(K,{headings:e?.headings||[],scrollToHeading:e?.scrollToHeading||(()=>{}),activeHeadingId:e?.activeHeadingId})}function K({headings:e,scrollToHeading:t,activeHeadingId:n}){let r=tn(e);return N(`span`,{className:`toc`,children:r.length>0?N(`ol`,{children:r.map(e=>N(en,{heading:e,scrollToHeading:t,activeHeadingId:n},e.id))}):N(`div`,{className:`no-headings`,children:D(`toc.no_headings`)})})}function en({heading:e,scrollToHeading:t,activeHeadingId:n}){let[i,a]=j(!1),o=e.id===n,c=M(null);return ce(c,[e.text]),N(r,{children:[N(`li`,{className:s(i&&`collapsed`,o&&`active`),children:[e.children.length>0&&N(R,{className:`collapse-button`,icon:`bx bx-chevron-down`,onClick:()=>a(!i)}),N(z,{containerRef:c,className:`item-content`,onClick:()=>t(e),html:e.text})]}),e.children.length>0&&N(`ol`,{children:e.children.map(e=>N(en,{heading:e,scrollToHeading:t,activeHeadingId:n},e.id))})]})}function tn(e){let t={level:0,text:``,children:[],id:`_root`},n=[t];for(let t of e){let e={...t,children:[]};for(;n.length>1&&n[n.length-1].level>=t.level;)n.pop();n[n.length-1].children.push(e),n.push(e)}return t.children}var nn=`tocId`;function rn(){let{noteContext:e}=x(),t=_(e),[r,i]=j([]);return A(()=>{if(!t)return;i(an(t));let e=!1,r;return n(async()=>{let{attributeChangeAffectsHeading:e}=await import(`./src5.js`);return{attributeChangeAffectsHeading:e}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]),import.meta.url).then(({attributeChangeAffectsHeading:n})=>{if(e)return;let a=()=>{t.model.document.differ.getChanges().some(e=>e.type===`insert`||e.type===`remove`||e.type===`attribute`&&n(e,t))&&requestAnimationFrame(()=>{i(an(t))})};t.model.document.on(`change:data`,a),r=()=>t.model.document.off(`change:data`,a)}),()=>{e=!0,r?.()}},[t]),N(K,{headings:r,scrollToHeading:k(e=>{if(!t)return;let n=t.editing.mapper.toViewElement(e.element);n&&t.editing.view.domConverter.mapViewToDom(n)?.scrollIntoView()},[t])})}function an(e){let t=[],n=e.model.document.getRoot();return n?(e.model.change(r=>{for(let{type:i,item:a}of e.model.createRangeIn(n).getWalker()){if(i!==`elementStart`||!a.is(`element`)||!a.name.startsWith(`heading`))continue;let n=Number(a.name.replace(`heading`,``)),o=e.editing.mapper.toViewElement(a),s=``;if(o){let t=e.editing.view.domConverter.mapViewToDom(o);if(t instanceof HTMLElement){let e=t.cloneNode(!0),n=e.querySelectorAll(`.ck-math-tex`),r=0;for(let e of a.getChildren()){if(!e.is(`element`,`mathtex-inline`))continue;if(r>=n.length)break;let t=String(e.getAttribute(`equation`)??``),i=document.createElement(`span`);i.className=`math-tex`,i.textContent=`\\(${t}\\)`,n[r].replaceWith(i),r++}s=e.innerHTML}}s||=Array.from(a.getChildren()).map(e=>e.is(`$text`)?e.data:``).join(``);let c=a.getAttribute(nn);c||(c=T(),r.setAttribute(nn,c,a)),t.push({level:n,text:s,element:a,id:c})}}),t):[]}function on(){let{noteContext:e}=x();return N(K,{headings:sn(ae(e)),scrollToHeading:k(e=>{e.element.scrollIntoView()},[])})}function sn(e){if(!e)return[];let t=[];for(let n of e.querySelectorAll(`h1,h2,h3,h4,h5,h6`))t.push({id:T(),level:parseInt(n.tagName.substring(1),10),text:n.innerHTML,element:n});return t}O(),i();var cn=5,q=90;function ln({widgetsByParent:e}){let{mode:t,visible:n,mounted:i,togglePeek:a,toggleDocked:o,dock:c,close:l,dismiss:u}=Ct(`rightPaneVisible`),d=un(i,e),[f,p]=re(`rightPaneSelectedTab`);fn(t);let m=d.find(e=>e.id===f)??d[0],h=M(new Set);return m&&h.current.add(m.id),S(`toggleRightPane`,o),S(`peekRightPane`,a),S(`selectRightPaneTab`,({tabId:e})=>{if(n&&m?.id===e){l();return}p(e),n||o()}),Et(t===`peek`,u,{keepOpenSelector:`#right-pane, .right-pane-peek-button`,focusSelector:`.right-pane-peek-button`}),N(r,{children:[N(Yt,{rightPaneVisible:n,onToggle:a}),N(`div`,{id:`right-pane-host`,class:s(t===`peek`&&`peek`,!n&&`hidden`),children:[N(`div`,{class:`right-pane-peek-spacer`}),N(`div`,{id:`right-pane`,class:n?`right-pane-mode-${t}`:void 0,children:[n&&N(`div`,{class:`right-pane-actions`,children:[t===`peek`&&N(I,{icon:`bx bx-pin`,text:D(`right_pane.dock`),onClick:c}),N(I,{icon:`bx bx-x`,text:D(`right_pane.close`),onClick:l})]}),i&&(d.length>0?N(r,{children:[N(Zt,{tabs:d,activeTabId:m?.id,onSelect:e=>void p(e)}),d.filter(e=>h.current.has(e.id)).map(e=>N(`div`,{role:`tabpanel`,class:s(`right-pane-tab-body`,e.id!==m?.id&&`hidden-ext`),children:N(st.Provider,{value:e.items.length>1,children:e.items.length>0?e.items:N(it,{icon:e.icon,text:D(`right_pane.empty_message`)})})},e.id))]}):N(it,{icon:`bx bx-sidebar`,text:D(`right_pane.empty_message`),children:t!==`peek`&&N(Ke,{text:D(`right_pane.empty_button`),triggerCommand:`toggleRightPane`})}))]})]})]})}function un(e,t){let{note:r}=x(),i=g(r,`type`),a=g(r,`mime`),[o]=ee(`highlightsList`),s=b(`chatHighlights`),[c]=ne(`aiEnabled`),l=i===`file`&&a===`application/pdf`;return e?dn([{el:N(ot,{}),enabled:!!r,tab:`attributes`},{el:N($t,{}),enabled:i===`text`||i===`doc`||l||i===`llmChat`||!!r?.isMarkdown(),tab:`outline`},{el:N(Wt,{}),enabled:l,tab:`outline`},{el:N(zt,{}),enabled:l,tab:`outline`},{el:N(Vt,{}),enabled:l,tab:`outline`},{el:N(Lt,{}),enabled:l,tab:`outline`},{el:N(Ot,{}),enabled:i===`text`&&o.length>0,tab:`outline`},{el:N(Dt,{}),enabled:i===`llmChat`&&(s?.highlights.length??0)>0,tab:`outline`},{el:N(bt,{loader:()=>n(()=>import(`./SidebarChat.js`),__vite__mapDeps([33,11,2,12,3,4,5,6,7,8,13,14,15,16,17,18,19,20,21,22,24,25,26,34,35,36,37,38,39,40,41,42,43,44,27,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,1,9,29,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78]),import.meta.url)}),enabled:i!==`llmChat`&&!le&&c,position:1e3,tab:`chat`},...t.getLegacyWidgets(`right-pane`).map(e=>({el:N(pn,{originalWidget:e},e._noteId),enabled:!0,position:e.position,tab:`widgets`})),...t.getPreactWidgets(`right-pane`).map(e=>{let t=e.render;return{el:N(t,{}),enabled:!0,position:e.position,tab:`widgets`}})],!!r):[]}function dn(e,t=!1){let n=10;for(let t of e)t.position||(t.position=n,n+=10);let r=e.filter(e=>e.enabled).toSorted((e,t)=>(e.position??10)-(t.position??10));return Xt.map(e=>({...e,items:r.filter(t=>t.tab===e.id).map(e=>e.el)})).filter(e=>e.items.length>0||t&&e.alwaysShown)}function fn(e){pe(()=>{if(e===`closed`)return;let t=Math.min(q,Math.max(cn,P.getInt(`rightPaneWidth`)??cn)),n,r=e=>{e[1]>q&&n?.setSizes([100-q,q])},i=e=>P.save(`rightPaneWidth`,Math.round(e[1])),a=e===`docked`?[`#center-pane`,`#right-pane-host`]:[`.right-pane-peek-spacer`,`#right-pane`],o=e===`docked`?[300,180]:[0,180],s=()=>He(a,{sizes:[100-t,t],gutterSize:5,minSize:o,rtl:glob.isRtl,onDrag:r,onDragEnd:i}),c;return a.every(e=>document.querySelector(e))?n=s():c=requestAnimationFrame(()=>{c=void 0,a.every(e=>document.querySelector(e))&&(n=s())}),()=>{c!==void 0&&cancelAnimationFrame(c),n?.destroy()}},[e])}function pn({originalWidget:e}){let t=M(null);return N(V,{id:e._noteId,title:e.widgetTitle,containerRef:t,contextMenuItems:[{title:D(`right_pane.custom_widget_go_to_source`),uiIcon:`bx bx-code-curly`,handler:()=>d.tabManager.openInNewTab(e._noteId,null,!0)}],children:N(mn,{originalWidget:e})})}function mn({originalWidget:e}){let{noteContext:t}=x(),[n]=te(()=>(e.contentSized(),e.doRender=function(){this.$widget=$(`<div>`),this.$body=this.$widget;let e=this.doRenderBody();typeof e==`object`&&`catch`in e?this.initialized=e.catch(e=>{this.logRenderingError(e)}):this.initialized=Promise.resolve()},e),{noteContext:t});return n}var hn=t(((e,t)=>{(function(e,n){typeof t==`object`&&t.exports?t.exports=n():e.getSize=n()})(window,function(){function e(e){let t=parseFloat(e);return e.indexOf(`%`)==-1&&!isNaN(t)&&t}let t=[`paddingLeft`,`paddingRight`,`paddingTop`,`paddingBottom`,`marginLeft`,`marginRight`,`marginTop`,`marginBottom`,`borderLeftWidth`,`borderRightWidth`,`borderTopWidth`,`borderBottomWidth`];t.length;function n(){let e={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0};return t.forEach(t=>{e[t]=0}),e}function r(r){if(typeof r==`string`&&(r=document.querySelector(r)),!(r&&typeof r==`object`&&r.nodeType))return;let i=getComputedStyle(r);if(i.display==`none`)return n();let a={};a.width=r.offsetWidth,a.height=r.offsetHeight;let o=a.isBorderBox=i.boxSizing==`border-box`;t.forEach(e=>{let t=i[e],n=parseFloat(t);a[e]=isNaN(n)?0:n});let s=a.paddingLeft+a.paddingRight,c=a.paddingTop+a.paddingBottom,l=a.marginLeft+a.marginRight,u=a.marginTop+a.marginBottom,d=a.borderLeftWidth+a.borderRightWidth,f=a.borderTopWidth+a.borderBottomWidth,p=e(i.width);p!==!1&&(a.width=p+(o?0:s+d));let m=e(i.height);return m!==!1&&(a.height=m+(o?0:c+f)),a.innerWidth=a.width-(s+d),a.innerHeight=a.height-(c+f),a.outerWidth=a.width+l,a.outerHeight=a.height+u,a}return r})})),gn=t(((e,t)=>{(function(e,n){typeof t==`object`&&t.exports?t.exports=n():e.EvEmitter=n()})(typeof window<`u`?window:e,function(){function e(){}let t=e.prototype;return t.on=function(e,t){if(!e||!t)return this;let n=this._events=this._events||{},r=n[e]=n[e]||[];return r.includes(t)||r.push(t),this},t.once=function(e,t){if(!e||!t)return this;this.on(e,t);let n=this._onceEvents=this._onceEvents||{},r=n[e]=n[e]||{};return r[t]=!0,this},t.off=function(e,t){let n=this._events&&this._events[e];if(!n||!n.length)return this;let r=n.indexOf(t);return r!=-1&&n.splice(r,1),this},t.emitEvent=function(e,t){let n=this._events&&this._events[e];if(!n||!n.length)return this;n=n.slice(0),t||=[];let r=this._onceEvents&&this._onceEvents[e];for(let i of n)r&&r[i]&&(this.off(e,i),delete r[i]),i.apply(this,t);return this},t.allOff=function(){return delete this._events,delete this._onceEvents,this},e})})),_n=t(((e,t)=>{(function(e,n){typeof t==`object`&&t.exports?t.exports=n(e,gn()):e.Unidragger=n(e,e.EvEmitter)})(typeof window<`u`?window:e,function(e,t){function n(){}let r=n.prototype=Object.create(t.prototype);r.handleEvent=function(e){let t=`on`+e.type;this[t]&&this[t](e)};let i,a;`ontouchstart`in e?(i=`touchstart`,a=[`touchmove`,`touchend`,`touchcancel`]):e.PointerEvent?(i=`pointerdown`,a=[`pointermove`,`pointerup`,`pointercancel`]):(i=`mousedown`,a=[`mousemove`,`mouseup`]),r.touchActionValue=`none`,r.bindHandles=function(){this._bindHandles(`addEventListener`,this.touchActionValue)},r.unbindHandles=function(){this._bindHandles(`removeEventListener`,``)},r._bindHandles=function(t,n){this.handles.forEach(r=>{r[t](i,this),r[t](`click`,this),e.PointerEvent&&(r.style.touchAction=n)})},r.bindActivePointerEvents=function(){a.forEach(t=>{e.addEventListener(t,this)})},r.unbindActivePointerEvents=function(){a.forEach(t=>{e.removeEventListener(t,this)})},r.withPointer=function(e,t){t.pointerId===this.pointerIdentifier&&this[e](t,t)},r.withTouch=function(e,t){let n;for(let e of t.changedTouches)e.identifier===this.pointerIdentifier&&(n=e);n&&this[e](t,n)},r.onmousedown=function(e){this.pointerDown(e,e)},r.ontouchstart=function(e){this.pointerDown(e,e.changedTouches[0])},r.onpointerdown=function(e){this.pointerDown(e,e)};let o=[`TEXTAREA`,`INPUT`,`SELECT`,`OPTION`],s=[`radio`,`checkbox`,`button`,`submit`,`image`,`file`];return r.pointerDown=function(e,t){let n=o.includes(e.target.nodeName),r=s.includes(e.target.type),i=!n||r;!this.isPointerDown&&!e.button&&i&&(this.isPointerDown=!0,this.pointerIdentifier=t.pointerId===void 0?t.identifier:t.pointerId,this.pointerDownPointer={pageX:t.pageX,pageY:t.pageY},this.bindActivePointerEvents(),this.emitEvent(`pointerDown`,[e,t]))},r.onmousemove=function(e){this.pointerMove(e,e)},r.onpointermove=function(e){this.withPointer(`pointerMove`,e)},r.ontouchmove=function(e){this.withTouch(`pointerMove`,e)},r.pointerMove=function(e,t){let n={x:t.pageX-this.pointerDownPointer.pageX,y:t.pageY-this.pointerDownPointer.pageY};this.emitEvent(`pointerMove`,[e,t,n]),!this.isDragging&&this.hasDragStarted(n)&&this.dragStart(e,t),this.isDragging&&this.dragMove(e,t,n)},r.hasDragStarted=function(e){return Math.abs(e.x)>3||Math.abs(e.y)>3},r.dragStart=function(e,t){this.isDragging=!0,this.isPreventingClicks=!0,this.emitEvent(`dragStart`,[e,t])},r.dragMove=function(e,t,n){this.emitEvent(`dragMove`,[e,t,n])},r.onmouseup=function(e){this.pointerUp(e,e)},r.onpointerup=function(e){this.withPointer(`pointerUp`,e)},r.ontouchend=function(e){this.withTouch(`pointerUp`,e)},r.pointerUp=function(e,t){this.pointerDone(),this.emitEvent(`pointerUp`,[e,t]),this.isDragging?this.dragEnd(e,t):this.staticClick(e,t)},r.dragEnd=function(e,t){this.isDragging=!1,setTimeout(()=>delete this.isPreventingClicks),this.emitEvent(`dragEnd`,[e,t])},r.pointerDone=function(){this.isPointerDown=!1,delete this.pointerIdentifier,this.unbindActivePointerEvents(),this.emitEvent(`pointerDone`)},r.onpointercancel=function(e){this.withPointer(`pointerCancel`,e)},r.ontouchcancel=function(e){this.withTouch(`pointerCancel`,e)},r.pointerCancel=function(e,t){this.pointerDone(),this.emitEvent(`pointerCancel`,[e,t])},r.onclick=function(e){this.isPreventingClicks&&e.preventDefault()},r.staticClick=function(e,t){let n=e.type===`mouseup`;n&&this.isIgnoringMouseUp||(this.emitEvent(`staticClick`,[e,t]),n&&(this.isIgnoringMouseUp=!0,setTimeout(()=>{delete this.isIgnoringMouseUp},400)))},n})})),vn=e(t(((e,t)=>{(function(e,n){typeof t==`object`&&t.exports?t.exports=n(e,hn(),_n()):e.Draggabilly=n(e,e.getSize,e.Unidragger)})(typeof window<`u`?window:e,function(e,t,n){function r(){}let i=e.jQuery;function a(e,t){this.element=typeof e==`string`?document.querySelector(e):e,i&&(this.$element=i(this.element)),this.options={},this.option(t),this._create()}let o=a.prototype=Object.create(n.prototype);o.option=function(e){this.options={...this.options,...e}};let s=[`relative`,`absolute`,`fixed`];o._create=function(){this.position={},this._getPosition(),this.startPoint={x:0,y:0},this.dragPoint={x:0,y:0},this.startPosition={...this.position};let e=getComputedStyle(this.element);s.includes(e.position)||(this.element.style.position=`relative`),this.on(`pointerDown`,this.handlePointerDown),this.on(`pointerUp`,this.handlePointerUp),this.on(`dragStart`,this.handleDragStart),this.on(`dragMove`,this.handleDragMove),this.on(`dragEnd`,this.handleDragEnd),this.setHandles(),this.enable()},o.setHandles=function(){let{handle:e}=this.options;typeof e==`string`?this.handles=this.element.querySelectorAll(e):typeof e==`object`&&e.length?this.handles=e:e instanceof HTMLElement?this.handles=[e]:this.handles=[this.element]};let c=[`dragStart`,`dragMove`,`dragEnd`],l=o.emitEvent;o.emitEvent=function(t,n){if(!this.isEnabled&&c.includes(t))return;l.call(this,t,n);let r=e.jQuery;if(!r||!this.$element)return;let i,a=n;n&&n[0]instanceof Event&&([i,...a]=n);let o=r.Event(i);o.type=t,this.$element.trigger(o,a)},o._getPosition=function(){let e=getComputedStyle(this.element),t=this._getPositionCoord(e.left,`width`),n=this._getPositionCoord(e.top,`height`);this.position.x=isNaN(t)?0:t,this.position.y=isNaN(n)?0:n,this._addTransformPosition(e)},o._getPositionCoord=function(e,n){if(e.includes(`%`)){let r=t(this.element.parentNode);return r?parseFloat(e)/100*r[n]:0}return parseInt(e,10)},o._addTransformPosition=function(e){let t=e.transform;if(!t.startsWith(`matrix`))return;let n=t.split(`,`),r=t.startsWith(`matrix3d`)?12:4,i=parseInt(n[r],10),a=parseInt(n[r+1],10);this.position.x+=i,this.position.y+=a},o.handlePointerDown=function(e,t){this.isEnabled&&(this.pointerDownPointer={pageX:t.pageX,pageY:t.pageY},e.preventDefault(),document.activeElement.blur(),this.bindActivePointerEvents(e),this.element.classList.add(`is-pointer-down`))},o.handleDragStart=function(){this.isEnabled&&(this._getPosition(),this.measureContainment(),this.startPosition.x=this.position.x,this.startPosition.y=this.position.y,this.setLeftTop(),this.dragPoint.x=0,this.dragPoint.y=0,this.element.classList.add(`is-dragging`),this.animate())},o.measureContainment=function(){let e=this.getContainer();if(!e)return;let n=t(this.element),r=t(e),{borderLeftWidth:i,borderRightWidth:a,borderTopWidth:o,borderBottomWidth:s}=r,c=this.element.getBoundingClientRect(),l=e.getBoundingClientRect(),u=i+a,d=o+s,f=this.relativeStartPosition={x:c.left-(l.left+i),y:c.top-(l.top+o)};this.containSize={width:r.width-u-f.x-n.width,height:r.height-d-f.y-n.height}},o.getContainer=function(){let e=this.options.containment;if(e)return e instanceof HTMLElement?e:typeof e==`string`?document.querySelector(e):this.element.parentNode},o.handleDragMove=function(e,t,n){if(!this.isEnabled)return;let r=n.x,i=n.y,a=this.options.grid,o=a&&a[0],s=a&&a[1];r=u(r,o),i=u(i,s),r=this.containDrag(`x`,r,o),i=this.containDrag(`y`,i,s),r=this.options.axis==`y`?0:r,i=this.options.axis==`x`?0:i,this.position.x=this.startPosition.x+r,this.position.y=this.startPosition.y+i,this.dragPoint.x=r,this.dragPoint.y=i};function u(e,t,n){return t?(n||=`round`,Math[n](e/t)*t):e}o.containDrag=function(e,t,n){if(!this.options.containment)return t;let r=e==`x`?`width`:`height`,i=this.relativeStartPosition[e],a=u(-i,n,`ceil`),o=this.containSize[r];return o=u(o,n,`floor`),Math.max(a,Math.min(o,t))},o.handlePointerUp=function(){this.element.classList.remove(`is-pointer-down`)},o.handleDragEnd=function(){this.isEnabled&&(this.element.style.transform=``,this.setLeftTop(),this.element.classList.remove(`is-dragging`))},o.animate=function(){this.isDragging&&(this.positionDrag(),requestAnimationFrame(()=>this.animate()))},o.setLeftTop=function(){let{x:e,y:t}=this.position;this.element.style.left=`${e}px`,this.element.style.top=`${t}px`},o.positionDrag=function(){let{x:e,y:t}=this.dragPoint;this.element.style.transform=`translate3d(${e}px, ${t}px, 0)`},o.setPosition=function(e,t){this.position.x=e,this.position.y=t,this.setLeftTop()},o.enable=function(){this.isEnabled||(this.isEnabled=!0,this.bindHandles())},o.disable=function(){this.isEnabled&&(this.isEnabled=!1,this.isDragging&&this.dragEnd(),this.unbindHandles())};let d=[`transform`,`left`,`top`,`position`];return o.destroy=function(){this.disable(),d.forEach(e=>{this.element.style[e]=``}),this.unbindHandles(),this.$element&&this.$element.removeData(`draggabilly`)},o._init=r,i&&i.bridget&&i.bridget(`draggabilly`,a),a})}))()),J=` • `;function yn(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}function bn(e,t,n={}){let r=e.map(e=>({text:e.title||t,active:e.active})),i=n.pinnedPrefix??``,a=r.length>1,o=r.map(e=>e.text).join(J),s=r.map(e=>{let t=yn(e.text);return e.active&&a?`<strong>${t}</strong>`:t}).join(J);return{segments:r,tooltip:`${i}${o}`,tooltipHtml:`${yn(i)}${s}`}}var xn=E.isDesktop(),Sn=100,Cn=240,wn=36,Tn=36,En=xn?50:15,Y=5,Dn=84,On=60,kn=48,An=`
<div class="note-tab">
  <div class="note-tab-wrapper">
    <div class="note-tab-drag-handle"></div>
    <div class="note-tab-icon"></div>
    <div class="note-tab-title"></div>
    <div class="note-tab-pin-indicator bx bx-pin" aria-label="${D(`tab_row.unpin_tab`)}"></div>
    <div class="note-tab-close bx bx-x" aria-label="${D(`tab_row.close_tab`)}"></div>
  </div>
</div>`,jn=`<div class="tab-row-container-anchor"></div>`,Mn=`<div class="note-new-tab" data-trigger-command="openNewTab" aria-label="${D(`tab_row.add_new_tab`)}">+</div>`,Nn=`<div class="tab-row-filler"></div>`,Pn=`
<div class="tab-row-widget">
    <style>
    .tab-row-widget {
        display:flex;
        box-sizing: border-box;
        position: relative;
        width: 100%;
        background: var(--main-background-color);
        user-select: none;
    }

    .tab-row-widget.full-width {
        background: var(--launcher-pane-background-color);
    }

    .tab-row-widget * {
        box-sizing: inherit;
        font: inherit;
    }

    .tab-row-widget .tab-row-widget-container {
        box-sizing: border-box;
        position: relative;
        height: 100%;
    }

    .tab-row-widget .note-tab {
        position: absolute;
        left: 0;
        width: 240px;
        border: 0;
        margin: 0;
        z-index: 1;
        pointer-events: none;
    }

    .note-new-tab {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 ${Tn}px;
        height: ${Tn}px;
        padding: 1px;
        font-size: 24px;
        cursor: pointer;
        box-sizing: border-box;
    }

    .note-new-tab:hover {
        background-color: var(--accented-background-color);
        border-radius: var(--button-border-radius);
    }

    .tab-row-filler {
        box-sizing: border-box;
        -webkit-app-region: drag;
        min-width: ${En}px;
        flex-grow: 1;
    }

    .tab-row-container-anchor{
        position: absolute;
        left: 0;
        width: 0px;
        height: 36px;
        border: 0;
        margin: 0;
        z-index: 1;
        cursor: pointer;
        box-sizing: border-box;
    }
    body.mobile .tab-row-filler {
        display: none;
    }

    .tab-row-widget .note-tab[active] {
        z-index: 5;
    }

    .tab-row-widget .note-tab,
    .tab-row-widget .note-tab * {
        cursor: default;
    }

    .tab-row-widget .note-tab.note-tab-was-just-added {
        top: 10px;
        animation: note-tab-was-just-added 120ms forwards ease-in-out;
    }

    .tab-row-widget .note-tab .note-tab-wrapper {
        position: absolute;
        display: flex;
        align-items: center;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 36px;
        padding: 7px 5px 7px 11px;
        border-radius: 8px;
        overflow: hidden;
        pointer-events: all;
        color: var(--inactive-tab-text-color);
        --tab-background-color: var(--workspace-tab-background-color);
        background-color: var(--tab-background-color, var(--inactive-tab-background-color));
    }

    .tab-row-widget .note-tab[active] .note-tab-wrapper {
        font-weight: bold;
        color: var(--active-tab-text-color);
        background-color : var(--tab-background-color, var(--active-tab-background-color));
    }

    .tab-row-widget .note-tab[is-mini] .note-tab-wrapper {
        padding-inline-start: 2px;
        padding-inline-end: 2px;
    }

    .tab-row-widget .note-tab .note-tab-title {
        flex: 1;
        vertical-align: top;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    /* In the active tab, dim every split segment except the focused one so it stands out. */
    .tab-row-widget .note-tab[active] .note-tab-segment:not(.note-tab-segment-active) {
        opacity: 0.55;
        font-weight: normal;
    }

    .tab-row-widget .note-tab .note-tab-icon {
        position: relative;
        padding-inline-end: 3px;
    }

    .tab-row-widget .note-tab[is-small] .note-tab-title {
        margin-inline-start: 0;
    }

    .tab-row-widget .note-tab .note-tab-drag-handle {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 50;
    }

    .tab-row-widget .note-tab .note-tab-close {
        flex: 0 0 22px;
        border-radius: 50%;
        z-index: 100;
        width: 22px;
        height: 22px;
        cursor: pointer;
        text-align: center;
    }

    .tab-row-widget .note-tab .note-tab-pin-indicator {
        display: none;
        flex: 0 0 22px;
        width: 22px;
        height: 22px;
        align-items: center;
        justify-content: center;
        text-align: center;
        /* purely a visual indicator: clicks fall through to the tab so it activates, never unpins */
        pointer-events: none;
    }

    .tab-row-widget .note-tab[pinned] .note-tab-pin-indicator {
        display: flex;
    }

    .tab-row-widget .note-tab[pinned] .note-tab-close {
        display: none;
    }

    .tab-scroll-button-left, .tab-scroll-button-right {
        display: none;
        flex: 0 0 ${wn}px;
        height: ${wn}px;
        padding: 1px 1px 1px 1px;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .tab-scroll-button-left {
        color: var(--active-tab-text-color);
        box-shadow: inset -1px 0 0 0 var(--main-border-color);
    }

    .tab-scroll-button-right {
        color: var(--active-tab-text-color);
        box-shadow: inset 1px 0 0 0 var(--main-border-color);
    }

    .tab-scroll-button-left.disabled,
    .tab-scroll-button-right.disabled {
        color: var(--inactive-tab-text-color);
        box-shadow: none;
        pointer-events: none;
    }

    .tab-scroll-button-left:hover,
    .tab-scroll-button-right:hover {
        background-color: var(--tab-background-color, var(--inactive-tab-hover-background-color));
    }

    .tab-row-widget .note-tab:hover .note-tab-wrapper {
        background-color: var(--tab-background-color, var(--inactive-tab-hover-background-color));
    }

    .tab-row-widget .note-tab[active]:hover .note-tab-wrapper {
        background-color: var(--tab-background-color, var(--active-tab-hover-background-color));
    }

    body.desktop .tab-row-widget .note-tab .note-tab-close:hover {
        background-color: var(--hover-item-background-color);
        color: var(--hover-item-text-color);
    }

    .tab-row-widget .note-tab[is-smaller] .note-tab-close {
        margin-inline-start: auto;
    }
    .tab-row-widget .note-tab[is-mini]:not([active]) .note-tab-close {
        display: none;
    }
    .tab-row-widget .note-tab[is-mini][active] .note-tab-close {
        margin-inline-start: auto;
        margin-inline-end: auto;
    }
    @-moz-keyframes note-tab-was-just-added {
        to {
            top: 0;
        }
    }
    @-webkit-keyframes note-tab-was-just-added {
        to {
            top: 0;
        }
    }
    @-o-keyframes note-tab-was-just-added {
        to {
            top: 0;
        }
    }
    @keyframes note-tab-was-just-added {
        to {
            top: 0;
        }
    }
    .tab-row-widget.tab-row-widget-is-sorting .note-tab:not(.note-tab-is-dragging),
    .tab-row-widget:not(.tab-row-widget-is-sorting) .note-tab.note-tab-was-just-dragged {
        transition: transform 120ms ease-in-out;
    }
    .tab-row-widget-wrapper {
        display: flex;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }

    .tab-row-widget-scrolling-container {
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none; /* Firefox */
    }

    /* Chrome/Safari */
    .tab-row-widget-scrolling-container::-webkit-scrollbar {
        display: none;
    }

    </style>
    <div class="tab-scroll-button-left bx bx-chevron-left"></div>
    <div class="tab-row-widget-scrolling-container">
        <div class="tab-row-widget-container"></div>
    </div>
    <div class="tab-scroll-button-right bx bx-chevron-right"></div>
</div>`,Fn=class extends o{isDragging;showNoteIcons;draggabillies;draggabillyDragging;$style;$tabScrollingContainer;$tabContainer;$scrollButtonLeft;$scrollButtonRight;$containerAnchor;$filler;$newTab;updateScrollTimeout;newTabOuterWidth=0;scrollButtonsOuterWidth=0;tabUpdateId=0;doRender(){this.$widget=$(Pn),this.$tabScrollingContainer=this.$widget.children(`.tab-row-widget-scrolling-container`),this.$tabContainer=this.$widget.find(`.tab-row-widget-container`),this.$scrollButtonLeft=this.$widget.children(`.tab-scroll-button-left`),this.$scrollButtonRight=this.$widget.children(`.tab-scroll-button-right`);let e=window.getComputedStyle(document.documentElement);this.showNoteIcons=e.getPropertyValue(`--tab-note-icons`)===`true`,this.draggabillies=[],this.setupStyle(),this.setupEvents(),this.setupContainerAnchor(),this.setupDraggabilly(),this.setupNewButton(),this.setupFiller(),this.layoutTabs(),this.setVisibility(),this.setupScrollEvents(),this.$widget.on(`contextmenu`,`.note-tab`,e=>{e.preventDefault();let t=$(e.target).closest(`.note-tab`).attr(`data-ntx-id`),n=d.tabManager.getMainNoteContexts().find(e=>e.ntxId===t),r=!!n?.pinned,i=!n||n.isEmpty();m.show({x:e.pageX,y:e.pageY,items:[r?{title:D(`tab_row.unpin_tab`),command:`unpinTab`,uiIcon:`bx bx-pin`}:{title:D(`tab_row.pin_tab`),command:`pinTab`,uiIcon:`bx bx-pin`,enabled:!i},{kind:`separator`},{title:D(`tab_row.close`),command:`closeTab`,uiIcon:`bx bx-x`,enabled:!r},{title:D(`tab_row.close_other_tabs`),command:`closeOtherTabs`,uiIcon:`bx bx-empty`,enabled:d.tabManager.noteContexts.length!==1},{title:D(`tab_row.close_right_tabs`),command:`closeRightTabs`,uiIcon:`bx bx-empty`,enabled:d.tabManager.noteContexts?.at(-1)?.ntxId!==t},{title:D(`tab_row.close_all_tabs`),command:`closeAllTabs`,uiIcon:`bx bx-empty`},{kind:`separator`},{title:D(`tab_row.reopen_last_tab`),command:`reopenLastTab`,uiIcon:`bx bx-undo`,enabled:d.tabManager.recentlyClosedTabs.length!==0},{kind:`separator`},{title:D(`tab_row.move_tab_to_new_window`),command:`moveTabToNewWindow`,uiIcon:`bx bx-window-open`,enabled:!r},{title:D(`tab_row.copy_tab_to_new_window`),command:`copyTabToNewWindow`,uiIcon:`bx bx-empty`}],selectMenuItemHandler:({command:e})=>{e&&this.triggerCommand(e,{ntxId:t})}})})}setupStyle(){this.$style=$(`<style>`),this.$widget.append(this.$style)}scrollTabContainer(e,t=`smooth`){this.$tabScrollingContainer[0].scrollBy({left:e,behavior:t})}setupScrollEvents(){l(this.$tabScrollingContainer),this.$scrollButtonLeft[0].addEventListener(`click`,()=>this.scrollTabContainer(-210)),this.$scrollButtonRight[0].addEventListener(`click`,()=>this.scrollTabContainer(210)),this.$tabScrollingContainer[0].addEventListener(`scroll`,()=>{clearTimeout(this.updateScrollTimeout),this.updateScrollTimeout=setTimeout(()=>{this.updateScrollButtonState()},100)})}updateScrollButtonState(){let e=this.$tabScrollingContainer[0].scrollLeft,t=this.$tabScrollingContainer[0].scrollWidth,n=this.$tabScrollingContainer[0].clientWidth;this.$scrollButtonLeft.toggleClass(`disabled`,Math.abs(e)<=1),this.$scrollButtonRight.toggleClass(`disabled`,Math.abs(e+n-t)<=1)}setScrollButtonVisibility(e=!0){e?(this.$scrollButtonLeft.css(`display`,`flex`),this.$scrollButtonRight.css(`display`,`flex`),clearTimeout(this.updateScrollTimeout),this.updateScrollTimeout=setTimeout(()=>{this.updateScrollButtonState()},200)):(this.$scrollButtonLeft.css(`display`,`none`),this.$scrollButtonRight.css(`display`,`none`))}setupEvents(){new ResizeObserver(e=>{this.cleanUpPreviouslyDraggedTabs(),this.layoutTabs()}).observe(this.$widget[0]),this.tabEls.forEach(e=>this.setTabCloseEvent(e))}setVisibility(){this.$widget.show()}getTabTooltips(e){return[`.note-tab-drag-handle`,`.note-tab-close`].map(t=>e.querySelector(t)).map(e=>e?w.getInstance(e):null).filter(e=>!!e)}setTooltipsEnabled(e){for(let t of this.tabEls)for(let n of this.getTabTooltips(t))e?n.enable():(n.hide(),n.disable())}get tabEls(){return Array.prototype.slice.call(this.$widget.find(`.note-tab`))}updateOuterWidth(){this.newTabOuterWidth==0&&(this.newTabOuterWidth=this.$newTab?.outerWidth(!0)??0),this.scrollButtonsOuterWidth==0&&(this.scrollButtonsOuterWidth=(this.$scrollButtonLeft?.outerWidth(!0)??0)+(this.$scrollButtonRight?.outerWidth(!0)??0))}get tabWidths(){let e=this.tabEls.length;this.updateOuterWidth();let t=Math.floor((this.$widget.width()??0)-this.newTabOuterWidth-En);105*e>t?(t-=this.scrollButtonsOuterWidth,this.setScrollButtonVisibility(!0)):this.setScrollButtonVisibility(!1);let n=(e-1)*Y,r=(t-n)/e,i=Math.floor(Math.max(Sn,Math.min(Cn,r))),a=i*e+n,o=t-a,s=[],c=o;for(let t=0;t<e;t+=1){let e=+(i<Cn&&c>=1);s.push(i+e),c>=1&&--c}return s}getTabPositions(){let e=[],t=0;this.tabWidths.forEach(n=>{e.push(t),t+=n+Y}),t-=Y;let n=t;return glob.isRtl&&e.reverse(),{tabPositions:e,anchorPosition:n}}layoutTabs(){let e=this.tabWidths;this.tabEls.forEach((t,n)=>{let r=e[n];t.style.width=`${r}px`,t.removeAttribute(`is-small`),t.removeAttribute(`is-smaller`),t.removeAttribute(`is-mini`),r<Dn&&t.setAttribute(`is-small`,``),r<On&&t.setAttribute(`is-smaller`,``),r<kn&&t.setAttribute(`is-mini`,``)});let t=``,{tabPositions:n,anchorPosition:r}=this.getTabPositions();n.forEach((e,n)=>{t+=`.note-tab:nth-child(${n+1}) { transform: translate3d(${e}px, 0, 0)} `}),t+=`.tab-row-container-anchor { transform: translate3d(${r}px, 0, 0) } `,t+=`.tab-row-widget-container {width: ${r}px}`,this.$style.html(t)}addTab(e){let t=$(An).attr(`data-ntx-id`,e);p.updateDisplayedShortcuts(t),t.addClass(`note-tab-was-just-added`),setTimeout(()=>t.removeClass(`note-tab-was-just-added`),500),this.$containerAnchor.before(t);let n=d.tabManager.getMainNoteContexts();n[n.length-1]?.ntxId!==e&&this.syncTabOrder(),this.setVisibility(),this.setTabCloseEvent(t),this.updateTitle(t,D(`tab_row.new_tab`)),new w(t.find(`.note-tab-drag-handle`)[0],{html:!0,title:()=>t.attr(`data-tab-title`)||``,trigger:`hover`,placement:`bottom`,container:`body`,delay:{show:500,hide:0}}),new w(t.find(`.note-tab-close`)[0],{title:D(`tab_row.close_tab`),trigger:`hover`,placement:`bottom`,container:`body`,delay:{show:500,hide:0}}),this.cleanUpPreviouslyDraggedTabs(),this.layoutTabs(),this.setupDraggabilly()}closeActiveTabCommand({$el:e}){let t=e.closest(`.note-tab`).attr(`data-ntx-id`);d.tabManager.removeNoteContext(t??null)}setTabCloseEvent(e){e.on(`mousedown`,t=>{if(t.which===2)return d.tabManager.removeNoteContext(e.attr(`data-ntx-id`)??null),!0}),e.find(`.note-tab-close`).on(`click`,e=>(this.triggerCommand(`closeActiveTab`,{$el:$(e.target)}),!0))}get activeTabEl(){return this.$widget.find(`.note-tab[active]`)[0]}activeContextChangedEvent(){let e=d.tabManager.getActiveContext();if(!e)return;e.mainNtxId&&(e=d.tabManager.getNoteContextById(e.mainNtxId));let t=this.getTabById(e.ntxId)[0],n=this.activeTabEl;n!==t&&(n&&(n.removeAttribute(`active`),this.refreshTab(n.getAttribute(`data-ntx-id`))),t&&t.setAttribute(`active`,``)),this.refreshTab(e.ntxId)}newNoteContextCreatedEvent({noteContext:e}){!e.mainNtxId&&e.ntxId&&this.addTab(e.ntxId)}removeTab(e){let t=this.getTabById(e)[0];if(t){for(let e of this.getTabTooltips(t))e.dispose();t.parentNode?.removeChild(t),this.cleanUpPreviouslyDraggedTabs(),this.layoutTabs(),this.setupDraggabilly(),this.setVisibility()}}getNtxIdsInOrder(){return this.tabEls.map(e=>e.getAttribute(`data-ntx-id`))}updateTitle(e,t){e.attr(`data-tab-title`,t),e.find(`.note-tab-title`).text(t)}getTabById(e){return this.$widget.find(`[data-ntx-id='${e}']`)}getTabId(e){return e.attr(`data-ntx-id`)}noteContextRemovedEvent({ntxIds:e}){for(let t of e)this.removeTab(t);this.refreshAllTabs()}cleanUpPreviouslyDraggedTabs(){this.tabEls.forEach(e=>e.classList.remove(`note-tab-was-just-dragged`))}setupDraggabilly(){let e=this.tabEls,{tabPositions:t}=this.getTabPositions(),n=0;this.isDragging&&this.draggabillyDragging&&(this.isDragging=!1,this.$widget.removeClass(`tab-row-widget-is-sorting`),this.draggabillyDragging.element.classList.remove(`note-tab-is-dragging`),this.draggabillyDragging.element.style.transform=``,this.draggabillyDragging.dragEnd(),this.draggabillyDragging.isDragging=!1,this.draggabillyDragging.positionDrag=()=>{},this.draggabillyDragging.destroy(),this.draggabillyDragging=null),this.draggabillies.forEach(e=>e.destroy()),e.forEach((e,r)=>{let i=t[r],a=new vn.default(e,{axis:`x`,handle:`.note-tab-drag-handle`,containment:this.$tabContainer[0]});this.draggabillies.push(a),a.on(`staticClick`,()=>{d.tabManager.activateTabContext(e.getAttribute(`data-ntx-id`))}),a.on(`dragStart`,()=>{this.isDragging=!0,this.draggabillyDragging=a,e.classList.add(`note-tab-is-dragging`),this.$widget.addClass(`tab-row-widget-is-sorting`),this.setTooltipsEnabled(!1),n=this.$tabScrollingContainer?.scrollLeft()??0,a.positionDrag=()=>{}}),a.on(`dragEnd`,()=>{this.isDragging=!1,this.setTooltipsEnabled(!0);let t=(this.$tabScrollingContainer?.scrollLeft()??0)-n,r=parseFloat(e.style.left)+t,i=this.$tabContainer[0]?.offsetWidth-e.offsetWidth,a=Math.min(i,Math.max(0,r));e.style.transform=`translate3d(0, 0, 0)`,requestAnimationFrame(t=>{e.style.left=`0`,e.style.transform=`translate3d(${a}px, 0, 0)`,requestAnimationFrame(t=>{e.classList.remove(`note-tab-is-dragging`),this.$widget.removeClass(`tab-row-widget-is-sorting`),e.classList.add(`note-tab-was-just-dragged`),requestAnimationFrame(t=>{e.style.transform=``,this.layoutTabs(),this.setupDraggabilly()})})})}),a.on(`dragMove`,(r,a,o)=>{let s=this.tabEls,c=s.indexOf(e),l=this.$tabScrollingContainer[0]?.getBoundingClientRect(),d=a.pageX;d<l.left?this.scrollTabContainer(-105):d>l.right&&this.scrollTabContainer(105);let f=(this.$tabScrollingContainer?.scrollLeft()??0)-n,p=o.x+f,m=this.$tabContainer[0]?.offsetWidth-e.offsetWidth-i,h=-i;p=Math.min(m,Math.max(h,p)),e.style.transform=`translate3d(${p}px, 0, 0)`;let g=i+p,_=this.closest(g,t),v=s.filter(e=>e.hasAttribute(`pinned`)).length,y=u(_,e.hasAttribute(`pinned`),v,s.length);c!==y&&this.animateTabMove(e,c,y),Math.abs(o.y)>100&&!e.hasAttribute(`pinned`)&&this.triggerCommand(`moveTabToNewWindow`,{ntxId:this.getTabId($(e))})})})}animateTabMove(e,t,n){if(n<t)e.parentNode?.insertBefore(e,this.tabEls[n]);else{let t=this.tabEls[n+1]||this.$containerAnchor[0];e.parentNode?.insertBefore(e,t)}this.triggerEvent(`tabReorder`,{ntxIdsInOrder:this.getNtxIdsInOrder()}),this.layoutTabs()}setupNewButton(){this.$newTab=$(Mn),this.$widget.append(this.$newTab),new w(this.$newTab[0],{title:D(`tab_row.add_new_tab`),trigger:`hover`,placement:`bottom`,container:`body`,delay:{show:500,hide:0}})}setupFiller(){this.$filler=$(Nn),this.$widget.append(this.$filler)}setupContainerAnchor(){this.$containerAnchor=$(jn),this.$tabContainer.append(this.$containerAnchor)}closest(e,t){let n=1/0,r=-1;return t.forEach((t,i)=>{Math.abs(e-t)<n&&(n=Math.abs(e-t),r=i)}),r}noteSwitchedAndActivatedEvent({noteContext:e}){this.activeContextChangedEvent(),this.updateTabById(e.mainNtxId||e.ntxId)}noteSwitchedEvent({noteContext:e}){this.updateTabById(e.mainNtxId||e.ntxId)}noteContextReorderEvent({oldMainNtxId:e,newMainNtxId:t}){e&&t&&this.getTabById(e).attr(`data-ntx-id`,t),this.refreshAllTabs()}contextsReopenedEvent({mainNtxId:e,tabPosition:t}){if(!e||t<0)return;let n=this.getTabById(e)[0];n&&n.parentNode&&n.parentNode.insertBefore(n,this.tabEls[t]),this.refreshTab(e)}updateTabById(e){let t=this.getTabById(e);t[0].scrollIntoView({behavior:`smooth`});let n=d.tabManager.getNoteContextById(e);this.updateTab(t,n)}async updateTab(e,t){if(!e.length)return;let n=t.getMainContext();e.attr(`pinned`,n.pinned?``:null);for(let t of Array.from(e[0].classList))t!==`note-tab`&&e.removeClass(t);let r=``,i=c.getNoteFromCache(n.hoistedNoteId);i?(e.find(`.note-tab-wrapper`).css(`--workspace-tab-background-color`,i.getWorkspaceTabBackgroundColor()),this.showNoteIcons||(r=i.getWorkspaceIconClass())):e.find(`.note-tab-wrapper`).removeAttr(`style`);let a=++this.tabUpdateId;e.data(`update-id`,a);let o=n.getSubContexts(),s=this.getFocusedNtxId(n,o);if(await this.updateTabTitle(e,o,s,n.pinned,a),e.data(`update-id`)!==a)return;let l=(o.find(e=>e.ntxId===s)??n).note;l&&(e.addClass(l.getCssClass()),e.addClass(E.getNoteTypeClass(l.type)),e.addClass(E.getMimeTypeClass(l.mime)),this.showNoteIcons&&(r=l.getIcon())),r&&e.find(`.note-tab-icon`).removeClass().addClass(`note-tab-icon`).addClass(r)}async updateTabTitle(e,t,n,r,i){let a=await Promise.all(t.map(async e=>({title:e.note?await e.getNavigationTitle():null,active:!!e.ntxId&&e.ntxId===n})));if(i!==void 0&&e.data(`update-id`)!==i)return;let{segments:o,tooltipHtml:s}=bn(a,D(`tab_row.new_tab`),{pinnedPrefix:r?D(`tab_row.pinned_prefix`):void 0});e.attr(`data-tab-title`,s);let c=e.find(`.note-tab-title`).empty();o.forEach((e,t)=>{t>0&&c.append(document.createTextNode(J));let n=$(`<span>`).addClass(`note-tab-segment`).text(e.text);e.active&&n.addClass(`note-tab-segment-active`),c.append(n)})}getFocusedNtxId(e,t){let n=e.lastActiveNtxId;return n&&t.some(e=>e.ntxId===n)?n:e.ntxId}refreshTab(e){if(!e)return;let t=this.getTabById(e),n=d.tabManager.noteContexts.find(t=>t.ntxId===e);t.length&&n&&this.updateTab(t,n)}refreshAllTabs(){for(let e of d.tabManager.getMainNoteContexts())this.refreshTab(e.ntxId)}async entitiesReloadedEvent({loadResults:e}){let t=new Set;for(let n of d.tabManager.noteContexts)if(n.noteId&&(e.isNoteReloaded(n.noteId)||e.getAttributeRows().find(e=>[`workspace`,`iconClass`,`workspaceIconClass`,`workspaceTabBackgroundColor`].includes(e.name||``)&&C.isAffecting(e,n.note)))){let e=n.mainNtxId||n.ntxId;e&&t.add(e)}for(let e of t)this.refreshTab(e)}frocaReloadedEvent(){for(let e of d.tabManager.noteContexts){let t=this.getTabById(e.ntxId);this.updateTab(t,e)}}hoistedNoteChangedEvent({ntxId:e}){let t=this.getTabById(e);if(t&&e){let n=d.tabManager.getNoteContextById(e);this.updateTab(t,n)}}tabPinStateChangedEvent({ntxId:e,pinned:t}){let n=this.getTabById(e);n.length&&(n.attr(`pinned`,t?``:null),this.syncTabOrder(),this.layoutTabs(),this.setupDraggabilly())}syncTabOrder(){for(let e of d.tabManager.getMainNoteContexts()){let t=this.getTabById(e.ntxId)[0];t&&this.$containerAnchor.before(t)}}};O();function In(){let e=de()&&window.electronApi,t=e?Ae():void 0,{canGoBack:n,canGoForward:r}=Ln(e),i=ie(`_lbBackInHistory`),a=ie(`_lbForwardInHistory`);return N(`div`,{className:`tab-history-navigation-buttons`,children:[!i&&N(I,{icon:`bx bx-left-arrow-alt`,text:D(`tab_history_navigation_buttons.go-back`),triggerCommand:`backInNoteHistory`,onContextMenu:t,disabled:!n}),!a&&N(I,{icon:`bx bx-right-arrow-alt`,text:D(`tab_history_navigation_buttons.go-forward`),triggerCommand:`forwardInNoteHistory`,onContextMenu:t,disabled:!r})]})}function Ln(e){let[t,n]=j(()=>e?window.electronApi?.navigation.navigationCanGoBack()??!0:!0),[r,i]=j(()=>e?window.electronApi?.navigation.navigationCanGoForward()??!0:!0);return A(()=>{let e=window.electronApi?.navigation;if(!e)return;let t=()=>{n(e.navigationCanGoBack()),i(e.navigationCanGoForward())};return e.onDidNavigate(t),e.onDidNavigateInPage(t),()=>{e.removeDidNavigateListeners()}},[e]),{canGoBack:t,canGoForward:r}}var Rn={USE_PROFILES:{html:!0,mathMl:!0},FORBID_TAGS:`script.style.iframe.object.embed.link.meta.base.noscript.template.form.input.textarea.button.select.option.div.p.h1.h2.h3.h4.h5.h6.blockquote.pre.section.article.aside.nav.header.footer.main.figure.figcaption.table.thead.tbody.tfoot.tr.th.td.ul.ol.li.dl.dt.dd.hr.img.video.audio.picture.canvas.svg.foreignObject`.split(`.`),FORBID_ATTR:[`onerror`,`onload`,`onclick`,`onmouseover`,`onfocus`,`onblur`,`onsubmit`,`onreset`,`onchange`,`oninput`,`onkeydown`,`onkeyup`,`onkeypress`],RETURN_DOM:!1,RETURN_DOM_FRAGMENT:!1},zn=`<div class="toc-widget">
    <style>
        .toc-widget {
            padding: 10px;
            contain: none;
            overflow: auto;
            position: relative;
            padding-inline-start:0px !important;
        }

        .toc ol {
            position: relative;
            overflow: hidden;
            padding-inline-start: 0px;
            transition: max-height 0.3s ease;
        }

        .toc li.collapsed + ol {
            display:none;
        }

        .toc li + ol:before {
            content: "";
            position: absolute;
            height: 100%;
            border-inline-start: 1px solid var(--main-border-color);
            z-index: 10;
        }

        .toc li {
            display: flex;
            position: relative;
            list-style: none;
            align-items: center;
            padding-inline-start: 7px;
            cursor: pointer;
            text-align: justify;
            word-wrap: break-word;
            hyphens: auto;
        }

        .toc > ol {
            --toc-depth-level: 1;
        }
        .toc > ol > ol {
            --toc-depth-level: 2;
        }
        .toc > ol > ol > ol {
            --toc-depth-level: 3;
        }
        .toc > ol > ol > ol > ol {
            --toc-depth-level: 4;
        }
        .toc > ol > ol > ol > ol > ol {
            --toc-depth-level: 5;
        }

        .toc > ol ol::before {
            inset-inline-start: calc((var(--toc-depth-level) - 2) * 20px + 14px);
        }

        .toc li {
            padding-inline-start: calc((var(--toc-depth-level) - 1) * 20px + 4px);
        }

        .toc li .collapse-button {
            display: flex;
            position: relative;
            width: 21px;
            height: 21px;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease;
        }

        .toc li.collapsed .collapse-button {
            transform: rotate(-90deg);
        }

        .toc li .item-content {
            margin-inline-start: 25px;
            flex: 1;
        }

        .toc li .collapse-button + .item-content {
            margin-inline-start: 4px;
        }

        .toc li:hover {
            font-weight: bold;
        }
    </style>

    <span class="toc"></span>
</div>`,Bn=class extends B{$toc;tocLabelValue;get widgetTitle(){return D(`toc.table_of_contents`)}get widgetButtons(){return[new U().icon(`bx-cog`).title(D(`toc.options`)).titlePlacement(`left`).onClick(()=>d.tabManager.openContextWithNote(`_optionsTextNotes`,{activate:!0})).class(`icon-action`),new U().icon(`bx-x`).titlePlacement(`left`).onClick(e=>e.triggerCommand(`closeToc`)).class(`icon-action`)]}isEnabled(){if(!super.isEnabled()||!this.note)return!1;let e=this.note.type===`doc`&&this.note.noteId.startsWith(`_help`);return(this.note.type===`text`||e)&&!this.noteContext?.viewScope?.tocTemporarilyHidden&&this.noteContext?.viewScope?.viewMode==="default"}async doRenderBody(){this.$body.empty().append($(zn)),this.$toc=this.$body.find(`.toc`)}async refreshWithNote(e){if(this.toggleInt(!!this.noteContext?.viewScope?.tocPreviousVisible),this.tocLabelValue=e.getLabelValue(`toc`),this.tocLabelValue===`hide`){this.toggleInt(!1),this.triggerCommand(`reEvaluateRightPaneVisibility`);return}if(!(!this.note||!this.noteContext?.viewScope)){if(this.note.type===`text`){let t=await e.getBlob();if(t){let e=await this.getToc(t.content);this.#e(e)}return}this.note.type===`doc`&&setTimeout(async()=>{let e=await this.noteContext?.getContentElement();if(e){let t=e.html(),n=await this.getToc(t);this.#e(n)}else console.warn(`Unable to get content element for doctype`)},250)}}#e({$toc:e,headingCount:t}){this.$toc.empty(),e&&this.$toc.append(e);let n=this.tocLabelValue,r=n===``||n===`show`||t>=(P.getInt(`minTocHeadings`)??0);this.toggleInt(r),this.noteContext?.viewScope&&(this.noteContext.viewScope.tocPreviousVisible=r),this.triggerCommand(`reEvaluateRightPaneVisibility`)}async replaceMathTextWithKatax(e){var t=[...e.matchAll(/<span class="math-tex">\\\(([\s\S]*?)\\\)<\/span>/g)];let r=e;if(t.length>0){let{default:e}=await n(async()=>{let{default:e}=await import(`./math2.js`);return{default:e}},__vite__mapDeps([79,58,59]),import.meta.url);for(let n of t){let t=n[1],i;try{i=e.renderToString(t,{throwOnError:!1})}catch(e){console.error(`KaTeX rendering error:`,e),i=n[0]}r=r.replace(n[0],i)}}return r}async getToc(e){let t=/<h(\d+)[^>]*>(.*?)<\/h\1>/gi,n=$(`<ol>`),r=2,i=[n],a;this.noteContext?.viewScope?.tocCollapsedHeadings instanceof Set||(this.noteContext.viewScope.tocCollapsedHeadings=new Set);let o=this.noteContext.viewScope.tocCollapsedHeadings,s=new Set,c=0;for(let n=null,l=0;(n=t.exec(e))!==null;l++){let e=parseInt(n[1]),t=e-r;if(t>0)for(let n=0;n<t;n++){let t=$(`<ol>`);if(i[i.length-1].append(t),i.push(t),a){let n=`h${e}_${l}_${a?.text().trim()}`;this.setupCollapsibleHeading(t,a,n,o,s)}}else if(t<0)for(let e=0;e<-t&&i.length>1;++e)i.pop();r=e;let u=await this.replaceMathTextWithKatax(n[2]),d=$(`<div class="item-content">`).html(F.sanitize(u,Rn)),f=$(`<li>`).append(d).on(`click`,()=>this.jumpToHeading(l));i[i.length-1].append(f),c=l,a=f}for(let e of o)s.has(e)||o.delete(e);return n=this.pullLeft(n),{$toc:n,headingCount:c}}pullLeft(e){for(;e.children().length===1;){let t=e.children(`:first`);if(t[0].tagName.toLowerCase()!==`ol`)break;e=t}return e}async jumpToHeading(e){if(!this.note||!this.noteContext)return;let t=this.note.type===`doc`,n=await this.noteContext.isReadOnly(),r=null;if(n||t)r=await this.noteContext.getContentElement();else{let e=await this.noteContext.getTextEditor();e?.sourceElement&&(r=$(e.sourceElement))}(r?.find(`:header:not(section.include-note :header)`)?.[e])?.scrollIntoView({behavior:`smooth`})}async setupCollapsibleHeading(e,t,n,r,i){if(t&&t.find(`.collapse-button`).length===0){let a=$(`<div class="collapse-button bx bx-chevron-down"></div>`);t.prepend(a),r?.has(n)?(t.addClass(`collapsed`),i.add(n)):t.removeClass(`collapsed`),a.on(`click`,i=>{if(i.stopPropagation(),t.hasClass(`animating`))return;let o=!t.hasClass(`collapsed`);t.addClass(`animating`),o?(e.css(`maxHeight`,`${e.prop(`scrollHeight`)}px`),requestAnimationFrame(()=>{requestAnimationFrame(()=>{e.css(`maxHeight`,`0px`),a.css(`transform`,`rotate(-90deg)`)})}),setTimeout(()=>{e.css(`maxHeight`,``),t.addClass(`collapsed`),t.removeClass(`animating`)},300)):(t.removeClass(`collapsed`),e.css(`maxHeight`,`0px`),requestAnimationFrame(()=>{e.css(`maxHeight`,`${e.prop(`scrollHeight`)}px`),a.css(`transform`,``)}),setTimeout(()=>{e.css(`maxHeight`,``),t.removeClass(`animating`)},300)),o?r.add(n):r.delete(n)})}}async closeTocCommand(){this.noteContext?.viewScope&&(this.noteContext.viewScope.tocTemporarilyHidden=!0),await this.refresh(),this.triggerCommand(`reEvaluateRightPaneVisibility`),d.triggerEvent(`reEvaluateTocWidgetVisibility`,{noteId:this.noteId})}async showTocWidgetEvent({noteId:e}){this.noteId===e&&(await this.refresh(),this.triggerCommand(`reEvaluateRightPaneVisibility`),d.triggerEvent(`reEvaluateTocWidgetVisibility`,{noteId:this.noteId}))}async entitiesReloadedEvent({loadResults:e}){(this.noteId&&e.isNoteContentReloaded(this.noteId)||e.getAttributeRows().find(e=>e.type===`label`&&((e.name??``).toLowerCase().includes(`readonly`)||e.name===`toc`)&&C.isAffecting(e,this.note)))&&await this.refresh()}},X={notes:{},attachments:{}};function Z(e){if(e!==`notes`&&e!==`attachments`)throw Error(`Unrecognized type '${e}', should be 'notes' or 'attachments'`)}function Vn(e,t){return Z(e),X[e][t]}function Hn(e,t){Z(e),delete X[e][t]}function Un(e,t){Z(e),delete X[e][t]}f.subscribeToMessages(async e=>{e.type===`openedFileUpdated`&&(Z(e.entityType),X[e.entityType][e.entityId]=e,d.triggerEvent(`openedFileUpdated`,{entityType:e.entityType,entityId:e.entityId,lastModifiedMs:e.lastModifiedMs,filePath:e.filePath}))});var Q={getFileModificationStatus:Vn,fileModificationUploaded:Hn,ignoreModification:Un},Wn=`
<div class="dropdown watched-file-update-status-widget alert alert-warning">
    <style>
        .watched-file-update-status-widget {
            margin: 10px;
            contain: none;
        }
    </style>

    <p>${D(`watched_file_update_status.file_last_modified`)}</p>

    <div style="display: flex; flex-direction: row; justify-content: flex-start; gap: 8px;">
        <button class="btn btn-sm file-upload-button">${D(`watched_file_update_status.upload_modified_file`)}</button>

        <button class="btn btn-sm ignore-this-change-button">${D(`watched_file_update_status.ignore_this_change`)}</button>
    </div>
</div>`,Gn=class extends oe{$filePath;$fileLastModified;$fileUploadButton;$ignoreThisChangeButton;isEnabled(){let{entityType:e,entityId:t}=this.getEntity();return super.isEnabled()&&!!e&&!!t&&!!Q.getFileModificationStatus(e,t)}doRender(){this.$widget=$(Wn),this.$filePath=this.$widget.find(`.file-path`),this.$fileLastModified=this.$widget.find(`.file-last-modified`),this.$fileUploadButton=this.$widget.find(`.file-upload-button`),this.$fileUploadButton.on(`click`,async()=>{let{entityType:e,entityId:t}=this.getEntity();await _e.post(`${e}/${t}/upload-modified-file`,{filePath:this.$filePath.text()}),e&&t&&Q.fileModificationUploaded(e,t),this.refresh()}),this.$ignoreThisChangeButton=this.$widget.find(`.ignore-this-change-button`),this.$ignoreThisChangeButton.on(`click`,()=>{let{entityType:e,entityId:t}=this.getEntity();e&&t&&Q.ignoreModification(e,t),this.refresh()})}async refreshWithNote(e){let{entityType:t,entityId:n}=this.getEntity();if(!t||!n)return;let r=Q.getFileModificationStatus(t,n);this.$filePath.text(r.filePath),r.lastModifiedMs&&this.$fileLastModified.text(a.default.unix(r.lastModifiedMs/1e3).format(`HH:mm:ss`))}getEntity(){if(!this.noteContext)return{};let{viewScope:e}=this.noteContext;return e?.viewMode===`attachments`&&e.attachmentId?{entityType:`attachments`,entityId:e.attachmentId}:{entityType:`notes`,entityId:this.noteId}}openedFileUpdatedEvent(e){console.log(e);let{entityType:t,entityId:n}=this.getEntity();e.entityType===t&&e.entityId===n&&this.refresh()}},Kn=class{customWidgets;constructor(e){this.customWidgets=e}getRootWidget(e){e.noteTreeWidget=new at;let t=P.get(`layoutOrientation`)===`horizontal`,r=this.#e(t),i=E.isElectron(),a=window.glob.hasNativeTitleBar,o=t||i&&!a&&E.areWindowControlsOnLeft(),s=ve(`new-layout`),c=new je(!0).setParent(e).class(`${t?`horizontal`:`vertical`}-layout`).optChild(o,new L(`row`).class(`tab-row-container`).child(new L(`row`).id(`tab-row-left-spacer`)).optChild(t,N(ut,{isHorizontalLayout:!0})).child(N(In,{})).child(new Fn().class(`full-width`)).optChild(s,N(H,{})).css(`height`,`40px`).css(`background-color`,`var(--launcher-pane-background-color)`).setParent(e)).optChild(t,r).child(new L(`row`).css(`flex-grow`,`1`).id(`horizontal-main-container`).optChild(!t,r).child(new ft().optChild(!t,new ke).child(e.noteTreeWidget).child(...this.customWidgets.get(`left-pane`))).child(new L(`column`).id(`rest-pane`).css(`flex-grow`,`1`).optChild(!o,new L(`row`).class(`tab-row-container`).child(N(In,{})).child(new Fn).optChild(s,N(H,{})).css(`height`,`40px`).css(`align-items`,`center`)).optChild(s,N(tt,{})).child(new L(`row`).filling().collapsible().id(`vertical-main-container`).child(new L(`column`).filling().collapsible().id(`center-pane`).child(new Pe(()=>new Se().child(new L(`row`).class(`title-row note-split-title`).cssBlock(`.title-row > * { margin: 5px; }`).child(N(Ye,{})).child(N($e,{})).optChild(s,N(Je,{})).child(N(Be,{baseSize:0,growthFactor:1})).optChild(!s,N(ye,{direction:`left`})).optChild(!s,N(ye,{direction:`right`})).optChild(!s,N(xe,{})).optChild(!s,N(we,{})).optChild(s,N(Ce,{}))).optChild(!s,N(bt,{loader:()=>n(()=>import(`./Ribbon.js`),__vite__mapDeps([80,11,2,12,3,4,5,6,7,8,13,14,15,16,17,18,19,20,21,22,24,25,26,34,81,82,35,36,40,57,68,83,84,27,85,37,38,39,41,45,46,86,64,65,53,87,88,89,90,91,92,71,72,93,94,95,96,97,98,42,28,99,100,101,102,103,69,70,104,105,106,49,107,108,109,110,111,47,48,112,113,114,115,116,117,118,119,120,121,122]),import.meta.url)})).child(new Gn).optChild(!s,N(Xe,{items:et})).child(new Me().filling().optChild(s,N(Oe,{})).optChild(s,N(Re,{})).optChild(!s,new dt().child(N(Ze,{})).child(N(Qe,{}))).optChild(!s,N(qe,{})).child(N(rt,{})).child(N(We,{media:`screen`})).child(N(Fe,{})).child(N(Le,{}))).child(N(lt,{})).child(new Ie).child(...this.customWidgets.get(`note-detail-pane`)))).child(...this.customWidgets.get(`center-pane`))).optChild(!s,new pt().child(new Bn).child(new yt).child(...this.customWidgets.get(`right-pane`))).optChild(s,N(ln,{widgetsByParent:this.customWidgets}))).optChild(!t&&s,N(De,{})))).optChild(t&&s,N(De,{})).child(N(Ee,{})).child(N(mt,{}));return ze(c),c}#e(e){let t;return t=e?new L(`row`).css(`height`,`53px`).class(`horizontal`).child(N(Ne,{isHorizontalLayout:!0})).child(N(Te,{isHorizontalLayout:!0})):new L(`column`).css(`width`,`53px`).class(`vertical`).child(N(Te,{isHorizontalLayout:!1})).child(N(Ne,{isHorizontalLayout:!1})).child(N(ut,{isHorizontalLayout:!1})),t.id(`launcher-pane`),t}};export{Kn as default};