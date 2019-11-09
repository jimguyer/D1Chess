angular.module('RegistrationMod', [])
    .directive('registration', RegistrationDir)
    .controller('RegistrationCtl', RegistrationCtl)
    .service('Registration', RegistrationSvc)
;

function RegistrationDir() {
    return {
        restrict: "E", templateUrl: '/Client/Anonymous/Views/Registration/Registration.html', controller: 'RegistrationCtl as VC' };
}

function RegistrationCtl($scope, $location, Registration, Global, Web) {
    //console.log("Registration.Ctl");
    Constructor();
    ngOnInit();

    //#region Ctl

    function Constructor() {
         //console.log("Registration.Constructor");
        GM.Scope = $scope;
        GM.Scope.VM = VM.Registration;
        GM.Scope.DM = DM.Registration;
    }
    function ngOnInit() {
         //console.log("Registration.ngOnInit * GM.View_Event=" + GM.View_Event);
        GM.View = "Registration";
        switch (GM.View_Event) {
            case "App_Boot":
            case "LogOn_Register": Registration.View({ Show: "*", Enable: "*", Msg: "Link_" + GM.View_Event }); break;
            default: alert("Registration.ngOnInit * Unknown GM.View_Event=" + GM.View_Event); break;
        }
        Registration.Size();
    }

    this.OnChange = function (pControl) {
        //console.log("Registration.OnChange * pControl=" + pControl);
        switch (pControl) {
            case "Email": Register.View({ Enable: "*", Msg: "Change" }); break;
            case "Password": break;
            case "FirstName": break;
            case "Code": Register.View({ Enable: "*", Msg: "Change" }); break;
        }
    };
    this.OnClick = function (pControl) {
         //console.log("Registration.OnClick * pControl=" + pControl);
        switch (pControl) {
            case "CodeImg": Web.Get("Code", null, (result) => Registration.Web(result)); break;
            case "Exit": GM.View_Event = "Registration_Exit"; $location.url("/"); break;
            case "Register": GM.View_Event = "Registration_Register"; $location.url('/privacy'); break;
            case "Toggle":
                //console.log("this.VM.Switch=" + this.VM.Switch);
                this.VM.ToggleShow = !this.VM.ToggleShow;
                Registration.View({ Show: "Toggle", Msg: "Info_Toggle" });
                break;
        }
    };

    //#endregion
}

function RegistrationSvc(Global, Size, Style, Web) {

    //#region Static

    this.Init = function () {
         //console.log("Registration.Init");
        Web.Get("Code", null, (result) => this.Web(result));
        //#region VM
        VM.Registration = {
            Loading: true,
            Switch: "Password", Disabled: false, ToggleShow: false, Email: "", UserId: "", Password: "", Code: "",
            FieldSet: Style.Build({ Type: "FieldSet_L", H: 9.5 }, false),
            Legend: Style.Build({ Type: "Legend", W: 5 }, false),
            Exit: GM.ButtonBL,
            Toggle: GM.ButtonBC,
            Register: GM.ButtonBR
        };
        var vm = VM.Registration;

        var wL = 1.8, addY = 1.25, y = GM.Y + addY * 1.5, h = .8, f = .8;
        vm.Email_Label = Style.Build({ Type: "Label_F", Y: y, W: wL, H: h, F: f }, false);

        var xR = vm.Email_Label.Size.X + vm.Email_Label.Size.W + GM.SpaceX;
        var wR = 9 - xR - vm.Email_Label.Size.X;
        vm.Email = Style.Build({ Type: "Input", X: xR, Y: y, W: wR, H: h });

        y += addY, wL = 4;
        vm.UserId_Label = Style.Build({ Type: "Label_F", Y: y, W: wL, H: h, F: f });
        xR = vm.UserId_Label.Size.X + vm.UserId_Label.Size.W + GM.SpaceX;
        wR = 9 - xR - vm.UserId_Label.Size.X;
        vm.UserId = Style.Build({ Type: "Input", X: xR, Y: y, H: h, W: wR });

        y += addY;
        vm.Password_Label = Style.Build({ Type: "Label_F", Y: y, W: wL, H: h, F: f });
        vm.Password = Style.Build({ Type: "Input", X: xR, Y: y, H: h, W: wR });

        y += addY;
        vm.FirstName_Label = Style.Build({ Type: "Label_F", Y: y, W: wL, H: h, F: f });
        vm.FirstName = Style.Build({ Type: "Input", X: xR, Y: y, H: h, W: wR });

        y += addY;
        vm.CodeImg_Label = Style.Build({ Type: "Label_F", Y: y, W: wL, H: h, F: f });
        vm.CodeImg = Style.Build({ Type: "Img", X: xR, Y: y, H: h, W: wR });

        y += addY;
        vm.Code_Label = Style.Build({ Type: "Label_F", Y: y, W: wL, H: h, F: f });
        vm.Code = Style.Build({ Type: "Input", X: xR, Y: y, H: h, W: wR });

        //#endregion
        //#region DM

        DM.Registration = {
            Email : "",
            UserId : "",
            FirstName : "",
            Password : "",
            Code : "",
            CodeImg: GM.Src.Diamond
        };
        var dm = DM.Registration;

        //#endregion

        //#region Test
        //GM.Test = true;
        if (GM.Test) {
            dm.Email = "LisaGuyer@hotmail.com";
            dm.UserId = "Lisa";
            dm.FirstName = "Lisa";
            dm.Password = "1234";
            dm.Code = "99999";
        }
        //#endregion

        //#region //console.log

        //console.log("Registration.Init * vm.FieldSet.Size=" + JSON.stringify(vm.FieldSet.Size));
        //console.log("Registration.Init * vm.Legend.Size=" + JSON.stringify(vm.Legend.Size));
        //console.log("Registration.Init * vm.Email_Label.Size=" + JSON.stringify(vm.Email_Label.Size));
        //console.log("Registration.Init * vm.Email.Size=" + JSON.stringify(vm.Email.Size));
        //console.log("Registration.Init * vm.UserId_Label.Size=" + JSON.stringify(vm.UserId_Label.Size));
        //console.log("Registration.Init * vm.UserId.Size=" + JSON.stringify(vm.UserId.Size));
        //console.log("Registration.Init * vm.Password_Label.Size=" + JSON.stringify(vm.Password_Label.Size));
        //console.log("Registration.Init * vm.Password.Size=" + JSON.stringify(vm.Password.Size));
        //console.log("Registration.Init * vm.FirstName_Label.Size=" + JSON.stringify(vm.FirstName_Label.Size));
        //console.log("Registration.Init * vm.FirstName.Size=" + JSON.stringify(vm.FirstName.Size));
        //console.log("Registration.Init * vm.CodeImg_Label.Size=" + JSON.stringify(vm.CodeImg_Label.Size));
        //console.log("Registration.Init * vm.CodeImg.Size=" + JSON.stringify(vm.CodeImg.Size));

        //#endregion

    };
    this.Web = function (pResult) {
         //console.log("Registration.Web * pResult=" + JSON.stringify(pResult));

        //console.log("Registration.Web * pResult.Action=" + pResult.Action);
        //console.log("Registration.Web * pResult.Success=" + pResult.Success);
        //console.log("Registration.Web * pResult.Data=" + JSON.stringify(pResult.Data));
        var vm = VM.Registration;

        switch (pResult.Action) {
            case "Code":
                vm.CodeImg.Src = pResult.Data; vm.Loading = false;
                this.View({});

                break;
        }
    };
    this.View = function (pObj) {
        //console.log("Registration.View * pObj=" + JSON.stringify(pObj));
        var vm = VM.Registration;
        var dm = DM.Registration;

        if (pObj.Show !== undefined) {
            //console.log("Registration.View * pObj=" + JSON.stringify(pObj));
            switch (pObj.Show) {
                case "*":
                case "Toggle": dm.Toggle = vm.Switch === 'Text' ? 'Hide' : 'Show'; break;
                default: alert("Registration.View.Show * Unknown=" + pObj.Show); break;
            }
        }
        if (pObj.Enable !== undefined) {
            switch (pObj.Enable) {
                case "*": vm.Disabled = GM.Processing; this.View({ Enable: "Register" }); break;
                case "All": vm.Disabled = false; break;
                case "Disable": vm.Disabled = false; break;
                case "Register": vm.Register_Disabled = dm.UserId.length < 4 || dm.Password.length < 4 || dm.FirstName.length === 0 || dm.Code.length === 0; break;
                //!UtilitySvc.EmailFunc("Validate", { Email: vm.Email }) ||
            }
        }
        if (pObj.Web !== undefined) {
            //console.log("RegistrationSvc.ViewFunc * pObj.Result=" + pObj.Web);
            switch (pObj.Web) {
                case "Code": Registration.VM.CodeImg.Src = pObj.Data; Registration.VM.Loading = false; break;
            }
        }
        if (pObj.Msg !== undefined) {
             //console.log("pObj.Msg=" + pObj.Msg);
            switch (pObj.Msg) {
                case "Change":
                    //if (!UtilitySvc.EmailFunc("Validate", { Email: dm.Email })) GM.Msg = "Enter a valid email.";
                    //else
                    if (dm.UserId.length === 0) this.View({ Msg: "Error_UserId_Blank" });
                    else if (dm.UserId.length < 4) this.View({ Msg: "Error_UserId_Short" });
                    else if (dm.Password.length.length === 0) this.View({ Msg: "Error_Password_Blank" });
                    else if (dm.Password.length.length < 4) this.View({ Msg: "Error_Password_Short" });
                    else if (dm.Password.length.length > 10) this.View({ Msg: "Error_Password_Long" });
                    else if (dm.FirstName.length === 0) this.View({ Msg: "Error_FirstName_Blank" });
                    else if (dm.Code.length === 0) this.View({ Msg: "Error_Code_Blank" });
                    else if (dm.Code.length < 5) this.View({ Msg: "Error_Code_Short" });
                    else if (dm.Code.length > 5) this.View({ Msg: "Error_Code_Long" });
                    else GM.Msg = "Click register.";
                    break;
                case "Info_Add": GM.Msg = "You my upload a photo."; break;
                case "Info_Init": GM.Msg = "Enter registration information."; break;
                case "Info_Toggle": GM.Msg = vm.Switch === "Text" ? "Password is visible." : "Password is hidden."; break;
                case "Error_UserId_Blank": GM.Msg = "Enter a User ID."; break;
                case "Error_UserId_Short": GM.Msg = "User ID is too short."; break;
                case "Error_Password_Blank": GM.Msg = "Enter a password."; break;
                case "Error_Password_Short": GM.Msg = "The password is too short."; break;
                case "Error_Password_Long": GM.Msg = "The password is too long."; break;
                case "Error_FirstName_Blank": GM.Msg = "Enter a firstname."; break;
                case "Error_FirstName_Short": GM.Msg = "The firstname is too short."; break;

                case "Error_Email_InUse": GM.Msg = "This email is already registered."; break;
                case "Error_Email_Invalid": GM.Msg = "This email is not valid."; break;
                case "Error_UserIdInUse": GM.Msg = "This user id is taken."; break;
                case "Error_CodeError": GM.Msg = "The code you entered is not correct."; break;
                case "Link_App_Boot": GM.Msg = "Enter registration information."; break;
                case "Link_LogOn_Register": GM.Msg = "Enter registration information."; break;
                case "Wait_Registering": GM.Msg = "Registering..."; break;
                case "Web_Registered": GM.Msg = "Registration successsful"; break;
            }
        }
    };
    this.Size = function () {
        //console.log("Registration.Size");
        //console.log("Registration.Size * vm.FieldSet.Size=" + JSON.stringify(vm.FieldSet.Size));
        //console.log("Registration.Size * vm.Legend.Size=" + JSON.stringify(vm.Legend.Size));
        //console.log("Registration.Size * vm.Email_Label.Size=" + JSON.stringify(vm.Email_Label.Size));
        //console.log("Registration.Size * vm.Email.Size=" + JSON.stringify(vm.Email.Size));
        var vm = VM.Registration;
        //Size.ViewModel(vm, false);
        Size.Control(vm.FieldSet, false);
        Size.Control(vm.Legend, false);
        Size.Control(vm.Email_Label, false); Size.Control(vm.Email, false);
        Size.Control(vm.UserId_Label, false); Size.Control(vm.UserId, false);
        Size.Control(vm.Password_Label, false); Size.Control(vm.Password, false);
        Size.Control(vm.FirstName_Label, false); Size.Control(vm.FirstName, false);
        Size.Control(vm.CodeImg_Label, false); Size.Control(vm.CodeImg, false);
        Size.Control(vm.Code_Label, false); Size.Control(vm.Code, false);

        //console.log("Registration.Size * vm.FieldSet.Style=" + JSON.stringify(vm.FieldSet.Style));
        //console.log("Registration.Size * vm.Legend.Style=" + JSON.stringify(vm.Legend.Style));
        //console.log("Registration.Size * vm.Email_Label.Style=" + JSON.stringify(vm.Email_Label.Style));
        //console.log("Registration.Size * vm.Email.Style=" + JSON.stringify(vm.Email.Style));
        //console.log("Registration.Init * vm.CodeImg_Label.Style=" + JSON.stringify(vm.CodeImg_Label.Style));
        //console.log("Registration.Init * vm.CodeImg.Style=" + JSON.stringify(vm.CodeImg.Style));
    };

    //#endregion
}