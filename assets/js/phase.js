class AbstractPhase{
    constructor(){
        this.init()
    }

    init(){
        throw new Error("Not implemented")
    }

    getJSONData(){
        throw new Error("Not implemented")
    }
}