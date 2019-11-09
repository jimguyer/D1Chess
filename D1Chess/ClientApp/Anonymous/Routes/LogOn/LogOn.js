angular.module('LogOnMod', [])
    .config(LogOnConfig)
    .controller('LogOnCtl', LogOnCtl)
    .service('LogOn', LogOnSvc);

function LogOnConfig($routeProvider) {
    $routeProvider.when('/', { templateUrl: '/Client/Anonymous/Routes/LogOn/LogOn.html', controller: 'LogOnCtl as VC' });
    $routeProvider.when('/logon', { templateUrl: '/Client/Anonymous/Routes/LogOn/LogOn.html', controller: 'LogOnCtl as VC' });
}

function LogOnCtl($scope, $location, LogOn, Web) {
    //console.log("LogOnCtl");
    Constructor();
    ngOnInit();

    function Constructor() {
        //console.log("LogOn.Constructor");
        GM.Scope = $scope;
        GM.Scope.VM = VM.LogOn;
        GM.Scope.DM = DM.LogOn;
    }
    function ngOnInit() {
        //console.log("LogOn.ngOnInit * GM.View_Event=" + GM.View_Event);
        GM.View = "LogOn";
        switch (GM.View_Event) {
            case "App_Boot": LogOn.View({ Show: "Toggle", Msg: GM.View_Event }); break;
            case "Privacy_OK":
            case "Recover_Exit":
            case "Registration_Exit": LogOn.View({ Enable: "*", Msg: "Link_" + GM.View_Event }); break;
            default: alert("LogOn.ngOnInit * Unknown GM.View_Event=" + GM.View_Event); break;
        }
        LogOn.Size();
    }

    this.OnChange = function (pControl) {
        console.log("OnChange * pControl=" + pControl);
        switch (pControl) {
            case "EmailUserId": LogOn.View({ Enable: "*", Msg: "Change" }); break;
            case "Password": LogOn.View({ Enable: "*", Msg: "Change" }); break;
        }
    };
    this.OnClick = function (pControl) {
        //console.log("LogOn.OnClick * pControl=" + pControl + "DM.LogOn=" + JSON.stringify(DM.LogOn));
        var vm = VM.LogOn;
        var dm = DM.LogOn;


        switch (pControl) {
            case "Facebook": 
            case "LogIn":
                GM.Processing = true;
                LogOn.View({ Enable: "*", Msg: "Wait_LogIn" });
                Web.Post("LogIn", { EmailUserId: dm.EmailUserId, Password: dm.Password }, (pResult) => LogOn.Web(pResult));
                break;
            case "Practice": GM.View_Event = "LogOn_Practice"; $location.url("/practice"); break;
            case "Privacy": GM.View_Event = "LogOn_Privacy"; $location.url('/privacy'); break;
            case "Recover": GM.View_Event = "LogOn_Recover"; $location.url('/recover'); break;
            case "Register": GM.View_Event = "LogOn_Register"; $location.url('/register'); break;
            case "Toggle":
                //console.log("this.VM.Switch=" + this.VM.Switch);
                this.VM.ToggleShow = !this.VM.ToggleShow;
                LogOn.View({ Show: "Toggle", Msg: "Info_Toggle" });
                break;
        }
    };
}

function LogOnSvc(Style, Size) {

    this.Init = function () {
        //console.log("LogOn.Init");

        //#region VM
        VM.LogOn = {};
        var vm = VM.LogOn;
        vm.Switch = "Password"; vm.Switch.Disabled = false; vm.ToggleShow = false;
        vm.FieldSet = Style.Build({ Type: "FieldSet", H: 3 }, false);

        var wL = 2.25, addY = 1.25, y = GM.Y + addY * .5, h = .5, fL = "A.8", fR ="A.65";
        vm.EmailUserId_Label = Style.Build({ Type: "Label_F", Y: y, W: wL, F: fL }, false);

        //console.log("LogOn.Init *  vm.EmailUserId_Label.Size.X=" + vm.EmailUserId_Label.Size.X);
        //console.log("LogOn.Init *  vm.EmailUserId_Label.Size.W=" + vm.EmailUserId_Label.Size.W);

        var xR = vm.EmailUserId_Label.Size.X + vm.EmailUserId_Label.Size.W + GM.SpaceX;
        var wR = 9 - xR - vm.EmailUserId_Label.Size.X;
        vm.EmailUserId = Style.Build({ Type: "Input", X: xR, Y: y, W: wR, H: h, F: fR  }, false);

        y += addY;
        vm.Password_Label = Style.Build({ Type: "Label_F", Y: y, W: wL, F: fL }, false);
        vm.Password = Style.Build({ Type: "Input", X: xR, Y: y, W: wR, H: h, F: fR }, false);

        addY = 1.5;
        y = GM.Y + vm.FieldSet.Size.Y + addY * 2;
        vm.Toggle = Style.Build({ Type: "ButtonC", Y: y });

        y += addY;
        vm.Recover = Style.Build({ Type: "ButtonL", Y: y });
        vm.Register = Style.Build({ Type: "ButtonR", Y: y });

        y += addY; vm.Practice = Style.Build({ Type: "ButtonC", Y: y });
        y += addY; vm.Privacy = Style.Build({ Type: "ButtonC", Y: y });
        y += addY; vm.FBLogIn = Style.Build({ Type: "Img", X: 2, Y: y, W: 5.5, H: 1.25, Src: GM.Src.Facebook });
        y += addY * 1.25; vm.LogIn = Style.Build({ Type: "ButtonC", Y: y });

        //#endregion
        //console.log("LogOnSvc.Init * GM.Index.Parms=" + JSON.stringify(GM.Index.Parms));
        DM.LogOn = GM.Test ? { EmailUserId: "Jim", Password: "1234" } : { EmailUserId: GM.Index.Parms.EmailUserId, Password: "" };

        //#region //console.log
        //console.log("vm.FieldSet.Size=" + JSON.stringify(vm.FieldSet.Size));

        //console.log("vm.FieldSet.Size=" + JSON.stringify(vm.FieldSet.Size));
        //console.log("vm.EmailUserId_Label.Size=" + JSON.stringify(vm.EmailUserId_Label.Size));
        //console.log("vm.EmailUserId.Size=" + JSON.stringify(vm.EmailUserId.Size));
        //console.log("vm.Password_Label.Size =" + JSON.stringify(vm.Password_Label.Size));
        //console.log("vm.Password=" + JSON.stringify(vm.Password));
        //console.log("vm.Toggle=" + JSON.stringify(vm.Toggle));
        //console.log("vm.Recover=" + JSON.stringify(vm.Recover));
        //console.log("vm.FBLogIn=" + JSON.stringify(vm.FBLogIn));
        //console.log("vm.FBLogIn.Style=" + JSON.stringify(vm.FBLogIn.Style));
        //#endregion
    };
    this.Error = function (pEvent, pObj) {
        switch (pEvent) {
            default: break;

        }
    };

    this.Web = function (pResult) {
        //console.log("Registration.Web * pResult=" + JSON.stringify(pResult));
        //console.log("Registration.Web * pResult.Action=" + pResult.Action);
        //console.log("Registration.Web * pResult.Success=" + pResult.Success);
        //console.log("Registration.Web * pResult.Data=" + JSON.stringify(pResult.Data));
        var vm = VM.LogOn;

        switch (pResult.Action) {
            case "FBLogIn":
            case "LogIn":
                if (pResult.Success) {
                    this.View({ Enable: "*", Msg: "Wait_LogInSuccess" });
                    document.forms[0].submit();
                }
                else {
                    GM.Processing = false;
                    this.View({ Enable: "*", Msg: "Wait_LogInSuccess" });
                }
                //console.log("LogIn returned");
                break;
        }
    };
    this.View = function (pObj) {
        //console.log("LogOn.View * VM.LogOn=" + JSON.stringify(VM.LogOn));
        var vm = VM.LogOn;
        var dm = DM.LogOn;
        if (pObj.Show !== undefined) {
            switch (pObj.Show) {
                case "*":
                case "Toggle": if (vm.Switch === "Text") this.View({ Show: "Password" }); else this.View({ Show: "Text" }); break;
                case "Password": vm.Switch = "Password"; vm.ToggleText = "Show"; break;
                case "Text": vm.Switch = "Text"; vm.ToggleText = "Hide"; break;
                default: alert("Unknown pObj.Show=" + pObj.Show); break;
            }
        }
        if (pObj.Enable !== undefined) {
            //console.log("LogOnSvc.View * pObj.Enable=" + pObj.Enable);
            //console.log("LogOnSvc.View * GM.Processing=" + GM.Processing);
            switch (pObj.Enable) {
                case "*":
                    if (GM.Processing) vm.Disabled = true; else {
                        vm.Disabled = false;
                        this.View({ Enable: "LogIn" });
                    }

                    break;
                case "LogIn":
                    //console.log("dm.EmailUserId.length=" + dm.EmailUserId.length + " * dm.Password.length=" + dm.Password.length );
                    vm.LogIn_Disabled = dm.EmailUserId.length < 2 || dm.Password.length < 4 || dm.Password.length > 10;
                    vm.FBLogIn.Style.filter = !vm.LogIn_Disabled ? null : GM.DisableFilter;
                    vm.FBLogIn.Style.opacity = !vm.LogIn_Disabled ? null : GM.DisableOpacity;
                    break;
            }
        }
        if (pObj.Msg !== undefined) {
            //console.log("pObj.Msg=" + pObj.Msg);
            switch (pObj.Msg) {
                case "App_Boot":
                    //console.log("GM.Index.Parms.MsgId=" + GM.Index.Parms.MsgId);
                    switch (GM.Index.Parms.MsgId) {

                        case "NewDevice":
                        case "NoToken":
                        case "UnknownDevice":
                        case "NoUser": GM.Msg = "Please LogIn or register."; break;
                        case "LoggedOut": GM.Msg = GM.Index.Parms.FirstName + ", has logged out."; break;
                        case "Registered": GM.Msg = GM.Index.Parms.FirstName + ", is registered."; break;
                    }
                    break;
                case "Change":
                    //console.log("VM.LogOn.Password.length=" + VM.LogOn.Password.length);
                    if (VM.LogOn.EmailUserId === "") GM.Msg = "Enter a User ID or Email.";
                    else if (VM.LogOn.Password === "") GM.Msg = "Enter a the password.";
                    else if (VM.LogOn.Password.length < 4) GM.Msg = "The password is too short.";
                    else if (VM.LogOn.Password.length > 10) GM.Msg = "The password is too long.";
                    else GM.Msg = "You may log in.";
                    break;
                case "Error_LogInFailed": GM.Msg = "Log in invalid"; break;
                case "Error_EmailInvalid": GM.Msg = "The email is invalid"; break;
                case "Error_FB": GM.Msg = "Facebook log in failed."; break;
                case "Error_InvalidPassword": GM.Msg = "Password is incorrect"; break;

                case "Info_Toggle": GM.Msg = (VM.LogOn.Switch === "Text") ? "Password is visible." : "Password is hidden."; break;

                case "Link_Privacy_ClickOK": GM.Msg = "Please LogIn or register."; break;
                case "Link_Recover_ClickBack": GM.Msg = "You have exited recovery."; break;
                case "Link_Recover_ClickExit": GM.Msg = "You have exited recovery."; break;
                case "Link_Recover_ClickRecover": GM.Msg = "Recovery information sent."; break;
                case "Link_Register_ClickExit": GM.Msg = "Registration was cancelled."; break;

                case "Req_EmailUserId": GM.Msg = "Email or User ID required"; break;
                case "Req_Password": GM.Msg = "Password is required"; break;
                case "Wait_LogIn": GM.Msg = "Logging you in..."; break;
                case "Wait_LogInFB": GM.Msg = "Logging you in with Face Book..."; break;
                case "Wait_LogInSuccess": GM.Msg = "Opening Home Menu..."; break;
            }
        }
    };
    this.Size = function () {
        //console.log("LogOnSvc.SizeFunc * GM.Sized.LogOn=" + GM.Sized.LogOn);
        //if (GM.Sized.LogIn) return;
        var vm = VM.LogOn;
        Size.Control(vm.FieldSet, false);
        Size.Control(vm.EmailUserId_Label, false);
        Size.Control(vm.EmailUserId, false);
        Size.Control(vm.Password_Label, false);
        Size.Control(vm.Password, false);
        Size.Control(vm.Toggle, false);
        Size.Control(vm.Recover, false);
        Size.Control(vm.Register, false);
        Size.Control(vm.Practice, false);
        Size.Control(vm.LogIn, false);
        Size.Control(vm.Privacy, false);
        GM.Sized.LogOn = true;
        //console.log("LogOn.Size *  GM.Sized.LogOn=" + GM.Sized.LogOn);
        //console.log("LogOn.Size * vm.FieldSet.Style=" + JSON.stringify(vm.FieldSet.Style));
        //console.log("LogOn.Size * vm.EmailUserId_Label.Style=" + JSON.stringify(vm.EmailUserId_Label.Style));
        //console.log("LogOn.Size * vm.EmailUserId.Style=" + JSON.stringify(vm.EmailUserId.Style));
        //console.log("LogOn.Size * vm.Recover.Style=" + JSON.stringify(vm.Recover.Style));
    };
}