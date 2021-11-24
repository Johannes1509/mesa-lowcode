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

    startPhase(dataModel){
        throw new Error("Not implemented")
    }

    endPhase(dataModel){
        this.stopPhase(dataModel)
        return this.getJSONData(dataModel)
    }

    getJSONData(){
        throw new Error("Not implemented")
    }
}