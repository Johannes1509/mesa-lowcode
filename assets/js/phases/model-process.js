class ModelProcessController extends AbstractPhase{
    init(){
        this.phaseName = "process"
        this.canvas = new Drawflow($("#process-canvas")[0]);
        this.canvas.start()
        this.canvas.addModule("dummy")
        this.canvas.changeModule("dummy")

        $(function() {
            $("#process-canvas-container").mousewheel(function(event, delta) {
               this.scrollLeft -= (delta * 90);
               event.preventDefault();
            });
        });
    }

    startPhase(phaseData){      
        for(var i = 0; i < phaseData["agents"].length; i++){
            let currentAgentId = phaseData["agents"][i]["id"]
            let currentAgentTypeElement = $("#agent-type-element-process").clone()
            
            currentAgentTypeElement.children().text(phaseData["agents"][i]["name"])
            currentAgentTypeElement.children().attr("agent-type-id", currentAgentId)
            $('#model-process-agent-types-select').append(currentAgentTypeElement)
        }

        if(phaseData["process"] == undefined){
            main.data["process"] = {}

            for(var i = 0; i < phaseData["agents"].length; i++){
                let currentAgentId = phaseData["agents"][i]["id"]
                this.canvas.addModule("agent-"+currentAgentId)
                this.canvas.changeModule("agent-"+currentAgentId)

                this.canvas.addNode('start', 0, 1, 150, 300, 'start-element', {}, $("#agent-process-start-element").html())
                this.canvas.addNode('end', 1, 0, 600, 300, 'start-element', {}, $("#agent-process-end-element").html())          
            }
        }else{
            this.canvas.import(phaseData["process"]["drawflowExport"])
        }
        
    
        this.canvas.changeModule("dummy")
    }

    stopPhase(){
        $('#model-process-agent-types-select').empty()
    }

    getJSONData(){
        let processData = {}
        let exportData = this.canvas.export()
        processData["drawflowExport"] = exportData

        for(let exportItem in exportData["drawflow"]){
            if(exportItem != "dummy" && exportItem != "Home"){
                processData[exportItem.replace('agent-','')] = exportData["drawflow"][exportItem]
                this.canvas.removeModule(exportItem)
            }
        }
        $('#model-process-agent-types-select-button').text("Select Agent type to model agent process")
        return processData
    }

    changeCanvasModule(triggerElement){
        $('#model-process-agent-types-select-button').text($(triggerElement).text())
        $(triggerElement).parent().parent().find("a").removeClass("active")
        $(triggerElement).addClass("active")
        this.canvas.changeModule("agent-"+$(triggerElement).attr("agent-type-id"))
    }

    addProcessStepElement(){
        this.canvas.addNode('block', 1, 1, 300, 300, 'start-element', {}, $("#agent-process-block-element").html())
    }

    updateBlockCustomCode(){
        this.canvas.updateNodeDataFromId(0, {"stepcode": "T"})
    }
}

