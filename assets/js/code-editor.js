class CodeEditor{

    constructor(){
        ace.require("ace/ext/language_tools")
        
        this.editor = ace.edit("ace-editor");
        this.editor.setTheme("ace/theme/textmate");
        this.editor.session.setMode("ace/mode/python");
        
        this.currentCaller = undefined
    }

    open(caller){
        this.currentCaller = caller
        this.editor.setValue($(this.currentCaller).val())
        $("#code-editor-modal").fadeIn()
    }

    close(){
        $("#code-editor-modal").fadeOut()
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