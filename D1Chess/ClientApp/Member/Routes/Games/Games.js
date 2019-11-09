angular.module('GamesMod', [])
    .config(GamesConfig)
    .directive('gamestabsdir', GamesTabsDir)
    .directive('gamesdir', GamesDir)
    .controller('GamesCtl', GamesCtl)
    .service('GamesWebSvc', GamesWebSvc)
    .service('GamesLinkSvc', GamesLinkSvc)
    .service('GamesSvc',GamesSvc)
;
function GamesConfig($routeProvider) {
    $routeProvider.when('/Games', { templateUrl: '/Client/Views/Games/Games.html', controller: 'GamesCtl as VM_Games' })
}
function GamesTabsDir() {
    return { restrict: "E", templateUrl: '/Client/Views/App/Tabs.html', controller: 'GamesCtl as VM_Games' };

}

function GamesDir() {
    return { restrict: "E", templateUrl: '/Client/Views/Games/GamesDir.html', controller: 'GamesCtl', controllerAs: 'VM_Games' };
}



function GamesCtl($scope, $location, GamesSvc, GamesLinkSvc, GamesWebSvc) {
    //console.log("GamesCtrl");
    $scope.Tabs = VM.Tabs;
    $scope.Games = VM.Games;
    GM.Scope = $scope;

    $scope.ClickTabMainFunc = function (pIdx) {
        //console.log("GamesCtl.ClickTabMainFunc * pIdx=" + pIdx);
        GamesSvc.RouteFunc("Click", { Control: "Tab", Set: "Main", Idx: pIdx });
    }
    $scope.ClickArrowFirstFunc = function () { GamesSvc.RouteFunc("Click", { Control: "Arrow", Arrow: "First" }); }
    $scope.ClickArrowPrevFunc = function () { GamesSvc.RouteFunc("Click", { Control: "Arrow", Arrow: "Prev" }); }
    $scope.ClickArrowNextFunc = function () { GamesSvc.RouteFunc("Click", { Control: "Arrow", Arrow: "Next" }); }
    $scope.ClickArrowLastFunc = function () { GamesSvc.RouteFunc("Click", { Control: "Arrow", Arrow: "Last" }); }


    this.ClickAcceptFunc = function () { GamesWebSvc.RouteFunc("Click", { Control: "Button", Button: "Accept" }) };

    this.ClickDeclineFunc = function () { GamesWebSvc.RouteFunc("Click", { Control: "Button", Button: "Decline" }) };
    this.ClickResendFunc = function () { GamesWebSvc.RouteFunc("Click", { Control: "Button", Button:"Resend" }) };
    this.ClickRetractFunc = function () { GamesWebSvc.RouteFunc("Click", { Control: "Button", Button: "Retract" }) };

    this.ClickExitFunc = function () { GamesLinkSvc.MainFunc("Click", { Control: "Button", Button: "Exit" }) }
    this.ClickBackFunc = function () { GamesLinkSvc.MainFunc("Click", { Control: "Button", Button: "Back" }) }
    this.Click_StartFunc = function () { GamesLinkSvc.MainFunc("Click", { Control: "Button", Button: "Start" }) }

    this.ClickImgFunc = function (pRowIdx) { GamesLinkSvc.RouteFunc("Click", { Control: "Row", RowIdx: pRowIdx, Col: "Img" }); }
    this.ClickRowFunc = function (pRowIdx) { GamesLinkSvc.RouteFunc("Click", { Control: "Row", RowIdx: pRowIdx, Col: "Row" }); }    

    this.ClickBoardFunc = function () { GamesLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Board" }) };
    this.ClickCheckAllFunc = function () { GamesSvc.RouteFunc("Click", { Control: "CheckAll" }) };
    this.ClickSelectFunc = function (pRowIdx) { GamesSvc.RouteFunc("Click", { Control: "Row", Col: "Select", RowIdx: pRowIdx }) };
}

function GamesWebSvc($http, UtilitySvc, GamesSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("GamesWebSvc.RouteFunc * pEvent = " + pEvent + " * pObj=" + JSON.stringify(pObj));
        switch (pEvent) {
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        //console.log("GamesWebSvc.RouteFunc.Click.Button * pObj.Button=" + pObj.Button);
                        GamesSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        switch (pObj.Button) {
                            case "Accept": this.MainFunc("Post", { Event: "ChallengeAccepts", Data: MM.Data }); break;
                            case "Decline": this.MainFunc("Post", { Event: "ChallengeDeclines", Data: MM.Data  }); break;
                            case "Resend": this.MainFunc("Post", { Event: "ChallengeResends", Data: MM.Data  }); break;
                            case "Retract": this.MainFunc("Post", { Event: "ChallengeRetracts", Data: MM.Data  }); break;
                        }
                        break;
                }
                break;
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("GamesWebSvc.MainFunc * pEvent = " + pEvent);
        switch (pEvent) {
            case "Post":
                //console.log("GamesWebSvc.MainFunc.Post MM.Data=" + JSON.stringify(MM.Data));
                var parms = UtilitySvc.WebParmsFunc(pEvent, { Event: pObj.Event, Data: pObj.Data });
                $http
                    .post("api/Web", parms)
                    .success(function (pWebReturn) {
                        //console.log("StartParmsWebSvc.MainFunc.Post.Success" + " * pWebReturn.Code=" + pWebReturn.Code + " * pWebReturn.Data=" + JSON.stringify(pWebReturn.Data));
                        if (pWebReturn.Code == "Success")
                            GamesSvc.RouteFunc("Web", { Event: pObj.Event, Data: pWebReturn.Data });
                        else
                            GamesSvc.RouteFunc("Error", { Event: pObj.Event, Error: pWebReturn.Code });
                    })
                    .error(function () { GamesSvc.RouteFunc("Error", { Event: pObj.Event, Error: "Server" }); });
                break;
        }
    }
}

function GamesLinkSvc($location, GamesSvc, BoardSvc, GameSvc, HomeSvc, StartParmsSvc, UtilitySvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("GamesLinkSvc.RouteFunc * pEvent=" + pEvent);
        //console.log("pObj = " + JSON.stringify(pObj));
        switch (pEvent) {
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        //console.log("GamesLinkSvc.RouteFunc.Click.Button * Button=" + pObj.Button);
                        GamesSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        break;
                    case "Row":
                        //console.log("GamesLinkSvc.RouteFunc.Click.Row * pObj.RowIdx=" + pObj.RowIdx + " * Col=" + pObj.Col);
                        //console.log("pObj = " + JSON.stringify(pObj));
                        switch (pObj.Col) {
                            case "Photo":
                            case "Img":
                            case "Row":
                                GamesSvc.RouteFunc(pEvent, { Control: pObj.Control, RowIdx: pObj.RowIdx, Col: pObj.Col });
                                this.MainFunc(pEvent, { Control: pObj.Control, RowIdx: pObj.RowIdx, Col: pObj.Col });
                                break;
                        }
                        break;
                }               
                break;
        }
    };
    this.MainFunc = function (pEvent, pObj) {
        //console.log("GamesLinkSvc.MainFunc * pEvent=" + pEvent);
        //console.log("pObj = " + JSON.stringify(pObj));
        switch (pEvent) {
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        //console.log("GamesLinkSvc.MainFunc.Click.Button * pObj.Button=" + pObj.Button);
                        switch (pObj.Button) {
                            case "Board":
                                //console.log("GamesLinkSvc.MainFunc.Click.Button.Board * MM.Data.length=" + MM.Data.length);
                                if (MM.Pages.Selections.length > 0) {
                                    var row = UtilitySvc.RowFunc("Get", { Pages: MM.Games.Active_Pages, Id: MM.Pages.Selections[0] });
                                    UtilitySvc.SelectFunc("Delete", { Selections: MM.Pages.Selections, Select: MM.Pages.Selections[0] });
                                    row.Selected = false;
                                    BoardSvc.RouteFunc("_Link", { View_Event: "Games_ClickBoard", Data: row });
                                }
                                break;
                            case "Exit": HomeSvc.RouteFunc("_Link", { View_Event: "Games_ClickExit" }); break;
                            case "Start": StartParmsSvc.RouteFunc("_Link", { View_Event: "Games_ClickStart" }); break;
                        }
                        break;
                    case "Row":
                        //console.log("GamesLinkSvc.MainFunc.Click.Row * pObj.RowIdx=" + pObj.RowIdx + " * Col=" + pObj.Col);
                        //console.log("pObj = " + JSON.stringify(pObj));
                        switch (pObj.Col) {
                            case "Photo": case "Img":
                            case "Row":
                                //console.log("GamesLinkSvc.ClickImg");
                                switch ($location.path()) {
                                    case "/History":
                                        BoardSvc.RouteFunc("_Link", { View_Event: "Games_ClickRow", "Data": MM.Data });
                                        break;                          
                                    case "/Games":
                                          switch (MM.Tabs.Main[MM.Tabs.Idx].Name) {
                                            case "Active": BoardSvc.RouteFunc("_Link", { View_Event: "Games_ClickRow", "Data": MM.Data }); break;
                                            case "Received": GameSvc.MainFunc("_Link", { View_Event: "Games_ClickRow", Type: "GamesReceived", "Data": MM.Data }); break;
                                            case "Sent": GameSvc.MainFunc("_Link", { View_Event: "Games_ClickRow", Type: "GamesSent", "Data": MM.Data }); break;
                                        }
                                        break;
                                }
                                break;
                        }
                        break;
                }
                break;
        }
    };
}

function GamesSvc($rootScope, $location, BoardSvc, UtilitySvc, StylesSvc, DMCSvc) {
    this.InitFunc = function () {
        //console.log("GamesSvc.InitFunc");
        IM.Games = { TabSwitch: "Fix" };
        MM.Pages.Selections = [];
        MM.Games = { Loading: true, History_Loading: true };
        MM.Games.Tabs = { Type: "Fixed", Idx: 0, Set: "Main", Idx: 0, Left: [], Right: [], Show: {} }
        MM.Games.Tabs.Main = [{ Name: "Active" }, { Name: "Received" }, { Name: "Sent" }];
        MM.Games.Tabs.Include = "/Client/Views/Games/GamesInclude.html";
        MM.Games.RowsPerPage = 5;

        MM.Games.Active_Pages = { Idx: 0, Set: [[]], Idx: 0, Rows_Length: 0, Page: [], Selections: [], RowsPer: 4 };
        MM.Games.Received_Pages = { Idx: 0, Set: [[]], Idx: 0, Rows_Length: 0, Page: [], Selections: [], RowsPer: 4 };
        MM.Games.Sent_Pages = { Idx: 0, Set: [[]], Idx: 0, Rows_Length: 0, Page: [], Selections: [], RowsPer: 4 };
        MM.Games.History_Pages = { Idx: 0, Set: [[]], Idx: 0, Rows_Length: 0, Page: [], Selections: [], RowsPer: 4 };
        VM.Games = { BigMsg_Label: MM.BigMsg, Radio: MM.Radio, Page: [], Show: {}, Show_View: "Tabs", Show_BigMsg: false };
        VM.Games.Table = MM.Table_Tab;
        VM.Games.TD = MM.TD_Tab;
        VM.Games.TDI = MM.TDI_Tab;
        VM.Games.CheckBox = MM.CheckBox;
        VM.Games.Exit = MM.ButtonTL;

        VM.Games.Board = MM.ButtonTC;
        VM.Games.Decline = MM.ButtonTC;
        VM.Games.Retract = MM.ButtonTC;

        VM.Games.Start = MM.ButtonTR;
        VM.Games.Accept = MM.ButtonTR;
        VM.Games.Profile = MM.ButtonTR;
        //console.log("VM.Games.Table.NgStyle =" + JSON.stringify(VM.Games.Table.NgStyle));
        //console.log("VM.Games.TD.NgStyle =" + JSON.stringify(VM.Games.TD.NgStyle));
        //console.log("VM.Games.TDI.NgStyle =" + JSON.stringify(VM.Games.TDI.NgStyle));


        //console.log("GamesSvc.InitFunc * VM.Games.Page.length=" + VM.Games.Page.length);
        //console.log("GamesSvc.InitFunc * VM.Games.BigMsg_Label=" + JSON.stringify(VM.Games.BigMsg_Label));
        //console.log("VM.Games.Div.NgStyle =" + JSON.stringify(VM.Games.Div.NgStyle));
    }
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("GamesSvc.RouteFunc * pEvent=" + pEvent + " * pObj.View_Event=" + pObj.View_Event);
        //console.log("GamesSvc.RouteFunc * pEvent=" + pEvent + " * pObj=" + JSON.stringify(pObj));
        switch (pEvent) {

            //#region case "_Link":
            case "_Link":
                //console.log("GamesSvc.RouteFunc._Link * pObj.View_Event=" + pObj.View_Event);
                //console.log("GamesSvc.RouteFunc._Link * pObj.View_Event=" + pObj.View_Event + " * pObj=" + JSON.stringify(pObj));

                switch (pObj.View_Event) {
                    case "Member_Init": this.InitFunc(); break;
                    case "Member_Size": this.SizeFunc(); break;
                    case "Game_WebChallenge":
                    case "Home_ClickGames": 
                    case "Game_WebAccept": 
                    case "Game_WebDecline": 
                    case "Game_WebResend": 
                    case "Game_WebRetract":
                    case "Game_WebSend":
                    case "Game_ClickBack": 
                    case "Home_ClickHistory":
                    case "History_ClickTab": 
                    case "History_WebGetHistory": this.MainFunc("_Link", { View_Event: pObj.View_Event, Data: pObj.Data }); break;
                    case "User_WebGetUser": this.MainFunc("_Link", { View_Event: pObj.View_Event, Data: pObj.Data }); break;
                }
                break;
            //#endregion

            //#region case "Click":
            case "Click":
                //console.log("GamesSvc.RouteFunc.Click * pObj = " + JSON.stringify(pObj));
                switch (pObj.Control) {
                    case "Arrow": this.MainFunc(pEvent, { Control: pObj.Control, Arrow: pObj.Arrow }); break;
                    case "Button": this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button }); break;
                    case "CheckAll": this.MainFunc(pEvent, { Control: pObj.Control }); break;
                    case "Row": this.MainFunc(pEvent, { Control: pObj.Control, Col: pObj.Col, RowIdx: pObj.RowIdx }); break;
                    case "Tab": this.MainFunc(pEvent, { Control: pObj.Control, Idx: pObj.Idx }); break;
                }
                break;
            //#endregion

            case "Web": this.MainFunc(pEvent, { Event: pObj.Event, Data: pObj.Data }); break;
            case "Hub": this.MainFunc(pEvent, { Event: pObj.Event, Data: pObj.Data }); break;
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("GamesSvc.MainFunc." + pEvent);
        //console.log("GamesSvc.MainFunc." + pEvent + " * pObj.View_Event=" + pObj.View_Event);
        //console.log("GamesSvc.MainFunc * pEvent=" + pEvent + " * pObj.Event=" + pObj.Event);
        //console.log("GamesSvc.MainFunc * pEvent=" + pEvent + " * pObj=" + JSON.stringify(pObj) );
        //console.log("MainFunc * $location.path()=" + $location.path());
        switch (pEvent) {
            //#region case "_Link":
            case "_Link":
                //console.log("GamesSvc.MainFunc._Link * pObj.View_Event=" + pObj.View_Event);
                switch (pObj.View_Event) {

                    //#region case "Home_ClickGames":
                    case "Home_ClickGames":
                        //console.log("MainFunc._Link.Home_ClickGames");
                        this.ViewFunc({ URL: "Games", View: "Games" });
                        if (MM.Games.Loading) this.ViewFunc({ Show: "Active" });
                        else if (MM.Games.Received_Pages.Set[0].length > 0) this.ViewFunc({ Show: "Received" });
                        else if (MM.Games.Active_Pages.Set[0].length > 0) this.ViewFunc({ Show: "Active" });
                        else if (MM.Games.Sent_Pages.Set[0].length > 0) this.ViewFunc({ Show: "Sent" });
                        else this.ViewFunc({ Show: "Sent" });
                        this.BatchFunc("Load");
                        this.BatchFunc("View");
                        break;
                    //#endregion

                    case "Home_ClickHistory":
                    case "History_ClickTab": this.BatchFunc("Load"); this.BatchFunc("View"); break;
                    case "History_WebGetHistory":
                    case "User_WebGetUser": this.BatchFunc("Load", { View_Event: pObj.View_Event, Data: pObj.Data }); this.BatchFunc("View"); break;
                    case "Game_ClickBack": this.ViewFunc({ View: "Games", Msg: "GameBack" }); break;

                    //#region case "Game_WebAccept":
                    case "Game_WebAccept":
                        //console.log("GamesSvc.MainFunc._Link.Game_WebAccept * pObj=" + JSON.stringify(pObj));
                        var game = DMCSvc.GamesFunc("Accept", { Event: pEvent, Data: pObj.Data });
                        MM.Games.Active_Pages.Idx = MM.Games.Active_Pages.Set.length - 1;
                        this.ViewFunc({ URL: "Games", View: "Games", Show: "Rows", Msg: "WebAccept", OpUserId: game.OpUserId });
                        break;
                    //#endregion

                    //#region case "Game_WebDecline":
                    case "Game_WebDecline":
                        var game = UtilitySvc.RowFunc("Delete", { Pages: MM.Games.Received_Pages, Id: pObj.Data });
                        MM.Pages.Rows_Length -= 1;
                        this.ViewFunc({ URL: "Games", Switch: "Received", Msg: "WebDecline", OpUserId: game.OpUserId });
                        break;
                    //#endregion

                    //#region case "Game_WebRetract":
                    case "Game_WebRetract":
                        //console.log("GamesSvc.MainFunc._Link.Game_WebRetract *  pObj=" + JSON.stringify(pObj));
                        var game = UtilitySvc.RowFunc("Delete", { Pages: MM.Games.Sent_Pages, Id: pObj.Data.Id });                        
                        MM.Pages.Rows_Length -= 1;
                        this.ViewFunc({ URL: "Games", Show: "Sent", Msg: "WebRetract", OpUserId: game.OpUserId });
                        break;
                    //#endregion

                    //#region case "Game_WebSend":
                    case "Game_WebSend":
                        //console.log("MainFunc._Link.Game_WebChallenge.Game_WebSend");
                        //console.log("MainFunc._Link * pObj=" + JSON.stringify(pObj));
                        //console.log("pObj.Data.OpPhoto_Src.length =" + pObj.Data.OpPhoto_Src.length);
                        //console.log("pObj.Data.GameName =" + pObj.Data.GameName);
                        //console.log("pObj.Data.Date =" + pObj.Data.Date);
                        //console.log("pObj.Data.Rated =" + pObj.Data.Rated);
                        //console.log("pObj.Data.Time =" + pObj.Data.Time);
                        //console.log("pObj.Data =" + JSON.stringify(pObj.Data));
                        MM.Data =
                            {
                                Id: pObj.Data.Id,
                                GameName: pObj.Data.GameName,
                                Date: pObj.Data.Date,
                                Rated: MM.Wiz.Rated,
                                Time: MM.Wiz.Time,
                                ProfileIdx: MM.UserProfiles.DefaultIdx,
                                OpPhoto_Src: MM.Wiz.OpPhoto_Src,
                                OpUserId: MM.Wiz.OpUserId,
                                OpGroup: MM.Wiz.OpGroup,
                                OpRating: MM.Wiz.OpRating,
                                Rated_O: UtilitySvc.BoolFunc("X", { "Bool": MM.Wiz.Rated }),
                                Time_O: UtilitySvc.TimeFunc("AmtInc", { "Inc": MM.Wiz.TimeInc, "Amt": MM.Wiz.TimeAmt }),
                            };       
                        UtilitySvc.RowFunc("Add", { Pages: MM.Games.Sent_Pages, Row: MM.Data });
                        MM.Games.Sent_Pages.Rows_Length += 1;
                        MM.Pages = MM.Games.Sent_Pages;
                        VM.Games.Page = MM.Pages.Set[MM.Pages.Idx];
                        MM.Games.Tabs.Idx = 2;     
                        VM.Games.Switch = "Challenge";
                        //this.BatchFunc("Load", {});
                        this.SizeFunc();
                        this.ViewFunc({ URL: "Games", View: "Games", Show: "Sent", Buttons: "ExitBoardStart", Msg: "WebSend", "OpUserId": MM.Wiz.OpUserId });
                        break;
                    //#endregion

                    default: alert("GamesSvc.MainFunc._Link * pObj.View_Event=" + pObj.View_Event); break;
                }
                break;
                //#endregion

            //#region case "Click":
            case "Click":
                //console.log("GamesSvc.MainFunc.Click * pObj=" + JSON.stringify(pObj));
                switch (pObj.Control) {

                    //#region case "Arrow":
                    case "Arrow":
                        //console.log("GamesSvc.MainFunc.Click.Arrow");
                        UtilitySvc.PageFunc("Click_Arrow", { Arrow: pObj.Arrow });
                        this.ViewFunc({ Arrows: "*", Msg: "Arrow" });
                        VM.Games.Page = MM.Pages.Set[MM.Pages.Idx];
                        MM.Games.RowsChecked = null;
                        break;
                    //#endregion

                    //#region case "Button":
                    case "Button":
                        //console.log("GamesSvc.MainFunc.Click.Button");
                        //console.log("GamesSvc.MainFunc.Click.Button * pObj.Button=" + pObj.Button + " * MM.Pages.Selections=" + JSON.stringify(MM.Pages.Selections));
                        switch (pObj.Button) {
                            case "Board":
                                MM.Data = [];
                                for (var selectionIdx = 0; selectionIdx < MM.Pages.Selections.length; selectionIdx++) {
                                    var game = UtilitySvc.RowFunc("Get", { Pages: MM.Games.Active_Pages, Id: MM.Pages.Selections[selectionIdx] });
                                    if (game != null) MM.Data.push(game);
                                }
                                this.ViewFunc({ Msg: "Wait_Board" })
                                //console.log("MainFunc.Click.Button.Board * MM.Data.length=" + JSON.stringify(MM.Data).length);
                                break;
                            case "Accept": MM.Data = MM.Pages.Selections; this.ViewFunc({ Msg: "Wait_Accept" }); break;
                            case "Decline": MM.Data = MM.Pages.Selections; this.ViewFunc({ Msg: "Wait_Decline" }); break;
                            case "Resend": MM.Data = MM.Pages.Selections; this.ViewFunc({ Msg: "Wait_Resend" }); break;
                            case "Retract": MM.Data = MM.Pages.Selections; this.ViewFunc({ Msg: "Wait_Retract" }); break;
                        }     
                        //console.log("GamesSvc.MainFunc.Click.Button * pObj.Button=" + pObj.Button + " * MM.Data=" + JSON.stringify(MM.Data));
                        break;
                    //#endregion

                    //#region case "CheckAll":
                    case "CheckAll":
                        //console.log("GamesSvc.MainFunc.Click.CheckAll * VM.Games.CheckAll=" + VM.Games.CheckAll);
                        for (var x = 0; x < MM.Pages.Set[MM.Pages.Idx].length; x++) {
                            if (VM.Games.Page[x].Selected != VM.Games.CheckAll) {
                                VM.Games.Page[x].Selected = VM.Games.CheckAll;
                                if (VM.Games.Page[x].Selected) UtilitySvc.SelectFunc("Add", { Selections: MM.Pages.Selections, Select: VM.Games.Page[x].Id });
                                else UtilitySvc.SelectFunc("Delete", { Selections: MM.Pages.Selections, Select: VM.Games.Page[x].Id });
                            }
                        }
                        switch (MM.View) {
                            case "GamesActive": this.ViewFunc({ Enable: "Board", Msg: "Select" }); break;
                            case "GamesReceived": this.ViewFunc({ Enable: "DeclineAccept", Msg: "Select" }); break;
                            case "GamesSent": this.ViewFunc({ Enable: "Retract", Msg: "Select" }); break;
                        }
                        //console.log("MM.Pages.Selections.length=" + JSON.stringify(MM.Pages.Selections.length)); 
                        //console.log("MM.Pages.Selections=" + JSON.stringify(MM.Pages.Selections));        
                        break;
                    //#endregion

                    //#region case "Row":
                    case "Row":
                        //console.log("GamesSvc.MainFunc.Click.Row * pObj.Col=" + pObj.Col);
                        switch (pObj.Col) {
                            case "Photo":
                            case "Img":
                            case "Row":
                                MM.Data = MM.Pages.Set[MM.Pages.Idx][pObj.RowIdx];
                                //console.log("MM.Data.Id=" + MM.Data.Id);
                                //console.log("MM.Data.GameName=" + MM.Data.GameName);
                                //console.log("MM.Data.ProfileIdx=" + MM.Data.ProfileIdx);

                                //console.log("MM.Data.OpPhoto_Src.length=" + MM.Data.OpPhoto_Src.length);
                                //console.log("MM.Data.OpUserId=" + MM.Data.OpUserId);
                                //console.log("MM.Data.OpName=" + MM.Data.OpName);
                                //console.log("MM.Data.OpGroup=" + MM.Data.OpGroup);
                                //console.log("MM.Data.OpRating=" + MM.Data.OpRating);
                                //console.log("MM.Data=" + JSON.stringify(MM.Data));
                                break;
                            case "Select":
                                //console.log("GamesSvc.MainFunc.Click.Row.Select * pObj.RowIdx=" + pObj.RowIdx);
                                //console.log("MM.View=" + MM.View);
                                if (VM.Games.Page[pObj.RowIdx].Selected) {
                                    UtilitySvc.SelectFunc("Add", { Selections: MM.Pages.Selections, Select: VM.Games.Page[pObj.RowIdx].Id });
                                }
                                else {
                                    UtilitySvc.SelectFunc("Delete", { Selections: MM.Pages.Selections, Select: VM.Games.Page[pObj.RowIdx].Id });
                                }
                                switch (MM.View) {
                                    case "GamesActive": this.ViewFunc({ Enable: "Board", Msg: "Select" }); break;
                                    case "GamesReceived": this.ViewFunc({ Enable: "DeclineAccept", Msg: "Select" }); break;
                                    case "GamesSent": this.ViewFunc({ Enable: "Retract", Msg: "Select" }); break;
                                }
                                //console.log("MM.Pages.Selections=" + JSON.stringify(MM.Pages.Selections));                       
                                break;
                        }
                        break;
                    //#endregion

                    case "Tab": this.ViewFunc({ TabIdx: pObj.Idx }); this.BatchFunc("View"); break;
                }
                break;
                //#endregion

            //#region case "Hub":
            case "Hub":
                //console.log("GamesSvc.MainFunc.Hub * pObj.Event=" + pObj.Event + " * pObj=" + JSON.stringify(pObj));
                switch (pObj.Event) {
                    //#region case "Accept":
                    case "Accept":
                        //console.log("GamesSvc.MainFunc.Hub." + pObj.Event + " * pObj=" + JSON.stringify(pObj));
                        var game = DMCSvc.GamesFunc("Send", { Data: pObj.Data });
                        this.ViewFunc({ Msg: "HubAccept", OpUserId: game.OpUserId });
                        DMCSvc.AudioFunc("Ping");
                        break; 
                    //#endregion

                    //#region case "Decline":
                    case "Decline":
                        //console.log("GamesSvc.MainFunc.Hub." + pObj.Event + " * pObj=" + JSON.stringify(pObj));
                        var game = DMCSvc.GamesFunc("Decline", { Data: pObj.Data });
                        break; 
                    //#endregion

                    //#region case "Resign":
                    case "Resign":
                        //console.log("GamesSvc.MainFunc.Hub." + pObj.Event + " * pObj=" + JSON.stringify(pObj));
                        var game = DMCSvc.GamesFunc("Resign", { Data: pObj.Data });
                        this.ViewFunc({ Msg: "HubResign", OpUserId: game.OpUserId });
                        DMCSvc.AudioFunc("Ping");
                        break; 
                    //#endregion

                    //#region case "Retract":
                    case "Retract":
                        //console.log("GamesSvc.MainFunc.Hub." + pObj.Event + " * pObj=" + JSON.stringify(pObj));
                        var game = DMCSvc.GamesFunc("Retract", { Data: pObj.Data });
                        break;
                    //#endregion

                    //#region case "Send":
                    case "Send":
                        //console.log("GamesSvc.MainFunc.Hub." + pObj.Event + " * pObj=" + JSON.stringify(pObj));
                        var game = DMCSvc.GamesFunc("Send", { Data: pObj.Data });
                        this.ViewFunc({ Msg: "HubSend", OpUserId: game.OpUserId });
                        DMCSvc.AudioFunc("Ping");
                        break;
                    //#endregion

                    //#region case "TurnSave":
                    case "TurnSave":
                        //console.log("GamesSvc.MainFunc.Hub.TurnSave * pObj=" + JSON.stringify(pObj));
                        var game = DMCSvc.TurnFunc("Save", { Data: pObj.Data });
                        switch (game.EndSts) {
                            default: this.ViewFunc({ Msg: "Turn_MeTurn", OpUserId: game.OpUserId }); break;
                            case "MeMated": this.ViewFunc({ Msg: "Turn_MeMated", OpUserId: game.OpUserId }); break;
                            case "MeCheckmated": this.ViewFunc({ Msg: "Turn_MeCheckmated", OpUserId: game.OpUserId }); break;
                        }
                        DMCSvc.AudioFunc("Ping");
                        break;
                   //#endregion
                }
                VM.Games.Page = MM.Pages.Set[MM.Pages.Idx];
                this.ViewFunc({ Show: "Rows" });
                break;
                //#endregion

            //#region case "Web":
            case "Web":
                //console.log("GamesSvc.MainFunc.Web." + pObj.Event + " * pObj=" + JSON.stringify(pObj));
                switch (pObj.Event) {
                    //#region case "ChallengeAccepts":
                    case "ChallengeAccepts":
                        //console.log("GamesSvc.MainFunc.Web.ChallengeAccepts * pObj=" + JSON.stringify(pObj));
                        for (var x = 0; x < pObj.Data.length; x++) {
                            var game = DMCSvc.GamesFunc("Accept", { Me: true, Data: pObj.Data[x] });
                        }
                        //console.log("GamesSvc.MainFunc.Web.ChallengeAccepts * game=" + JSON.stringify(game));
                        //console.log("GamesSvc.MainFunc.Web.ChallengeAccepts * game.OpUserId =" + game.OpUserId);
                        this.ViewFunc({ URL: "Games", View: "GamesReceived", Msg: "WebAccepts", OpUserId: game.OpUserId });
                        break;
                    //#endregion

                    //#region case "ChallengeDeclines":
                    case "ChallengeDeclines":
                        for (var x = 0; x < pObj.Data.length; x++) {
                            var game = DMCSvc.GamesFunc("Decline", { Me: true, Data: pObj.Data[x] });
                        }
                        this.ViewFunc({ URL: "Games", View: "GamesReceived", Msg: "Declines", OpUserId: games[0].OpUserId });
                        break;
                    //#endregion

                    //#region case "ChallengeResends":
                    case "ChallengeResends":
                        //console.log("GamesSvc.MainFunc.Web." + pObj.Event + " * pObj=" + JSON.stringify(pObj));
                        for (var x = 0; x < pObj.Data.length; x++) {
                            var game = DMCSvc.GamesFunc("Resend", { Me: true, Data: pObj.Data[x] });
                        }
                        this.ViewFunc({ Msg: "WebResends" }); break;
                    //#endregion

                    //#region case "ChallengeRetracts":
                    case "ChallengeRetracts":
                        //console.log("GamesSvc.MainFunc.Web." + pObj.Event + " * pObj=" + JSON.stringify(pObj));
                        for (var x = 0; x < pObj.Data.length; x++) {
                            var game = DMCSvc.GamesFunc("Retract", { Me: true, Data: pObj.Data[x] });
                        }
                        this.ViewFunc({ Msg: "WebRetracts" }); break;
                        break;
                    //#endregion
                }
                MM.Pages.Selections = [];
                VM.Games.Page = MM.Pages.Set[MM.Pages.Idx];
                this.ViewFunc({ Show: "Rows" });
                //console.log("MainFunc.Web * VM.Games.Switch=" + VM.Games.Switch);
                break;
                //#endregion
        }
    }
    this.BatchFunc = function (pEvent, pObj) {
        //console.log("BatchFunc * pEvent=" + pEvent);
        //console.log("BatchFunc * pObj=" + JSON.stringify(pObj));
        switch (pEvent) {
            //#region case "View":
            case "View":
                switch ($location.path()) {
                    //#region case "/Games":
                    case "/Games":                        
                        if (VM.Games.Show_View == "Tabs") {  
                            switch (MM.Tabs.Main[MM.Tabs.Idx].Name) {
                                case "Active":
                                    MM.Pages = MM.Games.Active_Pages;
                                    this.ViewFunc({ Show: "Active", Buttons: "ExitBoardStart", B_Enable: "ExitStart" });
                                    break;
                                case "Received":
                                    MM.Pages = MM.Games.Received_Pages;
                                    this.ViewFunc({ Show: "Received", Buttons: "ExitDeclineAccept", B_Enable: "Exit" });
                                    break;
                                case "Sent":
                                    MM.Pages = MM.Games.Sent_Pages;
                                    this.ViewFunc({ Show: "Sent", Buttons: "ExitRetractStart", B_Enable: "ExitStart" });
                                    break;
                            }
                            if (pObj != null) MM.Pages.Idx = (pObj.PageIdx != "Last") ? 0 : MM.Pages.Set.length - 1;
                            VM.Games.Page = MM.Pages.Set[MM.Pages.Idx];
                            this.ViewFunc({ Arrows: "*", Msg: "Init" });
                        }
                        break;
                    //#endregion

                    //#region case "/History":
                    case "/History":
                        //console.log("GamesSvc.BatchFunc.View./History");
                        if (VM.History.Show_View == "Tabs") {
                            switch (MM.Tabs.Main[MM.Tabs.Idx].Name) {
                                case "Games":
                                    //console.log("GamesSvc.BatchFunc.View./History.Games");
                                    MM.Pages = MM.Games.History_Pages;
                                    this.ViewFunc({ Show: "History", Buttons: "ExitBoardStart", B_Enable: "ExitStart" });
                                    if (pObj != null) MM.Pages.Idx = (pObj.PageIdx != "Last") ? 0 : MM.Pages.Set.length - 1;
                                    VM.Games.Page = MM.Pages.Set[MM.Pages.Idx];
                                    this.ViewFunc({ Arrows: "*", Msg: "Init" });
                                    //console.log("VM.Games.Page.length=" + VM.Games.Page.length);
                                    break;
                                default: return;
                            }
                        }
                        break;
                    //#endregion
                    default: return;
                }
                break;
            //#endregion

            //#region case "Load":
            case "Load":
                //console.log("GamesSvc.BatchFunc.Load * pObj=" + JSON.stringify(pObj));
                if (pObj != null) {
                    //console.log("GamesSvc.BatchFunc.Load * pObj.View_Event=" + pObj.View_Event);
                    switch (pObj.View_Event) {

                        //#region case "History_WebGetHistory":
                        case "History_WebGetHistory":
                            //console.log("GamesSvc.BatchFunc.Load.History_WebGetHistory");
                            //console.log("GamesSvc.BatchFunc.Load.History_WebGetHistory * pObj.Data.length=" + JSON.stringify(pObj.Data.length));
                            var games = pObj.Data;
                            for (var x = 0; x < games.length; x++) {
                                var game = games[x];
                                game.History = true;
                                game.OpPhoto_Src = (game.OpPhoto_Src.length == 0) ? IM.PhotoNo_Src : game.OpPhoto_Src;
                                game.OpUserId = (game.OpUserId.length < 10) ? game.OpUserId : game.OpUserId.substring(0, 8) + "*";
                                game.Script = DMCSvc.ScriptFunc("Parse", { Script: game.Script });     
                                DMCSvc.GameFunc("Extend", { Game: game });
                                //console.log("GamesSvc.BatchFunc.Load.History_WebGetHistory * game.EndSts=" + game.EndSts);
                                switch (game.EndSts.trim()) {
                                    case "B_CM": game.EndSts = (game.PlayingAsWhite) ? "MeCheckmated" : "OpCheckmated"; break;
                                    case "W_CM": game.EndSts = (game.PlayingAsWhite) ? "OpCheckmated" : "MeCheckmated"; break;
                                    case "B_M": game.EndSts = (game.PlayingAsWhite) ? "Memated" : "OpMated"; break;
                                    case "W_M": game.EndSts = (game.PlayingAsWhite) ? "OpMated" : "Memated"; break;
                                    case "B_Res": game.EndSts = (game.PlayingAsWhite) ? "OpResigned" : "MeResigned"; break;
                                    case "W_Res": game.EndSts = (game.PlayingAsWhite) ? "MeResigned" : "OpResigned"; break;
                                    case "B_TE": game.EndSts = (game.PlayingAsWhite) ? "OpTimeExpired" : "MeTimeExpired"; break;
                                    case "W_TE": game.EndSts = (game.PlayingAsWhite) ? "MeTimeExpired" : "OpTimeExpired"; break;
                                }
                                game.IWon_O = UtilitySvc.BoolFunc("X", { "Bool": game.IWon });
                                game.Rated_O = UtilitySvc.BoolFunc("X", { "Bool": game.Rated });
                                game.Time_O = UtilitySvc.TimeFunc("AmtInc", { Short: true, "Inc": game.TimeInc, "Amt": game.TimeAmt });
                                //console.log("game.Rated=" + game.Rated);
                                //console.log("game.TimeAmt=" + game.TimeAmt);
                                //console.log("game.Rated_O=" + game.Rated_O);
                                //console.log("game.Time_O=" + game.Time_O);
                                //console.log("GamesSvc.BatchFunc.Load.History_WebGetHistory * game.PlayingAsWhite=" + game.PlayingAsWhite);
                                //console.log("GamesSvc.BatchFunc.Load.History_WebGetHistory * game.EndSts=" + game.EndSts);
                                //console.log("------------------------------------------------"); 
                            }
                            //console.log("GamesSvc.BatchFunc.Load.History_WebGetHistory * games.length=" + games.length);
                            MM.Games.History_Pages = UtilitySvc.PageFunc("GetSet", { Rows: games, RowsPerPage: MM.Games.RowsPerPage });
                            break;
                        //#endregion

                        //#region case "User_WebGetUser":
                        case "User_WebGetUser":
                            //console.log("GamesSvc.BatchFunc.Load.User_WebGetUser");
                            //console.log("pObj=" + JSON.stringify(pObj));
                            //console.log("pObj.Data.Active.length=" + pObj.Data.Active.length);
                            //console.log("pObj.Data.Received.length=" + pObj.Data.Received.length);
                            //console.log("pObj.Data.Sent.length=" + pObj.Data.Sent.length);
                            //console.log("GamesSvc.BatchFunc.Load.User_WebGetUser * pObj.Data.Active[0]=" + JSON.stringify(pObj.Data.Active[0]));
                            //console.log("GamesSvc.BatchFunc.Load.User_WebGetUser * pObj.Data.Active[0].Script=" + JSON.stringify(pObj.Data.Active[0].Script));
                            //console.log("pObj.Data.Active[0].PlayingAsWhite=" + JSON.stringify(pObj.Data.Active[0].PlayingAsWhite));
                            for (var x = 0; x < pObj.Data.Active.length; x++) {
                                //console.log("GamesSvc.BatchFunc.Load.User_WebGetUser x=" + x);
                                pObj.Data.Active[x].Script = DMCSvc.ScriptFunc("Parse", { Script: pObj.Data.Active[x].Script });  
                                var game = DMCSvc.GameFunc("Extend", { Game: pObj.Data.Active[x] });  
                                game.Practice = false;
                                game.Over = false;
                            }
                            for (var x = 0; x < pObj.Data.Received.length; x++) DMCSvc.GameFunc("Extend", { Game: pObj.Data.Received[x] });  
                            for (var x = 0; x < pObj.Data.Sent.length; x++) DMCSvc.GameFunc("Extend", { Game: pObj.Data.Sent[x] });         
                            MM.RowsPerPage = MM.Games.RowsPerPage;
                            MM.Games.Active_Pages = UtilitySvc.PageFunc("GetSet", { Rows: pObj.Data.Active, RowsPerPage: MM.Games.RowsPerPage });
                            MM.Games.Received_Pages = UtilitySvc.PageFunc("GetSet", { Rows: pObj.Data.Received, RowsPerPage: MM.Games.RowsPerPage });
                            MM.Games.Sent_Pages = UtilitySvc.PageFunc("GetSet", { Rows: pObj.Data.Sent, RowsPerPage: MM.Games.RowsPerPage });
                            MM.Games.Loading = false;
                            //console.log("GamesSvc.BatchFunc.Load.User_WebGetUser * pObj.Data.Active[0].Script=" + JSON.stringify(pObj.Data.Active[0].Script));
                            //console.log("GamesSvc.BatchFunc.Load.User_WebGetUser * End");
                            break;
                        //#endregion
                    }
                }
                this.BatchFunc("View", { PageIdx: 0 } );
                break;
            //#endregion
        }
    }
    this.SizeFunc = function(pEvent, pObj) {
       //console.log("GamesSvc.MainFunc.SizeFunc");
        if (GM.Sized.Games) return;
        GM.Sized.Games = true;
    }
    this.ViewFunc = function (pObj) {
        if (pObj.URL != null) {
            //console.log("pObj.URL=" + pObj.URL);
            switch (pObj.URL) {
                case "Games":
                    $location.url("/Games");
                    VM.Tabs = MM.Games.Tabs;
                    MM.Tabs = MM.Games.Tabs;
                    break;
                case "History": $location.url("/History"); break;
                default: alert("GamesSvc.ViewFunc * Unknown pObj.URL=" + pObj.URL); break;
            }
        }
        if (pObj.View != null) {
            //console.log("GamesSvc.ViewFunc * $location.path()=" + $location.path() + " * pObj.View=" + pObj.View);
            MM.View = pObj.View;
            switch ($location.path()) {
                case "/Games":
                    switch (pObj.View) {
                        case "Board": VM.Games.Show_View = pObj.View; break;
                        case "Games": VM.Games.Show_View = "Tabs"; VM.Games.Show_Tab = pObj.View; break;
                    }   
                    break;
                case "/Players": VM.Players.Show_View = pObj.View; break;
                case "/Start": VM.Start.Show_View = pObj.View; break;
                case "/History":
                    switch (pObj.View) {
                        case "Board": VM.History.Show_View = pObj.View; break;
                        case "Games": VM.History.Show_View = "Tabs"; VM.History.Show_Tab = pObj.View; break;
                    }
                    break;
                default: alert("GamesSvc.ViewFunc.View * $location.path()=" + $location.path()); break;
            }
            //console.log("GamesSvc.ViewFunc * VM.Games.Show_View=" + VM.Games.Show_View);
            //console.log("GamesSvc.ViewFunc * VM.Games.Show_Tab=" + VM.Games.Show_Tab);
            //console.log("GamesSvc.ViewFunc * VM.History.Show_View=" + VM.History.Show_View);
            //console.log("GamesSvc.ViewFunc * VM.History.Show_Tab=" + VM.History.Show_Tab);
        }
        if (pObj.TabIdx != null) {
            //console.log("Obj.TabIdx=" + pObj.TabIdx);
            MM.Tabs.Idx = pObj.TabIdx;
            switch ($location.path()) {
                case "/Games":
                    switch (pObj.TabIdx) {
                        case 0: this.ViewFunc({ Switch: "Active" }); break;
                        case 1: this.ViewFunc({ Switch: "Received" }); break;
                        case 2: this.ViewFunc({ Switch: "Sent" }); break;
                    }
                    break;
            }
        }
        if (pObj.Show != null) {
            //console.log("GamesSvc.ViewFunc.Switch * pObj.Switch=" + pObj.Switch);
            //console.log("GamesSvc.ViewFunc.Switch * pObj.Switch=" + pObj.Switch + " * MM.Pages.Set[0].length=" + MM.Pages.Set[0].length);
            //console.log("GamesSvc.ViewFunc.Switch * MM.Games.Loading=" + MM.Games.Loading);
            //console.log("GamesSvc.ViewFunc.Switch * MM.History.Loading=" + MM.History.Loading);
            switch (pObj.Show) {
                case "*":
                    switch ($location.path()) {
                        case "/Games":
                            if (MM.Games.Loading || MM.Pages.Set[0].length == 0) VM.Games.Switch = "BigMsg";
                            else {
                                switch (MM.Tabs.Idx) {
                                    case 0: VM.Games.Switch = "Active"; break;
                                    case 1: VM.Games.Switch = "Challenges"; break;
                                    case 2: VM.Games.Switch = "Challenges"; break;
                                }
                            }
                            break;
                        case "/History": VM.Games.Switch = (MM.History.Loading || MM.Pages.Set[0].length == 0) ? "BigMsg" : "History"; break;
                    }
                    //console.log("GamesSvc.ViewFunc.Switch * VM.Games.Switch=" + VM.Games.Switch + " * MM.Pages.Set[0].length=" + MM.Pages.Set[0].length);
                    break;
                case "Arrows": UtilitySvc.PageFunc("ShowArrows"); break;
                case "BigMsg": VM.Games.Switch = pObj.Switch; break;
                case "Rows":
                    switch ($location.path()) {
                        case "/Games":
                            if (MM.Games.Loading || MM.Pages.Set[0].length == 0) VM.Games.Switch = "BigMsg";
                            else {
                                switch (MM.Tabs.Idx) {
                                    case 0: VM.Games.Switch = "Active"; break;
                                    case 1: VM.Games.Switch = "Challenges"; break;
                                    case 2: VM.Games.Switch = "Challenges"; break;
                                }
                            }
                            break;
                        case "/History": VM.Games.Switch = (MM.History.Loading || MM.Pages.Set[0].length == 0) ? "BigMsg" : "History"; break;
                    }
                    break;
                case "Active": case "Received": case "Sent": case "History": 
                    switch (pObj.Switch) {
                        case "Active": MM.Tabs.Idx = 0; break;
                        case "Received": MM.Tabs.Idx = 1; break;
                        case "Sent": MM.Tabs.Idx = 2; break;
                        case "History": break;
                    }
                    VM.Games.Show_View = "Tabs"; VM.Games.Show_Tab = "Games"; this.ViewFunc({ Show: "*" });

                    break;
                default: alert("GamesSvc.ViewFunc.View * pObj.Show=" + pObj.Show); break;
            }

            if ($location.path() == "/Games") { VM.Tabs.Idx = MM.Tabs.Idx; UtilitySvc.TabFunc("Show", { Switch: "Fix" }); }
            //console.log("$location.path()=" + $location.path());
            //console.log("VM.Games.Switch=" + VM.Games.Switch);
            //console.log("MM.Tabs.Idx=" + MM.Tabs.Idx);
        }
        if (pObj.Arrows) {
           //console.log("GamesSvc.ViewFunc * pObj.Arrows=" + pObj.Arrows);
           switch (pObj.Arrows) {
                case ("*"): UtilitySvc.PageFunc("ShowArrows"); break;
            }
        }
        if (pObj.Buttons != null) {
            //console.log("pObj.Buttons=" + pObj.Buttons);
            switch (pObj.Buttons) {
                case "*":

                    break;

                case "ExitBoardProfile":
                    VM.Games.Accept_Show = false;
                    VM.Games.Board_Show = true;
                    VM.Games.Decline_Show = false;
                    VM.Games.Profile_Show = true;
                    VM.Games.Rematch_Show = false;
                    VM.Games.Resend_Show = false;
                    VM.Games.Retract_Show = false;
                    VM.Games.Start_Show = false;
                    break;
                case "ExitBoardStart":
                    VM.Games.Accept_Show = false;
                    VM.Games.Board_Show = true;
                    VM.Games.Decline_Show = false;
                    VM.Games.Profile_Show = false;
                    VM.Games.Rematch_Show = false;
                    VM.Games.Resend_Show = false;
                    VM.Games.Retract_Show = false;
                    VM.Games.Start_Show = true;
                    break;
                case "ExitDeclineAccept":
                    VM.Games.Accept_Show = true;
                    VM.Games.Board_Show = false;
                    VM.Games.Decline_Show = true;
                    VM.Games.Profile_Show = false;
                    VM.Games.Rematch_Show = false;
                    VM.Games.Resend_Show = false;
                    VM.Games.Retract_Show = false;
                    VM.Games.Start_Show = false;
                    break;
                case "ExitRematchStart":
                    VM.Games.Accept_Show = false;
                    VM.Games.Board_Show = false;
                    VM.Games.Decline_Show = false;
                    VM.Games.Profile_Show = false;
                    VM.Games.Rematch_Show = true;
                    VM.Games.Resend_Show = false;
                    VM.Games.Retract_Show = false;
                    VM.Games.Start_Show = true;
                    break;
                case "ExitRetractResend":
                    VM.Games.Accept_Show = false;
                    VM.Games.Board_Show = false;
                    VM.Games.Decline_Show = false;
                    VM.Games.Profile_Show = false;
                    VM.Games.Rematch_Show = false;
                    VM.Games.Resend_Show = true;
                    VM.Games.Retract_Show = true;
                    VM.Games.Start_Show = false;
                    break;
                case "ExitRetractStart":
                    VM.Games.Accept_Show = false;
                    VM.Games.Board_Show = false;
                    VM.Games.Decline_Show = false;
                    VM.Games.Profile_Show = false;
                    VM.Games.Rematch_Show = false;
                    VM.Games.Resend_Show = false;
                    VM.Games.Retract_Show = true;
                    VM.Games.Start_Show = true;
                    break;


                default: alert("GamesSvc.ViewFunc pObj.Buttons=" + pObj.Buttons); break;
            }
        }
        if (pObj.Enable != null) {
            //console.log("pObj.Enable=" + JSON.stringify(pObj.Enable));
            switch (pObj.Enable) {
                case "All":
                    switch (MM.Tabs.Idx) {
                        case 0: this.ViewFunc({ Enable: "Board" }); this.ViewFunc({ Enable: "Start" }); break;
                        case 1: this.ViewFunc({ Enable: "Decline" }); this.ViewFunc({ Enable: "Accept" }); break;
                        case 2: this.ViewFunc({ Enable: "Retract" }); this.ViewFunc({ Enable: "Start" }); break;
                    }
                    break;
                case "Disable_All":
                    switch (MM.Tabs.Idx) {
                        case 0: VM.Games.Board_Disabled = true; VM.Games.Start_Disabled = true; break;
                        case 1: VM.Games.Decline_Disabled = true; VM.Games.Accept_Disabled = true; break;
                        case 2: VM.Games.Retract_Disabled = true; VM.Games.Start_Disabled = true; break;
                    }
                    break;
                case "AcceptDecline":
                    VM.Games.Accept_Disabled = (MM.Pages.Selections == null || MM.Pages.Selections.length == 0);
                    VM.Games.Decline_Disabled = (MM.Pages.Selections == null || MM.Pages.Selections.length == 0);
                    break;

                case "BoardProfile":
                    VM.Games.Board_Disabled = (MM.Pages.Selections == null || MM.Pages.Selections.length == 0);
                    VM.Games.Profile_Disabled = (MM.Pages.Selections == null || MM.Pages.Selections.length == 0);
                    break;

                case "Accept": VM.Games.Accept_Disabled = (MM.Pages.Selections == null || MM.Pages.Selections.length == 0); break;
                case "Board": VM.Games.Board_Disabled = (MM.Pages.Selections == null || MM.Pages.Selections.length == 0); break;
                case "Decline": VM.Games.Decline_Disabled = (MM.Pages.Selections == null || MM.Pages.Selections.length == 0); break;
                case "Profile": VM.Games.Profile_Disabled = (MM.Pages.Selections == null || MM.Pages.Selections.length == 0); break;
                case "Retract":
                    //console.log("GamesSvc.ViewFunc * MM.Pages.Selections.length=" + MM.Pages.Selections.length);
                    VM.Games.Retract_Disabled = (MM.Pages.Selections == null || MM.Pages.Selections.length == 0);
                    //console.log("GamesSvc.ViewFunc * VM.Games.Retract_Disabled=" + VM.Games.Retract_Disabled);
                    break;
            }
        }
        if (pObj.Msg != null) {
            //console.log("GamesSvc.ViewFunc.Msg * pObj.Msg=" + pObj.Msg);
            //console.log("GamesSvc.ViewFunc.Msg * MM.View=" + MM.View);
            //console.log("GamesSvc.ViewFunc.Msg * MM.Games.Loading=" + MM.Games.Loading);
            //console.log("GamesSvc.ViewFunc.Msg * $location.path()=" + $location.path());
            //console.log("GamesSvc.ViewFunc.Msg * MM.Pages.Set[0].length=" + MM.Pages.Set[0].length);
            switch (pObj.Msg) {
                //#region  case "Init":
                case "Error_Server": $rootScope.Msg = "Server error."; break;
                case "Init":
                    switch ($location.path()) {
                        case "/History":
                            if (MM.History.Loading) $rootScope.Msg = "Loading game history...";
                            else if (MM.Pages.Set[0].length == 0) $rootScope.Msg = "You have no completed games.";
                            else if (MM.Pages.Set[0].length == 1) $rootScope.Msg = "You have 1 completed game.";
                            else $rootScope.Msg = "You have " + MM.Pages.Rows_Length + " completed games.";
                            break;
                        case "/Games":
                            switch (MM.Tabs.Main[MM.Tabs.Idx].Name) {
                                case "Active":
                                    if (MM.Games.Loading) $rootScope.Msg = "Loading active games....";
                                    else if (MM.Pages.Set[0].length == 0) $rootScope.Msg = "You have no active games.";
                                    else if (MM.Pages.Set[0].length == 1) $rootScope.Msg = "You have 1 active game.";
                                    else $rootScope.Msg = "You have " + MM.Pages.Rows_Length + " active games.";
                                    break;
                                case "Received":
                                    if (MM.Games.Loading) $rootScope.Msg = "Loading received challenges....";
                                    else if (MM.Pages.Set[0].length == 0) $rootScope.Msg = "You have received no challenges.";
                                    else if (MM.Pages.Set[0].length == 1) $rootScope.Msg = "You have received 1 challenge.";
                                    else $rootScope.Msg = "You have received " + MM.Pages.Rows_Length + " challenges.";
                                    break;
                                case "Sent":
                                    if (MM.Games.Loading) $rootScope.Msg = "Loading sent challenges....";
                                    else if (MM.Pages.Set[0].length == 0) $rootScope.Msg = "You have sent no challenges.";
                                    else if (MM.Pages.Set[0].length == 1) $rootScope.Msg = "You have sent 1 challenge.";
                                    else $rootScope.Msg = "You have sent " + MM.Pages.Rows_Length + " challenges.";
                                    break;
                            }
                    }

                    break;
                case "Back":
                    switch ($location.path()) {
                        case "/Games": $rootScope.Msg = "You may select a different game."; break;
                        case "/History": $rootScope.Msg = "You may select a different game."; break;
                    }
                    break;
                //#endregion    

                //#region case "Arrow":
                case "Arrow":
                    switch ($location.path()) {
                        case "/Games":
                            switch (MM.Tabs.Main[MM.Tabs.Idx].Name) {
                                case "Active":
                                    if (MM.Pages.Idx > 0 && MM.Pages.Idx < MM.Pages.Set.length - 1) $rootScope.Msg = "Page #" + (MM.Pages.Idx + 1) + " of your active games.";
                                    else $rootScope.Msg = (MM.Pages.Idx == 0) ? "First page of your active games." : "Last page of your active games.";
                                    break;
                                case "Received":
                                    if (MM.Pages.Idx > 0 && MM.Pages.Idx < MM.Pages.Set.length - 1) $rootScope.Msg = "Page #" + (MM.Pages.Idx + 1) + " of received challenges.";
                                    else $rootScope.Msg = (MM.Pages.Idx == 0) ? "First page of received challenges." : "Last page of received challenges.";
                                    break;
                                case "Sent":
                                    if (MM.Pages.Idx > 0 && MM.Pages.Idx < MM.Pages.Set.length - 1) $rootScope.Msg = "Page #" + (MM.Pages.Idx + 1) + " of sent challenges.";
                                    else $rootScope.Msg = (MM.Pages.Idx == 0) ? "First page of sent challenges." : "Last page of sent challenges.";
                                    break;
                            }
                            break;
                        case "/History":
                            //console.log("GamesSvc.ViewFunc.Msg.Arrow./History");
                            if (MM.Pages.Idx > 0 && MM.Pages.Idx < MM.Pages.Set.length - 1) $rootScope.Msg = "Page #" + (MM.Pages.Idx + 1) + " of your completed games.";
                            else $rootScope.Msg = (MM.Pages.Idx == 0) ? "First page of your completed games." : "Last page of your completed games.";
                            break
                    }
                    break;
                //#endregion    

                //#region case "Select":

                case "Select":
                    switch ($location.path()) {
                        case "/Games":
                            switch (MM.Tabs.Main[MM.Tabs.Idx].Name) {
                                case "Active": $rootScope.Msg = (MM.Pages.Selections.length == 0) ? "No active games selected." : MM.Pages.Selections.length + " active gamesselected."; break;
                                case "Received": $rootScope.Msg = (MM.Pages.Selections.length == 0) ? "No received challenges selected." : MM.Pages.Selections.length + " received challenges selected."; break;
                                case "Sent": $rootScope.Msg = (MM.Pages.Selections.length == 0) ? "No sent challenges selected." : MM.Pages.Selections.length + " sent challenges selected."; break;
                            }
                            break;
                        case "/History":
                            if (MM.Pages.Idx > 0 && MM.Pages.Idx < MM.Pages.Set.length - 1) $rootScope.Msg = "Page #" + (MM.Pages.Idx + 1) + " of your completed games.";
                            else $rootScope.Msg = (MM.Pages.Idx == 0) ? "First page of your completed games." : "Last page of your completed games.";
                            break
                    }
                    break;
                //#endregion    

                case "GameBack": $rootScope.Msg = "You have exited the challenge."; break;

                case "Turn_MeTurn": $rootScope.Msg = pObj.OpUserId + " has moved."; break;
                case "Turn_MeMated": $rootScope.Msg = pObj.OpUserId + " has mated you."; break;
                case "Turn_MeCheckMated": $rootScope.Msg = pObj.OpUserId + " has checkmated you."; break;

                //#region case "Wait":
                case "Wait_Board": $rootScope.Msg = "Opening board for selected games...";
                case "Wait_Accept": $rootScope.Msg = "Accepting selected challenges..."; break;
                case "Wait_Decline": $rootScope.Msg = "Declining selected challenges..."; break;
                case "Wait_Resend": $rootScope.Msg = "Resending selected challenges..."; break;
                case "Wait_Retract": $rootScope.Msg = "Retracting selected challenges..."; break;

                //#endregion  
                // #region case "Web":
                case "WebResents": $rootScope.Msg = "Selected challenges have been resent."; break;
                case "WebSend": $rootScope.Msg = "Challenge sent to " + pObj.OpUserId + "."; break;
                case "WebAccept": $rootScope.Msg = "You accepted " + pObj.OpUserId + "'s challenge."; break;
                case "WebAccepts":
                    //console.log("MM.Pages.Selections.length=" + MM.Pages.Selections.length);
                    //console.log("pObj.OpUserId=" + pObj.OpUserId);
                    $rootScope.Msg = (MM.Pages.Selections.length == 1) ? "You accepted " + pObj.OpUserId + "'s challenge." : "You accepted " + MM.Pages.Selections.length + " challenges."; break;
                case "WebDeclines": $rootScope.Msg = (MM.Pages.Selections.length == 1) ? "You declined " + pObj.OpUserId + "'s challenge." : "You declined " + MM.Pages.Selections.length + " challenges."; break;
                case "WebResend": $rootScope.Msg = "Challenge to " + pObj.OpUserId + " resent."; break;
                case "WebRetract": $rootScope.Msg = "Challenge to " + pObj.OpUserId + " retracted."; break;
                //#endregion

                // #region case "Hub":
                case "HubAccept": $rootScope.Msg = pObj.OpUserId + " accepted a challenge."; break;
                case "HubAcceptRematch": $rootScope.Msg = pObj.OpUserId + " accepted a rematch offer."; break;
                case "HubSend": $rootScope.Msg = pObj.OpUserId + " has challenged you."; break;
                case "HubTurnSave": 
                    if (pObj.Game.Turn.HasMoves)
                        $rootScope.Msg = pObj.Game.OpUserId + " has moved.";
                    else {
                        $rootScope.Msg = (pObj.Game.Sts == "MeMated") ?
                            pObj.Game.OpUserId + " has mated you." : pObj.Game.OpUserId + " has checkmated you.";
                    }
                    break;
               //#endregion
            }
        }
    }
}