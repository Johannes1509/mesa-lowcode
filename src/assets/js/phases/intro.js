class IntroductionController extends AbstractPhase{
    //Phase of the first page including an introduction text and tool options

    init(){
        this.phaseName = "intro"
        this.tourSteps  = [{
                "element": $("#software-name")[0],
                "title": 'Welcome to "Low-Code MESA"!',
                "intro": 'Low-Code MESA is a software to support the development of agent-based simulation models.',
                "position": "left"
            },
            {
                "element":  $(".model-phases-nav")[0],
                "title": "Development phases",
                "intro": "The software is divided into four different development phases. These represent the most important steps in the creation of an agent-based simulation model. Finally, the created model can be exported as Python code.",
                "position": "right"
            },
            {
                "element":  $("#next-step-button")[0],
                "title": "Forward navigation",
                "intro": "You will get to the next phase via this button.",
                "position": "left"
            },
            {
                "element":  $("#last-step-button")[0],
                "title": "Backward navigation",
                "intro": "You will get to the last phase via this button.",
                "position": "left"
            },
            {
                "element": $("#mandatory-fields-container")[0],
                "title": "Mandatory conditons",
                "intro": "Within the phases, conditions to be fulfilled are displayed in this area. Fulfill them to generate a correct and complete model.",
                "position": "right"
            },
        ]
    }

    startPhase(){
    }

    stopPhase(){
    }

    getJSONData(dataModel){
        return dataModel
    }

}