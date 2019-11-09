angular.module('PrivacyMod', [])
    .config(PrivacyConfig)
    .controller('PrivacyCtl', PrivacyCtl)
    .service('Privacy', PrivacySvc);

function PrivacyConfig($routeProvider) {
    $routeProvider.when('/privacy', { templateUrl: '/Client/Anonymous/Routes/Privacy/Privacy.html', controller: 'PrivacyCtl as VC' });
}
function PrivacyCtl($scope, $location, Privacy) {
    Constructor();
    ngOnInit();

    //#region Ctl

    function Constructor() {
         //console.log("Privacy.Constructor");
        GM.Scope = $scope;
        GM.Scope.VM = VM.Privacy;
        GM.Scope.DM = DM.Privacy;
    }
    function ngOnInit() {
        //console.log("Privacy.ngOnInit * GM.View_Event=" + GM.View_Event);
        GM.View = "Privacy";
        switch (GM.View_Event) {
            case "App_Boot": 
            case "LogOn_Privacy": Privacy.View({ Show: "Toggle", Msg: "Link_" + GM.View_Event }); break;
            default: alert("Privacy.ngOnInit * Unknown GM.View_Event=" + GM.View_Event); break;
        }
        Privacy.Size();
    }
    this.OnClick = function (pControl) {
        //console.log("PrivacyCTL.OnClick * pControl=" + pControl);
        switch (pControl) {
            case "OK": GM.View_Event = "Privacy_OK"; $location.url("/"); break;
        }
    };

    //#endregion
}

//#region Static

function PrivacySvc(Global, Style, Size) {
    this.Init = function () {
        //console.log("Privacy.Init");

        //#region VM
        VM.Privacy = {
            FieldSet: Style.Build({ Type: "FieldSet_L" }, false),
            Legend: Style.Build({ Type: "Legend", W: 5 }, false)
        };
        var vm = VM.Privacy;
        var h = .7, c = "Red", f = .7;
        var y = 2.75, yAdd = .8;

        y = GM.Y_FL; vm.P1 = Style.Build({ Type: "Center", Y: y, F: f, C: c }, false);
        y += yAdd; vm.P2 = Style.Build({ Type: "Center", Y: y, H: h, F: f, C: c }, false);
        y += yAdd; vm.P3 = Style.Build({ Type: "Center", Y: y, H: h, F: f, C: c }, false);
        y += yAdd; vm.P4 = Style.Build({ Type: "Center", Y: y, H: h, F: f, C: c }, false);
        y += yAdd; vm.P5 = Style.Build({ Type: "Center", Y: y, H: h, F: f, C: c }, false);
        y += yAdd; vm.P6 = Style.Build({ Type: "Center", Y: y, H: h, F: f, C: c }, false);

        y += yAdd * 1.5; vm.F0 = Style.Build({ Type: "Center", Y: y, H: h, F: f, C: c }, false);
        y += yAdd; vm.F1 = Style.Build({ Type: "Center", Y: y, H: h, F: f, C: c }, false);
        y += yAdd; vm.F2 = Style.Build({ Type: "Center", Y: y, H: h, F: f, C: c }, false);
        y += yAdd; vm.F3 = Style.Build({ Type: "Center", Y: y, H: h, F: f, C: c }, false);
        y += yAdd; vm.F4 = Style.Build({ Type: "Center", Y: y, H: h, F: f, C: c }, false);
        y += yAdd; vm.F5 = Style.Build({ Type: "Center", Y: y, H: h, F: f, C: c }, false);
        y += yAdd; vm.F6 = Style.Build({ Type: "Center", Y: y, H: h, F: f, C: c }, false);
        vm.OK = GM.ButtonBC;
        //#endregion
        //#region DM
        DM.Privacy= {
            Legend: "Privacy",
            P1: "Diamond chess will never share any",
            P2: "of your information with anyone. If",
            P3: "you enter a phone number it will only",
            P4: "be used to send texts when it's your",
            P5: "turn or if you get a challenge. You",
            P6: "can turn notices off in 'User/Options'.",

            F0: "  ***  Facebook LogIn  ***",
            F1: "Logging in with Facebook will:",
            F2: "1. Default your photo from Facebook.",
            F3: "2. Let you challenge Facebook Friends.",
            F4: "3. Autopost wins to your Timeline.",
            F5: "You can change your photo in 'Profiles'.",
            F6: "You turn autopost off in 'User/Options'."
        };
        //#endregion        //#region //console.log()        //#endregion        
    };
    this.Size = function () {
        //console.log("PrivacySvc.Size * GM.Sized.Privacy=" + GM.Sized.Privacy);
        if (GM.Sized.Privacy !== undefined) return;
        //console.log("PrivacySvc.Size * Getting sized");
        var vm = VM.Privacy;
        //Size.ViewModel(vm, false);
        Size.Control(vm.FieldSet, false);
        Size.Control(vm.Legend, false);
        Size.Control(vm.P1, true);
        Size.Control(vm.P2, false);
        Size.Control(vm.P3, false);
        Size.Control(vm.P4, false);
        Size.Control(vm.P5, false);
        Size.Control(vm.P6, false);
        Size.Control(vm.P7, false);
        Size.Control(vm.F0, false);
        Size.Control(vm.F1, false);
        Size.Control(vm.F2, false);
        Size.Control(vm.F3, false);
        Size.Control(vm.F4, false);
        Size.Control(vm.F5, false);
        Size.Control(vm.F6, false);
        GM.Sized.Privacy = true;

        //console.log("PrivacySvc.Size * vm.FieldSet.Size=" + JSON.stringify(vm.FieldSet.Size));
        //console.log("PrivacySvc.Size * vm.FieldSet.Style=" + JSON.stringify(vm.FieldSet.Style));

    };
    this.View = function (pObj) {
        //var vm = Privacy.VM;
        //var dm = Privacy.DM;

        if (pObj.Msg !== undefined) {
            //console.log("pObj.Msg=" + pObj.Msg);
            //console.log("GM.Msg=" + GM.Msg);

            switch (pObj.Msg) {
                case "Link_App_Boot":
                case "Link_LogOn_Privacy": GM.Msg = "Diamond Chess Privacy Policy."; break;
                default: alert("Unknown Privacy.View.Msg=" + pObj.Msg); break;
            }
            //console.log("GM.Msg=" + GM.Msg);
        }
    };
}

//#endregion 