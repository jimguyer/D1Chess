angular.module('StartEmailMod', [])
    .directive('startemaildir', StartEmailDir)
    .controller('StartEmailCtl', StartEmailCtl)
    .service('StartEmailWebSvc', StartEmailWebSvc)
    .service('StartEmailLinkSvc', StartEmailLinkSvc)
    .service('StartEmailSvc', StartEmailSvc)
;

function StartEmailDir() {
    return { restrict: "E", templateUrl: '/Client/Views/StartEmail/StartEmail.html', controller: 'StartEmailCtl as VM_StartEmail' };
}

function StartEmailCtl(StartEmailWebSvc, StartEmailLinkSvc, StartEmailSvc, $scope) {
    //console.log("StartEmailCtl");
    $scope.StartEmail = VM.StartEmail;
    GM.Scope = $scope;
    this.ChangeFunc = function () { StartEmailSvc.RouteFunc("Change") }
    this.ClickExitFunc = function () { StartEmailLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Exit" }); }
    this.ClickBackFunc = function () { StartEmailLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Back" }); }
    this.ClickNextFunc = function () { StartEmailWebSvc.RouteFunc("Click", { Control: "Button", Button: "Next" }); }
}

function StartEmailWebSvc($http, StartEmailLinkSvc, StartEmailSvc, UtilitySvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("StartEmailWebSvc.RouteFunc * pEvent=" + pEvent);
        switch (pEvent) {
            case "Click":
                //console.log("StartEmailWebSvc.RouteFunc.Click * pObj.Control=" + pObj.Control);
                switch (pObj.Control) {
                    case "Button":
                        StartEmailSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        switch (pObj.Button) {
                            case "Next": this.MainFunc("Post", { Event: "StartEmailSave" }); break;
                        }
                        break;
                }
                break;
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("StartEmailWebSvc.MainFunc * pEvent=" + pEvent);        
        switch (pEvent) {
            case "Post":
                //console.log("StartEmailWebSvc.MainFunc.Post * pObj.Event=" + pObj.Event + " * pObj.Data=" + JSON.stringify(pObj.Data));
                var parms = UtilitySvc.WebParmsFunc(pEvent, { Event: pObj.Event, Data: MM.Data });
                $http
                    .post("api/Web", parms)
                    .success(function (pWebReturn) {
                        //console.log("StartEmailWebSvc.MainFunc.Post.Success * pWebReturn=" + JSON.stringify(pWebReturn));
                        if (pWebReturn.Code == "Success") {
                            StartEmailSvc.RouteFunc("Web", { Event: pObj.Event, Data: pWebReturn.Data });
                            StartEmailLinkSvc.RouteFunc("Web", { Event: pObj.Event, Data: pWebReturn.Data });
                        }
                        else StartEmailSvc.RouteFunc("Error", { Event: pObj.Event, Error: pWebReturn.Code });
                    })
                    .error(function () { StartEmailSvc.RouteFunc("Error", { Event: pObj.Event, Error: "Server" }); });
        }
    }
}

function StartEmailLinkSvc($location, $location, StartEmailSvc, HomeSvc, StartParmsSvc, MessageSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("StartEmailLinkSvc.RouteFunc * pEvent=" + pEvent);
        switch (pEvent) {
            case "Click":
                //console.log("StartEmailWebSvc.RouteFunc.Click * pObj.Control=" + pObj.Control);
                switch (pObj.Control) {
                    case "Button":
                        //console.log("StartEmailWebSvc.RouteFunc.Click.Button * pObj.Button=" + pObj.Button);
                        this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        StartEmailSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        break;
                }
                break;
            case "Web":
                //console.log("StartEmailLinkSvc.RouteFunc.Web.Success * pObj.Data=" + JSON.stringify(pObj.Data));          
                switch (pObj.Event) {
                    case "StartEmailSave":
                        StartEmailSvc.RouteFunc(pEvent, { Event: "Save", Data: pObj.Data });
                        this.MainFunc(pEvent, { Event: "Save", Data: pObj.Data });
                        break;
                }                
                break;
        }

    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("StartEmailLinkSvc.MainFunc * pEvent=" + pEvent);
        switch (pEvent) {
            case "Click":
                //console.log("StartEmailLinkSvc.MainFunc.Click * pObj.Control=" + pObj.Control);
                switch (pObj.Control) {
                    case "Button":
                        //console.log("StartEmailLinkSvc.MainFunc.Click.Button * pObj.Button=" + pObj.Button);
                        switch (pObj.Button) {
                            case "Back": StartParmsSvc.RouteFunc("_Link", { View_Event: "StartEmail_ClickBack" }); break;
                            case "Exit":
                                switch ($location.path()) {
                                    case "/History": HomeSvc.RouteFunc("_Link", { View_Event: "History_ClickExit" }); break;
                                    case "/Players": HomeSvc.RouteFunc("_Link", { View_Event: "Players_ClickExit" }); break;
                                    case "/Start": HomeSvc.RouteFunc("_Link", { View_Event: "Start_ClickExit" }); break;
                                }
                        }
                        break;
                }
                break;
            case "Web":
                //console.log("StartEmailLinkSvc.MainFunc.Web * pObj.Event=" + pObj.Event);
                switch (pObj.Event) {
                    case "Save": MessageSvc.RouteFunc("_Link", { View_Event: "StartEmail_WebSave", Data: MM.Data }); break;
                }
        }
    };
}

function StartEmailSvc($rootScope, $location, StylesSvc, UtilitySvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("StartEmailSvc.RouteFunc * pEvent=" + pEvent + " * pObj.View_Event=" + pObj.View_Event);
        switch (pEvent) {
            case "_Link":
                //console.log("StartEmailSvc.RouteFunc._Link * pObj.View_Event=" + pObj.View_Event);
                switch (pObj.View_Event) {
                    case "Member_Init": this.InitFunc(); break;
                    case "Member_Size": this.SizeFunc(); break;
                    case "Message_ClickBack": 
                    case "StartParms_WebSave": 
                    case "User_WebGetUser": this.MainFunc("_Link", { View_Event: pObj.View_Event, Data: pObj.Data }); break;
                }
                break;
            case "Change":this.MainFunc(pEvent); break;
            case "Click":
                //console.log("StartEmailSvc.RouteFunc.Click * pObj.Control=" + pObj.Control);
                switch (pObj.Control) {
                    case "Button": this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button }); break;
                }
                break;
            case "Error": MM.Processing = false; this.ViewFunc({ Enable: "*", Msg: "Error_" + pObj.Error }); break;
            case "Web": this.MainFunc(pEvent, { Event: pObj.Event, Data: pObj.Data }); break;
        }
    }
    this.InitFunc = function () {
        //console.log("StartEmailSvc.InitFunc");
        MM.StartEmail = { Loading: true };
        VM.StartEmail = { Email: "", FirstName: "", LastName: "" };

        //#region Types
        VM.StartEmail.EmailFieldSet = StylesSvc.InitFunc({ Type: "FieldSet", H: 3 });
        VM.StartEmail.EmailLegend_Text = StylesSvc.InitFunc({ Type: "Legend" });

        var yAdd = 1;
        var y = 3; fs = .7;
        VM.StartEmail.Email_Label = StylesSvc.InitFunc({ Type: "LabelR", X: .5, Y: y, W: 2, FS: 1 });
        VM.StartEmail.Email_Input = StylesSvc.InitFunc({ Type: "Input", X: 2.6, Y: y, W: 6, FS: fs });

        //************************************************************************
        y += yAdd * 2.5; VM.StartEmail.NameLegend_Text = StylesSvc.InitFunc({ Type: "Legend", Y: y });
        y += yAdd * .5; VM.StartEmail.NameFieldSet = StylesSvc.InitFunc({ Type: "FieldSet", Y: y, H: 4 });



        var xL = .5, xR = 4.65, wL = 4, wR = 4, fs = 1;

        y += yAdd;
        VM.StartEmail.FirstName_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.StartEmail.FirstName_Input = StylesSvc.InitFunc({ Type: "Input", X: xR, Y: y, W: wR, FS: fs });
        y += yAdd;
        VM.StartEmail.LastName_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.StartEmail.LastName_Input = StylesSvc.InitFunc({ Type: "Input", X: xR, Y: y, W: wR, FS: fs });

        VM.StartEmail.Exit = MM.ButtonL; VM.StartEmail.Back = MM.ButtonC; VM.StartEmail.Next = MM.ButtonR;
        //#endregion
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("StartEmailSvc.MainFunc * pEvent=" + pEvent + " * pObj.View_Event=" + pObj.View_Event);
        switch (pEvent) {

            //#region case "_Link":
            case "_Link":
                switch (pObj.View_Event) {
                    case "Message_ClickBack": this.ViewFunc({ View: "StartEmail", Msg: "Info_Change" }); break;
                    case "StartParms_WebSave": this.ViewFunc({ View: "StartEmail", Msg: "Info_Enter" }); break;
                    //#region case "User_WebGetUser":
                    case "User_WebGetUser":
                        VM.StartEmail.Email = pObj.Data.OpEmail;
                        VM.StartEmail.FirstName = pObj.Data.OpFirstName;
                        VM.StartEmail.LastName = pObj.Data.OpLastName;
                        //if (MM.Testing) {
                        //    VM.StartEmail.Email = "LisaGuyer@hotmail.com";
                        //    VM.StartEmail.FirstName = "Lisa";
                        //    VM.StartEmail.LastName = "Guyer";
                        //}
                        MM.StartEmail.Loading = false;
                        break;
                    //#endregion
                }
                if (MM.View == "StartEmail") {
                    //console.log("StartEmailSvc.MainFunc._Link * MM.View =" + MM.View);
                    this.SizeFunc();
                    this.ViewFunc({ Legend: "*", Enable: "*" });
                    if (MM.StartEmail.Loading) this.ViewFunc({ Msg: "Wait_Loading" }); 
                }
                break;
            //#endregion


            case "Change": this.ViewFunc({ Enable: "*", Msg: "Change" }); break;

            //#region case "Click":
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        switch (pObj.Button) {
                            case "Next":
                                //console.log("StartEmailSvc.MainFunc.Click_Button.Next");
                                MM.Processing = true;
                                MM.Data = { OpEmail: VM.StartEmail.Email, OpFirstName: VM.StartEmail.FirstName, OpLastName: VM.StartEmail.LastName }
                                this.ViewFunc({ Enable: "*", Msg: "Wait_Saving" });
                                break;
                        }
                        break;
                }
                break;
            //#endregion

            //#region case "Web":
            case "Web":
                switch (pObj.Event) {
                    case "Save":
                        //console.log("this.MainFunc.Web.Save * pObj.Data=" + JSON.stringify(pObj.Data));
                        MM.Processing = false;
                        MM.UserProfiles.List[MM.UserProfiles.DefaultIdx].StartEmail.OpEmail = VM.StartEmail.Email;
                        MM.UserProfiles.List[MM.UserProfiles.DefaultIdx].StartEmail.OpFirstName = VM.StartEmail.FirstName;
                        MM.UserProfiles.List[MM.UserProfiles.DefaultIdx].StartEmail.OpLastName = VM.StartEmail.LastName;

                        MM.Wiz.Email = VM.StartEmail.Email;
                        MM.Wiz.OpFirstName = VM.StartEmail.FirstName;
                        MM.Wiz.OpLastName = VM.StartEmail.LastName;

                        if (pObj.Data == null) {
                            MM.Wiz.Registered = false;
                            MM.Wiz.OpName = VM.StartEmail.FirstName + " " + VM.StartEmail.LastName;
                        }
                        else {
                            MM.Wiz.Registered = true;
                            MM.Wiz.OpUserId = pObj.Data.OpUserId;
                            MM.Wiz.OpName = pObj.Data.OpName;
                            MM.Wiz.OpRating = pObj.Data.OpRating;
                            MM.Wiz.OpPhoto_Src = pObj.Data.OpPhoto_Src;
                        }
                        //console.log("MM.Wiz=" + JSON.stringify(MM.Wiz));
                        break;
                }
                break;
            //#endregion
        }
    }
    this.SizeFunc = function (pEvent, pObj) {
        //console.log("StartEmailSvc.SizeFunc * GM.Sized.StartEmail=" + GM.Sized.StartEmail);
        if (GM.Sized.StartEmail) return;

        StylesSvc.SizeFunc(VM.StartEmail.EmailFieldSet); StylesSvc.SizeFunc(VM.StartEmail.EmailLegend_Text); 
        StylesSvc.SizeFunc(VM.StartEmail.Email_Label); StylesSvc.SizeFunc(VM.StartEmail.Email_Input);

        StylesSvc.SizeFunc(VM.StartEmail.NameFieldSet); StylesSvc.SizeFunc(VM.StartEmail.NameLegend_Text); 
        StylesSvc.SizeFunc(VM.StartEmail.FirstName_Label); StylesSvc.SizeFunc(VM.StartEmail.FirstName_Input);
        StylesSvc.SizeFunc(VM.StartEmail.LastName_Label); StylesSvc.SizeFunc(VM.StartEmail.LastName_Input);
        GM.Sized.StartEmail = true;
}
this.ViewFunc = function (pObj) {
    if (pObj.View != null) {
        //console.log("StartEmailSvc.ViewFunc * $location.path()=" + $location.path() + " * pObj.View=" + pObj.View);
        MM.View = pObj.View;
        switch ($location.path()) {
            case "/Start": VM.Start.Show_View = pObj.View; break;
        }
    }
    if (pObj.Legend != null) {
        switch (pObj.Legend) {
            case "*":
                if (MM.StartEmail.Loading) {
                    VM.StartEmail.EmailLegend = "Loading...";
                    VM.StartEmail.NameLegend = "Loading...";
                }
                else {
                    VM.StartEmail.EmailLegend = (pObj.Email_Text != null) ? pObj.Email_Text : "Enter Email";
                    VM.StartEmail.NameLegend = (pObj.Name_Text != null) ? pObj.Name_Text : "Enter Name";
                }
                break;
        }
    }
    if (pObj.Enable != null) {
        //console.log("ViewFunc.Enable * MM.View=" + MM.View);
        switch (pObj.Enable) {
            case "*":
                if (MM.Processing) VM.StartEmail.Disable = true;
                else if (VM.StartEmail.Email == "" || VM.StartEmail.FirstName == "" || VM.StartEmail.LastName == "") VM.StartEmail.Next_Disabled = true;
                break;
            case "All": VM.StartEmail.Disabled = false; break;
        }      
        }
        if (pObj.Buttons != null) {
            //console.log("StartParmsSvc.ViewFunc * pObj.Buttons=" + pObj.Buttons);
            switch (pObj.Buttons) {
                case "ExitBackNext":
                    VM.StartParms.Back_Show = true;

                    break;
                default: alert("Unknown pObj.Buttons=" + pObj.Buttons); break;
            }
        }
        if (pObj.Msg != null) {
            switch (pObj.Msg) {
                case "Change":
                    if (!UtilitySvc.EmailFunc("Validate", { Email: VM.StartEmail.Email })) $rootScope.Msg = "Enter a valid email.";
                    else if (VM.StartEmail.FirstName == "") $rootScope.Msg = "First name required to challenge someone."
                    else if (VM.StartEmail.LastName == "") $rootScope.Msg = "Last name required to challenge someone."; 
                    else if (VM.StartEmail.LastName == "") $rootScope.Msg = "Your email. Enter an opponent email"; 
                    else $rootScope.Msg = "Click next to send email."; 
                    break;
                case "Error_Server": $rootScope.Msg = "Server error."; break;
                case "Info_Change": $rootScope.Msg = "You may change the email information."; break;
                case "Info_Enter": $rootScope.Msg = "Enter the email information."; break;
                case "Wait_Loading": $rootScope.Msg = "Loading your start options..."; break;
                case "Wait_Saving": $rootScope.Msg = "Saving opponent email preference...";
            }
        }
    }
}