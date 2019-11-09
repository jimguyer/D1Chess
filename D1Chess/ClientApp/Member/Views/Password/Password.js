angular.module('PasswordMod', [])
    .directive('passworddir', PasswordDir)
    .controller('PasswordCtl', PasswordCtl)
    .service('PasswordWebSvc', PasswordWebSvc)
    .service('PasswordLinkSvc', PasswordLinkSvc)
    .service('PasswordSvc', PasswordSvc)
;

function PasswordDir() {
    return { restrict: "E", templateUrl: '/Client/Views/Password/Password.html', controller: 'PasswordCtl as VM_Password' };
}

function PasswordCtl($scope, PasswordWebSvc, PasswordLinkSvc, PasswordSvc) {
    $scope.Password = VM.Password;
    GM.Scope = $scope;
    this.ChangeFunc = function () { PasswordSvc.RouteFunc("Change"); }
    this.ClickExitFunc = function () { PasswordLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Exit" }); }
    this.ClickSaveFunc = function () { PasswordWebSvc.RouteFunc("Click", { Control: "Button", Button: "Save" }); }
    this.ClickToggleFunc = function () { PasswordSvc.RouteFunc("Click", { Control: "Button", Button: "Toggle" }); }
}

function PasswordWebSvc($http, PasswordLinkSvc, PasswordSvc, UtilitySvc) {
    this.RouteFunc = function (pEvent, pObj) {
        switch (pEvent) {
            case "Click":
                //console.log("OptionsWebSvc.RouteFunc.Click * pObj.Control=" + pObj.Control);
                switch (pObj.Control) {
                    case "Button":
                        PasswordSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        switch (pObj.Button) {
                            case "Save": this.MainFunc("Post", { Event: "PasswordSave", Data: MM.Data }); break;
                        }
                        break;
                }
                break;
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        switch (pEvent) {
            case "Post":
                //console.log("OptionsWebSvc.MainFunc.Post" + " * pObj.Event=" + pObj.Event + " * Data=" + JSON.stringify(pObj.Data));
                var parms = UtilitySvc.WebParmsFunc(pEvent, { Event: pObj.Event, Data: MM.Data });
                //console.log("OptionsWebSvc.MainFunc.Post" + " * parms=" + JSON.stringify(parms));
                $http
                    .post("api/Web", parms)
                    .success(function (pWebReturn) {
                        if (pWebReturn.Code == "Success") {
                            PasswordSvc.RouteFunc("Web", { Event: pObj.Event, Data: pWebReturn.Data });
                        }
                        else
                            PasswordSvc.RouteFunc("Error", { Event: pObj.Event, Error: pWebReturn.Code });
                    })
                    .error(function () { PasswordSvc.RouteFunc("Error", { Event: pObj.Event, Error: "Server" }); });
                    ;
                break;
        }
    }
}

function PasswordLinkSvc($location, PasswordSvc, HomeSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        switch (pEvent) {
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        //console.log("SearchLinkSvc.RouteFunc.Click.Button" + " * pObj.Button=" + pObj.Button);
                        PasswordSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        break;
                }
                break;
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("OptionLinkSvc.MainFunc * pEvent = " + pEvent);
        switch (pEvent) {
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        switch (pObj.Button) {
                            case "Exit": HomeSvc.RouteFunc("_Link", { View_Event: "User_ClickExit" }); break;
                        }
                }
                break;
        }
    };
}

function PasswordSvc($rootScope, $location, StylesSvc, UtilitySvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("PasswordSvc.RouteFunc" + " * pEvent=" + pEvent);
        switch (pEvent) {

            //#region case "_Link":
            case "_Link":
                switch (pObj.View_Event) {
                    case "Member_Init": this.InitFunc(); break;
                    case "Member_Size": this.SizeFunc(); break;
                    case "Home_ClickUser":
                    case "User_ClickTab":
                    case "User_WebGetUser": this.MainFunc(pEvent, { View_Event: pObj.View_Event, Data: pObj.Data }); break;
                }
                break;
            //#endregion

            case "Change": this.MainFunc(pEvent); break;
            case "Click": this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button }); break;
            case "Error": MM.Processing = false; this.ViewFunc({ Enable: "*", Msg: "Error_" + pObj.Error }); break;
            case "Web": this.MainFunc(pEvent, { Event: pObj.Event, Data: pObj.Data }); break;
        }
    }
    this.InitFunc = function () {
        //console.log("PasswordSvc.Init");
        MM.Password = { Loading: true }
        VM.Password = { New: "", Old: ""};

        //#region View
        VM.Password.FieldSet = StylesSvc.InitFunc({ Type: "FieldSetT", H: 3.5 });
        VM.Password.Legend_Text = StylesSvc.InitFunc({ Type: "LegendT", X: 2.5, W:4 });
        var addY = 1, xL = 1, wL = 3, fsL = .8, fsR = .7;
        var xR = xL + wL + .15, wR = 9 - xR - xL;


        var y = 4.25;
        VM.Password.Current_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fsL });
        VM.Password.Current_Input = StylesSvc.InitFunc({ Type: "Input", X: xR, Y: y, W: wR , FS: fsR });

        y += addY;
        VM.Password.New_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fsL });
        VM.Password.New_Input = StylesSvc.InitFunc({ Type: "Input", X: xR, Y: y, W: wR , FS: fsR });

        VM.Password.Exit = MM.ButtonTL; VM.Password.Toggle = MM.ButtonTC; VM.Password.Save = MM.ButtonTR;
        //#endregion
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("PasswordSvc.MainFunc * pEvent = " + pEvent);
        switch (pEvent) {
            case "_Link":
                switch (pObj.View_Event) {
                    case "Home_ClickUser":
                    case "User_ClickTab": this.ViewFunc({ TabView: "Password", Legend: "*", Show: "Password", Enable: "*", Msg: "Info_Init" }); break;
                }
                break;
            case "Change": this.ViewFunc({ Enable: "*", Msg: "Change"  }); break;
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        //console.log("OptionsSvc.MainFunc.Click.Button * pObj.Button=" + pObj.Button);
                        switch (pObj.Button) {
                            case "Toggle": this.ViewFunc({ Show: "Toggle", Msg: "Info_Toggle" }); break;
                            case "Save":
                                MM.Processing = true;
                                MM.Data = { Old: VM.Password.Old, New: VM.Password.New };
                                this.ViewFunc({ Show: "Password", Enable: "*", Msg: "Wait_Saving" }); break;
                        }
                        break;
                }
                break;
            case "Web":
                //console.log("PasswordSvc.MainFunc.Web * pObj.Event = " + pObj.Event);
                switch (pObj.Event) {
                    case "PasswordSave":
                        VM.Password.New = "";
                        VM.Password.Old = "";
                        MM.Processing = false;
                        this.ViewFunc({ Enable: "*", Msg: "Web_Save" });
                        break;
                }
        }
    }
    this.SizeFunc = function (pEvent, pObj) {
        //console.log("PasswordSvc.SizeFunc * GM.Sized.Search=" + GM.Sized.Search);
        if (GM.Sized.Password) return;
        StylesSvc.SizeFunc(VM.Password.Legend_Text); StylesSvc.SizeFunc(VM.Password.FieldSet);
        StylesSvc.SizeFunc(VM.Password.Current_Label); StylesSvc.SizeFunc(VM.Password.Current_Input);
        StylesSvc.SizeFunc(VM.Password.New_Label); StylesSvc.SizeFunc(VM.Password.New_Input);
        GM.Sized.Password = true;
    }
    this.ViewFunc = function (pObj) {
        //console.log("PasswordSvc.ViewFunc * pObj=" + JSON.stringify(pObj));
        if (pObj.View != null) {
            MM.View = pObj.View;
            switch ($location.path()) {
                case "/User": VM.User.Show_View = pObj.View; break;
                default: alert("PasswordSvc.ViewFunc * Unknown pObj.URL=" + pObj.URL); break;
            }
        }
        if (pObj.Legend != null) {
            VM.Password.Legend = "Password";
        }
        if (pObj.Show != null) {
            switch (pObj.Show) {
                case "Toggle": if (VM.Password.Switch == "Text") this.ViewFunc({ Show: "Password" }); else this.ViewFunc({ Show: "Text" }); break;
                case "Password": VM.Password.Switch = "Password"; VM.Password.Toggle.Text = "Show"; break;
                case "Text": VM.Password.Switch = "Text"; VM.Password.Toggle.Text = "Hide"; break;
                default: alert("Unknown pObj.Show=" + pObj.Show); break;
            }
        }
        if (pObj.Enable != null) {
            //console.log("OptionsSvc.ViewFunc * pObj.Enable=" + pObj.Enable);
            switch (pObj.Enable) {
                case "*":
                    VM.Password.Disabled = MM.Processing;
                    if (VM.Password.Old == null || VM.Password.Old == "") VM.Password.Save_Disabled = true;
                    else if (VM.Password.New == null || VM.Password.New == "") VM.Password.Save_Disabled = true;
                    else if (VM.Password.New.length > 10) VM.Password.Save_Disabled = true;
                    else if (VM.Password.Old.length == "") VM.Password.Save_Disabled = true;
                    else if (VM.Password.New.length == "") VM.Password.Save_Disabled = true;
                    else if (VM.Password.New == VM.Password.Old) VM.Password.Save_Disabled = true;
                    else VM.Password.Save_Disabled = false;
                    break;
                default: alert("Unknown pObj.Enable=" + pObj.Enable); break;
            }
        }
        if (pObj.Msg != null) {
            //console.log("OptionsSvc.ViewFunc * pObj.Msg=" + pObj.Msg);
            switch (pObj.Msg) {
                case "Change":
                    if (VM.Password.Old == "") $rootScope.Msg = "Enter current password.";
                    else if (VM.Password.New == "") $rootScope.Msg = "Enter a new password.";
                    else if (VM.Password.Old.length > 10) $rootScope.Msg = "The current password is too long.";
                    else if (VM.Password.New.length > 10) $rootScope.Msg = "The new password is too long.";
                    else if (VM.Password.New == VM.Password.Old) $rootScope.Msg = "The passwords are the same.";
                    else VM.Password.Save_Disabled = false;
                    break;
                case "Error_Server": $rootScope.Msg = "Server error."; break;
                case "Error_NoChanges": $rootScope.Msg = "No changes were made."; break;
                case "Error_PasswordNotCorrect": $rootScope.Msg = "The current password is incorrect."; break;                    
                case "Info_Init": $rootScope.Msg = "You may change your password."; break;
                case "Info_Toggle": $rootScope.Msg = (VM.Password.Switch == "Text") ? "Passwords are visible." : "Passwords are hidden."; break;
                case "Wait_Saving": $rootScope.Msg = "Saving your password..."; break;
                case "Web_Save": $rootScope.Msg = "Password successfully changed."; break;
                default: alert("PasswordSvc * Unknown pObj.Msg=" + pObj.Msg); break;
            }
        }

    }
}