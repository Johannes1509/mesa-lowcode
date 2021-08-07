class CodeExportController extends AbstractPhase{
    init(){
        this.phaseName = "export"
    }

    startPhase(phaseData){

    }

    stopPhase(){
        $(".show-generating-message").addClass("d-none")
        $(".code-download-card").addClass("d-none") 
    }

    getJSONData(){}

    generateCode(){
        $(".show-generating-message").removeClass("d-none")

        $(".show-generating-message").addClass("d-none")
        $(".code-download-card").removeClass("d-none")
    }
}