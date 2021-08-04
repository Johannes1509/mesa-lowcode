class MainController{
    constructor(){
        this.agents = new AgentTypesController()
        this.editor = new CodeEditor()

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

        //handling navigation phase change
        currentElement = $(".model-phases-nav").find("a.active")
        newElement = forward ? $(".model-phases-nav").find("a.active").parent().next().find("a") : $(".model-phases-nav").find("a.active").parent().prev().find("a")
        if(newElement.length != 0){
            newElement.addClass("active")
            newElement.removeClass("disabled")
            currentElement.removeClass("active")
            $(".model-phases-nav").find("a:not(.active)").addClass("disabled")
        }
    }

    
}