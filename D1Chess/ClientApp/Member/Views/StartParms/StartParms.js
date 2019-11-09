angular.module('StartParmsMod', [])
    .directive('startparmsdir', StartParmsDir)
    .controller('StartParmsCtl', StartParmsCtl)
    .service('StartParmsWebSvc', StartParmsWebSvc)
    .service('StartParmsLinkSvc', StartParmsLinkSvc)
    .service('StartParmsSvc', StartParmsSvc)
    ;

function StartParmsDir() {
    return { restrict: "E", templateUrl: '/Client/Views/StartParms/StartParms.html', controller: 'StartParmsCtl as VM_StartParms' };
}

function StartParmsCtl($scope, $location, StartParmsSvc, StartParmsLinkSvc, StartParmsWebSvc) {
    //console.log("StartParmsCtrl");
    $scope.StartParms = VM.StartParms;
    GM.Scope = $scope;
    this.ChangeFunc = function () { StartParmsSvc.RouteFunc("Change"); }
    this.ClickNextFunc = function () { StartParmsWebSvc.RouteFunc("Click", { Control: "Button", Button: "Next" }); }
    this.ClickBackFunc = function () { StartParmsLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Back" }); }
    this.ClickExitFunc = function () { StartParmsLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Exit" }); }
}

function StartParmsWebSvc($http, UtilitySvc, StartParmsSvc, StartParmsLinkSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("StartParmsWebSvc.RouteFunc * pEvent=" + pEvent);
        switch (pEvent) {
            case "Click":
                //console.log("StartParmsWebSvc.RouteFunc.Click * pObj.Control=" + pObj.Control);
                switch (pObj.Control) {
                    case "Button":
                        StartParmsSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        switch (pObj.Button) {
                            case "Next": this.MainFunc("Post", { Event: "StartParmsSave" }); break;
                        }
                        break;
                }
                break;
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        switch (pEvent) {
            case "Post":
                //console.log("StartParmsWebSvc.MainFunc.Post" + " * pObj.Event=" + pObj.Event + " * MM.Data=" + JSON.stringify(MM.Data));
                var parms = UtilitySvc.WebParmsFunc(pEvent, { Event: pObj.Event, Data: MM.Data });
                $http
                    .post("api/Web", parms)
                    .success(function (pWebReturn) {
                        //console.log("StartParmsWebSvc.MainFunc.Post.Success" + " * pWebReturn.Code=" + pWebReturn.Code + " * pWebReturn.Data=" + JSON.stringify(pWebReturn.Data));
                        if (pWebReturn.Code == "Success")
                            StartParmsLinkSvc.RouteFunc("Web", { Event: pObj.Event, Data: pWebReturn.Data });
                        else
                            StartParmsSvc.RouteFunc("Error", { Event: pObj.Event, Error: pWebReturn.Code })
                    })
                    .error(function () { StartParmsSvc.RouteFunc("Error", { Event: pObj.Event, Error: "Server" }); });
                break;
        }
    }
}

function StartParmsLinkSvc($location, StartParmsSvc, GameSvc, HistorySvc, HomeSvc, ProfilesSvc, SearchSvc, MessageSvc, StartEmailSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("StartParmsLinkSvc.RouteFunc" + " * pEvent=" + pEvent);
        switch (pEvent) {
            case "Click":
                //console.log("StartParmsLinkSvc.RouteFunc.Click" + " * pEvent=" + pEvent + " * pObj.Control=" + pObj.Control);
                switch (pObj.Control) {
                    case "Button":
                        //console.log("StartParmsLinkSvc.RouteFunc.Click.Button" + " * pObj.Button=" + pObj.Button);
                        StartParmsSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        break;
                }
                break;
            case "Web":
                //console.log("StartParmsLinkSvc.RouteFunc.Web * pObj.Event=" + pObj.Event + " * pObj.Data=" + JSON.stringify(pObj.Data));
                StartParmsSvc.RouteFunc(pEvent, { Event: pObj.Event, Data: pObj.Data });
                this.MainFunc(pEvent, { Event: pObj.Event, Data: pObj.Data });
                break;
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("StartParmsLinkSvc.MainFunc" + " * pEvent=" + pEvent + " * pObj.Control=" + pObj.Control);
        MM.Game = { Rated: VM.StartParms.Rated, TimeInc: VM.StartParms.TimeInc, TimeAmt: VM.StartParms.TimeAmt }
        switch (pEvent) {
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        switch (pObj.Button) {
                            case "Back":
                                switch ($location.path()) {
                                    case "/Games": Games.MainFunc("_Link", { View_Event: "StartParms_ClickBack" }); break;
                                    case "/History":
                                    case "/Players": ProfilesSvc.MainFunc("_Link", { View_Event: "StartParms_ClickBack" }); break;
                                    case "/Start": HomeSvc.RouteFunc("_Link", { View_Event: "StartParms_ClickBack" }); break;
                                }
                                break;
                            case "Exit":
                                switch ($location.path()) {
                                    case "/History": HomeSvc.RouteFunc("_Link", { View_Event: "History_ClickExit" }); break;
                                    case "/Players": HomeSvc.RouteFunc("_Link", { View_Event: "Players_ClickExit" }); break;
                                    case "/Start": HomeSvc.RouteFunc("_Link", { View_Event: "Start_ClickExit" }); break;
                                }
                                break;
                        }
                        break
                }
                break;

            case "Web":
                switch (pObj.Event) {
                    case "StartParmsSave":
                        //console.log("StartParmsLinkSvc.MainFunc.Web.StartParmsSave * $location.path()=" + $location.path());
                        //console.log("$location.path()=" + $location.path() + " * VM.StartParms.OpFindBy=" + VM.StartParms.OpFindBy);
                        //console.log("StartParmsLinkSvc.MainFunc.Web.StartParmsSave * MM.Data=" + JSON.stringify(MM.Data));
                        switch ($location.path()) {
                            case "/History": MessageSvc.RouteFunc("_Link", { View_Event: "StartParms_WebSave", Data: MM.Data }); break;
                            case "/Players":
                                //console.log("StartParmsLinkSvc.MainFunc.Web.StartParmsSave./Players * MM.Data.OpPhoto_Src.length=" + MM.Data.OpPhoto_Src.length);
                                //console.log("StartParmsLinkSvc.MainFunc.Web.StartParmsSave./Players  * MM.Data.Rated=" + MM.Data.Rated);
                                //console.log("StartParmsLinkSvc.MainFunc.Web.StartParmsSave./Players  * MM.Data.TimeAmt=" + MM.Data.TimeAmt);
                                //console.log("StartParmsLinkSvc.MainFunc.Web.StartParmsSave./Players  * MM.Data.TimeInc=" + MM.Data.TimeInc);
                                MessageSvc.RouteFunc("_Link", { View_Event: "StartParms_WebSave", Data: MM.Data }); break;
                            case "/Start":
                                //console.log("StartParmsLinkSvc.MainFunc.Web.StartParmsSave./Start * VM.StartParms.OpFindBy=" + VM.StartParms.OpFindBy);
                                //console.log("MM.Data=" + JSON.stringify(MM.Data));
                                //console.log("StartParmsLinkSvc.MainFunc.Web.StartParmsSave * MM.Data.OpPhoto_Src.length=" + MM.Data.OpPhoto_Src.length);
                                switch (VM.StartParms.OpFindBy) {
                                    case "A": GameSvc.RouteFunc("_Link", { View_Event: "StartParms_WebSave", Data: MM.Data }); break;
                                    case "E": StartEmailSvc.RouteFunc("_Link", { View_Event: "StartParms_WebSave", Data: MM.Data }); break;
                                    case "F": SearchSvc.RouteFunc("_Link", { View_Event: "StartParms_WebSave", Data: MM.Data }); break;
                                    case "S": SearchSvc.RouteFunc("_Link", { View_Event: "StartParms_WebSave", Data: MM.Data }); break;
                                }
                                break;
                        }
                        break;
                }
                break;
        }
    };
}

function StartParmsSvc($rootScope, $location, UtilitySvc, StylesSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("StartParmsSvc.RouteFunc * pEvent=" + pEvent);
        switch (pEvent) {
            //#region case "_Link":
            case "_Link":
                //console.log("StartParmsSvc.RouteFunc.Link * pObj.View_Event=" + pObj.View_Event);
                switch (pObj.View_Event) {
                    case "Member_Init": this.InitFunc(); break;
                    case "Member_Size": this.SizeFunc(); break;
                    case "Games_ClickStart":
                    case "Home_ClickStart": this.MainFunc(pEvent, { View_Event: pObj.View_Event }); break;
                    case "Profile_ClickChallenge":
                    case "Profiles_ClickChallenge":
                    case "User_WebGetUser": this.MainFunc(pEvent, { View_Event: pObj.View_Event, Data: pObj.Data }); break;
                    case "Search_ClickBack": 
                    case "Message_ClickBack":
                    case "StartEmail_ClickBack": this.MainFunc(pEvent, { View_Event: pObj.View_Event }); break;
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
        //console.log("StartParmsSvc.InitFunc");
        MM.StartParms = { Loading: true };
        VM.StartParms = { OpFindBy: "", Rated : "", TimeAmt : "", TimeInc : "", OpponentImg: IM.PhotoNo_Src, Facebook_Disabled : true,
            TimeIncs : ["Minutes", "Quarters", "Hours", "Days"], TimeAmts :[]            
        }

        for (var x = 1; x < 9; x++) VM.StartParms.TimeAmts.push(x);

        //#region Types
        VM.StartParms.ByFieldSet = StylesSvc.InitFunc({ Type: "FieldSet", H: 3.75 });
        VM.StartParms.ByLegend_Text = StylesSvc.InitFunc({ Type: "Legend" });
        var xL = .25, wL = 6.25, fs = .9;
        var xR = xL + wL + .15, wR = 9 - xR - xL;

        VM.StartParms.OpponentImg = StylesSvc.InitFunc({ Type: "ImgB", X: 2.5, S: 4 });


        var y = 2.5, yAdd = .85;
        VM.StartParms.Facebook_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.StartParms.Facebook_Radio = StylesSvc.InitFunc({ Type: "Radio", Pos: "F",X: xR, Y: y });
        y += yAdd;
        VM.StartParms.Email_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.StartParms.Email_Radio = StylesSvc.InitFunc({ Type: "Radio", Pos: "F",X: xR, Y: y });
        y += yAdd;
        VM.StartParms.Search_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.StartParms.Search_Radio = StylesSvc.InitFunc({ Type: "Radio", Pos: "F",X: xR, Y: y });

        //***************************************************************************

        //***************************************************************************
        y += yAdd * 2.4; VM.StartParms.RatedLegend_Text = StylesSvc.InitFunc({ Type: "Legend", Y: y });
        y += yAdd * .5; VM.StartParms.Rated_FieldSet = StylesSvc.InitFunc({ Type: "FieldSet", Y: y, H: 2.25 });
        var xL = .25, wL = 5, fs = 1;
        var xR = xL + wL + .15, wR = 9 - xR - xL;

        y += yAdd;
        VM.StartParms.Rated_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.StartParms.Rated_CheckBox = StylesSvc.InitFunc({ Type: "CheckBox", Pos: "F", X: xR, Y: y });
        //***************************************************************************
        y += yAdd * 2.5; VM.StartParms.TimeLegend_Text = StylesSvc.InitFunc({ Type: "Legend", Y: y });
        y += yAdd * .5; VM.StartParms.Time_FieldSet = StylesSvc.InitFunc({ Type: "FieldSet", Y: y, H:3.5 });

        var xL = .25, wL = 3.75, fs = 1;
        var xR = xL + wL + .15, wR = 9 - xR - xL;

        y += yAdd;
        VM.StartParms.TimeInc_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.StartParms.TimeInc_Select = StylesSvc.InitFunc({ Type: "Select", X: xR, Y: y });
        y += yAdd * 1.25;
        VM.StartParms.TimeAmt_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.StartParms.TimeAmt_Select = StylesSvc.InitFunc({ Type: "Select", X: xR, Y: y });

        VM.StartParms.Exit = MM.ButtonL;
        VM.StartParms.Back = MM.ButtonC;
        VM.StartParms.Next = MM.ButtonR;
        //#endregion
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("StartParmsSvc.MainFunc * pEvent=" + pEvent);
        switch (pEvent) {

            //#region case "_Link":
            case "_Link":
                //console.log("StartParmsSvc.MainFunc._Link * pObj.View_Event=" + pObj.View_Event);
                switch (pObj.View_Event) {
                    case "Home_ClickStart":
                    case "Games_ClickStart":
                        MM.Wiz = {};
                        this.ViewFunc({ URL: "Start", View: "StartParms", Show: "Find", Msg: "Init" });
                        break;
                    case "Message_ClickBack":
                    case "Search_ClickBack":
                    case "StartEmail_ClickBack": this.ViewFunc({ View: "StartParms", Msg: "Back" }); break;       
                    case "Profile_ClickChallenge":
                    case "Profiles_ClickChallenge":
                        //console.log("pObj.Data = " + JSON.stringify(pObj.Data));
                        //console.log("pObj.Data.OpUserId = " + JSON.stringify(pObj.Data.OpUserId));
                        this.ViewFunc({ View: "StartParms", Show: "Img" });
                        VM.StartParms.OpponentImg.NgSrc = pObj.Data.OpPhoto_Src;
                        VM.StartParms.OpponentLegend = pObj.Data.OpUserId;
                        this.ViewFunc({ View: "StartParms", Show: "Img", Msg:"Init" });
                        break;

                    case "User_WebGetUser":
                        //console.log("SearchSvc.MainFunc._Link.User_WebGetUser");
                        //console.log("MainFunc.Load.User_WebLoad * pObj.Data = " + JSON.stringify(pObj.Data));
                        VM.StartParms.OpFindBy = pObj.Data.OpFindBy;
                        VM.StartParms.Rated = pObj.Data.Rated;
                        VM.StartParms.TimeAmt = pObj.Data.TimeAmt;
                        MM.StartParms.TimeInc = pObj.Data.TimeInc;
                        VM.StartParms.TimeInc = UtilitySvc.TimeFunc("Inc", { Inc: MM.StartParms.TimeInc });
                        MM.StartParms.Loading = false;
                        break;
                    case "Profiles_Next":
                        this.ViewFunc({ Show: "Photo", Show: "Img" });
                        MM.Data = pObj.Data;
                        break;
                }
                //console.log("MM.View=" + MM.View);
                if (MM.View == "StartParms") {
                    //console.log("StartParmsSvc.MainFunc._Link.StartParms * MM.View =" + MM.View);
                    this.SizeFunc();
                    this.ViewFunc({ Disable: "Facebook" }); 
                    switch ($location.path()) {
                        case "/Games":
                        case "/History":
                        case "/Players": this.ViewFunc({ Show: "Img", Buttons: "ExitBackNext" }); break;
                        case "/Start":
                            this.ViewFunc({ Show: "Find", Buttons: "ExitNext" });
                            if (MM.StartParms.Loading) this.ViewFunc({ Msg: "Wait_Load" }); else this.ViewFunc({ Msg: "Init" });
                            break;
                    }
                    this.ViewFunc({ Legend: "*", Enable: "*" });
                }
                break;
            //#endregion

            case "Change": this.ViewFunc({ B_Enable: "*", Msg: "Init" }); break;

            //#region case "Click":
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        //console.log("MainFunc.Click.Button * pObj.Button=" + pObj.Button);
                        switch (pObj.Button) {
                            case "Next":
                                //console.log("StartParmSvc.MainFunc.Click_Button.Next * $location.path()=" + $location.path());
                                //console.log("VM.StartParms.OpFindBy=" + VM.StartParms.OpFindBy);
                                //console.log("VM.StartParms.Rated=" + VM.StartParms.Rated);
                                //console.log("VM.StartParms.TimeAmt=" + VM.StartParms.TimeAmt);
                                //console.log("VM.StartParms.TimeInc=" + JSON.stringify(VM.StartParms.TimeInc));
                                //console.log("VM.StartParms.TimeInc.Text=" + VM.StartParms.TimeInc.Text);
                                //console.log("VM.StartParms.TimeInc.Value=" + VM.StartParms.TimeInc.Value);
                                MM.Data = {
                                    Rated: VM.StartParms.Rated,
                                    TimeAmt: VM.StartParms.TimeAmt,
                                    TimeInc: VM.StartParms.TimeInc.substr(0, 1)
                                }
                                MM.Wiz.Rated = VM.StartParms.Rated;
                                MM.Wiz.TimeAmt = VM.StartParms.TimeAmt;
                                MM.Wiz.TimeInc = VM.StartParms.TimeInc;
                                switch ($location.path()) {
                                    case "/Games":
                                    case "/History":
                                    case "/Players":
                                        //console.log("StartParmSvc.MainFunc.Click_Button.Next./Players * VM.StartParms.OpponentImg.NgSrc.length=" + VM.StartParms.OpponentImg.NgSrc.length);
                                        MM.Data.OpPhoto_Src = VM.StartParms.OpponentImg.NgSrc;
                                        MM.Wiz.OpPhoto_Src = VM.StartParms.OpponentImg.NgSrc;
                                        break;
                                    case "/Start":
                                        MM.Data.OpFindBy = VM.StartParms.OpFindBy;
                                        MM.Wiz.OpFindBy = VM.StartParms.OpFindBy;
                                        break;
                                }
                                this.ViewFunc({ Enable: "*", Msg: "Wait_Save"  });
                                //console.log("MM.Data=" + JSON.stringify(MM.Data)); 
                                //console.log("StartParmsSvc.MainFunc.Click.Button.Next * MM.Wiz.OpFindBy=" + MM.Wiz.OpFindBy);
                                break;
                        }
                        break;
                }
                break;
                //#endregion

            //#region case "Web":
            case "Web":
                //console.log("MainFunc.Web * pObj.Event=" + pObj.Event);
                switch (pObj.Event) {
                    case "StartParmsSave":
                        //console.log("StartParmsSvc.MainFunc.Web.StartParmsSave");
                        //console.log("StartParmsSvc.MainFunc.Web.StartParmsSave * pObj=" + JSON.stringify(pObj));
                        //console.log("StartParmsSvc.MainFunc.Web.StartParmsSave * MM.Data.OpPhoto_Src.length=" + MM.Data.OpPhoto_Src.length);
                        //console.log("StartParmsSvc.MainFunc.Web.StartParmsSave * MM.Data.Rated=" + MM.Data.Rated);
                        //console.log("StartParmsSvc.MainFunc.Web.StartParmsSave * MM.Data.TimeAmt=" + MM.Data.TimeAmt);
                        //console.log("StartParmsSvc.MainFunc.Web.StartParmsSave * MM.Data.TimeInc=" + MM.Data.TimeInc);
                        //console.log("MainFunc.Web.StartParmsSave * $location.path=" + $location.path());
                        //console.log("MainFunc.Web.StartParmsSave * MM.Data=" + JSON.stringify(MM.Data));
                        //console.log("MainFunc.Web.StartParmsSave * MM.UserProfiles.List.length=" + MM.UserProfiles.List.length);
                        //console.log("MainFunc.Web.StartParmsSave * MM.UserProfiles.DefaultIdx=" + MM.UserProfiles.DefaultIdx);
                        //console.log("MM.UserProfiles.List[" + MM.UserProfiles.DefaultIdx + ".StartParms=" + JSON.stringify(MM.UserProfiles.List[MM.UserProfiles.DefaultIdx]));
                        MM.UserProfiles.List[MM.UserProfiles.DefaultIdx].StartParms.OpFindBy = MM.Data.OpFindBy;
                        MM.UserProfiles.List[MM.UserProfiles.DefaultIdx].StartParms.Rated = MM.Data.Rated;
                        MM.UserProfiles.List[MM.UserProfiles.DefaultIdx].StartParms.TimeInc = MM.Data.TimeInc;
                        MM.UserProfiles.List[MM.UserProfiles.DefaultIdx].StartParms.TimeAmt = MM.Data.TimeAmt;
                        MM.Share = { OpFindBy: MM.Data.OpFindBy };
                        MM.Wiz.Rated = MM.Data.Rated;
                        MM.Wiz.TimeInc = MM.Data.TimeInc;
                        MM.Wiz.TimeAmt = MM.Data.TimeAmt;
                        //console.log("StartParmsSvc.MainFunc.Web.StartParmsSave * MM.Wiz=" + JSON.stringify(MM.Wiz));
                        //console.log("StartParmsSvc.MainFunc.Web.StartParmsSave * MM.Wiz.OpPhoto_Src.length=" + MM.Wiz.OpPhoto_Src.length);
                        //console.log("StartParmsSvc.MainFunc.Web.StartParmsSave * MM.Wiz.OpUserId=" + MM.Wiz.OpUserId);
                        //console.log("StartParmsSvc.MainFunc.Web.StartParmsSave * MM.Wiz.OpName=" + MM.Wiz.OpName);
                        //console.log("StartParmsSvc.MainFunc.Web.StartParmsSave * MM.Wiz.OpRating=" + MM.Wiz.OpRating);
                        //console.log("StartParmsSvc.MainFunc.Web.StartParmsSave * MM.Wiz.Rated=" + MM.Wiz.Rated);
                        //console.log("StartParmsSvc.MainFunc.Web.StartParmsSave * MM.Wiz.TimeAmt=" + MM.Wiz.TimeAmt);
                        //console.log("StartParmsSvc.MainFunc.Web.StartParmsSave * MM.Wiz.TimeInc=" + MM.Wiz.TimeInc);
                }
                break;
                //#endregion

        }
    }
    this.SizeFunc = function () {
        //console.log("StartParmsSvc.SizeFunc * GM.Sized.StartParms=" + GM.Sized.StartParms);
        if (GM.Sized.StartParms) return;     
        //StylesSvc.SizeFunc(VM.StartParms.Opponent_FieldSet); StylesSvc.SizeFunc(VM.StartParms.OpponentLegend_Text);
        StylesSvc.SizeFunc(VM.StartParms.OpponentImg);

        StylesSvc.SizeFunc(VM.StartParms.ByFieldSet); StylesSvc.SizeFunc(VM.StartParms.ByLegend_Text); 
        StylesSvc.SizeFunc(VM.StartParms.Facebook_Label); StylesSvc.SizeFunc(VM.StartParms.Facebook_Radio);
        StylesSvc.SizeFunc(VM.StartParms.Email_Label); StylesSvc.SizeFunc(VM.StartParms.Email_Radio);
        StylesSvc.SizeFunc(VM.StartParms.Search_Label); StylesSvc.SizeFunc(VM.StartParms.Search_Radio);
        StylesSvc.SizeFunc(VM.StartParms.RatedLegend_Text); StylesSvc.SizeFunc(VM.StartParms.Rated_FieldSet); 
        StylesSvc.SizeFunc(VM.StartParms.Rated_Label); StylesSvc.SizeFunc(VM.StartParms.Rated_CheckBox);
        StylesSvc.SizeFunc(VM.StartParms.TimeLegend_Text); StylesSvc.SizeFunc(VM.StartParms.Time_FieldSet);
        StylesSvc.SizeFunc(VM.StartParms.TimeInc_Label); StylesSvc.SizeFunc(VM.StartParms.TimeInc_Select);
        StylesSvc.SizeFunc(VM.StartParms.TimeAmt_Label); StylesSvc.SizeFunc(VM.StartParms.TimeAmt_Select);
        GM.Sized.StartParms = true;
    }
    this.ViewFunc = function (pObj) {
        //console.log("StartParmsSvc.ViewFunc *  pObj=" + JSON.stringify(pObj));
        if (pObj.URL != null) {
            //console.log("StartParmsSvc.ViewFunc * pObj.URL=" + pObj.URL);
            switch (pObj.URL) {
                case "Start": $location.url("/Start"); break;
                default: alert("ProfilesSvc.ViewFunc * Unknown pObj.URL=" + pObj.URL); break;
            }
        }
        if (pObj.View != null) {
            //console.log("StartParmsSvc.ViewFunc * pObj.View=" + pObj.View);
            MM.View = pObj.View;
            switch ($location.path()) {
                case "/Players": VM.Players.Show_View = pObj.View; break;
                case "/Start": VM.Start.Show_View = pObj.View; break;
                default: alert("ProfilesSvc.ViewFunc * Unknown pObj.View=" + pObj.View); break;
            }
        }
        if (pObj.Show != null) {
            //console.log("StartParmsSvc.ViewFunc * pObj.Show=" + pObj.Show);
            switch (pObj.Show) {
                case "Find": VM.StartParms.Switch = "Find"; break;
                case "Img": VM.StartParms.Switch = "Img"; break;
                default: alert("Unknown pObj.Show=" + pObj.Show); break;
            }
        }
        if (pObj.Legend != null) {
            //console.log("StartParmsSvc.ViewFunc * pObj.Legend=" + pObj.Legend);
            switch (pObj.Legend) {
                case "*":
                    if (MM.StartParms.Loading) {
                        VM.StartParms.ByLegend = "Loading";
                        VM.StartParms.OpponentLegend = "Loading";
                        VM.StartParms.RatedLegend = "Loading";
                        VM.StartParms.TimeLegend = "Loading";
                    }
                    else {
                        VM.StartParms.ByLegend = "Find By";
                        VM.StartParms.OpponentLegend = "Opponent";
                        VM.StartParms.RatedLegend = "Rated";
                        VM.StartParms.TimeLegend = "Move Time";
                    }
                    break;
            }
        }
        if (pObj.Enable != null) {
            switch (pObj.Enable) {
                case "*":
                    if (MM.StartParms.Loading) VM.StartParms.Next_Disabled = true;
                    else if (VM.StartParms.Switch == "Find" && VM.StartParms.OpFindBy == null) VM.StartParms.Next_Disabled = true;
                    else if (VM.StartParms.TimeInc == null || VM.StartParms.TimeAmt == null) VM.StartParms.Next_Disabled = true;
                    else VM.StartParms.Next_Disabled = false;
                    VM.StartParms.Facebook_Disabled = true;
                    break;
                case "Disable":
                    VM.StartParms.Next_Disabled = true;
                    VM.StartParms.Next_Disabled = true;
                    VM.StartParms.Facebook_Disabled = true;
                    break;

                default: alert("Unknown pObj.Enable=" + pObj.Enable); break;
            }
        }
        if (pObj.Buttons != null) {
            //console.log("StartParmsSvc.ViewFunc * pObj.Buttons=" + pObj.Buttons);
            switch (pObj.Buttons) {
                case "ExitBackNext":
                    VM.StartParms.Back_Show = true;

                    break;
                case "ExitNext": VM.StartParms.Back_Show = false; break;
                default: alert("Unknown pObj.Buttons=" + pObj.Buttons); break;
            }
        }
        if (pObj.Msg != null) {
            //console.log("StartParmsSvc.ViewFunc * pObj.Msg=" + pObj.Msg);
            switch (pObj.Msg) {
                case "Back":
                    switch ($location.path()) {
                        case "/Players": $rootScope.Msg = "You may change the game parms."; break;
                        case "/Start": $rootScope.Msg = "You may change the game parms."; break;
                    }
                    break;
                case "Change":
                    if (VM.StartParms.Switch == "Find" && VM.StartParms.OpFindBy == null) $rootScope.Msg = "Select a find method.";
                    else if (VM.StartParms.TimeInc == null) $rootScope.Msg = "Select a time increment.";
                    else if (VM.StartParms.TimeAmt == null) $rootScope.Msg = "Select a time amount.";
                    else $rootScope.Msg = "Click next to continue.";
                    break;
                case "Init":
                    switch ($location.path()) {
                        case "/Players": $rootScope.Msg = "Enter game parameters for " + MM.Wiz.OpUserId;
                        case "/Start": $rootScope.Msg = (MM.StartParms.Loading) ? "Loading your start preferences..." : "Enter start parameters"; break;
                    }
                    break;
                case "Wait_Load": $rootScope.Msg = "Loading your start preferences..."; break;
                case "Wait_Save": $rootScope.Msg = "Saving your start preferences..."; break;

                default: alert("Unknown pObj.Msg=" + pObj.Msg); break;
            }
        }
    }
}

