angular.module('SearchMod', [])
    .directive('searchdir', SearchDir)
    .controller('SearchCtl', SearchCtl)
    .service('SearchWebSvc', SearchWebSvc)
    .service('SearchLinkSvc', SearchLinkSvc)
    .service('SearchSvc', SearchSvc)
;

function SearchDir() {
    return { restrict: "E", templateUrl: '/Client/Views/Search/Search.html', controller: 'SearchCtl as VM_Search' };
}

function SearchCtl($scope, SearchWebSvc, SearchLinkSvc, SearchSvc) {
    $scope.Search = VM.Search;
    GM.Scope = $scope;
    this.ChangeFunc = function () { SearchSvc.RouteFunc("Change"); }
    this.ClickSearchFunc = function () { SearchWebSvc.RouteFunc("Click", { Control: "Button", Button: "Search" }); }
    this.ClickExitFunc = function () { SearchLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Exit" }); }
    this.ClickBackFunc = function () { SearchLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Back" }); }
}

function SearchWebSvc($http, SearchLinkSvc, SearchSvc, UtilitySvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("SearchWebSvc.RouteFunc * pEvent=" + pEvent);
        switch (pEvent) {
            case "Click":
                //console.log("SearchWebSvc.RouteFunc.Click * pObj.Control=" + pObj.Control);
                switch (pObj.Control) {
                    case "Button":
                        SearchSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        switch (pObj.Button) {
                            case "Search": this.MainFunc("Post", { Event: "Search", Data: MM.Data  }); break;
                        }
                        break;
                }
                break;
        }
    };
    this.MainFunc = function (pEvent, pObj) {
        switch (pEvent) {
            case "Post":
                //console.log("SearchWebSvc.MainFunc.Post" + " * pObj.Event=" + pObj.Event + " * Data=" + JSON.stringify(pObj.Data));
                var parms = UtilitySvc.WebParmsFunc(pEvent, { Event: pObj.Event, Data: pObj.Data });
                $http
                    .post("api/Web", parms)
                    .success(function (pWebReturn) {
                        //console.log("SearchWebSvc.MainFunc.Post.Success" + " * pWebReturn.Code=" + pWebReturn.Code + " * pWebReturn.Data=" + JSON.stringify(pWebReturn.Data));
                        if (pWebReturn.Code == "Success")
                            SearchLinkSvc.RouteFunc("Web", { Event: pObj.Event, Data: pWebReturn.Data });
                        else
                            SearchSvc.ViewFunc({ Enable: "*", Msg: "Error_" + pWebReturn.Code })
                    })
                    .error(function () { MM.Processing = false; SearchSvc.ViewFunc({ Enable: "*", Msg: "Error_Server" }); })
                break;
        }
    }
}

function SearchLinkSvc($location, SearchSvc, HomeSvc, HistorySvc, ProfilesSvc, SearchSvc, StartParmsSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("SearchLinkSvc.RouteFunc * pEvent=" + pEvent);
        switch (pEvent) {
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                       //console.log("SearchLinkSvc.RouteFunc.Click.Button" + " * pObj.Button=" + pObj.Button);
                        SearchSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        break;
                }
                break;
            case "Web":
                //console.log("SearchLinkSvc.RouteFunc.Web * pObj.Event=" + pObj.Event);
                SearchSvc.RouteFunc(pEvent, { Event: pObj.Event, Data: pObj.Data });
                this.MainFunc(pEvent, { Event: pObj.Event });
                break;
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("SearchLinkSvc.MainFunc * pEvent=" + pEvent);
        switch (pEvent) {
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        switch (pObj.Button) {
                            case "Back":
                               //console.log("SearchLinkSvc.MainFunc.Click.Button.Back" + " * $location.path()=" + $location.path());
                                switch ($location.path()) {
                                    case "/History": HistorySvc.MainFunc("_Link", { View_Event: "History_ClickBack" }); break;
                                    case "/Players": HomeSvc.RouteFunc("_Link", { View_Event: "Players_ClickBack" }); break;
                                    case "/Start": StartParmsSvc.RouteFunc("_Link", { View_Event: "Search_ClickBack" }); break;
                                }
                                break;

                            case "Exit":
                               //console.log("SearchLinkSvc.MainFunc.Click.Button.Exit" + " * $location.path()=" + $location.path());
                                switch ($location.path()) {
                                    case "/History": HistorySvc.MainFunc("_Link", { View_Event: "History_ClickExit" }); break;
                                    case "/Players": HomeSvc.RouteFunc("_Link", { View_Event: "Players_ClickExit" }); break;
                                    case "/Start": HomeSvc.RouteFunc("_Link", { View_Event: "Start_ClickExit" }); break;
                                }
                                break;
                        }
                }
                break;

            case "Web":
                //console.log("SearchLinkSvc.MainFunc.Web * pObj.Event=" + pObj.Event);
                switch (pObj.Event) {
                    case "Search": ProfilesSvc.RouteFunc("_Link", { View_Event: "Search_WebSearch", Data: MM.Data }); break;
                }
                break;
        }
    };
}

function SearchSvc($rootScope, $location, StylesSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("SearchSvc.RouteFunc * pEvent=" + pEvent);
        switch (pEvent) {
            case "_Link":
                //console.log("SearchSvc.RouteFunc._Link * pObj.View_Event=" + pObj.View_Event);
                switch (pObj.View_Event) {
                    case "Member_Init": this.InitFunc(); break;
                    case "Member_Size": this.SizeFunc(); break;
                    case "Home_ClickPlayers": 
                    case "Profiles_ClickBack": 
                    case "StartParms_WebSave": 
                    case "User_WebGetUser": this.MainFunc(pEvent, { View_Event: pObj.View_Event, Data: pObj.Data }); break;
                }
                break;
            case "Change": this.MainFunc(pEvent); break;

            case "Click":
                //console.log("SearchSvc.RouteFunc.Click * pObj.Control=" + pObj.Control);
                switch (pObj.Control) {
                    case "Button": this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button }); break;       
                }
                break;
            case "Web": this.MainFunc(pEvent, { Event: pObj.Event, Data: pObj.Data }); break;
        }
    }
    this.InitFunc = function () {
        //console.log("SearchSvc.InitFunc");
        MM.Search = { Loading: true, RowsPerPage: 5 };
        VM.Search = {};

        //#region Types
        VM.Search.ByFieldSet = StylesSvc.InitFunc({ Type: "FieldSet", H: 5.25 });
        VM.Search.ByLegend_Text = StylesSvc.InitFunc({ Type: "Legend" });
        var xL = 2, wL = 4, fs = 1;
        var xR = xL + wL + .15, wR = 9 - xR - xL;
        var yAdd = 1;

        var y = 2.75;
        VM.Search.UserId_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Search.UserId_Radio = StylesSvc.InitFunc({ Type: "Radio", Pos: "F", X: xR, Y: y });
        y += yAdd;
        VM.Search.FirstName_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Search.FirstName_Radio = StylesSvc.InitFunc({ Type: "Radio", Pos: "F", X: xR, Y: y });
        y += yAdd;
        VM.Search.LastName_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Search.LastName_Radio = StylesSvc.InitFunc({ Type: "Radio", Pos: "F", X: xR, Y: y });
        y += yAdd;
        VM.Search.Group_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Search.Group_Radio = StylesSvc.InitFunc({ Type: "Radio", Pos: "F", X: xR, Y: y });
        //*******************************************************************************
        y += yAdd * 2; VM.Search.TextFieldSet = StylesSvc.InitFunc({ Type: "FieldSet", Y: y, H: 2 });

        var xL = .5, wL = 4, fs = 1;
        var xR = xL + wL + .15, wR = 9 - xR - xL;

        y += yAdd * .5;
        VM.Search.Text_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Search.Text_Input = StylesSvc.InitFunc({ Type: "Input", X: xR, Y: y, W: wR, FS: fs });
        //*******************************************************************************
        y += yAdd * 2; VM.Search.RatingLegend_Text = StylesSvc.InitFunc({ Type: "Legend", Y: y });
        y += yAdd * .5; VM.Search.RatingFieldSet = StylesSvc.InitFunc({ Type: "FieldSet", Y: y, H: 3.25 });
        y += yAdd;

        var xL = .5, wL = 4, fs = 1;
        var xR = xL + wL + .15, wR = 2; //9 - xR - xL;
        VM.Search.Min_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Search.Min_Input = StylesSvc.InitFunc({ Type: "Input", X: xR, Y: y, W: wR, FS: fs });
        y += yAdd;
        VM.Search.Max_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Search.Max_Input = StylesSvc.InitFunc({ Type: "Input", X: xR, Y: y, W: wR, FS: fs });

        VM.Search.Exit = MM.ButtonL; VM.Search.Back = MM.ButtonC; VM.Search.Search = MM.ButtonR;
        //#endregion
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("MainFunc * pEvent=" + pEvent);
        switch (pEvent) {

            //#region case "_Link":
            case "_Link":
                //console.log("SearchSvc.MainFunc._Link * pObj.View_Event=" + pObj.View_Event);
                switch (pObj.View_Event) {
                    case "Home_ClickPlayers": this.ViewFunc({ URL: "Players", View: "Search", Buttons: "ExitSearch" }); break;
                    case "Profiles_ClickBack":
                    case "StartParms_WebSave": this.ViewFunc({ View: "Search", Buttons:"ExitBackSearch" }); break;
                    case "User_WebGetUser":
                        //console.log("SearchSvc.MainFunc._Link.User_WebGetUser * pObj.Data=" + JSON.stringify(pObj.Data));
                        VM.Search.By = (pObj.Data.By == null) ? "G" : pObj.Data.By.substr(0, 1);
                        VM.Search.Text = pObj.Data.Text;
                        VM.Search.RatingMin = pObj.Data.RatingMin;
                        VM.Search.RatingMax = pObj.Data.RatingMax;           
                        MM.Search.Loading = false;
                        break;
                }
                if (MM.View == "Search") {
                    this.SizeFunc();
                    this.ViewFunc({ Legend: "*", Enable: "*" });
                    if (MM.Search.Loading) this.ViewFunc({ Msg: "Wait_Loading" });
                     else {
                        if (pObj.View_Event == "Profiles_ClickBack") this.ViewFunc({ Msg: "Info_ChangeParms" }); else this.ViewFunc({ Msg: "Info_EnterParms" });
                    }
                }
                break;
            //#endregion

            case "Change": this.ViewFunc({ Enable: "*", Msg: "Change" }); break;

            //#region case "Click":
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        //console.log("MainFunc.Click.Button * pObj.Button=" + pObj.Button);
                        switch (pObj.Button) {
                            case "Search":
                                MM.UserProfiles.List[MM.UserProfiles.DefaultIdx].Search.By = VM.Search.By;
                                MM.UserProfiles.List[MM.UserProfiles.DefaultIdx].Search.Text = VM.Search.Text;
                                MM.UserProfiles.List[MM.UserProfiles.DefaultIdx].Search.RatingMin = VM.Search.RatingMin;
                                MM.UserProfiles.List[MM.UserProfiles.DefaultIdx].Search.RatingMax = VM.Search.RatingMax;
                                MM.Data = {
                                    By: VM.Search.By,
                                    Text: VM.Search.Text,
                                    RatingMin: VM.Search.RatingMin,
                                    RatingMax: VM.Search.RatingMax
                                }
                                MM.Processing = true;
                                this.ViewFunc({ Enable: "*", "Msg": "Wait_Searching" });
                                //console.log("MM.Data=" + JSON.stringify(MM.Data));
                                break;
                        }
                        break;
                }
                break;
            //#endregion

            //#region case "Web":
            case "Web":
                MM.Processing = false;
                //console.log("SearchSvc.ViewFunc.Web * pObj.Event=" + pObj.Event);
                switch (pObj.Event) {
                    case "Search":
                        //console.log("pObj.Data=" + JSON.stringify(pObj.Data));
                        //console.log("pObj.Data.length=" + JSON.stringify(pObj.Data.length));
                        MM.Data = pObj.Data;
                        this.ViewFunc({ "Msg": "Wait_LoadingResults" });
                        break;
                }
                break;
            //#endregion

        }
    }
    this.SizeFunc = function (pEvent, pObj) {
        //console.log("SearchSvc.SizeFunc * GM.Sized.Search=" + GM.Sized.Search);
        if (GM.Sized.Search) return;
        StylesSvc.SizeFunc(VM.Search.ByFieldSet); StylesSvc.SizeFunc(VM.Search.ByLegend_Text);  
        StylesSvc.SizeFunc(VM.Search.UserId_Label); StylesSvc.SizeFunc(VM.Search.UserId_Radio);
        StylesSvc.SizeFunc(VM.Search.FirstName_Label); StylesSvc.SizeFunc(VM.Search.FirstName_Radio);
        StylesSvc.SizeFunc(VM.Search.LastName_Label); StylesSvc.SizeFunc(VM.Search.LastName_Radio);
        StylesSvc.SizeFunc(VM.Search.Group_Label); StylesSvc.SizeFunc(VM.Search.Group_Radio);
        StylesSvc.SizeFunc(VM.Search.TextFieldSet); StylesSvc.SizeFunc(VM.Search.Text_Label); StylesSvc.SizeFunc(VM.Search.Text_Input);
        StylesSvc.SizeFunc(VM.Search.RatingFieldSet); StylesSvc.SizeFunc(VM.Search.RatingLegend_Text); 
        StylesSvc.SizeFunc(VM.Search.Min_Label); StylesSvc.SizeFunc(VM.Search.Min_Input);
        StylesSvc.SizeFunc(VM.Search.Max_Label); StylesSvc.SizeFunc(VM.Search.Max_Input);
        GM.Sized.Search = true;
    }
    this.ViewFunc = function (pObj) {
        //console.log("SearchSvc.MainFunc.ViewFunc");
        if (pObj.URL != null) {
            //console.log("SearchSvc.MainFunc.ViewFunc * pObj.URL=" + pObj.URL);
            switch (pObj.URL) {
                case "Players": $location.url("/Players"); break;
                case "Start": $location.url("/Start"); break;
                default: alert("Unknown pObj.URL=" + pObj.URL); break;
            }
        }
        if (pObj.View != null) {
            //console.log("SearchSvc.MainFunc.ViewFunc * pObj.View=" + pObj.View);
            MM.View = pObj.View;
            switch ($location.path()) {
                case "/Players": VM.Players.Show_View = pObj.View; break;
                case "/Start": VM.Start.Show_View = pObj.View; break;
                default: alert("SearchSvc.ViewFunc * Unknown pObj.URL=" + pObj.URL); break;
            }
        }
        if (pObj.Legend != null) {
            switch (pObj.Legend) {
                case "*":
                    if (MM.Search.Loading) { VM.Search.ByLegend = "Loading..."; VM.Search.RatingLegend = "Loading..."; }
                    else { VM.Search.ByLegend = "Search By"; VM.Search.RatingLegend = "Rating"; }
                    break;
            }
        }
        if (pObj.Enable != null) {
            switch (pObj.Enable) {
                case "*":
                    if (MM.Processing) VM.Search.Disabled = false;
                    else if (VM.Search.By == null || VM.Search.By == "") VM.Search.Search_Disabled = true;
                    else if (VM.Search.Text == null || VM.Search.Text == "") VM.Search.Search_Disabled = true;
                    else VM.Search.Search_Disabled = false;
                    break;
                default: alert("Unknown pObj.Enable=" + pObj.Enable); break;
            }
        }
        if (pObj.Buttons != null) {
            //console.log("SearchSvc.ViewFunc * pObj.Buttons=" + pObj.Buttons);
            switch (pObj.Buttons) {
                case "ExitSearch": VM.Search.Back_Show = false; break;
                case "ExitBackSearch": VM.Search.Back_Show = true; break;
                default: alert("SearchSvc.ViewFunc * Unknown pObj.Buttons=" + pObj.Buttons); break;
            }
        }
        if (pObj.Msg != null) {
            switch (pObj.Msg) {
                case "Change":
                    if (VM.Search.By == null || VM.Search.By == "") $rootScope.Msg = "You must select a search option.";
                    else if (VM.Search.Text == null || VM.Search.Text == "") $rootScope.Msg = "You must enter a search text.";
                    else
                        switch ($location.path()) {
                            case "/Players": $rootScope.Msg = "Search to find players."; break;
                            case "/Search": $rootScope.Msg = "Search to find an opponent."; break;
                        }
                    break;
                case "Error_NoResults":
                    switch ($location.path()) {
                        case "/Players": $rootScope.Msg = "This search found no players."; break;
                        case "/Search": $rootScope.Msg = "This search found no opponents."; break;
                    }
                    break;
                case "Error_Server": $rootScope.Msg = "Server error."; break;
                case "Error_Unknown": $rootScope.Msg = "WebSearchProfiles - Unknown code returned"; break;
                case "Info_ChangeParms": $rootScope.Msg = "You may change the search options."; break;
                case "Info_EnterParms": $rootScope.Msg = "Enter search parameters options."; break;
                case "Wait_Loading": $rootScope.Msg = "Loading search parameters..."; break;
                case "Wait_LoadingResults": $rootScope.Msg = "Loading results..."; break;
                case "Wait_Searching":
                    switch ($location.path()) {
                        case "/Players": $rootScope.Msg = "Searching for players."; break;
                        case "/Search": $rootScope.Msg = "Searching for opponents."; break;
                    }
                    break;
                default: alert("pObj.Msg=" + pObj.Msg); break;
            }
        }
    }
}