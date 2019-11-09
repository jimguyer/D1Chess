angular.module('ProfilesMod', [])
    .directive('profilesdir', ProfilesDir)
    .controller("ProfilesCtl", ProfilesCtl)
    .service("ProfilesLinkSvc", ProfilesLinkSvc)
    .service('ProfilesSvc', ProfilesSvc)
;

function ProfilesDir() {
    return { restrict: "E", templateUrl: '/Client/Views/Profiles/Profiles.html', controller: 'ProfilesCtl', controllerAs: 'VM_Profiles' };
}

function ProfilesCtl($scope, ProfilesSvc, ProfilesLinkSvc) {
    //console.log("ProfilesCtrl");
    $scope.Profiles = VM.Profiles;
    GM.Scope = $scope;
    $scope.ClickArrowFirstFunc = function () { ProfilesSvc.RouteFunc("Click", { Control: "Arrow", Arrow: "First" }); }
    $scope.ClickArrowPrevFunc = function () { ProfilesSvc.RouteFunc("Click", { Control: "Arrow", Arrow:  "Prev" }); }
    $scope.ClickArrowNextFunc = function () { ProfilesSvc.RouteFunc("Click", { Control: "Arrow", Arrow:  "Next" }); }
    $scope.ClickArrowLastFunc = function () { ProfilesSvc.RouteFunc("Click", { Control: "Arrow", Arrow:  "Last" }); }

    this.ChangeFunc = function () { SearchSvc.RouteFunc("Change"); }
    this.ClickImgFunc = function (pRowIdx) { ProfilesLinkSvc.RouteFunc("Click", { Control: "Row", Col: "Img", RowIdx: pRowIdx }); }
    this.ClickRowFunc = function (pRowIdx) { ProfilesLinkSvc.RouteFunc("Click", { Control: "Row", Col: "Row", RowIdx: pRowIdx }); }
    this.ClickExitFunc = function () { ProfilesLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Exit" }) }
    this.ClickBackFunc = function () { ProfilesLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Back" }) }
    this.ClickNextFunc = function () { ProfilesLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Next" }) }
    this.ClickChallengeFunc = function () { ProfilesLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Challenge" }) }
    this.ClickSelectFunc = function (pRowIdx) { ProfilesSvc.RouteFunc("Click", { Control: "Row", Col: "Select", RowIdx: pRowIdx }); }
}

function ProfilesLinkSvc($location, ProfilesSvc, HistorySvc, HomeSvc, MessageSvc, ProfileSvc, SearchSvc, StartParmsSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("ProfilesLinkSvc.RouteFunc * pEvent=" + pEvent);
        switch (pEvent) {
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        //console.log("ProfilesLinkSvc.RouteFunc.Click.Button" + " * pObj.Button=" + pObj.Button);
                        ProfilesSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });       
                        this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
   
                        break;
                    case "Row":
                        //console.log("ProfilesLinkSvc.RouteFunc.Click_Row * pObj.Column=" + pObj.Column + " * pObj.RowIdx=" + pObj.RowIdx);
                        ProfilesSvc.MainFunc(pEvent, { Control: pObj.Control, Col: pObj.Col, RowIdx: pObj.RowIdx });    
                        this.MainFunc(pEvent, { Control: pObj.Control, Col: pObj.Col, RowIdx: pObj.RowIdx });                  
                        break;
                }
                break;
            case "Web":
                //console.log("SearchLinkSvc.RouteFunc.Web * pObj.Event=" + pObj.Event);
                ProfilesSvc.RouteFunc(pEvent, { Event: pObj.Event, Data: pObj.Data });
                this.MainFunc(pEvent, { Event: pObj.Event });
                break;
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("ProfilesLinkSvc.MainFunc" + " * pEvent=" + pEvent);
        //console.log("pObj = " + JSON.stringify(pObj));
        //console.log("VM.Profiles.Selection = " + VM.Profiles.Selection);
        //console.log("MM.Profile = " + JSON.stringify(MM.Profile));
        switch (pEvent) {
            case "_Link":
                //console.log("pObj.View_Event = " + pObj.View_Event);
                switch (pObj.View_Event) {
                    case "Home_ClickHistory": break;
                }
                break;
            case "Click":
                //console.log("ProfilesLinkSvc.MainFunc.Click" + " * pObj.Control=" + pObj.Control);
                switch (pObj.Control) {
                    case "Button":
                        //console.log("ProfilesLinkSvc.MainFunc.Click.Button * pObj.Button=" + pObj.Button);
                        switch (pObj.Button) {
                            case "Back":
                                switch ($location.path()) {
                                    case "/History": HomeSvc.RouteFunc("_Link", { View_Event: "History_ClickBack" }); break;
                                    case "/Players": SearchSvc.MainFunc("_Link", { View_Event: "Profiles_ClickBack" }); break;
                                    case "/Start": SearchSvc.MainFunc("_Link", { View_Event: "Profiles_ClickBack" }); break;
                                }
                                break;
                            case "Challenge":
                                //console.log("ProfilesLinkSvc.MainFunc.Click.Button.Challenge");
                                StartParmsSvc.RouteFunc("_Link", { View_Event: "Profiles_ClickChallenge", Data: MM.Data }); break;
                            case "Exit":
                                switch ($location.path()) {
                                    case "/History": HomeSvc.RouteFunc("_Link", { View_Event: "History_ClickExit", Enable: "ExitBackChallenge" }); break;
                                    case "/Players": HomeSvc.RouteFunc("_Link", { View_Event: "Players_ClickExit", Enable:"ExitBackChallenge" }); break;
                                    case "/Start": HomeSvc.RouteFunc("_Link", { View_Event: "Start_ClickExit" }); break;
                                }
                                break;
                            case "Next": MessageSvc.RouteFunc("_Link", { View_Event: "Profiles_ClickNext", Data: MM.Data }); break;
                        }
                        break;
                    case "Row":
                        //console.log("ProfilesLinkSvc.MainFunc.Click.Row * pObj.Col=" + pObj.Col);
                        //console.log("");
                        //console.log("ProfilesLinkSvc.MainFunc.Click_Row * pObj.Col=" + pObj.Col + " * pObj.RowIdx=" + pObj.RowIdx);
                        //console.log("");
                        switch (pObj.Col) {
                            case "Img": ProfileSvc.RouteFunc("_Link", { View_Event: "Profiles_ClickImg", Data: MM.Data }); break;
                            case "Row": ProfileSvc.RouteFunc("_Link", { View_Event: "Profiles_ClickRow", Data: MM.Data }); break;
                            case "Select":
                                //console.log("ProfilesSvc.MainFunc.Click_Row.Select * pObj.RowIdx=" + pObj.RowIdx);
                                //console.log("VM.Games.Page[pObj.RowIdx].Selected=" + VM.Games.Page[pObj.RowIdx].Selected);
                                break;
                        }
                        break;
                }
                break;
        }
    };
}

function ProfilesSvc($rootScope, $location, StylesSvc, UtilitySvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("ProfilesSvc.RouteFunc * pEvent=" + pEvent + " * pObj.View_Event=" + pObj.View_Event);
        //console.log("ProfilesSvc.RouteFunc * pEvent=" + pEvent + " * pObj=" + JSON.stringify(pObj));
        switch (pEvent) {
            case "_Link":
                //console.log("ProfilesSvc.RouteFunc._Link * pObj.View_Event = " + pObj.View_Event);
                switch (pObj.View_Event) {
                    case "Member_Init": this.InitFunc(); break;
                    case "Member_Size": this.SizeFunc(); break;
                    case "Home_ClickHistory":
                    case "History_ClickTab": 
                    case "Message_ClickBack": 
                    case "Profile_ClickBack": this.MainFunc(pEvent, { View_Event: pObj.View_Event }); break;
                    case "History_WebGetHistory": 
                    case "Search_WebSearch": this.MainFunc(pEvent, { View_Event: pObj.View_Event, Data: pObj.Data }); break;
                }

                break;
            case "Change": this.MainFunc(pEvent); break;

            case "Click":
                //console.log("ProfilesSvc.RouteFunc.Click * pObj.Control=" + pObj.Control);
                switch (pObj.Control) {
                    case "Arrow": this.MainFunc(pEvent, { Control: pObj.Control, Arrow: pObj.Arrow }); break;
                    case "Button": this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button }); break;
                    case "Row": this.MainFunc(pEvent, { Control: pObj.Control, Col: pObj.Col, RowIdx: pObj.RowIdx }); break;
                }
                break;
        }
    }
    this.InitFunc = function () {
        //console.log("aaProfilesSvc.InitFunc");
        MM.Profiles = { RowsPerPage: 5, History_Loading: true };
        MM.Profiles.History_Pages = { Idx: 0, Set: [[]], Rows_Length: 0, Page: [] };
        MM.Profiles.Search_Pages = { Idx: 0, Set: [[]], Rows_Length: 0, Page: [] };
        VM.Profiles = { BigMsg_Label: MM.BigMsg, Radio: MM.Radio, Page: [] };
    }
    this.ErrorFunc = function (pEvent, pObj) {
        switch (pEvent) {
            case "Change":
                switch (pObj.Error) {
                    case "NoSelection": $rootScope.Msg = "No selection was made."; break;
                }
                break;
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        switch (pObj.Button) {
                            case "Next":
                                switch (pObj.Error) {
                                    case "NoSelection": $rootScope.Msg = "No selection was made."; break;
                                }
                                break;
                        }
                    case "Row":
                        switch (pObj.Col) {
                            case "Img": break;
                            case "Row": break;
                        }
                        break;

                }
                break;
            case "Web":
                switch (pObj.Error) {
                    default: $rootScope.Msg = "Server Error."; break;
                }
                break;
        }
    }

    this.MainFunc = function (pEvent, pObj) {
        //console.log("ProfilesSvc.MainFunc * pEvent=" + pEvent + " * pObj.View_Event=" + pObj.View_Event);
        switch (pEvent) {
            case "_Link":
                //console.log("ProfilesSvc.MainFunc._Link * pObj.View_Event=" + pObj.View_Event);
                switch (pObj.View_Event) {
                    case "Home_ClickHistory":
                    case "History_ClickTab": this.BatchFunc("Load"); this.BatchFunc("View"); break;
                    case "Message_ClickBack":
                    case "Profile_ClickBack":
                    case "StartParms_ClickBack": this.ViewFunc({ View: "Profiles", Enable: "Back", Msg: "Back" }); break;
                    case "History_WebGetHistory":
                        break;
                        //console.log("ProfilesSvc.MainFunc._Link.History_WebGetHistory * pObj.Data.length=" + JSON.stringify(pObj.Data.length));
                        for (var x = 0; x < pObj.Data.length; x++) {
                            pObj.Data[x].OpPhoto_Src = (pObj.Data[x].OpPhoto_Src.length == 0) ? IM.PhotoNo_Src : pObj.Data[x].OpPhoto_Src;
                            pObj.Data[x].OpUserId_ = (pObj.Data[x].OpUserId.length < 10) ? pObj.Data[x].OpUserId : pObj.Data[x].OpUserId.substring(0, 8) + "*";
                        }
                        MM.Profiles.History_Pages = UtilitySvc.PageFunc("GetSet", { Rows: pObj.Data, RowsPerPage: MM.Profiles.RowsPerPage });
                        this.BatchFunc("Load", { Data: pObj.Data }); 
                        break;
                    case "Search_WebSearch":
                        //console.log("----ProfilesSvc.ViewFunc._Link.Search_WebSearch");
                        for (var x = 0; x < pObj.Data.length; x++) {
                            pObj.Data[x].OpPhoto_Src = (pObj.Data[x].OpPhoto_Src.length == 0) ? IM.PhotoNo_Src : pObj.Data[x].OpPhoto_Src;
                            pObj.Data[x].OpUserId_ = (pObj.Data[x].OpUserId.length < 10) ? pObj.Data[x].OpUserId : pObj.Data[x].OpUserId.substring(0, 8) + "*";
                        }
                        MM.Profiles.Search_Pages = UtilitySvc.PageFunc("GetSet", { Rows: pObj.Data, RowsPerPage: MM.Profiles.RowsPerPage });
                        this.BatchFunc("Load", { Data: pObj.Data }); 
                        this.BatchFunc("View");
                        break;
                    default: alert("ProfilesSvc.Profiles._Link * pObj.View_Event=" + pObj.View_Event); break;
                }
                 break;
            case "Change": this.ViewFunc({ Enable: "ChallengeNext" }); break;
            case "Click":
                //console.log("ProfilesSvc.MainFunc.Click * pObj.Control=" + pObj.Control);
                switch (pObj.Control) {
                    case "Arrow":
                        //console.log("ProfilesSvc.MainFunc.Click.Arrow");
                        //console.log("GamesSvc.MainFunc.Click.Arrow");
                        UtilitySvc.PageFunc("Click_Arrow", { Arrow: pObj.Arrow });
                        this.ViewFunc({ PageIdx: MM.Pages.Idx, Msg: "Arrow" });
                        break;
                    case "Button":
                        //console.log("MainFunc.Click.Button * pObj.Button=" + pObj.Button);
                        switch (pObj.Button) {
                            case "Exit": break;
                            case "Back": break;
                            case "Challenge": case "Next":
                                //console.log("ProfilesSvc.ViewFunc.Click_Button.ChallengeNext");
                                //console.log("MM.Pages.Idx=" + MM.Pages.Idx + " * MM.Pages.RowIdx=" + MM.Pages.RowIdx);
                                this.ViewFunc({ Enable: "Exit" });
                                MM.Wiz.OpPhoto_Src = MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].OpPhoto_Src;
                                MM.Wiz.OpUserId = MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].OpUserId;
                                MM.Wiz.OpName = MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].OpName;
                                MM.Wiz.OpGroup = MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].OpGroup;
                                MM.Wiz.OpRating = MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].OpRating;
                                MM.Data = MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx];
                                //console.log("MM.Data=" + JSON.stringify(MM.Data));
                                //console.log("MM.Wiz=" + JSON.stringify(MM.Wiz));
                                //console.log("MM.Wiz.OpPhoto_Src.length=" + MM.Wiz.OpPhoto_Src.length);
                                //console.log("MM.Wiz.OpUserId=" + MM.Wiz.OpUserId);
                                //console.log("MM.Wiz.OpName=" + MM.Wiz.OpName);
                                //console.log("MM.Wiz.OpGroup=" + MM.Wiz.OpGroup);
                                //console.log("MM.Wiz.OpRating=" + MM.Wiz.OpRating);
                                break;
                            case "Save":
                                MM.Data = {
                                    OpPhoto_Src: MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].OpPhoto_Src,
                                    OpUserId: MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].OpUserId,
                                    OpName: MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].OpName,
                                    OpGroup: MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].OpGroup,
                                    OpRating: MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].OpRating
                                }
                                break;
                        }
                        break;
                    case "Row":
                        //console.log("ProfilesSvc.ViewFunc.Click_Row * pObj.RowIdx=" + pObj.RowIdx + " * pObj.Col=" + pObj.Col);
                        //console.log("MM.Pages.Idx=" + MM.Pages.Idx);
                        MM.Profiles.PagesIdx = MM.Pages.Idx;
                        MM.Pages.RowIdx = pObj.RowIdx;
                        switch (pObj.Col) {
                            case "Row":
                            case "Img":
                                MM.Data = {
                                    OpPhoto_Src: MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].OpPhoto_Src,
                                    OpUserId: MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].OpUserId,
                                    OpName: MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].OpName,
                                    OpGroup: MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].OpGroup,
                                    OpRating: MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].OpRating
                                }
                                if (MM.Wiz === null) MM.Wiz = {};
                                //console.log("MM.Wiz=" + JSON.stringify(MM.Wiz));
                                MM.Wiz.OpPhoto_Src = MM.Data.OpPhoto_Src;
                                MM.Wiz.OpUserId = MM.Data.OpUserId;
                                MM.Wiz.OpName = MM.Data.OpName;
                                MM.Wiz.OpGroup = MM.Data.OpGroup;
                                MM.Wiz.OpRating = MM.Data.OpRating;
                                break;
                            case "Select":
                                //console.log("ProfilesSvc.ViewFunc.Click_Row.Select * pObj.RowIdx=" + pObj.RowIdx);
                                //console.log("MM.Pages.SelectedRowIdx=" + MM.Pages.SelectedRowIdx);
                                if (MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].Selected) {
                                    MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].Selected = null;
                                    MM.Pages.Set[MM.Pages.Idx].Selection = null;
                                    this.ViewFunc({ Enable: "ExitBack", Msg: "Clear" });
                                }
                                else {
                                    MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].Selected = true;
                                    MM.Pages.Selected = { PageIdx: MM.Pages.Idx, RowIdx: MM.Pages.RowIdx };
                                    this.ViewFunc({ Enable: "ChallengeNext", Msg: "Select" });
                                    for (var pI = 0; pI < MM.Pages.Set.length; pI++) if (pI != MM.Pages.Idx) MM.Pages.Set[pI].Selection = null;
                                }
                                break;
                        }
                        break;
                }
                break;
        }
    }
    this.BatchFunc = function(pEvent, pObj) {
        switch (pEvent) {
            case "View":
                switch ($location.path()) {
                    case "/History":
                        this.ViewFunc({ View: "Profiles", Switch: "History", Show: "Arrows", Buttons: "ExitChallenge", Enable: "Exit", Msg: "Init" });
                        break;
                    case "/Players":
                        this.ViewFunc({ View: "Profiles", Switch: "Search", Show: "Arrows", Buttons: "ExitBackChallenge", Enable: "ExitBack", Msg: "Init" });
                        break;
                    case "/Start":
                        this.ViewFunc({ View: "Profiles", Switch: "Search", Show: "Arrows", Buttons: "ExitBackNext", Enable: "ExitBack", Msg: "Init" });
                        break;
                }
                break;
            case "Load":
                //console.clear();
                //console.log("ProfilesSvc.BatchFunc * $location.path()=" + $location.path());
                switch ($location.path()) {
                    case "/History":
                        //console.log("ProfilesSvc.BatchFunc * MM.Profiles.History_Pages=" + JSON.stringify(MM.Profiles.History_Pages));
                        MM.Pages = MM.Profiles.History_Pages;
                        MM.Pages.Idx = 0;
                        MM.Pages.Selected = null;
                        VM.Profiles.Page = MM.Pages.Set[MM.Pages.Idx];
                        //console.log("ProfilesSvc.BatchFunc * VM.History.Show_View=" + VM.History.Show_View);
                        //console.log("ProfilesSvc.BatchFunc * VM.History.Show_Tab=" + VM.History.Show_Tab);
                        break;
                    case "/Players":
                        MM.Pages = MM.Profiles.Search_Pages;
                        MM.Pages.Idx = 0;
                        MM.Pages.Selected = null;
                        VM.Profiles.Page = MM.Pages.Set[MM.Pages.Idx];
                        //console.log("ProfilesSvc.BatchFunc * VM.Players.Show_View=" + VM.Players.Show_View);
                        break;
                    case "/Start":
                        MM.Pages = MM.Profiles.Search_Pages;
                        MM.Pages.Idx = 0;
                        MM.Pages.Selected = null;
                        VM.Profiles.Page = MM.Pages.Set[MM.Pages.Idx];
                        //console.log("ProfilesSvc.BatchFunc * VM.Start.Show_View=" + VM.Start.Show_View);
                        break;
                }
                //console.log("ProfilesSvc.BatchFunc * VM.Profiles.Switch=" + VM.Profiles.Switch);
                //console.log("ProfilesSvc.BatchFunc * VM.Profiles.BigMsg=" + VM.Profiles.BigMsg);
                //console.log("ProfilesSvc.BatchFunc * VM.Profiles.BigMsg_Label.NgStyle=" + JSON.stringify(VM.Profiles.BigMsg_Label.NgStyle));
                //console.log("ProfilesSvc.BatchFunc * VM.Profiles.Table.NgStyle=" + JSON.stringify(VM.Profiles.Table.NgStyle));
                //console.log("ProfilesSvc.BatchFunc * VM.Profiles.Page.length=" + VM.Profiles.Page.length);
                break;
        }
    }

    this.SizeFunc = function (pEvent, pObj) {
        //console.log("ProfilesSvc.MainFunc.SizeFunc");
        if (GM.Sized.Profiles) return;
        GM.Sized.Profiles = true;
    }
    this.ViewFunc = function (pObj) {
        if (pObj.URL != null) {
            switch (pObj.URL) {
                //case "Players": $location.url("/Players"); break;
                //case "Start": $location.url("/Start"); break;
                default: alert("ProfilesSvc.ViewFunc * Unknown pObj.URL=" + pObj.URL); break;
            }
        }
        if (pObj.View != null) {
            //console.log("ProfilesSvc.ViewFunc * $location.path()=" + $location.path() + " * pObj.View=" + pObj.View);
            MM.View = pObj.View;
            switch ($location.path()) {
                case "/Players":
                    VM.Players.Show_View = pObj.View;
                    MM.RowsPerPage = MM.Profiles.RowsPerPage;
                    VM.Profiles.Table = MM.Table;
                    VM.Profiles.TD = MM.TD;
                    VM.Profiles.TDI = MM.TDI;
                    VM.Profiles.Exit = MM.ButtonL;
                    VM.Profiles.Back = MM.ButtonC;
                    VM.Profiles.Challenge = MM.ButtonR;
                    VM.Profiles.Next = MM.ButtonR;
                    VM.Profiles.View = MM.ButtonR;
                    VM.Start.Show_View = pObj.View; break;
                    break;
                case "/Start":
                    MM.RowsPerPage = MM.Profiles.RowsPerPage;
                    VM.Profiles.Table = MM.Table;
                    VM.Profiles.TD = MM.TD;
                    VM.Profiles.TDI = MM.TDI;
                    VM.Profiles.Exit = MM.ButtonL;
                    VM.Profiles.Back = MM.ButtonC;
                    VM.Profiles.Challenge = MM.ButtonR;
                    VM.Profiles.Next = MM.ButtonR;
                    VM.Profiles.View = MM.ButtonR;
                    VM.Start.Show_View = pObj.View; break;
                case "/History":
                    MM.RowsPerPage = MM.History.RowsPerPage;
                    VM.History.Show_View = "Tabs";
                    VM.History.Show_Tab = pObj.View;
                    MM.RowsPerPage = MM.History.RowsPerPage;
                    VM.Profiles.Table = MM.Table_Tab;
                    VM.Profiles.TD = MM.TD_Tab;
                    VM.Profiles.TDI = MM.TDI_Tab;
                    VM.Profiles.Exit = MM.ButtonTL;
                    VM.Profiles.Back = MM.ButtonTC;
                    VM.Profiles.Challenge = MM.ButtonTR;
                    VM.Profiles.Next = MM.ButtonTR;
                    VM.Profiles.View = MM.ButtonTR;
                    break;
                default: alert("ProfilesSvc.ViewFunc.View * $location.path()=" + $location.path()); break;
            }

              
        }
        if (pObj.Switch != null) {
            //console.log("ProfilesSvc.ViewFunc * pObj.Switch=" + pObj.Switch);
            switch (pObj.Switch) {
                case "History":
                case "Search": VM.Profiles.Switch = (MM.Pages.Set[0].length == 0) ? "BigMsg" : pObj.Switch; break;
                case "BigMsg": VM.Profiles.Switch = "BigMsg"; break;
                default: alert("VM.Profiles * pObj.Switch=" + pObj.Switch); break;
            }
            //console.log("ProfilesSvc.ViewFunc * VM.Profiles.Switch=" + VM.Profiles.Switch);
        }
        if (pObj.PageIdx != null) {
            MM.Pages.Idx = pObj.PageIdx;
            VM.Profiles.Page = MM.Pages.Set[MM.Pages.Idx];
            this.ViewFunc({ Show: "Arrows" });
        }
        if (pObj.Show) {
            //console.log("ProfilesSvc.ViewFunc * pObj.Show=" + pObj.Show);
            switch (pObj.Show) {
                case ("Arrows"): UtilitySvc.PageFunc("ShowArrows"); break;
            }    
        }
        if (pObj.Enable != null) {
            //console.log("ProfilesSvc.ViewFunc * pObj.Enable=" + JSON.stringify(pObj.Enable));
            switch (pObj.Enable) {
                case "*":
                    VM.Profiles.Disabled = MM.Processing;
                    if (MM.Data.RowIdx === null) VM.Profiles.Next_Disabled = true;
                    else VM.Profiles.Next_Disabled = false;
                    break;
                case "Back":
                    switch ($location.path()) {
                        case "/History": this.ViewFunc({ View: "Profiles", Enable: "Exit", Msg: "Back" }); break;
                        case "/Players": this.ViewFunc({ View: "Profiles", Enable: "ExitBackChallenge", Msg: "Back" }); break;
                        case "/Start": this.ViewFunc({ View: "Profiles", Enable: "ExitBackNext", Msg: "Back" }); break;
                    }
                    break;
                case "Exit":
                    VM.Profiles.Back_Disabled = true;
                    VM.Profiles.Board_Disabled = true;
                    VM.Profiles.Challenge_Disabled = true;
                    VM.Profiles.Next_Disabled = true;
                    VM.Profiles.Profile_Disabled = true;
                    VM.Profiles.View_Disabled = true;
                    break;
                case "ExitBack":
                    VM.Profiles.Back_Disabled = false;
                    VM.Profiles.Board_Disabled = true;
                    VM.Profiles.Challenge_Disabled = true;
                    VM.Profiles.Next_Disabled = true;
                    VM.Profiles.Profile_Disabled = true;
                    VM.Profiles.View_Disabled = true;
                    break;
                case "ExitChallenge":
                    VM.Profiles.Back_Disabled = true;
                    VM.Profiles.Board_Disabled = true;
                    VM.Profiles.Challenge_Disabled = false;
                    VM.Profiles.Next_Disabled = true;
                    VM.Profiles.Profile_Disabled = true;
                    VM.Profiles.View_Disabled = true;
                    break;
                case "ExitBackView":
                    //console.log("pObj.Buttons.ExitBackView");
                    VM.Profiles.Back_Disabled = false;
                    VM.Profiles.Board_Disabled = true;
                    VM.Profiles.Challenge_Disabled = true;
                    VM.Profiles.Next_Disabled = true;
                    VM.Profiles.Profile_Disabled = true;
                    VM.Profiles.View_Disabled = false;
                    break;
                case "ExitBackChallenge":
                    //console.log("pObj.Buttons.ExitBackChallenge");
                    VM.Profiles.Back_Disabled = false;
                    VM.Profiles.Board_Disabled = true;
                    VM.Profiles.Challenge_Disabled = false;
                    VM.Profiles.Next_Disabled = true;
                    VM.Profiles.Profile_Disabled = true;
                    VM.Profiles.View_Disabled = true;
                    break;
                case "ExitBackNext":
                    //console.log("pObj.Buttons.ExitBackChallenge");
                    VM.Profiles.Back_Disabled = false;
                    VM.Profiles.Board_Disabled = true;
                    VM.Profiles.Challenge_Disabled = false;
                    VM.Profiles.Next_Disabled = false;
                    VM.Profiles.Profile_Disabled = true;
                    VM.Profiles.View_Disabled = true;
                    break;
                case "ExitBoardProfile":
                    //console.log("pObj.Buttons.BackBoardProfile");
                    VM.Profiles.Back_Disabled = false;
                    VM.Profiles.Board_Disabled = true;
                    VM.Profiles.Challenge_Disabled = true;
                    VM.Profiles.Next_Disabled = true;
                    VM.Profiles.Profile_Disabled = false;
                    VM.Profiles.View_Disabled = true;
                    break;
                case "ChallengeNext":
                    //console.log("pObj.Buttons.BackBoardProfile");
                    VM.Profiles.Next_Disabled = false;
                    VM.Profiles.Challenge_Disabled = false;
                    break;
                default: alert("VM.Profiles.ViewFunc * pObj.Enable=" + pObj.Enable); break;
            }
        }



        if (pObj.Buttons != null) {
            //console.log("ProfilesSvc.ViewFunc * pObj.Buttons=" + pObj.Buttons);
            switch (pObj.Buttons) {
                case "ExitChallenge":
                    VM.Profiles.Back_Show = false;
                    VM.Profiles.Board_Show = false;
                    VM.Profiles.Challenge_Show = true;
                    VM.Profiles.Next_Show = false;
                    VM.Profiles.Profile_Show = false;
                    VM.Profiles.View_Show = false;
                    break;
                case "ExitBackNext":
                    VM.Profiles.Back_Show = true;
                    VM.Profiles.Board_Show = false;
                    VM.Profiles.Challenge_Show = false;
                    VM.Profiles.Next_Show = true;
                    VM.Profiles.Profile_Show = false;
                    VM.Profiles.View_Show = false;
                    break;
                case "ExitBackView":
                    //console.log("pObj.Buttons.ExitBackView");
                    VM.Profiles.Back_Show = true;
                    VM.Profiles.Board_Show = false;
                    VM.Profiles.Challenge_Show = false;
                    VM.Profiles.Next_Show = false;
                    VM.Profiles.Profile_Show = false;
                    VM.Profiles.View_Show = true;
                    break;
                case "ExitBackChallenge":
                    //console.log("pObj.Buttons.ExitBackChallenge");
                    VM.Profiles.Back_Show = true;
                    VM.Profiles.Board_Show = false;
                    VM.Profiles.Challenge_Show = true;
                    VM.Profiles.Next_Show = false;
                    VM.Profiles.Profile_Show = false;
                    VM.Profiles.View_Show = false;
                    //console.log("xxxxVM.Profiles.Challenge_Show=" + VM.Profiles.Challenge_Show);
                    break;
                case "ExitBoardProfile":
                    //console.log("pObj.Buttons.BackBoardProfile");
                    VM.Profiles.Back_Show = true;
                    VM.Profiles.Board_Show = true;
                    VM.Profiles.Challenge_Show = false;
                    VM.Profiles.Next_Show = false;
                    VM.Profiles.Profile_Show = true;
                    VM.Profiles.View_Show = false;
                    //console.log("xxxxVM.Profiles.Challenge_Show=" + VM.Profiles.Challenge_Show);
                    break;


                default: alert("VM.Profiles.ViewFunc * pObj.Buttons=" + pObj.Buttons); break;
            }
            //console.log("VM.Profiles.Back_Show=" + VM.Profiles.Back_Show);
            //console.log("VM.Profiles.Challenge_Show=" + VM.Profiles.Challenge_Show);
            //console.log("VM.Profiles.Next_Show=" + VM.Profiles.Next_Show);
            //console.log("VM.Profiles.View_Show=" + VM.Profiles.View_Show);
        }
        if (pObj.Msg != null) {
            //console.log("ProfilesSvc.ViewFunc * pObj.Msg=" + pObj.Msg);
            switch (pObj.Msg) {
                case "Init":
                    //console.log("ProfilesSvc.ViewFunc.Msg.Init * $location.path()=" + $location.path());
                    switch ($location.path()) {
                        case "/History":
                            //console.log("ProfilesSvc.ViewFunc.Msg.Init./History * MM.History.Loading=" + MM.History.Loading);
                            //console.log("ProfilesSvc.ViewFunc.Msg.Init./History *  MM.Profiles.History_Pages.Rows_Length=" + MM.Profiles.History_Pages.Rows_Length);
                            //console.log("ProfilesSvc.ViewFunc.Msg.Init./History *  MM.Pages.Rows_Length=" + MM.Pages.Rows_Length);
                            //MM.Profiles.History_Pages = { Idx: 0, Set: [[]], Rows_Length: 0, Page: [] };
                            if (MM.History.Loading) $rootScope.Msg = "Loading opponent history...";
                            else if (MM.Pages.Set[0].length == 0) $rootScope.Msg = "You have no opponents.";
                            else if (MM.Pages.Set[0].length == 1) $rootScope.Msg = "You have 1 opponent.";
                            else $rootScope.Msg = "You have " + MM.Pages.Rows_Length + " opponents.";
                            break;
                        case "/Players":
                            if (MM.Pages.Rows_Length === 0) $rootScope.Msg = "Player search yeilded no results.";
                            else if (MM.Pages.Rows_Length == 1) $rootScope.Msg = "Your search yielded 1 player.";
                            else $rootScope.Msg = "Your search yielded " + MM.Pages.Rows_Length + " players.";
                            break;
                        case "/Start":
                            if (MM.Pages.Rows_Length === 0) $rootScope.Msg = "Opponent search yeilded no results.";
                            else if (MM.Pages.Rows_Length == 1) $rootScope.Msg = "Your search yielded 1 opponent.";
                            else $rootScope.Msg = "Your search yielded " + MM.Pages.Rows_Length + " opponents.";
                            break;
                    }
                    break;
                case "Back":
                    switch ($location.path()) {
                        case "/History": $rootScope.Msg = "Exited opponent profile."; break;
                        case "/Players": $rootScope.Msg = "You may select a different player."; break;
                        case "/Start": $rootScope.Msg = "You may select a different opponent."; break;
                    }
                    break;
                case "Select":
                    switch ($location.path()) {
                        case "/Start":
                            $rootScope.Msg = "Select Next to challenge " + MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].OpUserId + " .";
                            break;
                        case "/History":
                        case "/Players":
                            $rootScope.Msg = "You may challenge " + MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].OpUserId + " .";
                            break;
                    }
                    break;
                case "Clear": $rootScope.Msg = "Selection of " + MM.Pages.Set[MM.Pages.Idx][MM.Pages.RowIdx].OpUserId + " cleared."; break;
                case "Arrow":
                    switch ($location.path()) {
                        case "/History":
                            if (MM.Pages.Selected != null) $rootScope.Msg = "You selected " + MM.Pages.Set[MM.Pages.Selected.PageIdx][MM.Pages.Selected.RowIdx].OpUserId + ".";
                            else if (MM.Pages.Set.length === 1) { $rootScope.Msg = "These are your opponents."; }
                            else if (MM.Pages.Idx > 0 && MM.Pages.Idx < MM.Pages.Set.length - 1) $rootScope.Msg = "Page #" + (MM.Pages.Idx + 1) + " of your opponents.";
                            else $rootScope.Msg = (MM.Pages.Idx === 0) ? "xFirst page of your opponents." : "Last page of your opponents.";
                            break;
                        case "/Start":
                            if (MM.Pages.Selected != null) $rootScope.Msg = "You selected " + MM.Pages.Set[MM.Pages.Selected.PageIdx][MM.Pages.Selected.RowIdx].OpUserId + ".";
                            if (MM.Pages.Set.length === 1) { $rootScope.Msg = "Select an opponent."; break; }
                            if (MM.Pages.Idx > 0 && MM.Pages.Idx < MM.Pages.Set.length - 1) $rootScope.Msg = "Page #" + (MM.Pages.Idx + 1) + " of search results.";
                            else $rootScope.Msg = (MM.Pages.Idx === 0) ? "First page of search results." : "Last page of search results.";
                            break;
                        case "/Players":
                            if (MM.Pages.Selected != null) $rootScope.Msg = "You selected " + MM.Pages.Set[MM.Pages.Selected.PageIdx][MM.Pages.Selected.RowIdx].OpUserId + ".";
                            else if (MM.Pages.Set.length === 1) $rootScope.Msg = "Click a player to view, select to challenge."; 
                            else if (MM.Pages.Idx > 0 && MM.Pages.Idx < MM.Pages.Set.length - 1) $rootScope.Msg = "Page #" + (MM.Pages.Idx + 1) + "  of search results.";
                            else $rootScope.Msg = (MM.Pages.Idx === 0) ? "First page of search results." : "Last page of search results.";
                            break;
                    }
                    break;
                case "Info_NoSelection": $rootScope.Msg = "No selection was made."; break;
            }
            VM.Profiles.BigMsg = $rootScope.Msg;
            //console.log("ProfilesSvc.ViewFunc.Msg * VM.Profiles.BigMsg=" + VM.Profiles.BigMsg);
        }
    }
}