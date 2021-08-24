class ModelProcessController extends AbstractPhase{
    init(){
        this.phaseName = "process"
    }

    startPhase(phaseData){
        flowy(document.getElementById("flowycanvas"), main.process.__flowyOnGrab, main.process.__flowyOnRelease, main.process.__flowyOnSnap, main.process.__flowyOnRearrange, 20, 50)
    }

    stopPhase(){
        
    }

    getJSONData(){

    }

    __flowyOnGrab(block){
        // When the user grabs a block
    }

    __flowyOnRelease(){
        // When the user releases a block
    }

    __flowyOnSnap(block, first, parent){
        // When a block snaps with another one
        return true
    }

    __flowyOnRearrange(block, parent){
        // When a block is rearranged
    }
}

