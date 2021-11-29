class CodeExportController extends AbstractPhase{
    //Phase of code export at the end of the model creation
    init(){
        this.phaseName = "export"
    }

    startPhase(){

    }

    stopPhase(){
        $(".show-generating-message").addClass("d-none")
        $(".code-download-card").addClass("d-none") 
    }

    getJSONData(dataModel){
        return dataModel
    }

    generateCode(){
        $(".show-generating-message").removeClass("d-none")
        console.debug("Phase export: Triggering code generation")
        
        //sending data to backend
        main.sendModelDataToServer(true)

        $(".show-generating-message").addClass("d-none")
        $(".code-download-card").removeClass("d-none")
    }
}