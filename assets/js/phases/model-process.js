class ModelProcessController extends AbstractPhase{
    init(){
        this.phaseName = "process"
    }

    startPhase(phaseData){
       // flowy(document.getElementById("flowycanvas"), main.process.__flowyOnGrab, main.process.__flowyOnRelease, main.process.__flowyOnSnap, main.process.__flowyOnRearrange, 20, 50)
       

       $(function() {

        $("#process-canvas-container").mousewheel(function(event, delta) {
     
           this.scrollLeft -= (delta * 90);
         
           event.preventDefault();
     
        });
     
     });
       
       var id = document.getElementById("process-canvas");
       const editor = new Drawflow(id);
       editor.start();
            var html = `
        <div>asdasdasdasdasdsad<input type="text" df-name></div>
        `;
        var data = { "name": '' };

        editor.addNode('start', 0, 1, 150, 300, 'start-element', {}, $("#agent-process-start-element").html())
        editor.addNode('end', 1, 0, 600, 300, 'start-element', {}, $("#agent-process-end-element").html())
        editor.addNode('block', 1, 1, 300, 300, 'start-element', {}, $("#agent-process-block-element").html())
     

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

