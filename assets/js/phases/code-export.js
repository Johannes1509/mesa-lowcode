class CodeExportController extends AbstractPhase{
    //Phase of code export at the end of the model creation
    init(){
        this.phaseName = "export"
        this.generatedCode = undefined
    }

    startPhase(){

    }

    stopPhase(){
        $(".show-generating-message").addClass("d-none")
        $(".code-ready-card").addClass("d-none") 
        $("#code-display").val("")
        $(".code-files-container").empty()
        $("#generate-code-card").removeClass("d-none")
        this.generatedCode = undefined
    }

    getJSONData(dataModel){
        return dataModel
    }

    generateCode(){
        console.debug("Phase export: Triggering code generation")
        
        //sending data to backend
        main.sendModelDataToServer(true)
        $(".show-generating-message").addClass("d-none")
        $(".code-ready-card").removeClass("d-none")
    }

    displayGeneratedCode(generatedCode){
        this.generatedCode = generatedCode
        $("#code-display").val("")
        $("#code-files-container").empty()
        $("#generate-code-card").addClass("d-none")
        
        for(let i = 0; i < this.generatedCode.length; i++){
            let fileTemplate = $(".code-file-link.template").clone()
            fileTemplate.removeClass("template")
            fileTemplate.removeClass("d-none")
            fileTemplate.attr("codefileindex", i)
            fileTemplate.text(this.generatedCode[i]["name"])
            $("#code-files-container").append(fileTemplate)
        }
        if($("#code-files-container").children().length > 0){
            this.switchFile($("#code-files-container").children().first())
        }
        $(".code-ready-card").removeClass("d-none")
    }

    switchFile(element){
        $(".code-file-link.active").removeClass("active")
        $(element).addClass("active")
        $("#code-display").val(this.generatedCode[$(element).attr("codefileindex")]["code"])
    }
}