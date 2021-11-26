class MainController{
    constructor(){
        this.introJs = introJs()
        this.intro = new IntroductionController(this)
        this.agents = new AgentTypesController(this)
        this.editor = new CodeEditor()
        this.conditions = new ModelConditionsController(this)
        this.process = new ModelProcessController(this)
        this.export = new CodeExportController(this)
        this.mandatoryFieldsCheck = this.__getMandatoryFieldCheckValueFromCookie()
        this.guidedTour =this.__getGuidedTourCheckValueFromCookie()

        this.data = {
            "model":{
                "scheduler": undefined,
                "space": undefined,
                "drawflow": undefined,
                "description": undefined
            },
            "agents": []
        }
        this.agent = {
            "id" : undefined,
            "name": undefined,
            "properties": [],
            "process": {},
            "placement": {},
            "nodes": {},
            "drawflow-data": undefined,
            "orderNum": undefined,
            "description": undefined
        }

        this.intro.beginPhase()
    }


    changePhase(forward){
        //handling main editor phase change
        let currentElement =  $(".phases").children(".phase-active")
        let newElement = forward ? $(".phases").children(".phase-active").next() : $(".phases").children(".phase-active").prev() 
        
        //mandatory conditions required check
        if(this.mandatoryFieldsCheck && forward){
            if(!this.__getPhaseByName(currentElement.attr("phase")).checkMandatoryConditions()){
                return
            }
        }

        if(newElement.length != 0){
            newElement.addClass("phase-active")
            newElement.removeClass("d-none")
            currentElement.removeClass("phase-active")
            $(".phases").children(":not(.phase-active)").addClass("d-none")
        }

        let currentPhase = this.__getPhaseByName(currentElement.attr("phase"))
        this.data = currentPhase.endPhase(this.data)
        let newPhase = this.__getPhaseByName(newElement.attr("phase"))
        newPhase.beginPhase(this.data)
        console.log(JSON.parse(JSON.stringify(this.data)))
        
        
        //handling navigation phase change
        currentElement = $(".model-phases-nav").find("a.active")
        newElement = forward ? $(".model-phases-nav").find("a.active").parent().next().find("a") : $(".model-phases-nav").find("a.active").parent().prev().find("a")
        if(newElement.length != 0){
            newElement.addClass("active")
            newElement.removeClass("disabled")
            currentElement.removeClass("active")
            $(".model-phases-nav").find("a:not(.active)").addClass("disabled")
        }

        if(newElement.parent().is(':first-child')){
            $("#last-step-button").prop('disabled', true)
        }else if(newElement.parent().is(':last-child')){
            $("#next-step-button").prop('disabled', true)
        }else{
            $("#last-step-button").prop('disabled', false)
            $("#next-step-button").prop('disabled', false)
        }

       
    }

    __getPhaseByName(phaseName){
        let phase = undefined
        switch(phaseName){
            case "intro":
                phase = this.intro
                break
            case "agents":
                phase = this.agents
                break
            case "conditions":
                phase = this.conditions
                break
            case "process":
                phase = this.process
                break
            case "export":
                phase = this.export
                break
            
        }

        return phase
    }

    __getMandatoryFieldCheckValueFromCookie(){
        let val = Cookies.get('mandatoryFieldCheck')

        if(val == undefined){
            Cookies.set("mandatoryFieldCheck", 1)
            $("#mandatory-fields-requiered").prop("checked", 1)
            return true
        }else{
            val = Boolean(parseInt(val))
            if(val == false){
                $("#mandatory-fields-requiered").prop("checked", false)
            }else{
                $("#mandatory-fields-requiered").prop("checked", true)
            }
            return val
        }
    }

    __getGuidedTourCheckValueFromCookie(){
        let val = Cookies.get('guidedTourChecked')

        if(val == undefined){
            Cookies.set("guidedTourChecked", 1)
            $("#show-guided-tour").prop("checked", true)
            return true
        }else{
            val = Boolean(parseInt(val))
            if(val == false){
                $("#show-guided-tour").prop("checked", false)
            }else{
                $("#show-guided-tour").prop("checked", true)
            }
            return val
        }
    }

    getAgentIndexById(agentId){
        for(let i = 0; i < main.data.agents.length; i++){
            if(parseInt(main.data.agents[i].id) == parseInt(agentId)){
                return i
            }
        }
        return undefined
    }

    switchGuidedTourState(element){
        main.guidedTour = element.checked
        let cookieVal = element.checked ? 1 : 0
        Cookies.set("guidedTourChecked", cookieVal)
    }

    switchMandatoryFieldsCheck(element){
        main.mandatoryFieldsCheck = element.checked
        let cookieVal = element.checked ? 1 : 0
        Cookies.set("mandatoryFieldCheck", cookieVal)
    }

    
}