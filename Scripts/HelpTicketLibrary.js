//HelpTicketLibrary.js Initial Commit 3/11/23 
var _formContext;
var _globalContext;

function OnFormLoad(execObj) {

    try {

        SetContext(execObj);
        var formType = _formContext.ui.getFormType();

        if (formType === 1) {

            SetInitialTicketNameOnCreateForm();
            _formContext.getControl('bah_ticket_type').setDisabled(false);

        }

        else {

            _formContext.getControl('bah_ticket_type').setDisabled(true);

        }
        //Load Events
        ShowHideAppropriateSectionsOnTicketType();
        JobRoleOrUserToCopy();
        //Change Events
        _formContext.getAttribute('bah_ticket_type').addOnChange(ShowHideAppropriateSectionsOnTicketType);
        _formContext.getAttribute('bah_completed').addOnChange(ClearCompletedDateValidation);
        _formContext.getAttribute('bah_job_role').addOnChange(FillJobRoleText);
        _formContext.getAttribute('bah_useraccessrequesttype').addOnChange(FireOnChangeIsSubmission);
        _formContext.getAttribute('bah_rolesfromuser').addOnChange(JobRoleOrUserToCopy);
        _formContext.getAttribute('bah_job_role').addOnChange(JobRoleOrUserToCopy);
        
        //Change Events Forcing Save
        
        //API Call Events

        //Invoke Power Automate Events


    }

    catch(err) {

        console.log(`Failed at OnFormLoad on ${new Date()}`);
        console.log(`Error Details are as follows: ${err.message}`);


    }

}

function JobRoleOrUserToCopy() {

    try{

        var tixType = _formContext.getAttribute('bah_ticket_type').getValue();
        if (tixType !== 810050001) {

            return;

        }

        var jobRole = _formContext.getAttribute('bah_job_role').getValue();
        var jobRoleCtrl = _formContext.getControl('bah_job_role');
        var userToCopy = _formContext.getAttribute('bah_rolesfromuser').getValue();
        var userToCopyCtrl = _formContext.getControl('bah_rolesfromuser');

        if (userToCopy) { 

            jobRoleCtrl.getAttribute().setValue(); //clear job role
            jobRoleCtrl.setDisabled(true);
            
        }

        else if (jobRole) {

            userToCopyCtrl.getAttribute().setValue(); //clear userToCopy
            userToCopyCtrl.setDisabled(true);

        }

        else {
            
            userToCopyCtrl.setDisabled(false);
            jobRoleCtrl.setDisabled(false);

        }

    }

    catch(err) {

        console.log(`Failed at function JobRoleOrUserToCopy on ${new Date()}`);
        console.log(`Error Details are as follows: ${err.message}`);

    }


}

function FireOnChangeIsSubmission() {

    try {

        _formContext.getAttribute('bah_issubmission').fireOnChange();
        //_formContext.data.save();

    }

    catch(err) {

        console.log(`Failed at FireOnChangeIsSubmission on ${new Date()}`);
        console.log(`Error Details are as follows: ${err.message}`);

    }


}

function FillJobRoleText() {

    try {

        var jobRoleLookup = _formContext.getAttribute('bah_job_role').getValue();

        if (jobRoleLookup) {

            var jobRoleName = jobRoleLookup[0].name;

            _formContext.getAttribute('bah_applicationname').setValue(jobRoleName);            

        }

    }

    catch(err) {

        console.log(`Failed at FillJobRoleText on ${new Date()}`);
        console.log(`Error Details are as follows: ${err.message}`);

    }


}

function OnFormSave(execObj) {

    try {
        var saveType = execObj.getEventArgs().getSaveMode();
        SetActive(saveType);
        SetCancelled(saveType);
        SetCompleted(saveType);
        _formContext.getControl('bah_ticket_type').setDisabled(true);
    }

    catch(err) {

        console.log(`Failed at OnFormSave on ${new Date()}`);
        console.log(`Error Details are as follows: ${err.message}`);

    }



}

function ClearCompletedDateValidation() {

    try {

        var completed = _formContext.getAttribute('bah_completed').getValue();

        if (!completed) {

            _formContext.getAttribute('bah_completed_date').fireOnChange();

        }

    }

    catch(err) {

        console.log(`Failed at ClearCompletedDateValidation on ${new Date()}`);
        console.log(`Error Details are as follows: ${err.message}`);

    }


}

function SetActive(saveType) {

    try {
        var status = _formContext.getAttribute('statuscode').getValue();
        var statuses = [1, 810050001];

       

        if (statuses.indexOf(status) == -1) { //not a new ticket or submitted ticket

            return;

        }
                
        var received = _formContext.getAttribute('bah_recieved').getValue();

        if (saveType === 70 && received) {

            OpenConfirmDialog("Active");
            return;

        }

        if (received) {

            _formContext.getAttribute('statuscode').setValue(810050002); //Active Ticket.
            _formContext.getAttribute('statuscode').fireOnChange(); //Active Ticket.
            
        }
        
    }

    catch(err) {

        console.log(`Failed at SetActive on ${new Date()}`);
        console.log(`Error Details are as follows: ${err.message}`);

    }

}

function SetCancelled(saveType) {

    try {

        var cancelled = _formContext.getAttribute('bah_cancel_ticket').getValue();
        var cancelReason = _formContext.getAttribute('bah_cancelreason').getValue();

        

        if (!cancelled || !cancelReason){

            return;

        }

        if (saveType === 70 && cancelled && cancelReason) {

            OpenConfirmDialog("Cancelled");
            return;
            
        }

        if (cancelled && cancelReason) {

            //set to cancelled status
            _formContext.getAttribute('statecode').setValue(1);            
            _formContext.getAttribute('statuscode').setValue(2);
            _formContext.getAttribute('statuscode').fireOnChange();
        }


    }

    catch(err) {

        console.log(`Failed at SetCancelled on ${new Date()}`);
        console.log(`Error Details are as follows: ${err.message}`);

    }



}
function SetCompleted(saveType) {

    try {

        var completed = _formContext.getAttribute('bah_completed').getValue();
        var completedDate = _formContext.getAttribute('bah_completed_date').getValue();

        

        if (!completed || !completedDate){

            return;

        }

        if (saveType === 70 && completed && completedDate) {

            OpenConfirmDialog("Completed");
            return;
            
        }

        if (completed && completedDate) {

            //set to completed status
            _formContext.getAttribute('statecode').setValue(1);
            _formContext.getAttribute('statuscode').setValue(810050003);
            _formContext.getAttribute('statuscode').fireOnChange();

        }


    }

    catch(err) {

        console.log(`Failed at SetCancelled on ${new Date()}`);
        console.log(`Error Details are as follows: ${err.message}`);

    }



}

function OpenConfirmDialog(actionType) {

    try {

        var confirmText = `You have selected to transition this ticket to the ${actionType} status and not deliberately saved the form.  
        This notification popped up during an auto-save function with the purpose of confirming this lifecycle action.  
        Please click 'Confirm' to proceed with the changes or 'Cancel' to clear the changes and return to the ticket form.`
        

        var confirmStrings = {

            confirmButtonLabel : 'Confirm',
            text: confirmText,
            title: `Transition to ${actionType} Status`


        }

        Xrm.Navigation.openConfirmDialog(confirmStrings).then(


            function (success) {

                var toggleField = "";
                var additionalField = "";
                var status = 0;

                switch(actionType) {

                    case "Active":
                        toggleField = "bah_recieved";
                        status = 810050002;
                        break;
                    case "Cancelled":
                        toggleField = "bah_cancel_ticket";
                        additionalField = "bah_cancelreason";
                        status = 2;
                        break;
                    case "Completed":
                        toggleField = "bah_completed";
                        additionalField = "bah_completed_date";
                        status = 810050003
                        break;
                }

                if (success.confirmed) {

                    _formContext.getAttribute('statuscode').setValue(status);
                    _formContext.getAttribute('statuscode').fireOnChange();
                    if (actionType === "Cancelled" || actionType === "Completed") {

                        _formContext.getAttribute('statecode').setValue(1);

                    }
                    _formContext.data.save();
                }

                else {

                    _formContext.getAttribute(toggleField).setValue(false);
                    if (actionType === "Cancelled" || actionType === "Completed") {

                        _formContext.getAttribute(additionalField).setValue();

                    }
                    _formContext.data.save();
                }

            },

            function (err) {

                console.log(err.message)

            }

        )


    }

    catch(err) {

        console.log(`Failed at OpenConfirmDialog on ${new Date()}`);
        console.log(`Error Details are as follows: ${err.message}`);

    }


}

function SetInitialTicketNameOnCreateForm() {

    try {


        var today = new Date();
        var thisYear = today.getFullYear();
        var month = today.getMonth() + 1;
        var monthString = month < 10 ? month.toString().padStart(2, '0') : month.toString();
        var idString = `${thisYear}${monthString}`;
        
        _formContext.getAttribute('bah_ticketiddatestring').setValue(idString);

        _formContext.getAttribute('bah_name').setValue(`New Ticket: ${today}`);

    }

    catch(err) {

        console.log(`Failed at OnFormLoad on ${new Date()}`);
        console.log(`Error Details are as follows: ${err.message}`);

    }




}
function ShowHideAppropriateSectionsOnTicketType() {

    try {

        var ticketType = _formContext.getAttribute('bah_ticket_type').getValue();
        var tab = _formContext.ui.tabs.get('tab_general');
        var userAccessRequestSection = tab.sections.get('section_user_access_request_info');
        var helpTicketSection = tab.sections.get('section_help_ticket_info');
        var secRoleSection = tab.sections.get('section_security_roles');

        switch(ticketType) {

            case 810050000: //help tix
                userAccessRequestSection.setVisible(false);
                helpTicketSection.setVisible(true);
                secRoleSection.setVisible(false);
                break;
            case 810050001: //user access request
                userAccessRequestSection.setVisible(true);
                helpTicketSection.setVisible(false);
                secRoleSection.setVisible(true);
                break;
            // case 810050002: //training request
            //     userAccessRequestSection.setVisible(false);
            //     helpTicketSection.setVisible(false);
            //     trngReqSection.setVisible(true);
            //     break;
            default: //null
                userAccessRequestSection.setVisible(false);
                helpTicketSection.setVisible(false);
                secRoleSection.setVisible(false);
                break;

        }


    }

    catch(err) {

        console.log(`Failed at ShowHideAppropriateSectionsOnTicketType on ${new Date()}`);
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