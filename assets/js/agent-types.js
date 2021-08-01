class AgentTypesController{
    constructor(){
        this.agentTypes = []
        
    }

    addAgentType(){
        let templateAgentType = $(".agent-type-template").clone()
        $(templateAgentType).removeClass("d-none")
        $(templateAgentType).removeClass("agent-type-template")
        $("#agent-types-container").append($(templateAgentType))
    }

    __addProperty(){

    }

    getAgentTypesInfo(){

    }

    
}