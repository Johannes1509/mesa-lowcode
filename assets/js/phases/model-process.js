class ModelProcessController extends AbstractPhase{
    init(){
        this.phaseName = "process"
        this.canvas = new Drawflow($("#process-canvas")[0]);
        this.canvas.start()
        this.canvas.addModule("dummy")
        this.canvas.changeModule("dummy")
        this.currentAgentId = undefined

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
                main.data["process"][currentAgentId] = {
                    "nodes": {}
                }

                this.canvas.addModule("agent-"+currentAgentId)
                this.canvas.changeModule("agent-"+currentAgentId)

                this.canvas.addNode('start', 0, 1, 150, 300, 'start-element', {}, $("#agent-process-start-element").html())
                this.canvas.addNode('end', 1, 0, 600, 300, 'start-element', {}, $("#agent-process-end-element").html())          
            }
        }else{
            this.canvas.import(phaseData["process"]["drawflowExport"])
            //updateNodeData

          
            //setTimeout(function(){
              /*  for(let agentId in phaseData["process"]){
                    if(agentId == "drawflowExport"){
                        continue
                    }
                    main.process.canvas.changeModule("agent-"+agentId)

                    for(let nodeIndex in phaseData["process"][agentId]["nodes"]){
                        let currentNode = phaseData["process"][agentId]["nodes"][nodeIndex]
                        console.log("Node: "+$("#node-3")[0])
                        console.log("Val name vorher: "+$("#node-"+currentNode["id"]).find(".agent-process-custom-name").val())
                        $("#node-"+currentNode["id"]).find(".agent-process-custom-name").val(currentNode["stepname"])
                        console.log("Val name nachher: "+$("#node-"+currentNode["id"]).find(".agent-process-custom-name").val())
                        console.log("Val code vorher: "+$("#node-"+currentNode["id"]).find(".agent-process-custom-name").val())
                        $("#node-"+currentNode["id"]).find(".agent-process-custom-code").val(currentNode["stepcode"])
                        console.log("Val code nachher: "+$("#node-"+currentNode["id"]).find(".agent-process-custom-code").val())
                    }
                }*/
                //main.process.canvas.changeModule("dummy")

           // },2000)
           

            
        }
        
    
        this.canvas.changeModule("dummy")
    }

    stopPhase(){
        $('#model-process-agent-types-select').empty()
        
    }

    getJSONData(){
        let processData = main.data.process
        let exportData = this.canvas.export()
        processData["drawflowExport"] = exportData
        for(let exportItem in exportData["drawflow"]){
            if(exportItem != "dummy" && exportItem != "Home"){
                processData[exportItem.replace('agent-','')]["drawflow-data"] = exportData["drawflow"][exportItem]
            }
        }

        processData[this.currentAgentId].nodes = this.getCurrentNodeData()
        this.canvas.clear()
        $('#model-process-agent-types-select-button').text("Select Agent type to model agent process")
        this.currentAgentId = undefined
        return processData
    }

    changeCanvasModule(triggerElement){
        $('#model-process-agent-types-select-button').text($(triggerElement).text())
        $(triggerElement).parent().parent().find("a").removeClass("active")
        $(triggerElement).addClass("active")
        let agentId = $(triggerElement).attr("agent-type-id")

        //updateNodeData - save old
        if(this.currentAgentId != undefined){
            main.data.process[this.currentAgentId].nodes = this.getCurrentNodeData()
        }

        //updateNodeData - place new
        this.currentAgentId = agentId
        this.canvas.changeModule("agent-"+this.currentAgentId)
        
        if(!(main.data.process[this.currentAgentId] == undefined) && !jQuery.isEmptyObject(main.data.process[this.currentAgentId])){
            this.setCurrentNodeData(main.data.process[this.currentAgentId].nodes)
        }
    }


    addProcessStepElement(){
        this.canvas.addNode('block', 1, 1, 300, 300, 'start-element', {}, $("#agent-process-block-element").html())
    }

    
    
    getCurrentNodeData(){
        let resultData = {}

        for(let currentNodeId = 0; currentNodeId < 10000; currentNodeId++){
            if($("#node-"+currentNodeId).find(".agent-process-custom-name")[0] == undefined){
                continue
            }

            resultData[currentNodeId] = {
                "stepname": $("#node-"+currentNodeId).find(".agent-process-custom-name").val(),
                "stepcode": $("#node-"+currentNodeId).find(".agent-process-custom-code").val()
            }
        }

        return resultData
     
    }
    
    setCurrentNodeData(nodeData){
        for(let nodeId in nodeData){
            $("#node-"+nodeId).find(".agent-process-custom-name").val(nodeData[nodeId]["stepname"])
            $("#node-"+nodeId).find(".agent-process-custom-code").val(nodeData[nodeId]["stepcode"])
        }
    }
    

}

