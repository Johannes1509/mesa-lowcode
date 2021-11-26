class AbstractPhase{
    constructor(mainRef){
        this.mainRef = mainRef
        this.phaseMandatories = []
        this.init()
        if(this.phaseName == undefined){
            throw new Error("Phase name not defined!")
        }
        this.currentConditionNumber = 0
        this.activeConditionChecker = undefined
    }

    init(){
        throw new Error("Not implemented")
    }

    beginPhase(dataModel){
        if(this.phaseMandatories.length == 0){
            $("#mandatory-fields-container").addClass("d-none")
        }else{
            $("#mandatory-fields-container").removeClass("d-none")
            this.activeConditionChecker = setInterval(this.checkMandatoryConditions.bind(this), 2000)
        }
        this.startPhase(dataModel)
        this.__addMandatoryConditions()
    }

    endPhase(dataModel){
        clearInterval(this.activeConditionChecker)
        this.stopPhase(dataModel)
        this.currentConditionNumber = 0
        return this.getJSONData(dataModel)
    }

    getJSONData(){
        throw new Error("Not implemented")
    }

    checkMandatoryConditions(){
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