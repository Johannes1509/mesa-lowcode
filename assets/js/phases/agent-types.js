class AgentTypesController extends AbstractPhase{
    //Phase of creating, edition and removing agent types and their properties

    init(){
        this.agentTypes = []
        this.rowCount = 0
        this.phaseName = "agents"
        this.currentAgentId = 0

        //these conditions are mandatory conditions for the completion of the model creation phase
        this.phaseMandatories = [
            {
                "title": "At least one agent type was created",
                "condition": function(){
                    return ($(".agent-type:not(.template)")[0] != undefined)
                }
            },
            {
                "title": "All created agent types have a unique name",
                "condition": function(){
                    let agentTypes = $(".agent-type:not(.template)")
                    let agentTypesNames = []
                    for(let i = 0; i < agentTypes.length; i++){
                        if($(agentTypes[i]).find(".agent-type-name").val() == "" || $(agentTypes[i]).find(".agent-type-name").val() == undefined){
                            return false
                        }
                        agentTypesNames.push($(agentTypes[i]).find(".agent-type-name").val().toLowerCase())
                    }
                    let agentTypesNamesSet = new Set(agentTypesNames)
                    if(agentTypesNames.length > agentTypesNamesSet.size){
                        return false
                    }
                    return true
                }
            }
        ]

        //the steps are displayed within the guided tour
        this.tourSteps = [{
                "element": function(){ return $(".agent-type[agentid='0'] .agent-property .row")[0]},
                "title": 'Agent type',
                "intro": 'Each of these elements represents a set of equal agents - an agent type. An agent type can represent, for example, groups of people or organisations that have the same characteristics and behaviour.',
                "position": "right"
            },
            {
                "element": function(){ return $(".agent-type[agentid='0'] .agent-type-name")[0]},
                "title": 'Agent type name',
                "intro": 'Give each type a unique and descriptive name.',
                "position": "bottom"
            },
            {
                "element": function(){ return $(".agent-type[agentid='0'] .agent-property .row")[0]},
                "title": 'Agent type property',
                "intro": "Each agent type has properties, e.g. a person's account balance or number of children. Give each property a name and define its type. You can also initialise each property via Python code (right field).\n\nDouble-click the right field to open a code editor (this applies to all fields of this colour).",
                "position": "bottom"
            },
            {
                "element": function(){ return $(".agent-type[agentid='0'] .agent-type-add-property")[0]},
                "title": 'Add agent type properties',
                "intro": 'Further properties can be added to an agent type via this button',
                "position": "bottom"
            },
            {
                "element": function(){ return $("#add-agent-button").find("a")[0]},
                "title": 'Add new agent types',
                "intro": 'You can create further agent types via this button',
                "position": "left"
            }
        ]

        //these tips are displayed when the code editor is open
        this.codeEditorTips = [
            {
                "target": "property",
                "tip-text": "Following module is already imported:",
                "tip-code": "random"
            },
            {
                "target": "property",
                "tip-text": "Allowed custom code structure:",
                "tip-code": "def [METHODNAME]():\n    [CODE]\n    return [VALUE]"
            },
            {
                "target": "property",
                "tip-text": "Access the agent type via:",
                "tip-code": "self"
            },
            {
                "target": "property",
                "tip-text": "Access the model via:",
                "tip-code": "self.model"
            }
        ]
    }

    startPhase(dataModel){
        //add content from model data
        if(dataModel.agents.length == 0){
            this.addAgentType()
        }else{
            //set new agent id counter if the data model from the server gets loaded
            for(let i = 0; i < dataModel.agents.length; i++){
                if(this.currentAgentId <= dataModel.agents[i].id){
                    this.currentAgentId = dataModel.agents[i].id+1
                }
            }

            for(let i = 0; i < dataModel.agents.length; i++){
                this.addAgentType(dataModel.agents[i])
            }
        }

        //tour steps element get loaded dynamically
        if(this.firstStart){
            for(let i = 0; i < this.tourSteps.length; i++){
                this.tourSteps[i]["element"] = this.tourSteps[i].element()
            }
        }

    }

    stopPhase(){
        $(".agent-type:not(.template)").remove()
    }

    addAgentType(agent){
        //adds an agent type element to the HTML DOM

        let templateAgentType = $(".agent-type.template").clone()
        templateAgentType = $(templateAgentType).removeClass("template")
        
        if(agent == undefined){
            $(templateAgentType).attr("agentId", this.currentAgentId)
            this.addProp($(templateAgentType).find("a.btn"))
            this.currentAgentId++
        }else{
            $(templateAgentType).attr("agentId", agent.id)
            $(templateAgentType).find(".agent-type-name").val(agent.name)
            $(templateAgentType).find("textarea").val(agent.description)

            //add properties
            for(let i = 0; i < agent.properties.length; i++){
                let newProp = this.__getProp(agent.properties[i])
                $(templateAgentType).find(".agent-type-add-property").prev().append(newProp)
            }
        }

        $("#add-agent-button").before($(templateAgentType))
    }

    addProp(element){
        //adds an agent type property element to the triggering agent type

        let newAgentProp = this.__getProp()
        $(element).prev().append(newAgentProp)
    }

    changePropType(element){
        $(element).parent().parent().find(".active").removeClass("active")
        $(element).addClass("active")

        //set icon of the property type to the dropdown menu
        $(element).parent().parent().prev().children().attr("class", $($(element).children()[0]).attr("class"))
    }

    getJSONData(dataModel){
        let currentAgentTypes = $(".agent-type:not(.template)")

        //retrieving data from the agents HTML DOM
        for(let i = 0; i < currentAgentTypes.length; i++){
            let currentAgentIndex = main.getAgentIndexById($(currentAgentTypes[i]).attr("agentId"))
            if(currentAgentIndex == undefined){
                let currentAgent = JSON.parse(JSON.stringify(main.agent))
                dataModel.agents.push(currentAgent)
                currentAgentIndex = dataModel.agents.length-1
            }
            
            dataModel.agents[currentAgentIndex]["id"] = parseInt($(currentAgentTypes[i]).attr("agentId"))
            dataModel.agents[currentAgentIndex]["name"] = $(currentAgentTypes[i]).find(".agent-type-name").val()
            dataModel.agents[currentAgentIndex]["properties"] = this.__getAgentPropertiesJSON(currentAgentTypes[i]) 
            dataModel.agents[currentAgentIndex]["description"] = $(currentAgentTypes[i]).find(".agent-description-value").val() 
        }

        //remove old agents 
        for(let i = dataModel.agents.length-1; i >= 0; i--){
            if($("div.agent-type[agentid='"+dataModel.agents[i].id+"']")[0] == undefined){
                dataModel.agents.splice(i, 1)
            }
        }

        return dataModel
    }

    removeAgentType(triggerElement){
        $(triggerElement).closest(".agent-type").remove()
    }

    removeAgentTypeProperty(triggerElement){
        $(triggerElement).closest(".agent-property").remove()
    }

    __getProp(propData){
        let templateAgentTypeProperty = $(".agent-property.template").clone()
        templateAgentTypeProperty = $(templateAgentTypeProperty).removeClass("template")

        if(propData != undefined){
            this.changePropType($(templateAgentTypeProperty).find("a[proptype='"+propData["type"]+"']"))
            $(templateAgentTypeProperty).find("input").val(propData["name"])
            $(templateAgentTypeProperty).find("textarea").val(propData["value"])
        }

        return templateAgentTypeProperty
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
}