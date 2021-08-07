class AbstractPhase{
    constructor(mainRef){
        this.mainRef = mainRef
        this.init()
        if(this.phaseName == undefined){
            throw new Error("Phase name not defined!")
        }
    }

    init(){
        throw new Error("Not implemented")
    }

    startPhase(){
        throw new Error("Not implemented")
    }

    endPhase(phaseData){
        this.stopPhase()
        let currentPhaseData = this.getJSONData()
        phaseData[this.phaseName] = currentPhaseData
        return phaseData
    }

    getJSONData(){
        throw new Error("Not implemented")
    }
}