class ModelConditionsController extends AbstractPhase{
    //Phase of determing model conditions e. g. space and scheduler of the model
    init(){
        this.phaseName = "conditions"

        //these conditions are mandatory conditions for the completion of the model creation phase
        this.phaseMandatories = [
            {
                "title": "The model name is set",
                "condition": function(){
                    return ($("#model-name").val() != "")
                }
            },
            {
                "title": "The model scheduler type was chosen",
                "condition": function(){
                    return ($(".model-scheduler-type.active").attr("scheduler") != undefined)
                }
            },
            {
                "title": "The model space type was chosen",
                "condition": function(){
                    return ($(".model-space-type.active").attr("space") != undefined)
                }
            },
            {
                "title": "If a space type is selected, the sizes are set",
                "condition": function(){
                    if($(".model-space-type.active").attr("space") != undefined && $(".model-space-type.active").attr("space") != "none"){
                        if($("#model-grid-size-height").val() != "" && $("#model-grid-size-width").val() != ""){
                            return true
                        }else{
                            return false
                        }
                    }
                    return true
                }
            },
        ]

        //the steps are displayed within the guided tour
        this.tourSteps  = [{
                "element": $("#model-conditions-container button")[0],
                "title": 'Model scheduler',
                "intro": 'The scheduler of a model determines the order in which the agent activities (phase "Model process") are executed within a model step.',
                "position": "right"
            },
            {
                "element": $("#model-conditions-container button")[1],
                "title": 'Model space type',
                "intro": 'The space type determines whether and how the space concept of the model is defined. For example, the "Single Grid" space type can be used to model two-dimensional grids in which each field can only be occupied by one agent.',
                "position": "right"
            },
            {
                "element": $("#model-conditions-agent-placement")[0],
                "title": 'Agent placement',
                "intro": 'If you have selected a room type, you can also influence the initial placement of the agents. To do this, they can choose between random placement and placement by Python code.',
                "position": "bottom"
            }
        ]

        //these tips are displayed when the code editor is open
        this.codeEditorTips = [
            {
                "target": "agent-placement",
                "tip-text": "Following module is already imported:",
                "tip-code": "random"
            },
            {
                "target": "agent-placement",
                "tip-text": "Allowed custom code structure:",
                "tip-code": "def [METHODNAME]():\n    [CODE]\n    return [X_POS_VALUE], [Y_POS_VALUE]"
            },
            {
                "target": "agent-placement",
                "tip-text": "Access the agent type via:",
                "tip-code": "self"
            },
            {
                "target": "agent-placement",
                "tip-text": "Access the model via:",
                "tip-code": "self.model"
            },
            {
                "target": "agent-init-number",
                "tip-text": "Following module is already imported:",
                "tip-code": "random"
            },
            {
                "target": "agent-init-number",
                "tip-text": "Allowed custom code structure:",
                "tip-code": "lambda: [LAMBDA-EXPRESSION]"
            },
            {
                "target": "agent-init-number",
                "tip-text": "Access a dict (key= Agent type name [without special chars and first char upper-case]; value=Initial number of this agent type) via:",
                "tip-code": "modelAgentNums"
            }
        ]
    }

    startPhase(dataModel){

        //init model name
        if(dataModel.model.name != undefined){
            $("#model-name").val(dataModel.model.name)
        }

        //init model description
        if(dataModel.model.description != undefined){
            $("#model-description-value").val(dataModel.model.description)
        }

        //init model scheduler
        if(dataModel.model.scheduler != undefined){
            this.changeScheduler($(".model-scheduler-type[scheduler='"+dataModel.model.scheduler+"']")[0])
        }

        $('.scheduler-sort tbody').empty()
        let orderElement = $(".scheduler-order-element.template").clone()
        orderElement.removeClass("template")

        let agentsInOrder = _.sortBy(JSON.parse(JSON.stringify(dataModel.agents)), "orderNum");
        for(var i = 0; i < agentsInOrder.length; i++){
            let currentOrderElement = orderElement.clone()
            currentOrderElement.children().next().text(agentsInOrder[i]["name"])
            currentOrderElement.children().next().attr("agent-type-id", agentsInOrder[i]["id"])
            $('.scheduler-sort tbody').append(currentOrderElement)
        }

        $('.scheduler-sort tbody').sortable({
            handle: 'span'
        });

        //init model space
        if(dataModel.model.space != undefined){
            this.changeSpace($(".model-space-type[space='"+dataModel.model.space+"']")[0])
        }

        this.__changeSpaceAdditionalItemsVisisbilty(dataModel.model.space)
        $("#model-grid-size-width").val(dataModel.model.spaceWidth)
        $("#model-grid-size-height").val(dataModel.model.spaceHeight)

        $('.model-space-agent-placement-container').empty()
        let spacePlacementElement = $(".model-space-agent-conf").clone()
        for(var i = 0; i < dataModel.agents.length; i++){
            let newAgentSpaceConf = spacePlacementElement.clone()
            newAgentSpaceConf.removeClass("template")
            newAgentSpaceConf.find(".model-space-agent-name").text(dataModel.agents[i]["name"])
            newAgentSpaceConf.attr("agent-type-id", dataModel.agents[i]["id"])
            
            if(dataModel.agents[i].placement != undefined){
                newAgentSpaceConf.find(".agent-space-custom-code").text(dataModel.agents[i].placement.code)
            }

            $(".model-space-agent-placement-container").append(newAgentSpaceConf)

            if(dataModel.agents[i].placement != undefined && dataModel.agents[i].placement.type != undefined){
                this.changeAgentPlacement($(".model-space-agent-conf[agent-type-id='"+dataModel.agents[i].id+"']").find("a[agent-placement='"+dataModel.agents[i].placement.type+"']")[0])
            }
        }

        //init model number of agents
        $('.model-init-number-of-agents').empty()
        let agentNumElement = $(".model-number-of-agent-conf").clone()
        for(var i = 0; i < dataModel.agents.length; i++){
            let newAgentNumConf = agentNumElement.clone()
            newAgentNumConf.removeClass("template")
            newAgentNumConf.find(".agent-type-name").text(dataModel.agents[i]["name"])
            newAgentNumConf.attr("agent-type-id", dataModel.agents[i]["id"])
            newAgentNumConf.find(".agent-type-initnumber-input").val(dataModel.agents[i]["initNumber"])

            $(".model-init-number-of-agents").append(newAgentNumConf)
        }

        //init model steps to take
        $("#model-steps-to-take").val(dataModel.model.stepsToTake)
    }

    stopPhase(){
        //destroy model scheduler
        $('.scheduler-sort tbody').sortable('destroy')
    }

    getJSONData(dataModel){      
        //model name 
        dataModel.model.name = $("#model-name").val()
        //model description
        dataModel.model.description = $("#model-description-value").val()

        //model scheduler
        let schedulerType = $(".model-scheduler-type.active").attr("scheduler")
        dataModel.model.scheduler = schedulerType
        
        if(schedulerType == "basic"){
            let orderElements = $("table.scheduler-sort tbody").children()
            let orderNum = 0

            for(let i = 0; i < orderElements.length; i++){
                let currentAgentId = $($("table.scheduler-sort tbody").children()[i]).children().next().attr("agent-type-id")
                dataModel.agents[main.getAgentIndexById(currentAgentId)].orderNum = orderNum
                orderNum++
            }
        }

        //model space
        dataModel.model.space = $(".model-space-type.active").attr("space")
        dataModel.model.spaceWidth = $("#model-grid-size-width").val()
        dataModel.model.spaceHeight = $("#model-grid-size-height").val()

        let agentPlacementsElements = $(".model-space-agent-conf:not(.template)")

        for(var i = 0; i < agentPlacementsElements.length; i++){
            let currentAgentId = $(agentPlacementsElements[i]).attr("agent-type-id")
            let currentAgentPlacementType = $(agentPlacementsElements[i]).children().find("a.active").attr("agent-placement")
            let currentAgentPlacementCode = $(agentPlacementsElements[i]).find(".agent-space-custom-code").val()

            if(!currentAgentPlacementCode){
                currentAgentPlacementCode = undefined
            }

            dataModel.agents[main.getAgentIndexById(currentAgentId)].placement = {
                "type": currentAgentPlacementType,
                "code": currentAgentPlacementCode
            }
        }

        //model number of agents
        let agentNumElements = $(".model-number-of-agent-conf:not(.template)")
        for(var i = 0; i < agentNumElements.length; i++){
            let currentAgentId = $(agentNumElements[i]).attr("agent-type-id")
            let currentAgentInitNumber = $(agentNumElements[i]).find(".agent-type-initnumber-input").val()
            dataModel.agents[main.getAgentIndexById(currentAgentId)].initNumber = currentAgentInitNumber
        }

        //model steps to take
        dataModel.model.stepsToTake = $("#model-steps-to-take").val()

        return dataModel
    }

    changeScheduler(element){
        $(element).parent().parent().parent().find("button").text($(element).text())
        
        $(element).parent().parent().find("a").removeClass("active")
        $(element).addClass("active")

        if($(element).attr("scheduler") == "basic"){
            $(".scheduler-order").removeClass("d-none")
        }else{
            $(".scheduler-order").addClass("d-none")
        }
    }

    changeSpace(element){
        $(element).parent().parent().parent().find("button").text($(element).text())

        $(element).parent().parent().find("a").removeClass("active")
        $(element).addClass("active")

        this.__changeSpaceAdditionalItemsVisisbilty($(element).attr("space"))
    }

    changeAgentPlacement(element){
        $(element).parent().parent().parent().find("button").children().attr("class", $($(element).children()[0]).attr("class"))
        $(element).parent().parent().find("a").removeClass("active")
        $(element).addClass("active")
    }

    __changeSpaceAdditionalItemsVisisbilty(spaceType){
        if(spaceType == "none" || spaceType == undefined){
            $("#model-conditions-agent-placement").addClass("invisible")
            $("#model-conditions-grid-size").addClass("d-none")
        }else{
            $("#model-conditions-agent-placement").removeClass("invisible")
            $("#model-conditions-grid-size").removeClass("d-none")
            if(spaceType == "continuous"){
                $("#model-space-width-text").text("Max x-position of an agent")
                $("#model-space-height-text").text("Max y-position of an agent")
            }else{
                $("#model-space-width-text").text("Number of fields in width")
                $("#model-space-height-text").text("Number of fields in height")
            }
        }
    }
}