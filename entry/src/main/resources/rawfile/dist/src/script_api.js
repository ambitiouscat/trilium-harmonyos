var e=`/**\r
 * Public type surface for Trilium **user scripts** — the shape of the \`api\`\r
 * global available inside frontend/backend script notes.\r
 *\r
 * This is the single source of truth for script API types, consumed by:\r
 *  - the in-editor TypeScript language service (bundled into the script-note vfs),\r
 *  - the \`script-deployer\` app (script authoring/typechecking),\r
 * and kept honest against the real implementations by member-presence drift\r
 * guards (see \`frontend_script_api.ts\` / \`backend_script_api.ts\`).\r
 *\r
 * It is intentionally **self-contained** (no imports): the real \`Api\` interfaces\r
 * drag in the whole client/server graph (froca, widgets, jQuery, Vite \`?raw\`\r
 * imports) which can't be resolved by a browser-based language service. These\r
 * are faithful, decoupled re-declarations of the public surface — heavy or\r
 * advanced members (widget base classes, editor instances, the Preact API) are\r
 * typed as \`unknown\` rather than pulling in their real types.\r
 */\r
\r
/** A label or relation attached to a note. */\r
export interface ScriptAttribute {\r
    attributeId: string;\r
    type: "label" | "relation";\r
    name: string;\r
    value: string;\r
    isInheritable: boolean;\r
    isOwned: boolean;\r
}\r
\r
/** An attachment as seen by frontend scripts (subset of the client's \`FAttachment\`). */\r
export interface ScriptAttachment {\r
    attachmentId: string;\r
    ownerId: string;\r
    role: string;\r
    mime: string;\r
    title: string;\r
    utcDateModified: string;\r
    contentLength: number;\r
}\r
\r
/** Creation/modification timestamps returned by {@link ScriptFNote.getMetadata}. */\r
export interface ScriptNoteMetadata {\r
    dateCreated: string;\r
    utcDateCreated: string;\r
    dateModified: string;\r
    utcDateModified: string;\r
}\r
\r
/** A note's binary/text content blob (subset of the client's \`FBlob\`). */\r
export interface ScriptBlob {\r
    blobId: string;\r
    content: string;\r
    contentLength: number;\r
    dateModified: string;\r
    utcDateModified: string;\r
}\r
\r
/** One resolved tree path to a note (subset of the client's \`NotePathRecord\`). */\r
export interface ScriptNotePathRecord {\r
    isArchived: boolean;\r
    isInHoistedSubTree: boolean;\r
    isSearch?: boolean;\r
    notePath: string[];\r
    isHidden: boolean;\r
}\r
\r
/** A note as seen by frontend scripts (subset of the client's \`FNote\`). */\r
export interface ScriptFNote {\r
    noteId: string;\r
    title: string;\r
    type: string;\r
    mime: string;\r
    isProtected: boolean;\r
    /** Whether the note is archived (has the \`archived\` label). */\r
    isArchived: boolean;\r
    /** Whether the note's metadata (title, attributes) is read-only. */\r
    isMetadataReadOnly: boolean;\r
    /** IDs of this note's owned attributes. */\r
    attributes: string[];\r
    /** IDs of relations pointing *at* this note. */\r
    targetRelations: string[];\r
    /** Parent note IDs. */\r
    parents: string[];\r
    /** Child note IDs. */\r
    children: string[];\r
\r
    // --- Hierarchy ---------------------------------------------------------\r
    getParentNotes(): ScriptFNote[];\r
    getChildNotes(): Promise<ScriptFNote[]>;\r
    getParentNoteIds(): string[];\r
    getChildNoteIds(): string[];\r
    getChildNoteIdsWithArchiveFiltering(includeArchived?: boolean): Promise<string[]>;\r
    getSubtreeNotes(): Promise<ScriptFNote[]>;\r
    getSubtreeNoteIds(includeArchived?: boolean): Promise<string[]>;\r
    hasChildren(): boolean;\r
    hasAncestor(ancestorNoteId: string, followTemplates?: boolean): boolean;\r
    isRoot(): boolean;\r
    getParentBranchIds(): string[];\r
    getBranchIds(): string[];\r
    getParentBranches(): ScriptFBranch[];\r
    getChildBranches(): ScriptFBranch[];\r
    getBranches(): ScriptFBranch[];\r
    getFilteredChildBranches(): ScriptFBranch[];\r
    getAllNotePaths(): string[][];\r
    getBestNotePath(hoistedNoteId?: string, activeNotePath?: string | null): string[];\r
    getBestNotePathString(hoistedNoteId?: string): string;\r
    getSortedNotePathRecords(\r
        hoistedNoteId?: string,\r
        activeNotePath?: string | null\r
    ): ScriptNotePathRecord[];\r
\r
    // --- Attributes (inherited + own) --------------------------------------\r
    getAttributes(type?: string, name?: string): ScriptAttribute[];\r
    getOwnedAttributes(type?: string, name?: string): ScriptAttribute[];\r
    getAttribute(type: string, name: string): ScriptAttribute | null;\r
    getOwnedAttribute(type: string, name: string): ScriptAttribute | null;\r
    getAttributeValue(type: string, name: string): string | null;\r
    getOwnedAttributeValue(type: string, name: string): string | null;\r
    hasAttribute(type: string, name: string): boolean;\r
    hasOwnedAttribute(type: string, name: string): boolean;\r
    getAttributeDefinitions(): ScriptAttribute[];\r
    getPromotedDefinitionAttributes(): ScriptAttribute[];\r
\r
    // --- Labels ------------------------------------------------------------\r
    getLabels(name?: string): ScriptAttribute[];\r
    getOwnedLabels(name?: string): ScriptAttribute[];\r
    getLabel(name: string): ScriptAttribute | null;\r
    getOwnedLabel(name: string): ScriptAttribute | null;\r
    getLabelValue(name: string): string | null;\r
    getOwnedLabelValue(name: string): string | null;\r
    hasLabel(name: string): boolean;\r
    hasOwnedLabel(name: string): boolean;\r
    hasLabelOrDisabled(name: string): boolean;\r
    isLabelTruthy(name: string): boolean;\r
\r
    // --- Relations ---------------------------------------------------------\r
    getRelations(name?: string): ScriptAttribute[];\r
    getOwnedRelations(name: string): ScriptAttribute[];\r
    getRelation(name: string): ScriptAttribute | null;\r
    getOwnedRelation(name: string): ScriptAttribute | null;\r
    getRelationValue(name: string): string | null;\r
    getOwnedRelationValue(name: string): string | null;\r
    hasRelation(name: string): boolean;\r
    hasOwnedRelation(name: string): boolean;\r
    getLabelOrRelation(nameWithPrefix: string): string | null;\r
    getRelationTarget(name: string): Promise<ScriptFNote | null>;\r
    getRelationTargets(name: string): Promise<(ScriptFNote | null)[]>;\r
    getTargetRelations(): ScriptAttribute[];\r
    getTargetRelationSourceNotes(): Promise<ScriptFNote[]>;\r
\r
    // --- Content & attachments ---------------------------------------------\r
    getContent(): Promise<string | Uint8Array>;\r
    getJsonContent(): Promise<unknown>;\r
    getBlob(): Promise<ScriptBlob | null>;\r
    getNoteComplement(): Promise<ScriptBlob | null>;\r
    getMetadata(): Promise<ScriptNoteMetadata>;\r
    attachments: ScriptAttachment[] | null;\r
    getAttachments(): Promise<ScriptAttachment[]>;\r
    getAttachmentsByRole(role: string): Promise<ScriptAttachment[]>;\r
    getAttachmentById(attachmentId: string): Promise<ScriptAttachment | undefined>;\r
    getNotesToInheritAttributesFrom(): ScriptFNote[];\r
\r
    // --- Type & state predicates -------------------------------------------\r
    getIcon(): string;\r
    isFolder(): boolean;\r
    isShared(): boolean;\r
    isContentAvailable(): boolean;\r
    isJson(): boolean;\r
    isJavaScript(): boolean;\r
    isJsx(): boolean;\r
    isHtml(): boolean;\r
    isMarkdown(): boolean;\r
    isOptions(): boolean;\r
    isTriliumScript(): boolean;\r
    isTriliumSqlite(): boolean;\r
    isLaunchBarConfig(): boolean;\r
    isHiddenCompletely(): boolean;\r
    isInHiddenSubtree(): boolean;\r
    isEligibleForConversionToAttachment(): boolean;\r
\r
    // --- Presentation ------------------------------------------------------\r
    getColorClass(): string;\r
    getCssClass(): string;\r
    getWorkspaceIconClass(): string;\r
    getWorkspaceTabBackgroundColor(): string;\r
\r
    // --- Scripting runtime -------------------------------------------------\r
    getScriptEnv(): "frontend" | "backend" | null;\r
    executeScript(): Promise<unknown>;\r
\r
    // --- Low-level / Froca-managed -----------------------------------------\r
    // Exposed for completeness; most scripts should use the higher-level\r
    // accessors above rather than these cache fields and mutators.\r
    /** Blob ID of the current content; changes when content changes. */\r
    blobId: string;\r
    /** Map of parent note ID → branch ID. */\r
    parentToBranch: Record<string, string>;\r
    /** Map of child note ID → branch ID. */\r
    childToBranch: Record<string, string>;\r
    searchResultsLoaded?: boolean;\r
    highlightedTokens?: string[];\r
    /** Plain data representation of the note (the live object minus its cache handle). */\r
    dto: Record<string, unknown>;\r
    addParent(parentNoteId: string, branchId: string, sort?: boolean): void;\r
    addChild(childNoteId: string, branchId: string, sort?: boolean): void;\r
    sortParents(): void;\r
    sortChildren(): void;\r
    update(row: Record<string, unknown>): void;\r
    invalidateAttributeCache(): void;\r
    toString(): string;\r
}\r
\r
/** A branch (parent↔child link) as seen by frontend scripts (subset of \`FBranch\`). */\r
export interface ScriptFBranch {\r
    branchId: string;\r
    noteId: string;\r
    parentNoteId: string;\r
    notePosition: number;\r
    prefix?: string;\r
    isExpanded?: boolean;\r
    getNote(): Promise<ScriptFNote | null>;\r
    getNoteFromCache(): ScriptFNote | undefined;\r
    getParentNote(): Promise<ScriptFNote | null>;\r
    isTopLevel(): boolean;\r
}\r
\r
/** A split/tab context as seen by frontend scripts (subset of \`NoteContext\`). */\r
export interface ScriptNoteContext {\r
    ntxId: string | null;\r
    note: ScriptFNote | null;\r
    notePath: string | null;\r
    getCodeEditor(): Promise<unknown>;\r
    getTextEditor(): Promise<unknown>;\r
}\r
\r
/** Minimal day.js surface (the real API exposes the full day.js factory). */\r
export type ScriptDayjs = (date?: string | number | Date) => {\r
    format(template?: string): string;\r
    add(value: number, unit: string): ReturnType<ScriptDayjs>;\r
    subtract(value: number, unit: string): ReturnType<ScriptDayjs>;\r
    toDate(): Date;\r
};\r
\r
type Func = ((...args: unknown[]) => unknown) | string;\r
\r
/** Instance shape of \`BasicWidget\` (subset) — the base for custom frontend widgets. */\r
interface BasicWidget {\r
    /**\r
     * The widget's root jQuery element (assign in \`doRender\`, e.g. \`this.$widget = $(TPL)\`).\r
     * Typed loosely because jQuery types can't be imported into this self-contained module;\r
     * inside the editor it is a real \`JQuery<HTMLElement>\` so all jQuery methods work.\r
     */\r
    // eslint-disable-next-line @typescript-eslint/no-explicit-any\r
    $widget: any;\r
    /** Whether the widget should be shown for the current context. */\r
    isEnabled(): boolean | null | undefined;\r
    /** Builds \`this.$widget\`. Override to render the widget's DOM. */\r
    doRender(): void;\r
    /** Renders the widget and returns its root element. */\r
    render(): unknown;\r
    /** Tears down the widget; override to release resources. */\r
    cleanup(): void;\r
    /** Fluent builder: set the element id. Chainable. */\r
    id(id: string): this;\r
    /** Fluent builder: add a CSS class. Chainable. */\r
    class(className: string): this;\r
    /** Fluent builder: set an inline CSS property. Chainable. */\r
    css(name: string, value: string): this;\r
    /** Fluent builder: append child components. Chainable. */\r
    child(...components: unknown[]): this;\r
}\r
\r
/** Instance shape of \`NoteContextAwareWidget\` (subset) — reacts to the active note. */\r
interface NoteContextAwareWidget extends BasicWidget {\r
    /** The note currently shown in this widget's context. */\r
    note: ScriptFNote | null;\r
    /** The note context (split) this widget is attached to. */\r
    noteContext?: ScriptNoteContext;\r
    /** Called when the active note changes. Override to update the widget. */\r
    refreshWithNote(note: ScriptFNote | null | undefined): void | Promise<void>;\r
    /** Forces a refresh against the current note. */\r
    refresh(): void | Promise<void>;\r
}\r
\r
/** Instance shape of \`RightPanelWidget\` (subset) — a widget shown in the right sidebar. */\r
interface RightPanelWidget extends NoteContextAwareWidget {\r
    /** Title shown in the right-panel header. */\r
    readonly widgetTitle: string;\r
    /** Builds the panel body. Override to render the right-panel content. */\r
    doRenderBody(): void | Promise<void>;\r
}\r
\r
/** Constructor type allowing \`class X extends api.Widget { … }\`. */\r
type WidgetClass<T> = new (...args: unknown[]) => T;\r
\r
/** An attribute to create together with a note (see {@link ScriptCreateNoteOpts.attributes}). */\r
export interface ScriptCreateAttribute {\r
    type: "label" | "relation";\r
    name: string;\r
    value?: string;\r
    isInheritable?: boolean;\r
    position?: number;\r
}\r
\r
/** Options accepted by {@link FrontendApi.createNote}. */\r
export interface ScriptCreateNoteOpts {\r
    /** Title of the new note. */\r
    title?: string | null;\r
    /** Content of the new note (HTML for text notes, source for code notes, etc.). */\r
    content?: string | null;\r
    /** Note type, e.g. "text" (default), "code", "book". */\r
    type?: string;\r
    /** MIME type, e.g. "application/javascript;env=frontend" for a frontend code note. */\r
    mime?: string;\r
    /** Note ID of a template to apply to the new note. */\r
    templateNoteId?: string;\r
    /** Create the note as protected (only takes effect when a protected session is available). */\r
    isProtected?: boolean;\r
    /** Activate (open) the new note after creation. Defaults to \`true\`. */\r
    activate?: boolean;\r
    /** Which part of the activated note to focus. Defaults to "title". */\r
    focus?: "title" | "content";\r
    /** Where to place the note relative to the parent/target: "into" (default) or "after". */\r
    target?: string;\r
    /** Branch ID used together with \`target: "after"\`. */\r
    targetBranchId?: string;\r
    /** Attributes to set atomically on creation. */\r
    attributes?: ScriptCreateAttribute[];\r
}\r
\r
/**\r
 * The \`api\` global available inside **frontend** script notes\r
 * (\`application/javascript;env=frontend\`).\r
 */\r
export interface FrontendApi {\r
    /**\r
     * Container of all the rendered script content\r
     * */\r
    $container: unknown;\r
    /**\r
     * Note where the script execution started — the entry point of the current script bundle\r
     * (in C terms, the file containing \`main()\`). When a script is spread across multiple code\r
     * notes (descendant code notes loaded as modules via \`require()\`), every note in the\r
     * bundle shares the same \`startNote\`, while {@link currentNote} differs per note.\r
     * Messages from \`api.log()\` are grouped under this note.\r
     */\r
    startNote: ScriptFNote;\r
    /**\r
     * Note containing the source code that is currently executing (in C terms, \`__FILE__\`).\r
     * Equal to {@link startNote} unless execution has moved into a descendant module note\r
     * loaded via \`require()\`. Don't confuse this with the note open in the UI — use\r
     * \`api.getActiveContextNote()\` for that.\r
     */\r
    currentNote: ScriptFNote;\r
    /**\r
     * Entity whose event triggered this execution, or \`null\`.\r
     *\r
     * Most frontend scripts are started by the user or by the UI (startup scripts, widgets),\r
     * so this is usually \`null\`. It is set to a note when:\r
     * - the script runs through a \`~renderNote\` relation — then it's the note being rendered\r
     *   (the one carrying the relation), not the script note;\r
     * - a backend script calls \`api.runOnFrontend()\` — then it's the backend execution's\r
     *   \`originEntity\`, provided that entity was a note.\r
     */\r
    originEntity: unknown | null;\r
    /**\r
     * day.js library for date manipulation.\r
     * See {@link https://day.js.org} for documentation\r
     * @see https://day.js.org\r
     */\r
    dayjs: ScriptDayjs;\r
\r
    /** Base class for right-panel widgets — \`class X extends api.RightPanelWidget { … }\`. */\r
    RightPanelWidget: WidgetClass<RightPanelWidget>;\r
    /** Base class for note-context-aware widgets — \`class X extends api.NoteContextAwareWidget { … }\`. */\r
    NoteContextAwareWidget: WidgetClass<NoteContextAwareWidget>;\r
    /** Base class for basic widgets — \`class X extends api.BasicWidget { … }\`. */\r
    BasicWidget: WidgetClass<BasicWidget>;\r
\r
    /**\r
     * Activates note in the tree and in the note detail.\r
     *\r
     * @param notePath (or noteId)\r
     */\r
    activateNote(notePath: string): Promise<void>;\r
    /**\r
     * Activates newly created note. Compared to this.activateNote() also makes sure that frontend has been fully synced.\r
     *\r
     * @param notePath (or noteId)\r
     */\r
    activateNewNote(notePath: string): Promise<void>;\r
    /**\r
     * Open a note in a new tab.\r
     *\r
     * @method\r
     * @param notePath (or noteId)\r
     * @param activate - set to true to activate the new tab, false to stay on the current tab\r
     */\r
    openTabWithNote(notePath: string, activate: boolean): Promise<void>;\r
    /**\r
     * Open a note in a new split.\r
     *\r
     * @param notePath (or noteId)\r
     * @param activate - set to true to activate the new split, false to stay on the current split\r
     */\r
    openSplitWithNote(notePath: string, activate: boolean): Promise<void>;\r
\r
    /**\r
     * Executes given anonymous function on the backend.\r
     * Internally this serializes the anonymous function into string and sends it to backend via AJAX.\r
     * Please make sure that the supplied function is synchronous. Only sync functions will work correctly\r
     * with transaction management. If you really know what you're doing, you can call api.runAsyncOnBackendWithManualTransactionHandling()\r
     *\r
     * @method\r
     * @param func - (synchronous) function to be executed on the backend\r
     * @param params - list of parameters to the anonymous function to be sent to backend\r
     * @returns return value of the executed function on the backend\r
     */\r
    runOnBackend(func: Func, params?: unknown[]): Promise<unknown>;\r
    /**\r
     * Executes given anonymous function on the backend.\r
     * Internally this serializes the anonymous function into string and sends it to backend via AJAX.\r
     * This function is meant for advanced needs where an async function is necessary.\r
     * In this case, the automatic request-scoped transaction management is not applied,\r
     * and you need to manually define transaction via api.transactional().\r
     *\r
     * If you have a synchronous function, please use api.runOnBackend().\r
     *\r
     * @method\r
     * @param func - (synchronous) function to be executed on the backend\r
     * @param params - list of parameters to the anonymous function to be sent to backend\r
     * @returns return value of the executed function on the backend\r
     */\r
    runAsyncOnBackendWithManualTransactionHandling(func: Func, params?: unknown[]): Promise<unknown>;\r
\r
    /**\r
     * Whether backend script execution is enabled on the server (the\r
     * \`[Security] backendScriptingEnabled\` config toggle). When it's disabled,\r
     * \`api.runOnBackend()\` / \`api.runAsyncOnBackendWithManualTransactionHandling()\`\r
     * reject with a "Backend script execution is disabled" error, so check this\r
     * first to let a script degrade gracefully instead of throwing.\r
     */\r
    isBackendScriptingEnabled(): boolean;\r
    /**\r
     * Whether the SQL console is enabled on the server (the\r
     * \`[Security] sqlConsoleEnabled\` config toggle). When it's disabled, backend\r
     * scripts that run raw SQL (\`api.sql.*\`) fail, so check this before invoking\r
     * SQL-backed logic via \`api.runOnBackend()\`.\r
     */\r
    isSqlConsoleEnabled(): boolean;\r
\r
    /**\r
     * This is a powerful search method - you can search by attributes and their values, e.g.:\r
     * "#dateModified =* MONTH AND #log". See full documentation for all options at: https://triliumnext.github.io/Docs/Wiki/search.html\r
     */\r
    searchForNotes(searchString: string): Promise<ScriptFNote[]>;\r
    /**\r
     * This is a powerful search method - you can search by attributes and their values, e.g.:\r
     * "#dateModified =* MONTH AND #log". See full documentation for all options at: https://triliumnext.github.io/Docs/Wiki/search.html\r
     */\r
    searchForNote(searchString: string): Promise<ScriptFNote | null>;\r
    /**\r
     * Returns note by given noteId. If note is missing from the cache, it's loaded.\r
     */\r
    getNote(noteId: string): Promise<ScriptFNote | null>;\r
    /**\r
     * Returns list of notes. If note is missing from the cache, it's loaded.\r
     *\r
     * This is often used to bulk-fill the cache with notes which would have to be picked one by one\r
     * otherwise (by e.g. createLink())\r
     *\r
     * @param [silentNotFoundError] - don't report error if the note is not found\r
     */\r
    getNotes(noteIds: string[], silentNotFoundError?: boolean): Promise<ScriptFNote[]>;\r
    /**\r
     * Update frontend tree (note) cache from the backend.\r
     */\r
    reloadNotes(noteIds: string[]): Promise<void>;\r
    /**\r
     * Creates a new note as a child of the given parent, entirely on the frontend — no backend\r
     * scripting required (unlike \`api.runOnBackend(() => api.createTextNote(...))\`). By default the\r
     * new note is activated in the current tab with its title focused for editing; pass\r
     * \`{ activate: false }\` to create it silently.\r
     *\r
     * @param parentNotePath note path (or noteId) of the parent under which to create the note\r
     * @param opts creation options — e.g. \`{ title, content, type, mime, activate }\`\r
     * @returns the created note and its branch, resolved from the frontend cache\r
     */\r
    createNote(parentNotePath: string, opts?: ScriptCreateNoteOpts): Promise<{ note: ScriptFNote | null; branch: ScriptFBranch | undefined }>;\r
    /**\r
     * Instance name identifies particular Trilium instance. It can be useful for scripts\r
     * if some action needs to happen on only one specific instance.\r
     */\r
    getInstanceName(): string | null;\r
\r
    /**\r
     * Adds given text to the editor cursor\r
     *\r
     * @param text - this must be clear text, HTML is not supported.\r
     */\r
    addTextToActiveContextEditor(text: string): void;\r
    /**\r
     * @returns active note (loaded into center pane)\r
     */\r
    getActiveContextNote(): ScriptFNote;\r
    /**\r
     * Obtains the currently active/focused split in the current tab.\r
     *\r
     * Note that this method does not return the note context of the "Quick edit" panel, it will return the note context behind it.\r
     */\r
    getActiveContext(): ScriptNoteContext;\r
    /**\r
     * Obtains the main context of the current tab. This is the left-most split.\r
     *\r
     * Note that this method does not return the note context of the "Quick edit" panel, it will return the note context behind it.\r
     */\r
    getActiveMainContext(): ScriptNoteContext;\r
    /**\r
     * @returns returns all note contexts (splits) in all tabs\r
     */\r
    getNoteContexts(): ScriptNoteContext[];\r
    /**\r
     * @returns returns all main contexts representing tabs\r
     */\r
    getMainNoteContexts(): ScriptNoteContext[];\r
    /**\r
     * See https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_editor-Editor.html for documentation on the returned instance.\r
     *\r
     * @returns {Promise<BalloonEditor>} instance of CKEditor\r
     */\r
    getActiveContextTextEditor(): Promise<unknown>;\r
    /**\r
     * See https://codemirror.net/doc/manual.html#api\r
     *\r
     * @method\r
     * @returns instance of CodeMirror\r
     */\r
    getActiveContextCodeEditor(): Promise<unknown>;\r
    /**\r
     * Get access to the widget handling note detail. Methods like \`getWidgetType()\` and \`getTypeWidget()\` to get to the\r
     * implementation of actual widget type.\r
     */\r
    getActiveNoteDetailWidget(): Promise<unknown>;\r
    /**\r
     * @returns returns a note path of active note or null if there isn't active note\r
     */\r
    getActiveContextNotePath(): string | null;\r
    /**\r
     * Returns component which owns the given DOM element (the nearest parent component in DOM tree)\r
     *\r
     * @method\r
     * @param el DOM element\r
     */\r
    getComponentByEl(el: HTMLElement): unknown;\r
\r
    /**\r
     * Show an info toast message to the user.\r
     */\r
    showMessage(message: string, delay?: number): void;\r
    /**\r
     * Show an error toast message to the user.\r
     */\r
    showError(message: string, delay?: number): void;\r
    /**\r
     * Show an info dialog to the user.\r
     */\r
    showInfoDialog(message: string): Promise<void>;\r
    /**\r
     * Show confirm dialog to the user.\r
     * @returns promise resolving to true if the user confirmed\r
     */\r
    showConfirmDialog(message: string): Promise<boolean>;\r
    /**\r
     * Show prompt dialog to the user.\r
     *\r
     * @returns promise resolving to the answer provided by the user\r
     */\r
    showPromptDialog(props: { title?: string; message?: string; defaultValue?: string }): Promise<string | null>;\r
\r
    /**\r
     * Create a note link (jQuery object) for given note.\r
     *\r
     * @param {string} notePath (or noteId)\r
     * @param {object} [params]\r
     * @param {boolean} [params.showTooltip] - enable/disable tooltip on the link\r
     * @param {boolean} [params.showNotePath] - show also whole note's path as part of the link\r
     * @param {boolean} [params.showNoteIcon] - show also note icon before the title\r
     * @param {string} [params.title] - custom link tile with note's title as default\r
     * @param {string} [params.title=] - custom link tile with note's title as default\r
     * @returns {jQuery} - jQuery element with the link (wrapped in <span>)\r
     */\r
    createLink(notePath: string, params?: Record<string, unknown>): unknown;\r
    /** @deprecated - use api.createLink() instead */\r
    createNoteLink(notePath: string, params?: Record<string, unknown>): unknown;\r
\r
    /**\r
     * Trigger command. This is a very low-level API which should be avoided if possible.\r
     */\r
    triggerCommand(name: string, data?: Record<string, unknown>): Promise<unknown>;\r
    /**\r
     * Trigger event. This is a very low-level API which should be avoided if possible.\r
     */\r
    triggerEvent(name: string, data?: Record<string, unknown>): Promise<unknown>;\r
    /**\r
     * @param {object} $el - jquery object on which to set up the tooltip\r
     */\r
    setupElementTooltip(el: unknown): void;\r
    /**\r
     * @param {boolean} protect - true to protect note, false to unprotect\r
     */\r
    protectNote(noteId: string, protect: boolean): Promise<void>;\r
    /**\r
     * @param noteId\r
     * @param protect - true to protect subtree, false to unprotect\r
     */\r
    protectSubTree(noteId: string, protect: boolean): Promise<void>;\r
\r
    /**\r
     * Returns date-note for today. If it doesn't exist, it is automatically created.\r
     */\r
    getTodayNote(): Promise<ScriptFNote>;\r
    /**\r
     * Returns day note for a given date. If it doesn't exist, it is automatically created.\r
     *\r
     * @param date - e.g. "2019-04-29"\r
     */\r
    getDayNote(date: string): Promise<ScriptFNote>;\r
    /**\r
     * Returns day note for the first date of the week of the given date. If it doesn't exist, it is automatically created.\r
     *\r
     * @param date - e.g. "2019-04-29"\r
     */\r
    getWeekFirstDayNote(date: string): Promise<ScriptFNote>;\r
    /**\r
     * Returns week note for given date. If such a note doesn't exist, it is automatically created.\r
     *\r
     * @param date in YYYY-MM-DD format\r
     * @param rootNote - specify calendar root note, normally leave empty to use the default calendar\r
     */\r
    getWeekNote(date: string): Promise<ScriptFNote>;\r
    /**\r
     * Returns month-note. If it doesn't exist, it is automatically created.\r
     *\r
     * @param month - e.g. "2019-04"\r
     */\r
    getMonthNote(month: string): Promise<ScriptFNote>;\r
    /**\r
     * Returns quarter note for given date. If such a note doesn't exist, it is automatically created.\r
     *\r
     * @param date in YYYY-MM format\r
     * @param rootNote - specify calendar root note, normally leave empty to use the default calendar\r
     */\r
    getQuarterNote(date: string): Promise<ScriptFNote>;\r
    /**\r
     * Returns year-note. If it doesn't exist, it is automatically created.\r
     *\r
     * @method\r
     * @param {string} year - e.g. "2019"\r
     * @returns {Promise<FNote>}\r
     */\r
    getYearNote(year: string): Promise<ScriptFNote>;\r
\r
    /**\r
     * Hoist note in the current tab. See https://triliumnext.github.io/Docs/Wiki/note-hoisting.html\r
     *\r
     * @param {string} noteId - set hoisted note. 'root' will effectively unhoist\r
     */\r
    setHoistedNoteId(noteId: string): void;\r
    /**\r
     * @param keyboardShortcut - e.g. "ctrl+shift+a"\r
     * @param [namespace] specify namespace of the handler for the cases where call for bind may be repeated.\r
     *                               If a handler with this ID exists, it's replaced by the new handler.\r
     */\r
    bindGlobalShortcut(keyboardShortcut: string, handler: () => void, namespace?: string): void;\r
    /**\r
     * Trilium runs in a backend and frontend process, when something is changed on the backend from a script,\r
     * frontend will get asynchronously synchronized.\r
     *\r
     * This method returns a promise which resolves once all the backend -> frontend synchronization is finished.\r
     * Typical use case is when a new note has been created, we should wait until it is synced into frontend and only then activate it.\r
     */\r
    waitUntilSynced(): Promise<unknown>;\r
    /**\r
     * This will refresh all currently opened notes which have included note specified in the parameter\r
     *\r
     * @param includedNoteId - noteId of the included note\r
     */\r
    refreshIncludedNote(includedNoteId: string): void;\r
\r
    /**\r
     * Return randomly generated string of given length. This random string generation is NOT cryptographically secure.\r
     *\r
     * @method\r
     * @param length of the string\r
     * @returns random string\r
     */\r
    randomString(length: number): string;\r
    /**\r
     * @param size in bytes\r
     * @return formatted string\r
     */\r
    formatSize(size: number): string;\r
    /**\r
     * @param size in bytes\r
     * @return formatted string\r
     * @deprecated - use api.formatSize()\r
     */\r
    formatNoteSize(size: number): string;\r
    /**\r
     * Converts the given HTML string to Markdown.\r
     *\r
     * Unlike the backend API, this runs on the server (the HTML→Markdown\r
     * converter is backend-only), so it returns a promise.\r
     *\r
     * @param html - HTML content to convert\r
     * @returns Markdown representation of the input HTML\r
     */\r
    htmlToMarkdown(html: string): Promise<string>;\r
    /**\r
     * Converts the given Markdown string to HTML.\r
     *\r
     * Runs entirely in the browser; the promise is only needed because the\r
     * Markdown renderer is loaded on demand.\r
     *\r
     * @param markdown - Markdown content to convert\r
     * @returns HTML representation of the input Markdown\r
     */\r
    markdownToHtml(markdown: string): Promise<string>;\r
    /**\r
     * @returns date in YYYY-MM-DD format\r
     */\r
    formatDateISO(date: Date): string;\r
    /** Parses a date string into a Date. */\r
    parseDate(str: string): Date;\r
\r
    /** Per-note log message buffers shown in the UI log pane. */\r
    logMessages: Record<string, string[]>;\r
    /** Per-note spaced-update handlers for the log pane. */\r
    logSpacedUpdates: Record<string, unknown>;\r
    /**\r
     * Log given message to the log pane in UI.\r
     * Accepts multiple arguments which are joined with spaces, similar to \`console.log\`.\r
     */\r
    log(...args: unknown[]): void;\r
\r
    /** The Preact API surface (components, hooks) for render scripts. */\r
    preact: unknown;\r
}\r
\r
/** A branch (note→parent placement) as seen by backend scripts (subset of \`BBranch\`). */\r
export interface ScriptBBranch {\r
    branchId: string;\r
    noteId: string;\r
    parentNoteId: string;\r
    prefix: string | null;\r
    notePosition: number;\r
    isExpanded: boolean;\r
    getNote(): ScriptBNote;\r
    getParentNote(): ScriptBNote | null;\r
}\r
\r
/** A note revision as seen by backend scripts (subset of trilium-core's \`BRevision\`). */\r
export interface ScriptBRevision {\r
    revisionId?: string;\r
    noteId: string;\r
    type: string;\r
    mime: string;\r
    title: string;\r
    dateLastEdited?: string;\r
    utcDateLastEdited?: string;\r
    contentLength?: number;\r
    getContent(): string | Uint8Array;\r
    getJsonContent(): unknown;\r
}\r
\r
/** Result of a clone operation ({@link ScriptBNote.cloneTo}); mirrors \`CloneResponse\`. */\r
export interface ScriptCloneResponse {\r
    success: boolean;\r
    message?: string;\r
    branchId?: string;\r
    notePath?: string;\r
}\r
\r
/** A single parent→child link in a subtree ({@link ScriptBNote.getSubtree}). */\r
export interface ScriptSubtreeRelationship {\r
    parentNoteId: string;\r
    childNoteId: string;\r
}\r
\r
/** Options accepted by the subtree traversal helpers on {@link ScriptBNote}. */\r
export interface ScriptSubtreeOpts {\r
    includeArchived?: boolean;\r
    includeHidden?: boolean;\r
    resolveSearch?: boolean;\r
}\r
\r
/** Input accepted by {@link ScriptBNote.saveAttachment}. */\r
export interface ScriptSaveAttachmentInput {\r
    attachmentId?: string;\r
    role: string;\r
    mime: string;\r
    title: string;\r
    content?: string | Uint8Array;\r
    position?: number;\r
}\r
\r
/** A note as seen by backend scripts (subset of trilium-core's \`BNote\`). */\r
export interface ScriptBNote {\r
    noteId: string;\r
    title: string;\r
    type: string;\r
    mime: string;\r
    isProtected: boolean;\r
    isArchived: boolean;\r
    isDeleted: boolean;\r
    /** Share root ID this note is published under, if any. */\r
    shareId: string;\r
    blobId: string;\r
    dateCreated: string;\r
    dateModified: string;\r
    utcDateCreated: string;\r
    utcDateModified: string;\r
\r
    // --- Content -----------------------------------------------------------\r
    getContent(): string | Uint8Array;\r
    setContent(content: string | Uint8Array, opts?: { forceFrontendReload?: boolean }): void;\r
    getJsonContent<T = unknown>(): T | null;\r
    getJsonContentSafely(): unknown;\r
    setJsonContent(content: unknown): void;\r
    hasStringContent(): boolean;\r
    getFileName(): string;\r
    getFlatText(): string;\r
    /** Plain serialisable representation of the note (the real return type is \`NotePojo\`). */\r
    getPojo(): Record<string, unknown>;\r
    getTitleOrProtected(): string;\r
    getIcon(): string;\r
\r
    // --- Hierarchy ---------------------------------------------------------\r
    parents: ScriptBNote[];\r
    children: ScriptBNote[];\r
    parentBranches: ScriptBBranch[];\r
    parentCount: number;\r
    childrenCount: number;\r
    getParentNotes(): ScriptBNote[];\r
    getChildNotes(): ScriptBNote[];\r
    getVisibleChildNotes(): ScriptBNote[];\r
    getParentBranches(): ScriptBBranch[];\r
    getChildBranches(): ScriptBBranch[];\r
    getVisibleChildBranches(): ScriptBBranch[];\r
    getStrongParentBranches(): ScriptBBranch[];\r
    getFilteredChildBranches(): ScriptBBranch[];\r
    getBranches(): ScriptBBranch[];\r
    hasChildren(): boolean;\r
    hasVisibleChildren(): boolean;\r
    getAncestors(): ScriptBNote[];\r
    getAncestorNoteIds(): string[];\r
    getDescendantNoteIds(): string[];\r
    getDistanceToAncestor(ancestorNoteId: string): number;\r
    hasAncestor(ancestorNoteId: string): boolean;\r
    isDescendantOfNote(ancestorNoteId: string): boolean;\r
    isRoot(): boolean;\r
    getSubtree(opts?: ScriptSubtreeOpts): {\r
        notes: ScriptBNote[];\r
        relationships: ScriptSubtreeRelationship[];\r
    };\r
    getSubtreeNoteIds(opts?: ScriptSubtreeOpts): string[];\r
    getSubtreeNotesIncludingTemplated(): ScriptBNote[];\r
    getInheritingNotes(): ScriptBNote[];\r
\r
    // --- Note paths --------------------------------------------------------\r
    getAllNotePaths(): string[][];\r
    getBestNotePath(hoistedNoteId?: string): string[];\r
    getBestNotePathString(hoistedNoteId?: string): string;\r
    getSortedNotePathRecords(hoistedNoteId?: string): ScriptNotePathRecord[];\r
    areAllNotePathsArchived(): boolean;\r
\r
    // --- Attributes (read) -------------------------------------------------\r
    ownedAttributes: ScriptAttribute[];\r
    targetRelations: ScriptAttribute[];\r
    attributeCount: number;\r
    ownedAttributeCount: number;\r
    labelCount: number;\r
    ownedLabelCount: number;\r
    relationCount: number;\r
    relationCountIncludingLinks: number;\r
    ownedRelationCount: number;\r
    ownedRelationCountIncludingLinks: number;\r
    targetRelationCount: number;\r
    targetRelationCountIncludingLinks: number;\r
    getAttributes(type?: string, name?: string): ScriptAttribute[];\r
    getOwnedAttributes(type?: string, name?: string): ScriptAttribute[];\r
    getAttribute(type: string, name: string): ScriptAttribute | null;\r
    getOwnedAttribute(type: string, name: string, value?: string | null): ScriptAttribute | null;\r
    getAttributeValue(type: string, name: string): string | null;\r
    getOwnedAttributeValue(type: string, name: string): string | null;\r
    getAttributeById(attributeId: string): ScriptAttribute | undefined;\r
    getAttributeCaseInsensitive(\r
        type: string,\r
        name: string,\r
        value?: string | null\r
    ): ScriptAttribute | undefined;\r
    hasAttribute(type: string, name: string): boolean;\r
    hasOwnedAttribute(type: string, name: string, value?: string): boolean;\r
    getLabelDefinitions(): ScriptAttribute[];\r
    getRelationDefinitions(): ScriptAttribute[];\r
    getTargetRelations(): ScriptAttribute[];\r
\r
    // --- Labels ------------------------------------------------------------\r
    getLabel(name: string): ScriptAttribute | null;\r
    getOwnedLabel(name: string): ScriptAttribute | null;\r
    getLabels(name?: string): ScriptAttribute[];\r
    getOwnedLabels(name: string): ScriptAttribute[];\r
    getLabelValue(name: string): string | null;\r
    getOwnedLabelValue(name: string): string | null;\r
    getLabelValues(name: string): string[];\r
    getOwnedLabelValues(name: string): string[];\r
    hasLabel(name: string): boolean;\r
    hasOwnedLabel(name: string, value?: string): boolean;\r
    isLabelTruthy(name: string): boolean;\r
    hasInheritableArchivedLabel(): boolean;\r
\r
    // --- Relations ---------------------------------------------------------\r
    getRelation(name: string): ScriptAttribute | null;\r
    getOwnedRelation(name: string): ScriptAttribute | null;\r
    getRelations(name?: string): ScriptAttribute[];\r
    getOwnedRelations(name?: string | null): ScriptAttribute[];\r
    getRelationValue(name: string): string | null;\r
    getOwnedRelationValue(name: string): string | null;\r
    getRelationTarget(name: string): ScriptBNote | null;\r
    hasRelation(name: string, value?: string): boolean;\r
    hasOwnedRelation(name: string, value?: string): boolean;\r
\r
    // --- Attributes (write) ------------------------------------------------\r
    addLabel(name: string, value?: string, isInheritable?: boolean): ScriptAttribute;\r
    addRelation(name: string, targetNoteId: string, isInheritable?: boolean): ScriptAttribute;\r
    addAttribute(\r
        type: string,\r
        name: string,\r
        value?: string,\r
        isInheritable?: boolean\r
    ): ScriptAttribute;\r
    setLabel(name: string, value?: string): void;\r
    setRelation(name: string, value?: string): void;\r
    setAttribute(type: string, name: string, value?: string): void;\r
    setAttributeValueById(attributeId: string, value?: string): void;\r
    toggleLabel(enabled: boolean, name: string, value?: string): void;\r
    toggleRelation(enabled: boolean, name: string, value?: string): void;\r
    toggleAttribute(type: string, enabled: boolean, name: string, value?: string): void;\r
    removeLabel(name: string, value?: string): void;\r
    removeRelation(name: string, value?: string): void;\r
    removeAttribute(type: string, name: string, value?: string): void;\r
    isInherited(): boolean;\r
\r
    // --- Revisions & attachments -------------------------------------------\r
    revisionCount: number | null;\r
    getRevisions(): ScriptBRevision[];\r
    saveRevision(opts?: { description?: string; source?: string }): ScriptBRevision;\r
    getAttachments(): ScriptAttachment[];\r
    getAttachmentById(attachmentId: string): ScriptAttachment;\r
    getAttachmentByTitle(title: string): ScriptAttachment | undefined;\r
    getAttachmentsByRole(role: string): ScriptAttachment[];\r
    saveAttachment(\r
        attachment: ScriptSaveAttachmentInput,\r
        matchBy?: "attachmentId" | "title"\r
    ): ScriptAttachment;\r
    convertToParentAttachment(opts?: Record<string, unknown>): ScriptAttachment | null;\r
    isEligibleForConversionToAttachment(opts?: Record<string, unknown>): boolean;\r
\r
    // --- Sizes -------------------------------------------------------------\r
    contentSize: number | null;\r
    contentAndAttachmentsSize: number | null;\r
    contentAndAttachmentsAndRevisionsSize: number | null;\r
\r
    // --- Tree operations ---------------------------------------------------\r
    cloneTo(parentNoteId: string): ScriptCloneResponse;\r
    deleteNote(deleteId?: string | null): void;\r
    sortParents(): void;\r
    sortChildren(): void;\r
\r
    // --- Search ------------------------------------------------------------\r
    searchNotesInSubtree(searchString: string): ScriptBNote[];\r
    searchNoteInSubtree(searchString: string): ScriptBNote | null;\r
    getSearchResultNotes(): ScriptBNote[];\r
\r
    // --- Type & state predicates -------------------------------------------\r
    isFolder(): boolean;\r
    isContentAvailable(): boolean;\r
    isStringNote(): boolean;\r
    isHtml(): boolean;\r
    isImage(): boolean;\r
    isJavaScript(): boolean;\r
    isJsx(): boolean;\r
    isJson(): boolean;\r
    isMarkdown(): boolean;\r
    isOptions(): boolean;\r
    isLaunchBarConfig(): boolean;\r
    isHiddenCompletely(): boolean;\r
    isInHiddenSubtree(): boolean;\r
\r
    // --- Scripting runtime -------------------------------------------------\r
    getScriptEnv(): "frontend" | "backend" | null;\r
    executeScript(): unknown;\r
}\r
\r
/** Result of the backend note-creation helpers. */\r
export interface ScriptNoteAndBranch {\r
    note: ScriptBNote;\r
    branch: ScriptBBranch;\r
}\r
\r
/**\r
 * Minimal Express \`Request\` surface available to **custom request handlers**\r
 * (a subset of Express's \`Request\` — re-declared here to keep this module\r
 * self-contained). Only the commonly used members are typed; the real object is\r
 * a full Express request.\r
 */\r
export interface ScriptRequest {\r
    /** Route/path parameters. */\r
    params: Record<string, string>;\r
    /** Parsed query-string parameters. */\r
    query: Record<string, unknown>;\r
    /** Parsed request body (requires a matching body parser). */\r
    body: unknown;\r
    /** Request headers (lower-cased names). */\r
    headers: Record<string, string | string[] | undefined>;\r
    /** HTTP method, e.g. "GET", "POST". */\r
    method: string;\r
    /** Request URL (path + query string). */\r
    url: string;\r
    /** Returns the value of the given (case-insensitive) header. */\r
    get(headerName: string): string | undefined;\r
}\r
\r
/**\r
 * Minimal Express \`Response\` surface available to **custom request handlers**\r
 * (a subset of Express's \`Response\`). Write the HTTP response through this\r
 * object, e.g. \`api.res.status(200).json({ ok: true })\`.\r
 */\r
export interface ScriptResponse {\r
    /** Sets the HTTP status code (chainable). */\r
    status(code: number): ScriptResponse;\r
    /** Sends the response body (string, Buffer, object, …) and ends the response. */\r
    send(body?: unknown): ScriptResponse;\r
    /** Sends a JSON response and ends the response. */\r
    json(body: unknown): ScriptResponse;\r
    /** Sets a response header (chainable). */\r
    setHeader(name: string, value: string | string[]): ScriptResponse;\r
    /** Sets a response header (Express alias of \`setHeader\`, chainable). */\r
    set(field: string, value?: string): ScriptResponse;\r
    /** Redirects to the given URL. */\r
    redirect(url: string): void;\r
    /** Ends the response without further data. */\r
    end(): void;\r
}\r
\r
/**\r
 * The \`api\` global available inside **backend** script notes\r
 * (\`application/javascript;env=backend\`). Runs server-side: no DOM, no jQuery.\r
 */\r
export interface BackendApi {\r
    /**\r
     * Note where the script execution started — the entry point of the current script bundle\r
     * (in C terms, the file containing \`main()\`). When a script is spread across multiple code\r
     * notes (descendant code notes loaded as modules via \`require()\`), every note in the\r
     * bundle shares the same \`startNote\`, while {@link currentNote} differs per note.\r
     * Messages from \`api.log()\` are grouped under this note.\r
     *\r
     * When a frontend script calls \`api.runOnBackend()\`, the frontend's \`startNote\` is\r
     * preserved here; since that note may not be resolvable on the backend, this can be null.\r
     */\r
    startNote?: ScriptBNote | null;\r
    /**\r
     * Note containing the source code that is currently executing (in C terms, \`__FILE__\`).\r
     * Equal to {@link startNote} unless execution has moved into a descendant module note\r
     * loaded via \`require()\`. Don't confuse this with the concept of the active note in\r
     * the UI.\r
     */\r
    currentNote: ScriptBNote;\r
    /**\r
     * Entity whose event triggered this execution; \`undefined\` when the run was not\r
     * event-driven (e.g. started manually via "Execute script" or \`note.executeScript()\`).\r
     *\r
     * What it holds depends on the trigger:\r
     * - \`~runOnNoteCreation\`, \`~runOnNoteChange\`, \`~runOnNoteTitleChange\`,\r
     *   \`~runOnNoteContentChange\` — the affected note;\r
     * - \`~runOnChildNoteCreation\` — the newly created child note;\r
     * - \`~runOnAttributeCreation\`, \`~runOnAttributeChange\` — the attribute;\r
     * - \`~runOnBranchCreation\`, \`~runOnBranchChange\`, \`~runOnBranchDeletion\` — the branch;\r
     * - scheduled scripts (\`#run=backendStartup\` / \`#run=hourly\` / \`#run=daily\`) — the\r
     *   script note itself;\r
     * - search scripts (\`~searchScript\`) — the search note.\r
     */\r
    originEntity?: unknown | null;\r
\r
    /**\r
     * Express request object. Available only inside custom request handlers — a note\r
     * with the \`#customRequestHandler\` label, invoked via a \`/custom/...\` URL. The\r
     * editor surfaces this member only for such notes (where the request always\r
     * supplies it), so it is non-optional rather than forcing a null-check.\r
     */\r
    req: ScriptRequest;\r
    /**\r
     * Express response object — write the HTTP response here, e.g.\r
     * \`api.res.status(200).json({ ok: true })\`. Available only inside custom request\r
     * handlers (where it is always supplied), so it is non-optional.\r
     */\r
    res: ScriptResponse;\r
    /**\r
     * The capture groups from the \`#customRequestHandler\` regex that matched this\r
     * request's URL, in order. Available only inside custom request handlers.\r
     */\r
    pathParams: string[];\r
\r
    /**\r
     * day.js library for date manipulation. See {@link https://day.js.org} for documentation\r
     */\r
    dayjs: ScriptDayjs;\r
    /**\r
     * xml2js library for XML parsing. See {@link https://github.com/Leonidas-from-XIV/node-xml2js} for documentation\r
     */\r
    xml2js: unknown;\r
    /**\r
     * cheerio library for HTML parsing and manipulation. See {@link https://cheerio.js.org} for documentation\r
     * @deprecated cheerio will be removed in a future version. Use api.htmlParser (node-html-parser) instead.\r
     */\r
    cheerio: unknown;\r
    /**\r
     * node-html-parser library for HTML parsing. See {@link https://github.com/piotr-nicol/node-html-parser} for documentation.\r
     * This is the recommended replacement for cheerio.\r
     */\r
    htmlParser: unknown;\r
\r
    /**\r
     * Instance name identifies particular Trilium instance. It can be useful for scripts\r
     * if some action needs to happen on only one specific instance.\r
     */\r
    getInstanceName(): string | null;\r
\r
    /** Returns a note by its ID, or null. */\r
    getNote(noteId: string): ScriptBNote | null;\r
    /** Returns a branch by its ID, or null. */\r
    getBranch(branchId: string): ScriptBBranch | null;\r
    /** Returns an attribute by its ID, or null. */\r
    getAttribute(attributeId: string): ScriptAttribute | null;\r
    /** Returns an attachment by its ID, or null. */\r
    getAttachment(attachmentId: string): unknown | null;\r
    /** Returns a revision by its ID, or null. */\r
    getRevision(revisionId: string): unknown | null;\r
    /** Returns an ETAPI token by its ID, or null. */\r
    getEtapiToken(etapiTokenId: string): unknown | null;\r
    /** Returns all ETAPI tokens. */\r
    getEtapiTokens(): unknown[];\r
    /** Returns an option by name, or null. */\r
    getOption(optionName: string): unknown | null;\r
    /** Returns all options. */\r
    getOptions(): unknown[];\r
\r
    /**\r
     * This is a powerful search method - you can search by attributes and their values, e.g.:\r
     * "#dateModified =* MONTH AND #log". See {@link https://triliumnext.github.io/Docs/Wiki/search.html} for full documentation for all options\r
     */\r
    searchForNotes(query: string, searchParams?: Record<string, unknown>): ScriptBNote[];\r
    /**\r
     * This is a powerful search method - you can search by attributes and their values, e.g.:\r
     * "#dateModified =* MONTH AND #log". See {@link https://triliumnext.github.io/Docs/Wiki/search.html} for full documentation for all options\r
     */\r
    searchForNote(query: string, searchParams?: Record<string, unknown>): ScriptBNote | null;\r
    /**\r
     * Retrieves notes with given label name & value\r
     *\r
     * @param name - attribute name\r
     * @param value - attribute value\r
     */\r
    getNotesWithLabel(name: string, value?: string): ScriptBNote[];\r
    /**\r
     * Retrieves first note with given label name & value\r
     *\r
     * @param name - attribute name\r
     * @param value - attribute value\r
     */\r
    getNoteWithLabel(name: string, value?: string): ScriptBNote | null;\r
\r
    /**\r
     * If there's no branch between note and parent note, create one. Otherwise, do nothing. Returns the new or existing branch.\r
     *\r
     * @param prefix - if branch is created between note and parent note, set this prefix\r
     */\r
    ensureNoteIsPresentInParent(noteId: string, parentNoteId: string, prefix?: string): { branch: ScriptBBranch | null };\r
    /**\r
     * If there's a branch between note and parent note, remove it. Otherwise, do nothing.\r
     */\r
    ensureNoteIsAbsentFromParent(noteId: string, parentNoteId: string): void;\r
    /**\r
     * Based on the value, either create or remove branch between note and parent note.\r
     *\r
     * @param present - true if we want the branch to exist, false if we want it gone\r
     * @param prefix - if branch is created between note and parent note, set this prefix\r
     */\r
    toggleNoteInParent(present: boolean, noteId: string, parentNoteId: string, prefix?: string): void;\r
\r
    /**\r
     * Create text note. See also createNewNote() for more options.\r
     */\r
    createTextNote(parentNoteId: string, title: string, content: string): ScriptNoteAndBranch;\r
    /**\r
     * Create data note - data in this context means object serializable to JSON. Created note will be of type 'code' and\r
     * JSON MIME type. See also createNewNote() for more options.\r
     */\r
    createDataNote(parentNoteId: string, title: string, content: object): ScriptNoteAndBranch;\r
    /**\r
     * @returns object contains newly created entities note and branch\r
     */\r
    createNewNote(params: {\r
        parentNoteId: string;\r
        title: string;\r
        content: string | Uint8Array;\r
        type: string;\r
        mime?: string;\r
        [key: string]: unknown;\r
    }): ScriptNoteAndBranch;\r
\r
    /** Per-note log message buffers shown in the UI log pane. */\r
    logMessages: Record<string, string[]>;\r
    /** Per-note spaced-update handlers for the log pane. */\r
    logSpacedUpdates: Record<string, unknown>;\r
    /**\r
     * Log given message to trilium logs and log pane in UI.\r
     * Accepts multiple arguments which are joined with spaces, similar to \`console.log\`.\r
     */\r
    log(...args: unknown[]): void;\r
\r
    /**\r
     * Returns root note of the calendar.\r
     */\r
    getRootCalendarNote(): ScriptBNote | null;\r
    /**\r
     * Returns day note for given date. If such note doesn't exist, it is created.\r
     *\r
     * @method\r
     * @param date in YYYY-MM-DD format\r
     * @param rootNote - specify calendar root note, normally leave empty to use the default calendar\r
     */\r
    getDayNote(date: string, rootNote?: ScriptBNote): ScriptBNote | null;\r
    /**\r
     * Returns today's day note. If such note doesn't exist, it is created.\r
     *\r
     * @param rootNote specify calendar root note, normally leave empty to use the default calendar\r
     */\r
    getTodayNote(rootNote?: ScriptBNote): ScriptBNote | null;\r
    /**\r
     * Returns note for the first date of the week of the given date.\r
     *\r
     * @param date in YYYY-MM-DD format\r
     * @param rootNote - specify calendar root note, normally leave empty to use the default calendar\r
     */\r
    getWeekFirstDayNote(date: string, rootNote?: ScriptBNote): ScriptBNote | null;\r
    /**\r
     * Returns week note for given date. If such a note doesn't exist, it is created.\r
     *\r
     * <p>\r
     * If the calendar does not support week notes, this method will return \`null\`.\r
     *\r
     * @param date in YYYY-MM-DD format\r
     * @param rootNote - specify calendar root note, normally leave empty to use the default calendar\r
     * @return an existing or newly created week note, or \`null\` if the calendar does not support week notes.\r
     */\r
    getWeekNote(date: string, rootNote?: ScriptBNote): ScriptBNote | null;\r
    /**\r
     * Returns month note for given date. If such a note doesn't exist, it is created.\r
     *\r
     * @param date in YYYY-MM format\r
     * @param rootNote - specify calendar root note, normally leave empty to use the default calendar\r
     */\r
    getMonthNote(date: string, rootNote?: ScriptBNote): ScriptBNote | null;\r
    /**\r
     * Returns quarter note for given date. If such a note doesn't exist, it is created.\r
     *\r
     * @param date in YYYY-MM format\r
     * @param rootNote - specify calendar root note, normally leave empty to use the default calendar\r
     */\r
    getQuarterNote(date: string, rootNote?: ScriptBNote): ScriptBNote | null;\r
    /**\r
     * Returns year note for given year. If such a note doesn't exist, it is created.\r
     *\r
     * @param year in YYYY format\r
     * @param rootNote - specify calendar root note, normally leave empty to use the default calendar\r
     */\r
    getYearNote(year: string, rootNote?: ScriptBNote): ScriptBNote | null;\r
\r
    /**\r
     * Sort child notes of a given note.\r
     */\r
    sortNotes(parentNoteId: string, sortConfig: { sortBy?: string; reverse?: boolean; foldersFirst?: boolean }): void;\r
    /**\r
     * This method finds note by its noteId and prefix and either sets it to the given parentNoteId\r
     * or removes the branch (if parentNoteId is not given).\r
     *\r
     * This method looks similar to toggleNoteInParent() but differs because we're looking up branch by prefix.\r
     *\r
     * @deprecated this method is pretty confusing and serves specialized purpose only\r
     */\r
    setNoteToParent(noteId: string, prefix: string, parentNoteId: string | null): void;\r
    /**\r
     * This functions wraps code which is supposed to be running in transaction. If transaction already\r
     * exists, then we'll use that transaction.\r
     *\r
     * @param func\r
     * @returns result of func callback\r
     */\r
    transactional<T>(func: () => T): T;\r
\r
    /**\r
     * Return randomly generated string of given length. This random string generation is NOT cryptographically secure.\r
     *\r
     * @param length of the string\r
     * @returns random string\r
     */\r
    randomString(length: number): string;\r
    /**\r
     * @param to escape\r
     * @returns escaped string\r
     */\r
    escapeHtml(str: string): string;\r
    /**\r
     * @param string to unescape\r
     * @returns unescaped string\r
     */\r
    unescapeHtml(str: string): string;\r
    /**\r
     * Converts the given HTML string to Markdown.\r
     *\r
     * @param html - HTML content to convert\r
     * @returns Markdown representation of the input HTML\r
     */\r
    htmlToMarkdown(html: string): string;\r
    /**\r
     * Converts the given Markdown string to HTML.\r
     *\r
     * @param markdown - Markdown content to convert\r
     * @returns HTML representation of the input Markdown\r
     */\r
    markdownToHtml(markdown: string): string;\r
    /**\r
     * sql\r
     * @type {module:sql}\r
     */\r
    sql: unknown;\r
    /** Application info (version, build date, etc.). */\r
    getAppInfo(): unknown;\r
\r
    /**\r
     * Creates a new launcher to the launchbar. If the launcher (id) already exists, it will be updated.\r
     */\r
    createOrUpdateLauncher(opts: {\r
        id: string;\r
        type: "note" | "script" | "customWidget";\r
        title: string;\r
        isVisible: boolean;\r
        icon: string;\r
        keyboardShortcut: string;\r
        targetNoteId?: string;\r
        scriptNoteId?: string;\r
        widgetNoteId?: string;\r
    }): { note: ScriptBNote };\r
    /**\r
     * @param format - either 'html' or 'markdown'\r
     */\r
    exportSubtreeToZipFile(noteId: string, format: "markdown" | "html", zipFilePath: string): Promise<void>;\r
    /**\r
     * Executes given anonymous function on the frontend(s).\r
     * Internally, this serializes the anonymous function into string and sends it to frontend(s) via WebSocket.\r
     * Note that there can be multiple connected frontend instances (e.g. in different tabs). In such case, all\r
     * instances execute the given function.\r
     *\r
     * @param script - script to be executed on the frontend\r
     * @param params - list of parameters to the anonymous function to be sent to frontend\r
     * @returns no return value is provided.\r
     */\r
    runOnFrontend(script: (() => void) | string, params?: unknown[]): void;\r
    /**\r
     * Sync process can make data intermittently inconsistent. Scripts which require strong data consistency\r
     * can use this function to wait for a possible sync process to finish and prevent new sync process from starting\r
     * while it is running.\r
     *\r
     * Because this is an async process, the inner callback doesn't have automatic transaction handling, so in case\r
     * you need to make some DB changes, you need to surround your call with api.transactional(...)\r
     *\r
     * @param callback - function to be executed while sync process is not running\r
     * @returns resolves once the callback is finished (callback is awaited)\r
     */\r
    runOutsideOfSync(callback: () => void): Promise<void>;\r
    /**\r
     * @param backupName - If the backupName is e.g. "now", then the backup will be written to "backup-now.db" file\r
     * @returns resolves once the backup is finished\r
     */\r
    backupNow(backupName: string): Promise<string>;\r
    /**\r
     * Enables the complete duplication of the specified original note and all its children into the specified parent note.\r
     * The new note will be named the same as the original, with (Dup) added to the end of it.\r
     *\r
     * @param origNoteId - the noteId for the original note to be duplicated\r
     * @param newParentNoteId - the noteId for the parent note where the duplication is to be placed.\r
     *\r
     * @returns the note and the branch of the newly created note.\r
     */\r
    duplicateSubtree(origNoteId: string, newParentNoteId: string): ScriptNoteAndBranch;\r
}\r
`;export{e as default};