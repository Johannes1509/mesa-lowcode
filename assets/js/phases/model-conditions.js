class ModelConditionsController extends AbstractPhase{
    init(){
        this.phaseName = "conditions"
        this.phaseMandatories = [
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
            }
        ]

        this.tourSteps  = [{
                "element": $("#model-conditions-container button")[0],
                "title": 'Model scheduler',
                "intro": '',
                "position": "right"
            },
            {
                "element": $("#model-conditions-container button")[1],
                "title": 'Model space type',
                "intro": '',
                "position": "right"
            },
            {
                "element": $("#model-conditions-container div.card-body")[1],
                "title": 'Agent placement',
                "intro": '',
                "position": "bottom"
            }
        ]
    }

    startPhase(dataModel){
        //init model scheduler
        $('.scheduler-sort tbody').empty()
        let orderElement = $(".scheduler-order-element.template").clone()
        orderElement.removeClass("template")


        //hier muss hinzufügen nach orderNum erfolgen, falls gesetzt
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
    }

    stopPhase(){
        //destroy model scheduler
        $('.scheduler-sort tbody').sortable('destroy')
    }

    getJSONData(dataModel){        
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

        dataModel.model.description = $("#model-description-value").val()

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
    }

    changeAgentPlacement(element){
        $(element).parent().parent().parent().find("button").children().attr("class", $($(element).children()[0]).attr("class"))
        $(element).parent().parent().find("a").removeClass("active")
        $(element).addClass("active")
    }
}