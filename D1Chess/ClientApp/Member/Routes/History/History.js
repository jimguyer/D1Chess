angular.module('HistoryMod', [])
    .config(HistoryConfig)
    .directive("historytabsdir", HistoryTabsDir)

    .controller('HistoryCtl', HistoryCtl)
    .service('HistoryWebSvc', HistoryWebSvc)
    .service('HistoryLinkSvc', HistoryLinkSvc)
    .service('HistorySvc', HistorySvc)
;

function HistoryConfig($routeProvider) {
    $routeProvider.when('/History', { templateUrl: '/Client/Views/History/History.html', controller: 'HistoryCtl as VM_History' })

}
function HistoryTabsDir() {
    return { restrict: "E", templateUrl: '/Client/Views/App/Tabs.html', controller: 'HistoryCtl as VM_History' };
}

function HistoryCtl($scope, HistoryLinkSvc) {
    //console.log("HistoryCtl");
    $scope.Tabs = VM.Tabs;
    $scope.History = VM.History;
    $scope.ClickTabMainFunc = function (pTabIdx) { HistoryLinkSvc.RouteFunc("Click_Tab", { TabIdx: pTabIdx }); }
}

function HistoryWebSvc($http, UtilitySvc, HistoryLinkSvc, HistorySvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("HistoryWebSvc.RouteFunc * pEvent = " + pEvent);
        switch (pEvent) {
            case "_Link":
                switch (pObj.View_Event) {
                    case "Member_GetHistory": this.MainFunc("Get", { Event: "History" }); break;
                }
        }
    };

    this.MainFunc = function (pEvent, pObj) {
        //console.log("HistoryWebSvc.MainFunc * pEvent = " + pEvent);
        //console.log("pObj=" + JSON.stringify(pObj));
        switch (pEvent) {
            case "Get":
                var parms = UtilitySvc.WebParmsFunc(pEvent, { Event: pObj.Event });
                $http
                    .get("api/Web", parms)
                    .success(function (pWebReturn) {
                       //console.log("HistoryWebSvc * pWebReturn.Code=" + pWebReturn.Code);
                        if (pWebReturn.Code == "Success") HistoryLinkSvc.RouteFunc("Web", { Event: pObj.Event, Data: pWebReturn.Data });
                        else HistorySvc.RouteFunc("Error", { Event: pObj.Event, Error: pWebReturn.Code });
                    })
                    .error(function () { HistorySvc.RouteFunc("Error", { Event: pObj.Event, Error: "Server" }); });
                break;
        }
    }
}

function HistoryLinkSvc($location, HistorySvc, GamesSvc, ProfilesSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("HistoryLinkSvc.RouteFunc" + " * pEvent=" + pEvent);
        //console.log("pObj = " + JSON.stringify(pObj));
        //console.log("MM.History.Tabs.Idx = " + MM.History.Tabs.Idx);
        switch (pEvent) {
            case "_Link":
                //console.log("HistoryLinkSvc.RouteFunc._Link * pObj.View_Event=" + pObj.View_Event);
                switch (pObj.View_Event) {
                    case "Home_ClickHistory":
                        HistorySvc.RouteFunc(pEvent, { View_Event: pObj.View_Event });
                        this.MainFunc(pEvent, { View_Event: pObj.View_Event });
                        break;
                }
                break;

            case "Hub":
                switch (pObj.Event) {
                    case "Resign": this.ViewFunc({ URL: "History", TabView: "History", View: "Board" }); break;
                }
                break;
            case "Click_Tab":
                //console.log("HistoryLinkSvc.RouteFunc.Click_Tab * pObj.TabIdx=" + pObj.TabIdx);
                HistorySvc.RouteFunc("Click_Tab", { TabIdx: pObj.TabIdx });      
                this.MainFunc(pEvent, { TabIdx: pObj.TabIdx });     
                break;

            case "Web":
                //console.log("HistoryLinkSvc.RouteFunc.Web" + " * pObj.Event=" + pObj.Event);
                switch (pObj.Event) {
                    case "History":
                        HistorySvc.RouteFunc("Web", { Event: "GetHistory", Data: pObj.Data });
                        this.MainFunc("Web", { Event: "GetHistory", Data: pObj.Data });
                        break;
                    case "Resign": this.ViewFunc({ URL: "History", TabView: "History", View: "Board" }); break;
                }
                break;
        }
    };
    this.MainFunc = function (pEvent, pObj) {
        //console.log("HistoryLinkSvc.MainFunc" + " * pEvent=" + pEvent);
        //console.log("pObj = " + JSON.stringify(pObj));
        switch (pEvent) {
            //#region case "_Link":
            case "_Link":
                //console.log("HistoryLinkSvc.MainFunc._Link" + " * pObj.View_Event=" + pObj.View_Event);
                switch (pObj.View_Event) {
                    case "Home_ClickHistory":
                        //console.log("HistoryLinkSvc.MainFunc.Home_ClickHistory" + " * VM.History.Show_Tab=" + VM.History.Show_Tab);
                        switch (VM.History.Show_Tab) {
                            default:
                            case "Profiles": ProfilesSvc.RouteFunc(pEvent, { View_Event: pObj.View_Event }); break;
                            case "Games": GamesSvc.RouteFunc(pEvent, { View_Event: pObj.View_Event }); break;
                        }
                        break;
                }
                break;
                //#endregion
            //#region case "Click_Tab":
            case "Click_Tab":
                //console.log("HistoryLinkSvc.MainFunc.Click_Tab * pObj.TabIdx=" + pObj.TabIdx + " * MM.View=" + MM.View);
                switch (MM.View) {
                    case "Profiles": ProfilesSvc.MainFunc("_Link", { View_Event: "History_ClickTab" }); break;
                    case "Games": GamesSvc.RouteFunc("_Link", { View_Event: "History_ClickTab" }); break;
                }
                break;
                //#endregion

            //#region case "Web":
            case "Web":
                //console.log("HistoryLinkSvc.MainFunc.Web" + " * pObj.Event=" + pObj.Event);
                //console.log("pObj.Data.Profiles.length=" + pObj.Data.Profiles.length);
                //console.log("pObj.Data.Games.length=" + pObj.Data.Games.length);
                //console.log("pObj.Data.Profiles[0].OpPhoto_Src.length=" + pObj.Data.Profiles[0].OpPhoto_Src.length);
                //break;
                switch (pObj.Event) {
                    case "GetHistory":
                        //console.log("HistoryLinkSvc.MainFunc.Web.GetHistory" + " * pObj.Event=" + pObj.Event);
                        MM.History.Loading = false;
                        ProfilesSvc.MainFunc("_Link", { View_Event: "History_WebGetHistory", Data: pObj.Data.Profiles });
                        GamesSvc.RouteFunc("_Link", { View_Event: "History_WebGetHistory", Data: pObj.Data.Games });
                        break;
                }
                break;
        };
    }
}

function HistorySvc($rootScope, $location, UtilitySvc, DMCSvc) {
    this.InitFunc = function () {
        IM.History = { TabSwitch: "Fix" };
        MM.History = { Loading: true, RowsPerPage: 4 };
        MM.History.Tabs = { Idx: 0, Set: "Main", Idx: 0, Left: [], Main: [], Right: [], Show: {} }
        MM.History.Tabs.Main = [{ Name: "Opponents" }, { Name: "Games" }];
        MM.History.Tabs.Include = "/Client/Views/History/HistoryInclude.html";
        VM.History = { Enabled: {}, Show_Tab: "Profiles" };
    }
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("HistorySvc.RouteFunc * pEvent = " + pEvent);
        //console.log("pObj=" + JSON.stringify(pObj));
        switch (pEvent) {
            case "_Link":
                //console.log("HistorySvc.RouteFunc._Link * pObj.View_Event = " + pObj.View_Event);
                switch (pObj.View_Event) {
                    case "Member_Init": this.InitFunc(); break;
                    case "Board_Resign":
                    case "Home_ClickHistory": this.MainFunc(pEvent, { View_Event: pObj.View_Event, Data: pObj.Data }); break;
                }
                break;
            case "Click_Tab": this.MainFunc(pEvent, { "TabIdx": pObj.TabIdx }); break;
            case "Error": MM.Processing = false; this.ViewFunc({ Enable: "*", Msg: "Error_" + pObj.Error }); break;
            case "Web": this.MainFunc(pEvent, { Event: pObj.Event, Data: pObj.Data }); break;
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("HistorySvc.MainFunc * pEvent = " + pEvent + "* pObj=" + JSON.stringify(pObj));
        switch (pEvent) {
            case "_Link":
                //console.log("HistorySvc.MainFunc * pEvent = " + pEvent + "* pObj=" + JSON.stringify(pObj));
                switch (pObj.View_Event) {
                    case "Board_Exit": this.ViewFunc({ View: "Games" }); break;
                    case "Profile_Exit": this.ViewFunc({ View: "Profiles" }); break;
                    case "Home_ClickHistory": this.ViewFunc({ URL: "History", View: "Profiles" }); break;
                }
                break;
            case "Click_Tab": this.ViewFunc({ TabIdx: pObj.TabIdx }); break;
            case "Web":
                //console.log("HistorySvc.MainFunc.Web * pObj.Event=" + pObj.Event);
                switch (pObj.Event) {
                    case "History": break;
                }
                break;
        }
    }
    this.ViewFunc = function (pObj) {
        if (pObj.URL != null) {
            //console.log("HistorySvc.ViewFunc * pObj.URL=" + pObj.URL);
            switch (pObj.URL) {
                case "History":
                    $location.url("/History");
                    VM.Tabs = MM.History.Tabs;
                    MM.Tabs = MM.History.Tabs;
                    break;
                default: alert("HistorySvc.ViewFunc * Unknown pObj.URL=" + pObj.URL); break;
            }
        }
        if (pObj.View != null) {
            //console.log("HistorySvc.ViewFunc * pObj.View=" + pObj.View);
            MM.View = pObj.View;
            switch (pObj.View) {
                case "Profiles": VM.History.Show_View = "Tabs"; MM.Tabs.Idx = 0; break;
                case "Games": VM.History.Show_View = "Tabs"; MM.Tabs.Idx = 1; break;
                default: alert("ProfilesSvc.ViewFunc * Unknown pObj.View=" + pObj.View); break;
            }
            VM.Tabs.Idx = MM.Tabs.Idx;
            VM.History.Show_Tab = MM.View;
            if (VM.History.Show_View == "Tabs") UtilitySvc.TabFunc("Show", { Switch: "Fix" });
        }
        if (pObj.TabIdx != null) {
            //console.log("HistorySvc.ViewFunc * Obj.TabIdx=" + pObj.TabIdx);
            switch (pObj.TabIdx) {
                case 0: this.ViewFunc({ View: "Profiles" }); break;
                case 1: this.ViewFunc({ View: "Games" }); break;
            }
        }
        if (pObj.Msg != null) {
            switch (pObj.Msg) {
                case "Error_Server": $rootScope.Msg = "History server error."; break;
                default: alert("History unknown pObj.Msg=" + pObj.Msg); break;
            }
        }

    }
}
