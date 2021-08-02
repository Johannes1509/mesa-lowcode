class AgentTypesController{
    constructor(){
        this.agentTypes = []
        this.rowCount = 0
    }

    addAgentType(){
        let templateAgentType = $(".agent-type-template").clone()
        templateAgentType = $(templateAgentType).removeClass("d-none")
        templateAgentType = $(templateAgentType).removeClass("agent-type-template")
        $("#add-agent-button").before($(templateAgentType))
        this.__addProperty($(templateAgentType).find("a.btn"))
    }

    __addProperty(element){
        let templateAgentTypeProperty = $(".agent-type-template-properties").clone()
        templateAgentTypeProperty = $(templateAgentTypeProperty).removeClass("d-none")
        templateAgentTypeProperty = templateAgentTypeProperty.removeClass("agent-type-template-properties")
        $(element).prev().append(templateAgentTypeProperty)
    }

    getAgentTypesInfo(){

    }

    
}