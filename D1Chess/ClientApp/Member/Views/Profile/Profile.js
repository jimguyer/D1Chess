angular.module('ProfileMod', [])
    .config(ProfileConfig)
    .directive('profiledir', ProfileDir)
    .controller("ProfileCtl", ProfileCtl)
    .service("ProfileLinkSvc", ProfileLinkSvc)
    .service('ProfileSvc', ProfileSvc)
;
function ProfileConfig($routeProvider) {
    $routeProvider.when('/Profile', { templateUrl: '/Client/Views/Profile/Profile.html', controller: 'ProfileCtl as VM_Profile' })
}

function ProfileDir() {
    return { restrict: "E", templateUrl: '/Client/Views/Profile/Profile.html', controller: 'ProfileCtl as VM_Profile' };
}

function ProfileCtl($scope, $location, ProfileLinkSvc, ProfileSvc) {
    //console.log("ProfileCtrl");
    $scope.Profile = VM.Profile;
    GM.Scope = $scope;
    this.ClickExitFunc = function () { ProfileLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Exit" }) }
    this.ClickBackFunc = function () { ProfileLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Back" }) }
    this.ClickSelectFunc = function () { ProfileLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Select" }) }
    this.ClickChallengeFunc = function () { ProfileLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Challenge" }) }
    this.ClickBoardFunc = function () { ProfileLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Board" }) }
    this.ClickGameFunc = function () { ProfileLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Game" }) }
}
function ProfileLinkSvc($location, HomeSvc, BoardSvc, HistorySvc, MessageSvc, ProfileSvc, ProfilesSvc, StartParmsSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        switch (pEvent) {
            case "Click":
                //console.log("ProfileLinkSvc.RouteFunc.Click * pObj.Control=" + pObj.Control);
                switch (pObj.Control) {
                    case "Button":
                        //console.log("ProfileLinkSvc.RouteFunc.Click.Button" + " * pObj.Button=" + pObj.Button);
                        ProfileSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        break;
                }
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("ProfileLinkSvc.MainFunc * pEvent=" + pEvent);
        //console.log("MM.Data=" + JSON.stringify(MM.Data));
        switch (pEvent) {
            case "Click":
                //console.log("ProfileLinkSvc.RouteFunc.Click * pObj.Control=" + pObj.Control);
                switch (pObj.Control) {
                    case "Button":
                        //console.log("ProfileLinkSvc.MainFunc. Click_Button * pObj.Button=" + pObj.Button);
                        switch (pObj.Button) {
                            case "Back":
                                switch ($location.path()) {
                                    case "/Games": BoardSvc.RouteFunc("_Link", { View_Event: "Profile_ClickBack" }); break;
                                    case "/History": ProfilesSvc.MainFunc("_Link", { View_Event: "Profile_ClickBack" }); break;
                                    case "/Players": ProfilesSvc.MainFunc("_Link", { View_Event: "Profile_ClickBack" }); break;
                                    case "/Start": ProfilesSvc.MainFunc("_Link", { View_Event: "Profile_ClickBack" }); break;
                                }
                                break;

                            case "Challenge": StartParmsSvc.RouteFunc("_Link", { View_Event: "Profile_ClickChallenge", Data: MM.Data }); break;

                            case "Exit":
                                switch ($location.path()) {
                                    case "/History": HomeSvc.RouteFunc("_Link", { View_Event: "History_ClickExit" }); break;
                                    case "/Players": HomeSvc.RouteFunc("_Link", { View_Event: "Players_ClickExit" }); break;
                                    case "/Start": HomeSvc.RouteFunc("_Link", { View_Event: "Start_ClickExit" }); break;
                                }
                                break;
                            case "Select": MessageSvc.RouteFunc("_Link", { View_Event: "Profile_ClickSelect", Data: MM.Data }); break;
                        }
                        break;
                }
        }
    };
}

function ProfileSvc($rootScope, $location, StylesSvc, UtilitySvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("ProfileSvc.RouteFunc" + " * pEvent=" + pEvent);
        //console.log("pObj=" + JSON.stringify(pObj));
        switch (pEvent) {
            case "_Link":
                switch (pObj.View_Event) {
                    case "Member_Init": this.InitFunc(); break;
                    case "Member_Size": this.SizeFunc(); break;
                    default: this.MainFunc(pEvent, { View_Event: pObj.View_Event, Type: pObj.Type, Data: pObj.Data }); break;
                }
                break;
            case "Click":
                switch (pObj.Control) {
                    case "Button": this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button }); break;
                }
                break;
        }
    }
    this.InitFunc = function () {
        //console.log("ProfileSvc.InitFunc");
        MM.Profile = {};
        VM.Profile = {};

        //#region Types
        VM.Profile.FieldSet = StylesSvc.InitFunc({ Type: "FieldSet" });
        VM.Profile.Legend = StylesSvc.InitFunc({ Type: "Legend" });
        VM.Profile.Img = StylesSvc.InitFunc({ Type: "Img" });

        var xL = .5, wL = 3, wR = 4, fs = 1;
        var xR = xL + wL + .15, wR = 9 - xR - xL;

        var yAdd = 1;

        var y = 9.5;
        VM.Profile.UserId_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Profile.UserId_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, FS: fs });
        y += yAdd;
        VM.Profile.Name_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Profile.Name_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, FS: fs });
        y += yAdd;
        VM.Profile.Rating_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Profile.Rating_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, FS: fs });
        y += yAdd;
        VM.Profile.Group_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Profile.Group_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, FS: fs });

        VM.Profile.Exit = MM.ButtonL; VM.Profile.Back = MM.ButtonC;
        VM.Profile.Board = MM.ButtonR; VM.Profile.Challenge = MM.ButtonR; VM.Profile.Game = MM.ButtonR; VM.Profile.Select = MM.ButtonR;
        //#endregion 

        //console.log("VM.Profile.FieldSet.NgStyle =" + JSON.stringify(VM.Profile.FieldSet.NgStyle));
        //console.log("VM.Profile.Legend.NgStyle =" + JSON.stringify(VM.Profile.Legend.NgStyle));
        //console.log("VM.Profile.UserId_Label.NgStyle =" + JSON.stringify(VM.Profile.UserId_Label.NgStyle));
        //console.log("VM.Profile.UserId_Text.NgStyle =" + JSON.stringify(VM.Profile.UserId_Text.NgStyle));
        //console.log("VM.Profile.Rating_Label.NgStyle =" + JSON.stringify(VM.Profile.Rating_Label.NgStyle));
        //console.log("VM.Profile.Rating_Text.NgStyle =" + JSON.stringify(VM.Profile.Rating_Text.NgStyle));
        //console.log("VM.Profile.Group_Label.NgStyle =" + JSON.stringify(VM.Profile.Group_Label.NgStyle));
        //console.log("VM.Profile.Group_Text.NgStyle =" + JSON.stringify(VM.Profile.Group_Text.NgStyle));
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("ProfileSvc.ViewFunc" + " * pEvent=" + pEvent);
        //console.log("pObj=" + JSON.stringify(pObj));
        switch (pEvent) {

            //#region case "_Link":
            case "_Link":
                //console.log("ProfileSvc.ViewFunc._Link * pObj.View_Event=" + pObj.View_Event);
                switch (pObj.View_Event) {
                    case "Profiles_ClickImg":
                    case "Profiles_ClickRow":
                    case "Profiles_ClickView":
                        //console.log("pObj.Data=" + JSON.stringify(pObj.Data));
                        //console.log("pObj.Data.OpPhoto_Src.length=" + pObj.Data.OpPhoto_Src.length);
                        //console.log("pObj.Data.OpUserId=" + pObj.Data.OpUserId);
                        //console.log("pObj.Data.OpName=" + pObj.Data.OpName);
                        //console.log("pObj.Data.OpRating=" + pObj.Data.OpRating);
                        //console.log("pObj.Data.OpGroup=" + pObj.Data.OpGroup);
                        this.ViewFunc({ View: "Profile", Legend: pObj.Data.OpUserId });
                        VM.Profile.Img.NgSrc = pObj.Data.OpPhoto_Src;
                        VM.Profile.UserId = pObj.Data.OpUserId;
                        VM.Profile.Name = pObj.Data.OpName;
                        VM.Profile.Rating = pObj.Data.OpRating;
                        VM.Profile.Group = pObj.Data.OpGroup;

                        //VM.Profile.Name_Show = (VM.Profile.UserId != null);
                        VM.Profile.Name_Show = (VM.Profile.Name != null);
                        VM.Profile.Rating_Show = (VM.Profile.Rating != null);
                        VM.Profile.Group_Show = (VM.Profile.Group != null);

                        VM.Profile.Show_UserId = true;
                        VM.Profile.Name_Show = true;
                        VM.Profile.Rating_Show = true;
                        VM.Profile.Group_Show = true;

                        switch (pObj.View_Event) {
                            case "Profiles_ClickImg":
                            case "Profiles_ClickRow":
                            case "Profiles_ClickView":
                                switch ($location.path()) {
                                    case "/Games":
                                    case "/History":
                                    case "/Players": this.ViewFunc({ Msg: "Info_Challenge", UserId: pObj.Data.OpUserId }); break;
                                    case "/Start": this.ViewFunc({ Msg: "Info_Select", UserId: pObj.Data.OpUserId }); break;
                                }
                                break;

                        }
                        break;
                    case "StartParms_ClickBack": this.ViewFunc({ View: "Profile", Msg: "Info_ChallengeCancel"}); break;
                }



                if (MM.View == "Profile") {
                    //console.log("$location.path()=" + $location.path());
                    this.SizeFunc();
                    switch ($location.path()) {
                        case "/Games": this.ViewFunc({ View: "Profile", Buttons: "ExitBack" }); break;
                        case "/History":
                        case "/Players": this.ViewFunc({ View: "Profile", Buttons: "ExitBackChallenge" });; break;
                        case "/Start": this.ViewFunc({ View: "Profile", Buttons: "ExitBackSelect" }); break;
                    }
                }
                break;
            //#endregion 

            //#region case "Click":
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        //console.log("MainFunc.Click.Button * pObj.Button=" + pObj.Button);
                        switch (pObj.Button) {
                            case "Challenge": case "Select":
                                //console.log("MM.Data=" + JSON.stringify(MM.Data));
                                MM.Data = {
                                    OpPhoto_Src: VM.Profile.Img.NgSrc,
                                    OpUserId: VM.Profile.OpUserId,
                                    OpName: VM.Profile.OpName,
                                    OpRating: VM.Profile.OpRating,
                                    OpGroup: VM.Profile.OpGroup
                                }
                                MM.Wiz.OpPhoto_Src = MM.Data.OpPhoto_Src;
                                MM.Wiz.OpUserId = MM.Data.OpUserId;
                                MM.Wiz.OpName = MM.Data.OpName;
                                MM.Wiz.OpGroup = MM.Data.OpGroup;
                                MM.Wiz.OpRating = MM.Data.OpRating;
                        }
                        break;
                }
                break;
            //#endregion


        }
    }
    this.SizeFunc = function (pEvent, pObj) {
        //console.log("GameSvc.SizeFunc * GM.Sized.Game=" + GM.Sized.Game);
        //console.log("GameSvc.SizeFunc * VM.Game.Switch=" + VM.Game.Switch);
        if (GM.Sized.Game) return;
        StylesSvc.SizeFunc(VM.Profile.Legend); StylesSvc.SizeFunc(VM.Profile.FieldSet);
        StylesSvc.SizeFunc(VM.Profile.Img);
        //StylesSvc.SizeFunc(VM.Profile.UserId_Label); StylesSvc.SizeFunc(VM.Profile.UserId_Text);
        StylesSvc.SizeFunc(VM.Profile.Name_Label); StylesSvc.SizeFunc(VM.Profile.Name_Text);
        StylesSvc.SizeFunc(VM.Profile.Rating_Label); StylesSvc.SizeFunc(VM.Profile.Rating_Text);
        StylesSvc.SizeFunc(VM.Profile.Group_Label); StylesSvc.SizeFunc(VM.Profile.Group_Text);
        GM.Sized.Profile = true;
    }
    this.ViewFunc = function (pObj) {
        if (pObj.View != null) {
            MM.View = pObj.View;
            switch ($location.path()) {
                case "/Players": VM.Players.Show_View = pObj.View; break;
                case "/History": VM.History.Show_View = pObj.View; break;
                case "/Start": VM.Start.Show_View = pObj.View; break;
                default: alert("ProfileSvc.ViewFunc * pObj.URL=" + pObj.URL); break;
            }
        }
        if (pObj.Legend != null) {
            VM.Profile.Legend.Text = pObj.Legend;
        }
        if (pObj.Enable != null) {
            switch (pObj.Enable) {
                case "*":
                    VM.StartParms.Send_Disabled = false;
                    break;
            }
        }
        if (pObj.Buttons != null) {
            //console.log("ProfileSvc.ViewFunc * pObj.Buttons=" + pObj.Buttons);
            switch (pObj.Buttons) {
                case "ExitBackBoard":
                    VM.Profile.Back_Show = true;
                    VM.Profile.Board_Show = true;
                    VM.Profile.Challenge_Show = false;
                    VM.Profile.Game_Show = false;
                    VM.Profile.Select_Show = false;
                    break;
                case "ExitBackChallenge":
                    VM.Profile.Back_Show = true;
                    VM.Profile.Board_Show = false;
                    VM.Profile.Challenge_Show = true;
                    VM.Profile.Game_Show = false;
                    VM.Profile.Select_Show = false;
                    break;
                case "ExitBackGame":
                    VM.Profile.Back_Show = true;
                    VM.Profile.Board_Show = false;
                    VM.Profile.Challenge_Show = false;
                    VM.Profile.Game_Show = true;
                    VM.Profile.Select_Show = false;
                    break;
                case "ExitBackSelect":
                    VM.Profile.Back_Show = true;
                    VM.Profile.Board_Show = false;
                    VM.Profile.Challenge_Show = false;
                    VM.Profile.Game_Show = false;
                    VM.Profile.Select_Show = true;
                    break;
                default: alert("ProfileSvc.ViewFunc * pObj.Buttons=" + pObj.Buttons); break;
            }
        }
        if (pObj.Msg != null) {
            switch (pObj.Msg) {
                case "Error_Server": $rootScope.Msg = "Server error."; break;
                case "Info_Challenge": $rootScope.Msg = "Click challenge to play " + pObj.UserId + "."; break;
                case "Info_ChallengeCancel": $rootScope.Msg = "Challenge cancelled."; break;
                case "Info_Select": $rootScope.Msg = "Click select to challenge " + pObj.UserId + "."; break;
            }
        }
    }
}