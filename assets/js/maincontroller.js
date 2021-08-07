class MainController{
    constructor(){
        this.agents = new AgentTypesController(this)
        this.editor = new CodeEditor()
        this.conditions = new ModelConditionsController(this)
        this.process = new ModelProcessController(this)
        this.export = new CodeExportController(this)
        this.data = {}
    }


    changePhase(forward){
        //handling main editor phase change
        let currentElement =  $(".phases").children(".phase-active")
        let newElement = forward ? $(".phases").children(".phase-active").next() : $(".phases").children(".phase-active").prev() 
        
        if(newElement.length != 0){
            newElement.addClass("phase-active")
            newElement.removeClass("d-none")
            currentElement.removeClass("phase-active")
            $(".phases").children(":not(.phase-active)").addClass("d-none")
        }

        let currentPhase = this.__getPhaseByName(currentElement.attr("phase"))
        this.data = currentPhase.endPhase(this.data)
        let newPhase = this.__getPhaseByName(newElement.attr("phase"))
        newPhase.startPhase(this.data)
        console.log(this.data)
        
        
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
            case "agents":
                phase = this.agents
                break;
            case "conditions":
                phase = this.conditions
                break;
            case "process":
                phase = this.process
                break;
            case "export":
                phase = this.export
                break;
            
        }

        return phase
    }


    
}