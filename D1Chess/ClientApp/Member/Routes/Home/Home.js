angular.module('HomeMod', []).config(HomeConfig).controller('HomeCtl', HomeCtl).service('Home', HomeSvc);
function HomeConfig($routeProvider) { $routeProvider.when('/home', { templateUrl: '/Client/Member/Routes/Home/Home.html', controller: 'HomeCtl as VC' }); }

function HomeCtl($scope, $location, Home, Web) {
    //console.log("HomeCtl");
    Constructor();
    ngOnInit();

    function Constructor() {
        //console.log("LogOn.Constructor");
        GM.Scope = $scope;
        GM.Scope.VM = VM.Home;
        GM.Scope.DM = DM.Home;
    }
    function ngOnInit() {
        //console.log("Home.ngOnInit * GM.View_Event=" + GM.View_Event);
        GM.Route = "Home"; GM.View = "Home";
        GM.Processing = false;
        switch (GM.View_Event) {
            case "App_Boot": Home.View({ Msg: GM.View_Event }); break;
            case "User_Exit":
            case "Profiles_Exit":
            case "Practice_Exit":
            case "Start_Exit":
            case "Players_Exit":
            case "Games_Exit": Home.View({ Msg: "Link_" + GM.View_Event }); break;
            case "History_Exit": LogOn.View({ Enable: "*", Msg: "Link_" + GM.View_Event }); break;
            default: alert("Home.ngOnInit * Unknown GM.View_Event=" + GM.View_Event); break;
        }
        Home.Size();
    }
    this.OnClick = function (pControl) {
        switch (pControl) {
            case "Games": GM.View_Event = "Home_Games"; $location.url("/games"); break;
            case "History": GM.View_Event = "Home_History"; $location.url("/history"); break;
            case "Players": GM.View_Event = "Home_Players"; $location.url("/players"); break;
            case "Practice": GM.View_Event = "Home_Practice"; $location.url("/practice"); break;
            case "Profiles": GM.View_Event = "Home_Profiles"; $location.url("/profiles"); break;
            case "Start": GM.View_Event = "Home_Start"; $location.url("/start"); break;
            case "User": GM.View_Event = "Home_User"; $location.url("/user"); break;
            case "LogOut":
                GM.Processing = true;
                Home.View({ Enable: "*", Msg: "Wait_LogOut" });
                Web.Get("LogOut", null, (pResult) => Home.Web(pResult));
                break;
        }
    };
}

function HomeSvc($location, Style, Size) {
    this.Init = function () {
        //console.log("HomeSvc.Init");
        VM.Home = {};
        var vm = VM.Home;
        var yAdd = 3;

        var y = 2; vm.User = Style.Build({ Type: "ButtonL", Y: y }); vm.Profiles = Style.Build({ Type: "ButtonR", Y: y });
        y += yAdd; vm.Practice = Style.Build({ Type: "ButtonC", Y: y });
        y += yAdd; vm.Start = Style.Build({ Type: "ButtonL", Y: y }); vm.Players = Style.Build({ Type: "ButtonR", Y: y });
        y += yAdd; vm.Games = Style.Build({ Type: "ButtonL", Y: y }); vm.History = Style.Build({ Type: "ButtonR", Y: y });
        y += yAdd; vm.LogOut = Style.Build({ Type: "ButtonC", X: 2.75, Y: y, W: 3.5 });
        //#endregion

        this.Size();

        $location.url("/home");
    };
    this.Web = function (pResult) {
        //console.log("Registration.Web * pResult=" + JSON.stringify(pResult));
        //console.log("Registration.Web * pResult.Action=" + pResult.Action);
        //console.log("Registration.Web * pResult.Success=" + pResult.Success);
        //console.log("Registration.Web * pResult.Data=" + JSON.stringify(pResult.Data));
        var vm = VM.Home;

        switch (pResult.Action) {
            case "LogOut":
                if (pResult.Success) {
                    this.View({ Msg: "Wait_LogOutSuccess" });
                    document.forms[0].submit();
                }
                //else {
                //    GM.Processing = false;
                //    LogOn.View({ Enable: "*", Msg: "Wait_LogInSuccess" });
                //}
                //console.log("LogOut returned");
                break;
        }
    };
    this.Size = function () {
        //console.log("HomeSvc.Size * GM.Sized.Home=" + GM.Sized.Home);
        if (GM.Sized.Home) return;
        var vm = VM.Home;
        Size.Control(vm.User); Size.Control(vm.Profiles);
        Size.Control(vm.Practice);
        Size.Control(vm.Start); Size.Control(vm.Players);
        Size.Control(vm.Games); Size.Control(vm.History);
        Size.Control(vm.LogOut);
        GM.Sized.Home = true;
    };
    this.View = function (pObj) {
        var vm = VM.Home;
        if (pObj.Enable !== undefined) {
            //console.log("pObj.Enable=" + pObj.Enable);
            switch (pObj.Enable) {
                case "*": vm.Disabled = GM.Processing; break;
            }
        }
        if (pObj.Msg !== undefined) {
            //console.log("pObj.Msg=" + pObj.Msg);
            switch (pObj.Msg) {
                case "App_Boot":
                    //console.log("GM.Index.Parms.MsgId=" + GM.Index.Parms.MsgId);
                    switch (GM.Index.Parms.MsgId) {
                        case "LoggedIn": GM.Msg = "Welcome back " + GM.Index.Parms.FirstName + "."; break;
                        case "Registered": GM.Msg = "Welcome " + GM.Index.Parms.FirstName + "."; break;
                    }
                    break;
                case "Link_Privacy_ClickOK": GM.Msg = "Please LogIn or register."; break;
                case "Link_User_Exit": GM.Msg = "You exited user data."; break;
                case "Link_Profile_Exit": GM.Msg = "You exited your profiles."; break;
                case "Link_Practice_Exit": GM.Msg = "You exited the practice board."; break;
                case "Link_Start_Exit": GM.Msg = "Game start cancelled."; break;
                case "Link_Players_Exit": GM.Msg = "You exited the player search."; break;
                case "Link_Games_Exit": GM.Msg = "You exited games."; break;
                case "Wait_LogOut": GM.Msg = "Logging you out..."; break;
                case "Wait_LogOutSuccess": GM.Msg = "Opening Log On Screen..."; break;
                default: alert("Home.View.Msg * Unknown=" + pObj.Msg); break;
            }
        }
    };
}


