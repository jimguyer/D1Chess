angular.module('RecoverMod', []).config(RecoverConfig).controller('RecoverCtl', RecoverCtl).service('Recover', RecoverSvc);
function RecoverConfig($routeProvider) {
    $routeProvider.when('/recover', { templateUrl: '/Client/Anonymous/Routes/Recover/Recover.html', controller: 'RecoverCtl as VC' });
}


function RecoverCtl($scope, $location, Recover) {
    Constructor();
    ngOnInit();

    function Constructor() {
         //console.log("Recover.Constructor");
        GM.Scope = $scope;
        GM.Scope.VM = VM.Recover;
        GM.Scope.DM = DM.Recover;
    }
    function ngOnInit() {
         //console.log("Recover.ngOnInit * GM.View_Event=" + GM.View_Event);
        GM.View = "Recover";
        switch (GM.View_Event) {
            case "App_Boot":
            case "LogOn_Recover": Recover.View({ Show: "*", Msg: "Link_" + GM.View_Event }); break;
            default: alert("Recover.ngOnInit * Unknown GM.View_Event=" + GM.View_Event); break;
        }
        Recover.Size();
    }
    this.OnChange = function (pControl) {
        //console.log("OnChange * pControl=" + pControl);
        switch (pControl) {
            case "Email": Recover.ViewFunc({ Enable: "LogIn", Msg: "Change" }); break;
            case "Phone": Recover.ViewFunc({ Enable: "LogIn", Msg: "Change" }); break;
            case "EmailUserId": Recover.ViewFunc({ Enable: "LogIn", Msg: "Change" }); break;
        }
    };
    this.OnClick = function (pControl) {
         //console.log("LogOn.OnClick * pControl=" + pControl);
        switch (pControl) {
            case "Exit": GM.View_Event = "Recover_Exit"; $location.url("/"); break;
            case "Send": break;
        }
    };


}

function RecoverSvc($location, Size, Style) {
    this.Init = function () {
         //console.log("Recover.Init");

        //#region VM
        VM.Recover = {
            ContactMethod_FieldSet: Style.Build({ Type: "FieldSet_L", H: 4 }, false),
            ContactMethod_Legend: Style.Build({ Type: "Legend", W: 5 }, false)
        };

        var vm = VM.Recover;
        var wL = 2.5, h = .7, c = "Red", f = .7, yAdd = 1.2;
        var xL = 2;
        var y = GM.Y_FL;

        vm.Email_Label = Style.Build({ Type: "Label_F", X: xL, Y: y, W: wL }, false);
        var xR = 5; var wR = GM.Grid.Cols - xL;
        vm.Email = Style.Build({ Type: "CheckBox", X: xR, Y: y }, true);

        y += yAdd;
        vm.Phone_Label = Style.Build({ Type: "Label_F", X: xL, Y: y, W: wL }, false);
        vm.Phone = Style.Build({ Type: "CheckBox", X: xR, Y: y }, false);

        y += yAdd * 2.5;
        vm.ContactInfo_Legend = Style.Build({ Type: "Legend", X: 2, Y: y, W: 6 }, false);
        y += .5;
        vm.ContactInfo_FieldSet = Style.Build({ Type: "FieldSet", Y: y, H: 3.5 }, false);

        y += yAdd * .75;
        vm.EmailUserId_Label = Style.Build({ Type: "Center", Y: y }, false);
        y += yAdd;
        vm.EmailUserId = Style.Build({ Type: "Center", W: 8, Y: y });

        vm.Exit = GM.ButtonBL;
        vm.Send = GM.ButtonBR;

        //#endregion

        //#region DM

        DM.Recover = {
            Email: true,
            Phone: true
        };

        //#endregion

        //#region //console.log

        //console.log("Recover.Init * vm.ContactMethod_FieldSet.Size=" + JSON.stringify(vm.ContactMethod_FieldSet.Size));
        //console.log("Recover.Init * vm.ContactMethod_Legend.Size=" + JSON.stringify(vm.ContactMethod_Legend.Size));
        //console.log("Recover.Init * vm.Email_Label.Size=" + JSON.stringify(vm.Email_Label.Size));
        //console.log("Recover.Init * vm.Email.Size=" + JSON.stringify(vm.Email.Size));
        //console.log("Recover.Init * vm.Phone_Label.Size=" + JSON.stringify(vm.Phone_Label.Size));
        //console.log("Recover.Init * vm.Phone.Size=" + JSON.stringify(vm.Phone.Size));

        //console.log("Recover.Init * vm.ContactInfo_FieldSet.Size=" + JSON.stringify(vm.ContactInfo_FieldSet.Size));
        //console.log("Recover.Init * vm.ContactInfo_Legend.Size=" + JSON.stringify(vm.ContactInfo_Legend.Size));

        //console.log("Recover.Init * vm.EmailUserId.Size=" + JSON.stringify(vm.EmailUserId.Size));
        //console.log("Recover.Init * vm.EmailUserId.Style=" + JSON.stringify(vm.EmailUserId.Style));
        //#endregion
    };
    this.View = function (pObj) {
        var vm = VM.Recover;
        var dm = DM.Recover;

        if (pObj.Enable !== undefined) {
            //console.log("pObj.Enable=" + pObj.Enable);
            switch (pObj.Enable) {
                case "*": vm.Disabled = GM.Processing; this.View({ Enable: "Send" }); break;
                case "Send": vm.Send_Disabled = dm.EmailUserId === "" || !vm.Email && !vm.Phone; break;
            }
        }
        if (pObj.Msg !== undefined) {
            //console.log("pObj.Msg=" + pObj.Msg);
            switch (pObj.Msg) {
                case "Change":
                    if (!dm.Email && !dm.Phone) GM.Msg = "Select at least one contact method.";
                    else if (dm.EmailUserId === "") GM.Msg = "Enter an email or User ID.";
                    else GM.Msg = "Click send.";
                    break;
                case "Error_NotFound": GM.Msg = "Email or User ID not found."; break;
                case "Error_Server": GM.Msg = "Server error."; break;
                case "Info_Sent": GM.Msg = "Password recovery has been sent."; break;
                case "Info_Enter": GM.Msg = "Enter recovery information."; break;
                case "Wait_Sending": GM.Msg = "Sending recovery information..."; break;
            }
        }
    };
    this.Size = function () {
        //console.log("Recover.SizeFunc * GM.Sized.Recover=" + GM.Sized.Recover);
        if (GM.Sized.Recover) return;
        var vm = VM.Recover;
        Size.Control(vm.ContactMethod_FieldSet, false);
        Size.Control(vm.ContactMethod_Legend, false);
        Size.Control(vm.Email_Label, false);
        Size.Control(vm.Email, false);
        Size.Control(vm.Phone_Label, false);
        Size.Control(vm.Phone, false);

        Size.Control(vm.ContactInfo_FieldSet, false);
        Size.Control(vm.ContactInfo_Legend, false);
        Size.Control(vm.EmailUserId_Label, false);
        Size.Control(vm.EmailUserId, false);
        GM.Sized.Recover = true;
        //console.log("RecoverSvc.SizeFunc * VM.Recover.Email_Label=" + JSON.stringify(VM.Recover.Email_Label));
        //console.log("RecoverSvc.SizeFunc * VM.Recover.Email_CheckBox=" + JSON.stringify(VM.Recover.Email_CheckBox));
        //console.log("RecoverSvc.SizeFunc * VM.Recover.Phone_Label=" + JSON.stringify(VM.Recover.Phone_Label));
        //console.log("RecoverSvc.SizeFunc * VM.Recover.Phone_CheckBox=" + JSON.stringify(VM.Recover.Phone_CheckBox));
    };
}