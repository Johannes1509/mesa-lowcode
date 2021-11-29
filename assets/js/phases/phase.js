class AbstractPhase{
    //Abstract class for phase overall methods

    constructor(mainRef){
        this.mainRef = mainRef
        this.tourSteps = []
        this.phaseMandatories = []
        this.init()
        if(this.phaseName == undefined){
            throw new Error("Phase name not defined!")
        }
        this.currentConditionNumber = 0
        this.activeConditionChecker = undefined
        this.firstStart = true

        console.debug("Phase "+this.phaseName+" initialized.")
    }

    init(){
        //abstract method, must be implemented by the child classes
        throw new Error("Not implemented")
    }

    beginPhase(dataModel){
        //starts a new phase
        if(this.phaseMandatories.length == 0){
            $("#mandatory-fields-container").addClass("invisible")
        }else{
            $("#mandatory-fields-container").removeClass("invisible")
            //adds a timer based check for the mandatory phase conditions
            this.activeConditionChecker = setInterval(this.checkMandatoryConditions.bind(this), 2000)
        }
        this.startPhase(dataModel)
        this.__addMandatoryConditions()
        
        //triggering the guided tour if necessary
        if(this.tourSteps.length > 0 && this.mainRef.guidedTour && this.firstStart){
            this.mainRef.introJs = introJs()
            this.mainRef.introJs.setOptions({"steps": this.tourSteps})
            this.mainRef.introJs.start() 
        }

        console.info("[Phase "+this.phaseName+"]:  Started Phase.")
        this.firstStart = false
    }

    endPhase(dataModel){
        clearInterval(this.activeConditionChecker)
        this.currentConditionNumber = 0

        //closing the guided tour if necessary
        this.mainRef.introJs.exit(true)
        
        let newData =  this.getJSONData(dataModel)
        this.stopPhase(dataModel)
        
        console.info("[Phase "+this.phaseName+"]:  Ended Phase.")
        
        return newData
    }

    getJSONData(){
        //abstract method, must be implemented by the child classes
        throw new Error("Not implemented")
    }

    checkMandatoryConditions(){
        //checks the main and all defined mandatory conditions of the current phase
        let allMandatoryResults = []
        for(let i = 0; i < this.phaseMandatories.length; i++){
            let currentConditionResult = this.phaseMandatories[i].condition()
            this.__updateMandatoryCondition(this.phaseMandatories[i].conditionNumber, currentConditionResult)
            allMandatoryResults.push(currentConditionResult)
        }

        let overallResult = !allMandatoryResults.includes(false)

        this.__updateMandatoryCondition(-1 , overallResult)

        return overallResult
    }

    __addMandatoryConditions(){
        $("#mandatory-fields-condition-container").empty()
        for(let i = 0; i < this.phaseMandatories.length; i++){
            let mandatoryCondition = $(".mandatory-fields-condition.template").clone()
            mandatoryCondition.removeClass("template")
            mandatoryCondition.removeClass("d-none")
            mandatoryCondition.find(".condition-text").text(this.phaseMandatories[i].title)

            mandatoryCondition.find(".mandatory-fields-badge").attr("conditionNumber", this.currentConditionNumber)
            this.phaseMandatories[i]["conditionNumber"] = this.currentConditionNumber
            this.currentConditionNumber++

            $("#mandatory-fields-condition-container").append(mandatoryCondition)
        }

        this.checkMandatoryConditions()
    }

    __updateMandatoryCondition(conditionNumber, newState){
        if(newState){
            $(".mandatory-fields-badge[conditionNumber='"+conditionNumber+"']").removeClass("bg-danger")
            $(".mandatory-fields-badge[conditionNumber='"+conditionNumber+"']").find("i").removeClass("ri-close-line")

            $(".mandatory-fields-badge[conditionNumber='"+conditionNumber+"']").addClass("bg-success")
            $(".mandatory-fields-badge[conditionNumber='"+conditionNumber+"']").find("i").addClass("ri-check-line")
        }else{
            $(".mandatory-fields-badge[conditionNumber='"+conditionNumber+"']").removeClass("bg-success")
            $(".mandatory-fields-badge[conditionNumber='"+conditionNumber+"']").find("i").removeClass("ri-check-line")

            $(".mandatory-fields-badge[conditionNumber='"+conditionNumber+"']").addClass("bg-danger")
            $(".mandatory-fields-badge[conditionNumber='"+conditionNumber+"']").find("i").addClass("ri-close-line")
        }
 
    }

}