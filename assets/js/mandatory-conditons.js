var mandatoryConditions = {
    "intro":[
        {
            "title": "Guided tour checked",
            "condition": function(){
                return $("#show-guided-tour").is(":checked")
            }
        },
        {
            "title": "Mandatory active",
            "condition": function(){
                return $("#mandatory-fields-requiered").is(":checked")
            }
        }
    ],
    "agents":[
        {
            "title": "Testcondition",
            "condition": function(){
                return false
            }
        }
    ],
    "conditions":[
        {
            "title": "Testcondition",
            "condition": function(){
                return false
            }
        }
    ],
    "process":[
        {
            "title": "Testcondition",
            "condition": function(){
                return false
            }
        }
    ],
    "export":[
        {
            "title": "Testcondition",
            "condition": function(){
                return false
            }
        }
    ]
}