//JobRoleLibrary.js Initial Commit 3/11/23 
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

        //Grid OnChange
        
        var roleSG = _formContext.getControl('sg_role_selections');
        roleSG.addOnLoad(PopulateReportingField);
    }

    catch(err) {

        console.log(`Failed at OnFormLoad on ${new Date()}`);
        console.log(`Error Details are as follows: ${err.message}`);


    }

}

function PopulateReportingField() {

    try {

        var fetchData = {
            "statecode": "0",
            "bah_job_roleid": _formContext.data.entity.getId()
          };
          var fetchXml = [
            "<fetch version='1.0' mapping='logical' no-lock='false' distinct='true'>",
            "  <entity name='bah_role_selection'>",
            "    <attribute name='bah_role_selectionid'/>",
            "    <attribute name='bah_name'/>",
            "    <attribute name='createdon'/>",
            "    <order attribute='bah_name' descending='false'/>",
            "    <filter type='and'>",
            "      <condition attribute='statecode' operator='eq' value='", fetchData.statecode/*0*/, "'/>",
            "    </filter>",
            "    <link-entity name='bah_job_role_bah_role_selection' intersect='true' visible='false' from='bah_role_selectionid' to='bah_role_selectionid'>",
            "      <link-entity name='bah_job_role' alias='ab' from='bah_job_roleid' to='bah_job_roleid'>",
            "        <filter type='and'>",
            "          <condition attribute='bah_job_roleid' operator='eq' value='", fetchData.bah_job_roleid/*{97342dd6-8cc0-ed11-83ff-002248268651}*/, "' uiname='DREAM CUSTOMIZER' uitype='bah_job_role'/>",
            "        </filter>",
            "      </link-entity>",
            "    </link-entity>",
            "  </entity>",
            "</fetch>"
            ].join("");
          
          var FetchXML = "?fetchXml=" + encodeURIComponent(fetchXml);
          var url = `${_globalContext.getClientUrl()}/api/data/v9.1/bah_role_selections${FetchXML}`
          
          var roles = "";

          var req = new XMLHttpRequest();
          req.open("GET", url, false);
          req.setRequestHeader("Accept", "application/json");
          req.setRequestHeader("Content-type", "application/json; charset=utf-8");
          req.send();

          if (req.readyState == 4) {

            //Success
            if (req.status == 200) {

                var res = JSON.parse(req.responseText);
                for(var i = 0; i < res.value.length; i++) {

                    roles += `${res.value[i].bah_name}`

                    if (i !== res.value.length - 1) {

                        roles += ', '

                    }
    

                }


            }

          }

          _formContext.getAttribute('bah_roles').setValue(roles);



    }

    catch(err) {

        console.log(`Failed at PopulateReportingField on ${new Date()}`);
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

