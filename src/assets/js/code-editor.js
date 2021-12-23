class CodeEditor{

    constructor(){
        ace.require("ace/ext/language_tools")
        
        this.editor = ace.edit("ace-editor");
        this.editor.setTheme("ace/theme/textmate");
        this.editor.session.setMode("ace/mode/python");
        
        this.currentCaller = undefined
    }

    open(caller, textEditorTitle){
        if(textEditorTitle){
            $("#ace-editor-title").text("Text editor")
            $("#code-editor-tips-col").addClass("d-none")
        }else{
            $("#code-editor-tips-col").removeClass("d-none")
            this.__clearEditorTips()
            this.__loadEditorTips($(caller).attr("code-target"))
        }

        this.currentCaller = caller
        this.editor.setValue($(this.currentCaller).val(), 1)
        $("#code-editor-modal").fadeIn()
    }

    close(){
        if(this.editor.getValue() != ""){
            if(!confirm('Discard text changes?')){
                return
            }
        }

        $("#code-editor-modal").fadeOut()
        $("#ace-editor-title").text("Python code editor")
        this.__clearEditorTips()
        this.editor.setValue("")
    }

    closeAndSave(){
        if(this.currentCaller == undefined){
            throw new Error("Caller of ace code editor is not set! Can not send added coded to input field!")
        }
        
        $(this.currentCaller).val(this.editor.getValue())

        $("#code-editor-modal").fadeOut()
        this.editor.setValue("")
        this.currentCaller = undefined
        
    }

    __loadEditorTips(target){
        let currentEditorTips = main.getCurrentEditorTips(target)
        for(let i = 0; i < currentEditorTips.length; i++){
            let currentTip = $(".code-editor-tip.template").clone()
            $(currentTip).removeClass("template")
            $(currentTip).removeClass("d-none")
            $(currentTip).find(".code-editor-tip-text").text(currentEditorTips[i]["tip-text"])
            $(currentTip).find(".code-editor-tip-code").text(currentEditorTips[i]["tip-code"])
            $("#code-editor-tips-container").append(currentTip)
        }
    }

    __clearEditorTips(){
        $("#code-editor-tips-container").empty()
    }

}