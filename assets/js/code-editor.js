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

}