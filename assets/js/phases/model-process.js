class ModelProcessController extends AbstractPhase{
    init(){
        this.phaseName = "process"

        //these conditions are mandatory conditions for the completion of the model creation phase
        this.phaseMandatories = [
            {
                "title": "At least one process step is defined for each agent type",
                "condition": function(){
                    let blockNodes = main.process.canvas.getNodesFromName("block")
                    let moduleWithBlockNodes = {}
    
                    if(blockNodes.length == 0){
                        return false
                    }
    
                    for(let i = 0; i < blockNodes.length; i++){
                        let moduleName = main.process.canvas.getModuleFromNodeId(blockNodes[i])
                        if(moduleName in moduleWithBlockNodes){
                            moduleWithBlockNodes[moduleName].push(blockNodes[i])
                        }else{
                            moduleWithBlockNodes[moduleName] = []
                            moduleWithBlockNodes[moduleName].push(blockNodes[i])
                        }
                    }
    
                    for(let moduleName in moduleWithBlockNodes){
                        if(moduleWithBlockNodes[moduleName].length == 0){
                            return false
                        }
                    }

                    if(Object.keys(moduleWithBlockNodes).length < main.data.agents.length){
                        return false
                    }
    
                    return true
                }
            },
            {
                "title": "All process steps inputs and outputs are connected for all agent types",
                "condition": function(){
                    let blockNodes = main.process.canvas.getNodesFromName("block")
    
                    if(blockNodes.length == 0){
                        return false
                    }
    
                    for(let i = 0; i < blockNodes.length; i++){
                        let currentBlockNode = main.process.canvas.getNodeFromId(blockNodes[i])
                        if(currentBlockNode.outputs.output_1.connections.length == 0){
                            return false
                        }
                        if(currentBlockNode.inputs.input_1.connections.length == 0){
                            return false
                        }
                    }
                    return true 
                }
            },
            {
                "title": "The start element is connected with the process steps for all agent types",
                "condition": function(){
                    let startNodes = main.process.canvas.getNodesFromName("start")
    
                    if(startNodes.length == 0){
                        return false
                    }
    
                    for(let i = 0; i < startNodes.length; i++){
                        let currentStartNode = main.process.canvas.getNodeFromId(startNodes[i])
                        if(currentStartNode.outputs.output_1.connections.length == 0){
                            return false
                        }
                    }
                    return true
                }
            },
            {
                "title": "The end element is connected with the process steps for all agent types",
                "condition": function(){
                    let endNodes = main.process.canvas.getNodesFromName("end")
    
                    if(endNodes.length == 0){
                        return false
                    }
    
                    for(let i = 0; i < endNodes.length; i++){
                        let currentEndNode = main.process.canvas.getNodeFromId(endNodes[i])
                        if(currentEndNode.inputs.input_1.connections.length == 0){
                            return false
                        }
                    }  
                    return true
                }
            }
        ]

        //the steps are displayed within the guided tour
        this.tourSteps = [
            {
                "element": $("#model-process-agent-types-select-button")[0],
                "title": 'Agent type selection',
                "intro": 'Select the agent type whose behaviour you want to model. The modelled sequence is executed in each model step during model execution.',
                "position": "top"
            },
            {
                "element": $("#process-add-step")[0],
                "title": 'Process steps',
                "intro": 'Once an agent type has been selected, you can use this to add new process steps',
                "position": "top"
            }
        ]

        //these tips are displayed when the code editor is open
        this.codeEditorTips = [
            {
                "target": undefined,
                "tip-text": "Following module is already imported:",
                "tip-code": "random"
            },
            {
                "target": undefined,
                "tip-text": "Allowed custom code structure:",
                "tip-code": "def [METHODNAME]():\n    [CODE]\n    return [VALUE]"
            },
            {
                "target": undefined,
                "tip-text": "Access the agent type via:",
                "tip-code": "self"
            },
            {
                "target": undefined,
                "tip-text": "Access the agent position tuple (xpos, ypos) via:",
                "tip-code": "self.pos"
            },
            {
                "target": undefined,
                "tip-text": "Access the model via:",
                "tip-code": "self.model"
            },
            {
                "target": "process-block-step",
                "tip-text": "Following module is already imported:",
                "tip-code": "random"
            },
            {
                "target": "process-block-step",
                "tip-text": "Allowed custom code structure:",
                "tip-code": "def [METHODNAME]():\n    [CODE]"
            },
            {
                "target": "process-block-step",
                "tip-text": "Access the agent type via:",
                "tip-code": "self"
            },
            {
                "target": "process-block-step",
                "tip-text": "Access the agent position tuple (xpos, ypos) via:",
                "tip-code": "self.pos"
            },
            {
                "target": "process-block-step",
                "tip-text": "Access the model via:",
                "tip-code": "self.model"
            }
        ]
        
        //init external componenten for process modelling
        this.canvas = new CustomDrawFlow($("#process-canvas")[0]);
        this.canvas.start()
        this.canvas.addModule("dummy")
        this.canvas.changeModule("dummy")
        this.currentAgentId = undefined


        //added horizontal scrolling for model area
        $(function() {
            $("#process-canvas-container").mousewheel(function(event, delta) {
               this.scrollLeft -= (delta * 90);
               event.preventDefault();
            });
        });

        this.connectionCheck()
    }

    startPhase(dataModel){      

        //add agents types to view selection
        for(var i = 0; i < dataModel.agents.length; i++){
            let curAgentId = dataModel.agents[i]["id"]
            let currentAgentTypeElement = $("#agent-type-element-process").clone()
            
            currentAgentTypeElement.children().text(dataModel.agents[i]["name"])
            currentAgentTypeElement.children().attr("agent-type-id", curAgentId)
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

        $("#process-add-step").addClass("disabled")
        this.canvas.changeModule("dummy")
    }

    stopPhase(){
        $('#model-process-agent-types-select').empty()
        this.canvas.clear()
        $('#model-process-agent-types-select-button').text("Select Agent type to model agent process")
        this.currentAgentId = undefined
    }

    getJSONData(dataModel){
        let exportData = this.canvas.export()
        dataModel.model.drawflow = exportData
        
        for(let exportItem in exportData["drawflow"]){
            if(exportItem != "dummy" && exportItem != "Home"){
                if(dataModel.agents[exportItem.replace('agent-','')] != undefined && !jQuery.isEmptyObject(dataModel.agents[exportItem.replace('agent-','')])){
                    dataModel.agents[exportItem.replace('agent-','')]["drawflow-data"] = exportData["drawflow"][exportItem]
                }
            }
        }

        if(this.currentAgentId != undefined){
            dataModel.agents[main.getAgentIndexById(this.currentAgentId)].nodes = this.getCurrentNodeData()
        }

        return dataModel
    }

    changeCanvasModule(triggerElement){
        $("#process-add-step").removeClass("disabled")
        $('#model-process-agent-types-select-button').text($(triggerElement).text())
        $(triggerElement).parent().parent().find("a").removeClass("active")
        $(triggerElement).addClass("active")
        let agentId = $(triggerElement).attr("agent-type-id")

        //updateNodeData - save old
        if(this.currentAgentId != undefined){
            main.data.agents[main.getAgentIndexById(this.currentAgentId)].nodes = this.getCurrentNodeData()
        }

        //updateNodeData - place new
        this.currentAgentId = agentId
        this.canvas.changeModule("agent-"+this.currentAgentId)
        
        if(!(main.data.agents[main.getAgentIndexById(this.currentAgentId)] == undefined) && !jQuery.isEmptyObject(main.data.agents[main.getAgentIndexById(this.currentAgentId)])){
            this.setCurrentNodeData(main.data.agents[main.getAgentIndexById(this.currentAgentId)].nodes)
        }
    }


    addProcessStartStopElements(){
        this.canvas.addNode('start', 0, 1, 150, 300, 'start-element', {}, $(".agent-process-start-element").html())
        this.canvas.addNode('end', 1, 0, 600, 300, 'start-element', {}, $(".agent-process-end-element").html())          
    }

    addProcessStepElement(){
        this.canvas.addNode('block', 1, 1, 300, 300, 'start-element', {}, $(".agent-process-block-element").html())
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
                "description": $("#node-"+currentNodeId).find(".process-step-description").val(),
                "stepnumber": undefined
            }
        }

        resultData = main.process.__getStepNumbers(resultData)

        return resultData
     
    }
    
    setCurrentNodeData(nodeData){
        for(let nodeId in nodeData){
            $("#node-"+nodeId).find(".agent-process-custom-name").val(nodeData[nodeId]["stepname"])
            $("#node-"+nodeId).find(".agent-process-custom-code").val(nodeData[nodeId]["stepcode"])
            $("#node-"+nodeId).find(".process-step-description").val(nodeData[nodeId]["description"])
        }
    }

    connectionCheck(){
        this.canvas.on('connectionCreated', function(connectionData) {
            if(main.process.__getNodeConnectionsCount(connectionData.input_id, "input") > 1 || main.process.__getNodeConnectionsCount(connectionData.output_id, "output") > 1){
                main.process.canvas.removeSingleConnection(connectionData.output_id, connectionData.input_id, connectionData.output_class, connectionData.input_class)
            }
        })
    }

    __getStepNumbers(resultData){
        if(!jQuery.isEmptyObject(resultData)){
            for(let nodeId in resultData){
                let currentNode = main.process.canvas.getNodeFromId(nodeId)
                if(main.process.canvas.getNodeFromId(nodeId).inputs.input_1.connections.length == 0){
                    resultData[nodeId].stepnumber = undefined
                }else{
                    let prevNode = main.process.canvas.getNodeFromId(nodeId).inputs.input_1.connections[0].node
                    let stepNumber = 0
                    while(prevNode != undefined){
                        prevNode = main.process.canvas.getNodeFromId(prevNode)
                        if(!jQuery.isEmptyObject(prevNode.inputs) && !jQuery.isEmptyObject(prevNode.inputs.input_1.connections)){
                            prevNode = prevNode.inputs.input_1.connections[0].node
                            stepNumber++
                        }else{
                            prevNode = undefined
                        }
                    }
                    resultData[nodeId].stepnumber = stepNumber
                }
            }
        }
        return resultData
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

class CustomDrawFlow extends Drawflow {
    //prevent deletion of start or end nodes
    removeNodeId(id) {
        id = id.slice(5)

        if(["start", "end"].indexOf(this.getNodeFromId(id).name) >= 0){
            return
        }

        var moduleName = this.getModuleFromNodeId(id)
        if(this.module === moduleName) {
            document.getElementById("node-"+id).remove();
        }

        delete this.drawflow.drawflow[moduleName].data[id];
        this.dispatch('nodeRemoved', id);
        this.removeConnectionNodeId(id);
     
   }
}

