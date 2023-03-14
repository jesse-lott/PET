//Backlog.js Initial Commit 3/11/23 
//Global Vars
var _formContext; 
var _globalContext;

function OnFormLoad(execObj) {

    try {

        SetContext(execObj); //Sets Form Context and Global Context
        var formType = _formContext.ui.getFormType();

        if (formType === 1) { //Create Form

            

        }
        //Load Events
       
        //Change Events
        
        //Change Events Forcing Save
        
        //API Call Events

        //Invoke Power Automate Events


    }

    catch(err) {

        console.log(`Failed at OnFormLoad on ${new Date()}`);
        console.log(`Error Details are as follows: ${err.message}`);


    }

}

function SetContext(execObj) {

    try {

        _formContext = execObj.getFormContext();
        _globalContext = Xrm.Utility.getGlobalContext();

    }

    catch(err) {

        console.log(`Failed at SetContext on ${new Date()}`);
        console.log(`Error Details are as follows: ${err.message}`);

    }





}