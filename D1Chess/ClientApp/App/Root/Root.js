angular.module('RootMod')
    .directive('approot', RootDir)
    .controller('RootCtl', RootCtl)
    .service('RootSvc', RootSvc)
    .run(['$location', '$route', function ($location, $route) {
        //switch (GM.Role) {
        //    case "Anonymous": $location.url("/Anonymous"); break;
        //    case "Member": $location.url("/Member"); break;
        //}

        $route.reload();
    }
    ])
    ;

function RootDir() {
    return { restrict: "E", templateUrl: 'ClientApp/App/Root/Root.html', controller: 'RootCtl as VC' };
}

function RootCtl($scope, RootSvc, Global, Role, Size, Style, Web) {
    //console.log("Root.Ctl");
    constructor();
    ngOnInit();

    //#region Ctl

    function constructor() {
        //console.log("Root.Constructor");
        GM.Role = "Anonymous";
        GM.Test = false;
        GM.View_Event = "App_Boot";
        GM.Msg = "Loading...";
        Global.Init();
        Style.Init();
        Size.Init();
        RootSvc.Init();
        RootSvc.Size();
        Role.Init();
    }

    function ngOnInit() {
        //console.log("Root.OnInit");
        GM.ScopeApp = $scope;
        GM.ScopeApp.VM = VM.Root;
        GM.ScopeApp.GM = GM;
        window.onresize = function () {
            //console.log("Root.OnInit.window.onresize");
            GM.Sized = {};
            Global.Measure();
            GM.ScopeApp.$apply(Root.Size());
            GM.ScopeApp.$apply(Size.OnResize());
            GM.Scope.$apply(Role.OnResize());
        };
    }


    this.OnClick = function (pControl) {
        //console.log("Root.OnClick * pControl=" + pControl);
        switch (pControl) {
            case "LeftDiamond":
                //console.log("Left Diamond");
                Web.Get("Ping", "LeftDiamond", (result) => Root.Web(result));
                break;
            case "RightDiamond":
                //console.log("Right Diamond");
                Web.Get("Ping", "RightDiamond", (result) => Root.Web(result));
                break;
        }
    };


    //#endregion 

}


function RootSvc(Style, Size) {
    //console.log("RootSvc");

    //#region Static

    this.Init = function () {
        //console.log("Root.Init");
        //console.log("Root.Init * GM.Src.Background =" + GM.Src.Background);

        VM.Root = {
            Background: Style.Build({ L: 0, T: 0, Z: -1, S: "100%", Src: GM.Src.Background }, false),
            View: Style.Build({ Z: -1, W: "100%", H: "100%", Src: GM.Src.Background }, false),
            Div: Style.Build({ Z: 1, L: 0, T: 0, H: GM.H_Header, W: "100%", BgC: "B" }, false),
            Label: Style.Build({ Z: 3, T: 0, X: .5, W: 8, F: "1WhBGeorgia", TA: "C" }, true),
            Img_L: Style.Build({ Z: 1, L: .2, T: .05, S: .9, Src: GM.Src.Diamond }, false),
            Img_R: Style.Build({ Z: 1, R: .2, T: .05, S: .9, Src: GM.Src.Diamond }, false),
            Msg: Style.Build({ X: 0, Y: 15.25, Z: 1, W: 9, F: "A1", TA: "C" }, false)
        };

        //console.log("Root.Size * VM.Root.Background.Size=" + JSON.stringify(VM.Root.Background.Size));
        //console.log("Root.Size * VM.Root.Background.Style=" + JSON.stringify(VM.Root.Background.Style));
        //console.log("Root.Size * VM.Root.Msg.Style=" + JSON.stringify(VM.Root.Msg.Style));
        //console.log("Root.Size * VM.Root.View.Style=" + JSON.stringify(VM.Root.View.Style));
        //console.log("Root.Size * VM.Root.Div.Style=" + JSON.stringify(VM.Root.Div.Style));
        //console.log("Root.Size * VM.Root.Div.Size=" + JSON.stringify(VM.Root.Div.Size));
        //console.log("Root.Size * VM.Root.Label.Size=" + JSON.stringify(VM.Root.Label.Size));
        //console.log("Root.Size * VM.Root.Img_L.Size=" + JSON.stringify(VM.Root.Img_L.Size));
        //console.log("Root.Size * VM.Root.Img_R.Size=" + JSON.stringify(VM.Root.Img_R.Size));
        //console.log("Root.Size * VM.Root.Msg.Size=" + JSON.stringify(VM.Root.Msg.Size));

    };

    this.Web = function (pResult) {
        //console.log("Registration.Web * pResult=" + JSON.stringify(pResult));

        //console.log("Registration.Web * pResult.Action=" + pResult.Action);
        //console.log("Registration.Web * pResult.Success=" + pResult.Success);
        //console.log("Registration.Web * pResult.Data=" + JSON.stringify(pResult.Data));
        var vm = VM.Registration;

        switch (pResult.Action) {
            case "Ping":
                //console.log("Ping returned");
                break;
        }
    };


    this.Size = function () {
        //console.log("Root.Size");
        //console.log("Root.Size * this.VM.Msg.Size=" + JSON.stringify(this.VM.Msg.Size));
        //if (GM.Sized.Root) return;
        //Size.ViewModel(this.VM, false);
        var vm = VM.Root;
        Size.Control(vm.Div, false);
        Size.Control(vm.Label, false);
        Size.Control(vm.Img_L, false);
        Size.Control(vm.Img_R, false);
        Size.Control(vm.Msg, false);
        //console.log("Root.Size * this.vm.Div.Style =" + JSON.stringify(vm.Div.Style));
        //console.log("Root.Size * this.vm.Label.Style =" + JSON.stringify(vm.Label.Style ));
    };

    //#endregion 
}

