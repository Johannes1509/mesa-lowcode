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
        let sendObject = {
            "type": "modelData",
            "data": main.data
        }
        
        connection.send(JSON.stringify(sendObject))

        $(".show-generating-message").addClass("d-none")
        $(".code-download-card").removeClass("d-none")
    }
}