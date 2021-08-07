class ModelConditionsController extends AbstractPhase{
    init(){
        this.phaseName = "conditions"
    }

    startPhase(phaseData){
        //init model scheduler
        $('.scheduler-sort tbody').empty()
        let orderElement = $(".scheduler-order-element.template").clone()
        orderElement.removeClass("template")

        for(var i = 0; i < phaseData["agents"].length; i++){
            let currentOrderElement = orderElement.clone()
            currentOrderElement.children().next().text(phaseData["agents"][i]["name"])
            currentOrderElement.children().next().attr("agent-type-id", phaseData["agents"][i]["id"])
            $('.scheduler-sort tbody').append(currentOrderElement)
        }

        $('.scheduler-sort tbody').sortable({
            handle: 'span'
        });

        //init model space
        $('.model-space-agent-placement-container').empty()
        let spacePlacementElement = $(".model-space-agent-conf").clone()
        for(var i = 0; i < phaseData["agents"].length; i++){
            let newAgentSpaceConf = spacePlacementElement.clone()
            newAgentSpaceConf.removeClass("template")
            newAgentSpaceConf.find(".model-space-agent-name").text(phaseData["agents"][i]["name"])
            newAgentSpaceConf.attr("agent-type-id", phaseData["agents"][i]["id"])
            $(".model-space-agent-placement-container").append(newAgentSpaceConf)
        }
    }

    stopPhase(){
        //destroy model scheduler
        $('.scheduler-sort tbody').sortable('destroy')
    }

    getJSONData(){
        let jsonData = {"scheduler": {}, "space": {}}
        
        //model scheduler
        let schedulerType = $(".model-scheduler-type.active").attr("scheduler")
        jsonData.scheduler.type = schedulerType
        
        if(schedulerType == "basic"){
            let orderElements = $("table.scheduler-sort tbody").children()
            let agentOrder = []
            for(var i = 0; i < orderElements.length; i++){
                agentOrder.push({
                    "id": $($("table.scheduler-sort tbody").children()[i]).children().next().attr("agent-type-id"), 
                    "name": $($("table.scheduler-sort tbody").children()[i]).children().next().text()
                })
            }
            jsonData.scheduler.order = agentOrder
        }else{
            jsonData.scheduler.order = undefined
        }

        //model space
        let spaceType = $(".model-space-type.active").attr("space")
        jsonData.space.type = spaceType

        let agentPlacementsElements = $(".model-space-agent-conf:not(.template)")
        let agentsPlacements = []

        for(var i = 0; i < agentPlacementsElements.length; i++){
            let currentAgentId = $(agentPlacementsElements[i]).attr("agent-type-id")
            let currentAgentName = $(agentPlacementsElements[i]).find(".model-space-agent-name").text()
            let currentAgentPlacementType = $(agentPlacementsElements[i]).children().find("a.active").attr("agent-placement")
            let currentAgentPlacementCode = $(agentPlacementsElements[i]).find(".agent-space-custom-code").val()
            
            if(!currentAgentPlacementCode){
                currentAgentPlacementCode = undefined
            }

            agentsPlacements.push({
                "id": currentAgentId,
                "name": currentAgentName,
                "type": currentAgentPlacementType,
                "code": currentAgentPlacementCode
            })
        }

        jsonData.space.placement = agentsPlacements

        return jsonData
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