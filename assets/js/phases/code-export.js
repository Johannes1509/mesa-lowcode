class CodeExportController extends AbstractPhase{
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

        //sending data to backend
        main.sendModelDataToServer(true)

        $(".show-generating-message").addClass("d-none")
        $(".code-download-card").removeClass("d-none")
    }
}