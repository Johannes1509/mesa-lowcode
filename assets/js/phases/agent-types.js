class AgentTypesController extends AbstractPhase{
    init(){
        this.agentTypes = []
        this.rowCount = 0
        this.phaseName = "agents"
        this.agentId = 0
    }

    startPhase(){

    }

    stopPhase(){

    }

    addAgentType(){
        let templateAgentType = $(".agent-type.template").clone()
        templateAgentType = $(templateAgentType).removeClass("template")
        $(templateAgentType).attr("agentId", this.agentId)
        $("#add-agent-button").before($(templateAgentType))
        this.addProp($(templateAgentType).find("a.btn"))
        this.agentId++
    }

    addProp(element){
        let templateAgentTypeProperty = $(".agent-property.template").clone()
        templateAgentTypeProperty = $(templateAgentTypeProperty).removeClass("template")
        $(element).prev().append(templateAgentTypeProperty)
    }

    changePropType(element){
        $(element).parent().parent().find(".active").removeClass("active")
        $(element).addClass("active")

        //set icon of the property type to the dropdown menu
        $(element).parent().parent().prev().children().attr("class", $($(element).children()[0]).attr("class"))
    }

    getJSONData(dataModel){
        let currentAgentTypes = $(".agent-type:not(.template)")


        for(let i = 0; i < currentAgentTypes.length; i++){
            let currentAgent = JSON.parse(JSON.stringify(main.agent))
            
            currentAgent["id"] = parseInt($(currentAgentTypes[i]).attr("agentId"))
            currentAgent["name"] = $(currentAgentTypes[i]).find(".agent-type-name").val()
            currentAgent["properties"] = this.__getAgentPropertiesJSON(currentAgentTypes[i])
            
            dataModel.agents.push(currentAgent)
        }

        return dataModel
    }

    __getAgentPropertiesJSON(agentType){
        let currentAgentTypeProperties = $(agentType).find(".agent-property")
        let jsonResult = []

        for(let i = 0; i < currentAgentTypeProperties.length; i++){
            jsonResult.push(
                {
                    "type": $(currentAgentTypeProperties[i]).find("a.active").attr("proptype"),
                    "name": $(currentAgentTypeProperties[i]).find(".agent-property-name").val(),
                    "value": $(currentAgentTypeProperties[i]).find(".agent-property-value").val()
                }
            )

        }

        return jsonResult
    }

    removeAgentType(triggerElement){
        $(triggerElement).closest(".agent-type").remove()
    }

    removeAgentTypeProperty(triggerElement){
        $(triggerElement).closest(".agent-property").remove()
    }
    
}