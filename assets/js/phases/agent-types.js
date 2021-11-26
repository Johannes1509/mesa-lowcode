class AgentTypesController extends AbstractPhase{
    init(){
        this.agentTypes = []
        this.rowCount = 0
        this.phaseName = "agents"
        this.agentId = 0
        this.phaseMandatories = [
            {
                "title": "At least one agent type was created",
                "condition": function(){
                    return ($(".agent-type:not(.template)")[0] != undefined)
                }
            }
        ]
    }

    startPhase(){
        if(this.firstStart){
            this.addAgentType()
            this.tourSteps = [{
                    "element": $(".agent-type[agentid='0']")[0],
                    "title": 'Agent type',
                    "intro": 'Each of these elements represents a set of equal agents - an agent type. An agent type can represent, for example, groups of people or organisations that have the same characteristics and behaviour.',
                    "position": "right"
                },
                {
                    "element": $(".agent-type[agentid='0'] .agent-type-name")[0],
                    "title": 'Agent type name',
                    "intro": 'Give each type a unique and descriptive name.',
                    "position": "bottom"
                },
                {
                    "element": $(".agent-type[agentid='0'] .agent-property .row")[0],
                    "title": 'Agent type property',
                    "intro": "Each agent type has properties, e.g. a person's account balance or number of children. Give each property a name and define its type. You can also initialise each property via Python code (right field).\n\nDouble-click the right field to open a code editor (this applies to all fields of this colour).",
                    "position": "bottom"
                },
                {
                    "element": $(".agent-type[agentid='0'] .agent-type-add-property")[0],
                    "title": 'Add agent type properties',
                    "intro": 'Further properties can be added to an agent type via this button',
                    "position": "bottom"
                },
                {
                    "element": $("#add-agent-button").find("a")[0],
                    "title": 'Add new agent types',
                    "intro": 'You can create further agent types via this button',
                    "position": "left"
                }
            ]
        }
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