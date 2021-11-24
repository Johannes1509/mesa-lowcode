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

        this.connectionCheck()
    }

    startPhase(dataModel){      
        for(var i = 0; i < dataModel.agents.length; i++){
            let currentAgentId = dataModel.agents[i]["id"]
            let currentAgentTypeElement = $("#agent-type-element-process").clone()
            
            currentAgentTypeElement.children().text(dataModel.agents[i]["name"])
            currentAgentTypeElement.children().attr("agent-type-id", currentAgentId)
            $('#model-process-agent-types-select').append(currentAgentTypeElement)
        }

        if(dataModel.model.drawflow != undefined){
            this.canvas.import(dataModel.model.drawflow)
        }

        //add new modules if new agents have been added
        for(var i = 0; i < dataModel.agents.length; i++){
            if(jQuery.isEmptyObject(dataModel.agents[i].nodes)){
                this.canvas.addModule("agent-"+dataModel.agents[i].id)
                this.canvas.changeModule("agent-"+dataModel.agents[i].id)
                this.addProcessStartStopElements()
            }
        }

        this.canvas.changeModule("dummy")
    }

    stopPhase(){
        $('#model-process-agent-types-select').empty()
        
    }

    getJSONData(dataModel){

        let exportData = this.canvas.export()
        dataModel.model.drawflow = exportData
        for(let exportItem in exportData["drawflow"]){
            if(exportItem != "dummy" && exportItem != "Home"){
                dataModel.agents[exportItem.replace('agent-','')]["drawflow-data"] = exportData["drawflow"][exportItem]
            }
        }

        dataModel.agents[this.currentAgentId].nodes = this.getCurrentNodeData()
        this.canvas.clear()
        $('#model-process-agent-types-select-button').text("Select Agent type to model agent process")
        this.currentAgentId = undefined
        return dataModel
    }

    changeCanvasModule(triggerElement){
        $('#model-process-agent-types-select-button').text($(triggerElement).text())
        $(triggerElement).parent().parent().find("a").removeClass("active")
        $(triggerElement).addClass("active")
        let agentId = $(triggerElement).attr("agent-type-id")

        //updateNodeData - save old
        if(this.currentAgentId != undefined){
            main.data.agents[this.currentAgentId].nodes = this.getCurrentNodeData()
        }

        //updateNodeData - place new
        this.currentAgentId = agentId
        this.canvas.changeModule("agent-"+this.currentAgentId)
        
        if(!(main.data.agents[this.currentAgentId] == undefined) && !jQuery.isEmptyObject(main.data.agents[this.currentAgentId])){
            this.setCurrentNodeData(main.data.agents[this.currentAgentId].nodes)
        }
    }


    addProcessStartStopElements(){
        this.canvas.addNode('start', 0, 1, 150, 300, 'start-element', {}, $("#agent-process-start-element").html())
        this.canvas.addNode('end', 1, 0, 600, 300, 'start-element', {}, $("#agent-process-end-element").html())          
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
                "stepcode": $("#node-"+currentNodeId).find(".agent-process-custom-code").val(),
                "stepnumber": -1
            }
        }

        this.__getStepNumbers(resultData)

        return resultData
     
    }
    
    setCurrentNodeData(nodeData){
        for(let nodeId in nodeData){
            $("#node-"+nodeId).find(".agent-process-custom-name").val(nodeData[nodeId]["stepname"])
            $("#node-"+nodeId).find(".agent-process-custom-code").val(nodeData[nodeId]["stepcode"])
        }
    }
    
    __getStepNumbers(resultData){
        let stepNumber = 1
        if(resultData.length > 0){
            //ANHAND DER MODULE EXPORT DATEN DIE NUMMER BESTIMMEN!!!
        }

        $("this.__getStepNumber(currentNodeId)")
    }

    connectionCheck(){
        this.canvas.on('connectionCreated', function(connectionData) {
            if(main.process.__getNodeConnectionsCount(connectionData.input_id, "input") > 1 || main.process.__getNodeConnectionsCount(connectionData.output_id, "output") > 1){
                main.process.canvas.removeSingleConnection(connectionData.output_id, connectionData.input_id, connectionData.output_class, connectionData.input_class)
            }
        })
    }

    __getNodeConnectionsCount(nodeId, checkType){
        if(checkType == "input"){
            if(!jQuery.isEmptyObject(main.process.canvas.getNodeFromId(nodeId).inputs)){
                return main.process.canvas.getNodeFromId(nodeId).inputs.input_1.connections.length
            }
        }else{
            if(!jQuery.isEmptyObject(main.process.canvas.getNodeFromId(nodeId).outputs)){
                return main.process.canvas.getNodeFromId(nodeId).outputs.output_1.connections.length
            }
        }

        return 0
    }
}

