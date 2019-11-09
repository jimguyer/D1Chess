angular.module('EmailMod', [])
    .directive('emaildir', EmailDir)
    .controller('EmailCtl', EmailCtl)
    .service('EmailWebSvc', EmailWebSvc)
    .service('EmailLinkSvc', EmailLinkSvc)
    .service('EmailSvc', EmailSvc)
    ;

function EmailDir() {
    return { restrict: "E", templateUrl: '/Client/Member/Views/Email/Email.html', controller: 'EmailCtl as VM_Email' };
}

function EmailCtl($scope, EmailWebSvc, EmailLinkSvc, EmailSvc) {
    $scope.Email = VM.Email;

    this.ClickConfirmFunc = function () { EmailWebSvc.RouteFunc("Click", { Control: "Button", Button: "Confirm" }); }
    this.ClickResendFunc = function () { EmailWebSvc.RouteFunc("Click", { Control: "Button", Button: "Resend" }); }
    this.ClickSaveFunc = function () { EmailWebSvc.RouteFunc("Click", { Control: "Button", Button: "Save" }); }

    this.ClickBackFunc = function () { EmailLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Back" }); }
    this.ClickExitFunc = function () { EmailLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Exit" }); }
    this.ClickSkipFunc = function () { EmailLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Skip" }); }

    this.ChangeFunc = function () { EmailSvc.RouteFunc("Change"); }
    this.ClickReenterFunc = function () { EmailSvc.RouteFunc("Click", { Control: "Button", Button: "Reenter" }); }
}

function EmailWebSvc($http, EmailLinkSvc, EmailSvc, UtilitySvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("EmailWebSvc.RouteFunc" + " * pEvent=" + pEvent);
        switch (pEvent) {
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        //console.log("EmailWebSvc.RouteFunc.Click * pObj.Button=" + pObj.Button);
                        EmailSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        switch (pObj.Button) {
                            case "Confirm": this.MainFunc("Post", { Event: "EmailConfirm", Data: MM.Data }); break;
                            case "Resend": this.MainFunc("Post", { Event: "EmailResend", Data: MM.Data }); break;
                            case "Save": this.MainFunc("Post", { Event: "EmailSave", Data: MM.Data }); break;
                        }
                        break;
                }
                break;
        }
    };
    this.MainFunc = function (pEvent, pObj) {
        switch (pEvent) {
            case "Post":
                //console.log("EmailWebSvc.MainFunc.Post" + " * pObj.Event=" + pObj.Event + " * pObj.Data=" + JSON.stringify(pObj.Data));
                var parms = UtilitySvc.WebParmsFunc(pEvent, { Event: pObj.Event, Data: pObj.Data });
                $http
                    .post("api/Web", parms)
                    .success(function (pWebReturn) {
                        if (pWebReturn.Code == "Success") {
                            //console.log("EmailWebSvc.MainFunc.Post.Success" + " * pObj.Event=" + pObj.Event);
                            EmailSvc.RouteFunc("Web", { Event: pObj.Event, Data: pWebReturn.Data });
                        }
                        else
                            //console.log("EmailWebSvc.MainFunc.Post.Error" + " * pObj.Event=" + pObj.Event);
                            EmailSvc.RouteFunc("Error", { Event: pObj.Event, Error: pWebReturn.Code });
                    })
                    .error(function () { EmailSvc.RouteFunc("Error", { Event: pObj.Event, Error: "Server" }); });
                break;
        }
    }
}

function EmailLinkSvc( $location, EmailSvc, HomeSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("EmailLinkSvc.RouteFunc");
        switch (pEvent) {
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        //console.log("EmailLinkSvc.RouteFunc.Click.Button");
                        EmailSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        break;
                }
                break;

            case "Web":
                switch (pObj.Event) {
                    case "EmailSave": var event = "Save"; break;
                    case "EmailConfirm": var event = "Confirm"; break;
                    case "EmailResend": var event = "Resend"; break;
                }
                EmailSvc.RouteFunc("Web", { Event: event });
                this.MainFunc("Web", { Event: event });
                break;
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("EmailLinkSvc.MainFunc" + " * pEvent=" + pEvent + " * pCode=" + pCode);
        switch (pEvent) {
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                    case "Exit": HomeSvc.RouteFunc("_Link", { View_Event: "Info_ClickExit" }); break;
                }
                break;
        }
    };
}

function EmailSvc($location, $rootScope, StylesSvc, UtilitySvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("EmailSvc.RouteFunc" + " * pEvent=" + pEvent);
        switch (pEvent) {
            //#region case "_Link":
            case "_Link":
                //console.log("EmailSvc.RouteFunc._Link" + " * pObj.View_Event=" + pObj.View_Event);
                switch (pObj.View_Event) {
                    case "Member_Init": this.InitFunc(); break;
                    case "Member_Size": this.SizeFunc(); break;
                    case "Home_ClickUser":
                    case "User_ClickTab":
                    case "User_WebGetUser": this.MainFunc(pEvent, { View_Event: pObj.View_Event, Data: pObj.Data }); break;
                    default: alert("EmailSvc.MainFunc * pObj.View_Event=" + pObj.View_Event); break;
                }
                break;
            //#endregion 

            case "Change": this.MainFunc(pEvent); break;

            //#region case "Click":
            case "Click":
                switch (pObj.Control) {
                    case "Button": this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button }); break;
                }
                break;
            //#endregion

            case "Error": MM.Processing = false; this.ViewFunc({ Enable: "*", Msg: "Error_" + pObj.Error }); break;
            case "Web": this.MainFunc(pEvent, { Event: pObj.Event, Data: pObj.Data }); break;
        }
    }
    this.InitFunc = function () {
        //console.log("EmailSvc.InitFunc");
        MM.Email = { Loading: true, Confirmed: "" };
        VM.Email = { Entry: "", Code: "" }

        //#region Types

        VM.Email.FieldSet = StylesSvc.InitFunc({ Type: "FieldSetT", H: 4 });
        VM.Email.Legend_Text = StylesSvc.InitFunc({ Type: "LegendT", X: 3.25, W: 2.5 });

        var addY = 1, xL = .8, xR = 2.25, wL = 1.75, wR = 5, fsL = .8, fsR = .7;

        var y = 4;
        VM.Email.Current_LabelText = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, FS: fsL });
        VM.Email.Current_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, FS: fsR});

        y = 5.25;
        VM.Email.Entry_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, FS: fsL });
        VM.Email.Entry_Input = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, FS: fsR });

        y = 5.25;
        VM.Email.Code_Label = StylesSvc.InitFunc({ Type: "LabelR", X: 2.75, Y: y, W: 1.5, FS: fsL });
        VM.Email.Code_Input = StylesSvc.InitFunc({ Type: "Input", X: 4.35, Y: y, W: 1.75, FS: fsR });
        VM.Email.Reenter = MM.ButtonTUC; VM.Email.Exit = MM.ButtonTL; VM.Email.Resend = MM.ButtonTC; VM.Email.Confirm = MM.ButtonTR; VM.Email.Save = MM.ButtonTR;
        //#endregion

        //console.log("VM.Email.FieldSet.Size" + JSON.stringify(VM.Email.FieldSet.Size));
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("EmailSvc.MainFunc * pEvent=" + pEvent);
        switch (pEvent) {

            //#region case "_Link":
            case "_Link":
                switch (pObj.View_Event) {
                    case "Home_ClickUser":
                    case "User_ClickTab": break;
                    case "User_WebGetUser":
                        //console.log("EmailSvc.MainFunc.User_WebGetUser * pObj.Data=" + JSON.stringify(pObj.Data));
                        if (pObj.Data.Entry) this.ViewFunc({ Show: "Entry" }); else this.ViewFunc({ Show: "Confirm" });
                        VM.Email.Legend = "Email";
                        VM.Email.Current_Label = (VM.Email.Switch == "Entry") ? "Current" : "Email";
                        VM.Email.Current = pObj.Data.Current;
                        VM.Email.Entry = pObj.Data.Current;
                        MM.Email.Loading = false;
                        break;
                }
                //console.log("MM.View=" + MM.View);
                if (MM.View == "Email") {
                    //console.log("MM.ViewEmail.Loading=" + MM.Email.Loading);
                    if (MM.Email.Loading) this.ViewFunc({ Legend: "Loading...", Enable: "*", Show: "Entry", Buttons: "ExitSave", Msg: "Wait_Loading" });
                    else {
                        //console.log("MM.Email.Loaded");
                        //console.log("VM.Email.Switch=" +VM.Email.Switch);
                        //console.log("VM.Email.Current=" + MM.Email.Current);
                        this.ViewFunc({ Legend: "Email", Enable: "*" });
                        switch (VM.Email.Switch) {
                            case "Confirm": this.ViewFunc({ Buttons: "ExitReenterResendConfirm", Msg: "Info_Confirm" }); break;
                            case "Confirmed": this.ViewFunc({ Show: "Entry", Buttons: "ExitSave", Msg: "Info_Change" }); break;
                            case "Entry": this.ViewFunc({ Buttons: "ExitSave", Msg: "Info_Change" }); break;
                        }
                    }
                    this.SizeFunc();
                }
                break;
            //#endregion

            case "Change": this.ViewFunc({ Enable: "*", Msg: "Change" }); break;

            //#region case "Click":
            case "Click":
                //console.log("EmailSvc.MainFunc.Click * pObj.Control=" + pObj.Control);
                switch (pObj.Control) {
                    case "Button":
                        //console.log("EmailSvc.MainFunc.Click.Button * pObj.Button=" + pObj.Button);
                        switch (pObj.Button) {
                            case "Confirm": MM.Processing = true; MM.Data = VM.Email.Code; this.ViewFunc({ Enable: "*", Msg: "Wait_Confirm"}); break;
                            case "Reenter": this.ViewFunc({ Show: "Entry", Enable: "*", Buttons: "ExitSave", Msg: "Info_Change" }); break;
                            case "Resend": MM.Processing = true; MM.Data = null; this.ViewFunc({ Enable: "*", Msg: "Wait_Resend" }); break;
                            case "Save": MM.Processing = true; MM.Data = VM.Email.Entry; this.ViewFunc({ Enable: "*", Msg: "Wait_Save" });break;
                        }
                        //console.log("EmailSvc.MainFunc.Click.Button * MM.Data =" + JSON.stringify(MM.Data));
                        break;
                }
                break;
            //#endregion

            //#region case "Web":
            case "Web":
                //console.log("EmailSvc.MainFunc.Web * pObj.Event=" + pObj.Event + "  * pObj=" + JSON.stringify(pObj));
                MM.Processing = false;
                switch (pObj.Event) {
                    case "EmailConfirm": this.ViewFunc({ Show: "Confirmed", Enable: "*", Buttons: "Exit", Msg: "Web_Confirmed" }); break;
                    case "EmailResend": this.ViewFunc({ Show: "Confirm", Enable: "*", Msg: "Web_CheckEmail" }); break;
                    case "EmailSave":
                        VM.Email.Current_Label = "Email";
                        VM.Email.Current = VM.Email.Entry;
                        this.ViewFunc({ Show: "Confirm", Enable: "*", Buttons: "ExitReenterResendConfirm", Msg: "Web_CheckEmail" });
                        break;
                    default: alert("EmailSvc.MainFunc.Web * pObj.Event=" + pObj.Event); break;
                }
                break;
            //#endregion
        }
    }
    this.SizeFunc = function (pEvent, pObj) {
        //console.log("EmailSvc.SizeFunc");
        //console.log("EmailSvc.SizeFunc * GM.Sized.Email=" + GM.Sized.Email);
        //console.log("EmailSvc.SizeFunc * VM.Email.FieldSet.Size =" + JSON.stringify(VM.Email.FieldSet.Size));
        //console.log("EmailSvc.SizeFunc * VM.Email.Current_LabelText.Size=" + JSON.stringify(VM.Email.Current_LabelText.Size));
        //console.log("EmailSvc.SizeFunc * VM.Email.Legend_Text.Size=" + JSON.stringify(VM.Email.Legend_Text.Size));
        if (GM.Sized.Email) return;
        StylesSvc.SizeFunc(VM.Email.FieldSet); StylesSvc.SizeFunc(VM.Email.Legend_Text); 
        StylesSvc.SizeFunc(VM.Email.Current_LabelText); StylesSvc.SizeFunc(VM.Email.Current_Text); 
        StylesSvc.SizeFunc(VM.Email.Entry_Label); StylesSvc.SizeFunc(VM.Email.Entry_Input);
        StylesSvc.SizeFunc(VM.Email.Code_Label); StylesSvc.SizeFunc(VM.Email.Code_Input);

        GM.Sized.Email = true;
        //console.log("VM.Email.FieldSet.NgStyle" + JSON.stringify(VM.Email.FieldSet.NgStyle));
    }
    this.ViewFunc = function (pObj) {
        if (pObj.Legend != null) {
            //console.log("pObj.Legend=" + pObj.Legend);
            if (pObj.Legend == "*") VM.Email.Legend = (MM.Email.Loading) ? "Loading..." : "Email"; 
            else VM.Email.Legend = pObj.Legend;
        }
        if (pObj.Show != null) {
            //console.log("pObj.Show=" + pObj.Show);
            switch (pObj.Show) {
                case "Confirm": VM.Email.Switch = "Confirm"; break; 
                case "Confirmed": VM.Email.Switch = "Confirmed"; VM.Email.Entry_Show = false; break; 
                case "Entry": VM.Email.Switch = "Entry"; VM.Email.Entry_Show = true; break; 
            }
        }
        if (pObj.Enable != null) {
            //console.log("this.ViewFunc.Enable * pObj.Enable=" + pObj.Enable);
            switch (pObj.Enable) {
                case "*":
                    VM.Email.Disabled = MM.Processing;
                    VM.Email.Confirm_Disabled = (VM.Email.Code == "" || VM.Email.Code.length < 5); 
                    VM.Email.Save_Disabled = (VM.Email.Entry == "" || !UtilitySvc.EmailFunc("Validate", { Email: VM.Email.Entry })); 
                    break;
            }
            //console.log("this.ViewFunc.Enable * VM.Email.Confirm_Disabled=" + VM.Email.Confirm_Disabled);
        }
        if (pObj.Buttons != null) {
            //console.log("pObj.Buttons=" + pObj.Buttons);
            switch (pObj.Buttons) {
                case "Exit":
                    VM.Email.Confirm_Show = false;
                    VM.Email.Resend_Show = false;
                    VM.Email.Reenter_Show = false;
                    VM.Email.Save_Show = false;
                    break;
                case "ExitReenterResendConfirm":
                    VM.Email.Confirm_Show = true;
                    VM.Email.Resend_Show = true;
                    VM.Email.Reenter_Show = true;
                    VM.Email.Save_Show = false;
                    break;
                case "ExitSave":
                    VM.Email.Confirm_Show = false;
                    VM.Email.Resend_Show = false;
                    VM.Email.Reenter_Show = false;
                    VM.Email.Save_Show = true;
                    break;
            }
        }
        if (pObj.Msg != null) {
            //console.log("pObj.Msg=" + pObj.Msg);
            switch (pObj.Msg) {
                case "Change":
                    switch (VM.Email.Switch) {
                        case "Entry":
                            $rootScope.Msg = (UtilitySvc.EmailFunc("Validate", { Email: VM.Email.Entry })) ?
                                "Save to store your email address" : "Enter a valid email address";
                            break;
                        case "Confirm":
                            if (VM.Email.Code.length < 5) $rootScope.Msg = "Please enter five digits.";
                            else if (VM.Email.Code.length > 5) $rootScope.Msg = "Only five digits allowed.";
                            else $rootScope.Msg = "Confirm to validate code.";
                            break;
                    }
                    break;
       
                case "Error_CodeNotCorrect": $rootScope.Msg = "The confirmation code is not correct."; break;
                case "Error_EmailInUse": $rootScope.Msg = "This email is already in use."; break;
                case "Error_EmailInvalid": $rootScope.Msg = "This email is invalid."; break;
                case "Error_Server": $rootScope.Msg = "Server error."; break;
                case "Info_Change": $rootScope.Msg = "You may change your email."; break;
                case "Info_Confirm": $rootScope.Msg = "Enter email confirmation code."; break;
                case "Wait_Confirm": $rootScope.Msg = "Confirming your email..."; break;
                case "Wait_Loading": $rootScope.Msg = "Loading your email information..."; break;
                case "Wait_Resend": $rootScope.Msg = "Resending email confirmation..."; break;
                case "Wait_Save": $rootScope.Msg = "Saving your Email..."; break;
                case "Web_CheckEmail": $rootScope.Msg = "Check email for confirm code."; break;
                case "Web_Confirmed": $rootScope.Msg = "Your email is confirmed."; break;
            }
        }
    }
}

