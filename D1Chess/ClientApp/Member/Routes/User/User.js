angular.module('UserMod', [])
    .config(UserConfig)
    .directive('usertabsdir', UserTabsDir)
    .controller('UserCtl', UserCtl)
    .service('UserWebSvc', UserWebSvc)
    .service('UserLinkSvc', UserLinkSvc)
    .service('UserSvc', UserSvc)
;

function UserConfig($routeProvider) {
    $routeProvider.when('/User', { templateUrl: '/Client/Views/User/User.html', controller: 'UserCtl as VM_User' })
}

function UserTabsDir() {
    return { restrict: "E", templateUrl: '/Client/Views/App/Tabs.html', controller: 'UserCtl as VM_User' };
}

function UserCtl($scope, UserWebSvc, UserLinkSvc, UserSvc) {
    //console.log("UserCtrl");
    $scope.Tabs = VM.Tabs;
    $scope.User = VM.User;
    $scope.ClickTabMainFunc = function (pIdx) { UserLinkSvc.RouteFunc("Click", { Control: "Tab", Idx: pIdx }); }
}

function UserWebSvc($http, UserLinkSvc, UserSvc, UtilitySvc) {
    this.RouteFunc = function (pEvent, pObj) {
       //console.log("HistoryWebSvc.RouteFunc * pEvent = " + pEvent);
        switch (pEvent) {
            case "_Link":
                switch (pObj.View_Event) {
                    case "Member_GetUser": this.MainFunc("Get", { Event: "User" }); break;
                }
        }
    };
    this.MainFunc = function (pEvent, pObj) {
       //console.log("HistoryWebSvc.MainFunc * pEvent = " + pEvent);
        switch (pEvent) {
            case "Get":
                //console.log("UserWebSvc.MainFunc.Get * pObj.Event = " + pObj.Event);
                var parms = UtilitySvc.WebParmsFunc(pEvent, { Event: pObj.Event });
                $http
                    .get("api/Web", parms)
                    .success(function (pWebReturn) {
                       //console.log("Success * pObj.Event=" + pObj.Event);
                        if (pWebReturn.Code == "Success") UserLinkSvc.RouteFunc("WebGet", { Event: pObj.Event, Data: pWebReturn.Data });
                        else UserSvc.ErrrorFunc("WebGet", { Event: pObj.Event, Error: pWebReturn.Code });
                    })
                    .error(function () { UserSvc.RouteFunc("Error", { Event: pObj.Event, Error: "Server" }); });
                break;
        }
    }
}

function UserLinkSvc($rootScope, $location, UserSvc, UtilitySvc, BoardSvc,
    EmailSvc, GamesSvc, MembershipSvc, OptionsSvc, PasswordSvc, PhoneSvc,
    SearchSvc, StartEmailSvc, StartParmsSvc, UserProfileSvc, UserProfilesSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("UserLinkSvc.RouteFunc * pEvent = " + pEvent);
        //console.log("UserLinkSvc.RouteFunc * pObj=" + JSON.stringify(pObj));
        switch (pEvent) {
            case "_Link":
                //console.log("UserLinkSvc.RouteFunc._Link * pObj=" + JSON.stringify(pObj));
                switch (pObj.View_Event) {
                    case "Home_ClickUser":
                        UserSvc.RouteFunc(pEvent, { View_Event: pObj.View_Event });
                        this.MainFunc(pEvent, { View_Event: pObj.View_Event });
                        //console.log("UserLinkSvc.RouteFunc._Link * MM.View=" + MM.View);
                        break;
                }
                break;
            case "Click":
                //console.log("UserLinkSvc.RouteFunc.Click * pObj=" + JSON.stringify(pObj));
                switch (pObj.Control) {
                    case "Tab":
                        UserSvc.RouteFunc(pEvent, { Control: "Tab", Idx: pObj.Idx });
                        this.MainFunc(pEvent, { Control: "Tab", Idx: pObj.Idx });
                        break;
                }
                break;

            case "WebGet":
                //console.log("UserLinkSvc.RouteFunc.WebGet * pObj.Event = " + pObj.Event);
                switch (pObj.Event) {
                    case "User":
                        UserSvc.RouteFunc("Web", { Event: "GetUser", Data: pObj.Data });
                        this.MainFunc("Web", { Event: "GetUser", Data: pObj.Data });
                        break;
                }
                break;
        }
    };
    this.MainFunc = function (pEvent, pObj) {
        //console.log("UserLinkSvc.MainFunc * pEvent = " + pEvent);
        //console.log("pObj=" + JSON.stringify(pObj));
        switch (pEvent) {
            case "_Link":
                switch (pObj.View_Event) {
                    case "Home_ClickUser":
                        //console.log("MainFunc._Link.Home_ClickUser * VM.User.Show_Tab=" + VM.User.Show_Tab);
                        switch (VM.User.Show_Tab) {
                            case "Membership": MembershipSvc.RouteFunc("_Link", { View_Event: pObj.View_Event }); break;
                            case "Email": EmailSvc.RouteFunc("_Link", { View_Event: pObj.View_Event }); break;
                            case "Phone": PhoneSvc.RouteFunc("_Link", { View_Event: pObj.View_Event }); break;
                            case "Options": OptionsSvc.RouteFunc("_Link", { View_Event: pObj.View_Event }); break;
                            case "Password": PasswordSvc.RouteFunc("_Link", { View_Event: pObj.View_Event }); break;
                        }
                        break;
                }
                break;
            case "Click":
                switch (pObj.Control) {
                    case "Tab":
                        //console.log("MainFunc.Click.Tab * VM.User.Show_Tab=" + VM.User.Show_Tab);
                        switch (VM.User.Show_Tab) {
                            case "Membership": MembershipSvc.RouteFunc("_Link", { View_Event: "User_ClickTab" }); break;
                            case "Email": EmailSvc.RouteFunc("_Link", { View_Event: "User_ClickTab" }); break;
                            case "Phone": PhoneSvc.RouteFunc("_Link", { View_Event: "User_ClickTab" }); break;
                            case "Options": OptionsSvc.RouteFunc("_Link", { View_Event: "User_ClickTab" }); break;
                            case "Password": PasswordSvc.RouteFunc("_Link", { View_Event: "User_ClickTab" }); break;
                        }
                        break;
                }
                break;

            case "Web":
                switch (pObj.Event) {
                    //*****************************************************************************************************************************************
                    //*****************************************************************************************************************************************
                    //*****************************************************************************************************************************************
                    //*****************************************************************************************************************************************
                    case "GetUser":
                        //console.log("UserLinkSvc.Web.GetUser-----------------------------------------------");
                        // break;
                        if (pObj.Data.UserProfiles.DefaultIdx >= pObj.Data.UserProfiles.List.length) pObj.Data.UserProfiles.DefaultIdx = pObj.Data.UserProfiles.List.length - 1;
                        //console.log("UserLinkSvc.Main.Web.GetUser -----------------------------------------------");
                        //console.log("pObj=" + JSON.stringify(pObj));
                        //console.log("pObj.Data.Membership=" + JSON.stringify(pObj.Data.Membership));
                        //console.log("pObj.Data.Email=" + JSON.stringify(pObj.Data.Email));
                        //console.log("pObj.Data.Phone=" + JSON.stringify(pObj.Data.Phone));
                        //console.log("pObj.Data.Options=" + JSON.stringify(pObj.Data.Options));
                        //console.log("pObj.Data.Games=" + JSON.stringify(pObj.Data.Games));
                        //console.log("pObj.Data.Games.Active=" + JSON.stringify(pObj.Data.Games.Active));      
                        //console.log("pObj.Data.PracticeBoard =" + JSON.stringify(pObj.Data.PracticeBoard));
                        //console.log("UserLinkSvc.MainFunc pObj.Data.UserProfiles.List.length=" + pObj.Data.UserProfiles.List.length);
                        //console.log("*******UserLinkSvc.MainFunc.Web * pObj.Data.UserProfiles.DefaultIdx=" + pObj.Data.UserProfiles.DefaultIdx);
                        MembershipSvc.RouteFunc("_Link", { View_Event: "User_WebGetUser", Data: pObj.Data.Membership });
                        EmailSvc.MainFunc("_Link", { View_Event: "User_WebGetUser", Data: pObj.Data.Email });
                        PhoneSvc.RouteFunc("_Link", { View_Event: "User_WebGetUser", Data: pObj.Data.Phone });
                        OptionsSvc.RouteFunc("_Link", { View_Event: "User_WebGetUser", Data: pObj.Data.Options });
                        StartParmsSvc.RouteFunc("_Link", { View_Event: "User_WebGetUser", Data: pObj.Data.UserProfiles.List[pObj.Data.UserProfiles.DefaultIdx].StartParms });
                        StartEmailSvc.RouteFunc("_Link", { View_Event: "User_WebGetUser", Data: pObj.Data.UserProfiles.List[pObj.Data.UserProfiles.DefaultIdx].StartEmail });
                        SearchSvc.RouteFunc("_Link", { View_Event: "User_WebGetUser", Data: pObj.Data.UserProfiles.List[pObj.Data.UserProfiles.DefaultIdx].Search });
                        GamesSvc.RouteFunc("_Link", { View_Event: "User_WebGetUser", Data: pObj.Data.Games });
                        //*****************************************************************************************************************************************
                        pObj.Data.Practice.Photo_Src = pObj.Data.UserProfiles.List[pObj.Data.UserProfiles.DefaultIdx].Photo_Src;
                        UserProfilesSvc.RouteFunc("_Link", { View_Event: "User_WebGetUser", Data: pObj.Data.UserProfiles });


                        //console.log("xxxxxxxxxxxxxxxxUserLinkSvc.MainFunc.Web * pObj.Data.UserProfiles.DefaultIdx=" + pObj.Data.UserProfiles.DefaultIdx);
                        UserProfileSvc.RouteFunc("_Link", { View_Event: "User_WebGetUser", Data: pObj.Data.UserProfiles.DefaultIdx });
                        //*****************************************************************************************************************************************
                        //Board must load last to get Photos from UserProfile

                        BoardSvc.RouteFunc("_Link", { View_Event: "User_WebGetUser", Data: pObj.Data.Practice });
                        //*****************************************************************************************************************************************
                        MM.User.Loading = false;
                        //console.log("MM.Games.History_Loading=" + MM.Games.History_Loading);
                        //console.log("User data has been loaded -----------------------------------------------");
                        //$rootScope.Msg = "User data has been loaded.";
                        break;

                }
                //*****************************************************************************************************************************************
                //*****************************************************************************************************************************************
                //*****************************************************************************************************************************************
                //*****************************************************************************************************************************************
                break;
        }
    };
}

function UserSvc($rootScope, $location, StylesSvc, UtilitySvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("UserSvc.RouteFunc" + " * pEvent=" + pEvent);
        switch (pEvent) {
            case "_Link":
                //console.log("UserSvc.RouteFunc" + " * pObj.View_Event=" + pObj.View_Event);
                switch (pObj.View_Event) {
                    case "Member_Init": this.InitFunc(); break;
                    case "Member_Size": this.InitFunc(); break;
                    case "Home_ClickUser":
                    case "User_WebGetUser": this.MainFunc(pEvent, { View_Event: pObj.View_Event, Data: pObj.Data }); break;
                }
                break;
            case "Click":
                switch (pObj.Control) {
                    case "Tab": this.MainFunc(pEvent, { Control: pObj.Control, Idx: pObj.Idx }); break;
                }
                break;
            case "Web": this.MainFunc(pEvent, { View_Event: pObj.View_Event, Data: pObj.Data }); break;
        }
    }
    this.InitFunc = function () {
        //console.log("UserSvc.Init");
        IM.User = { TabSwitch: "Fix" };
        MM.User = { Loading: true };
        MM.User.Tabs = { Idx: 0, Set: "Main", Left: [], Main: [], Right: [], Show: {} }
        MM.User.Tabs.Main = [{ Name: "Member" }, { Name: "Email" }, { Name: "Phone" }, { Name: "Opts" }, { Name: "Pwd" }];
        MM.User.Tabs.Include = "/Client/Views/User/UserInclude.html";
        VM.User = { Enabled: {}, Show: {} };
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("UserLinkSvc.MainFunc * pEvent = " + pEvent);
        switch (pEvent) {
            case "_Link":
                //console.log("UserSvc.MainFunc._Link * pObj.View_Event=" + pObj.View_Event);
                switch (pObj.View_Event) {
                    case "Home_ClickUser":
                        this.ViewFunc({ URL: "User", View: "Tabs", TabSet: "Main", TabIdx: MM.User.Tabs.Idx });
                        StylesSvc.SizeFunc(VM.Tabs.Div_Table); StylesSvc.SizeFunc(VM.Tabs.Table); StylesSvc.SizeFunc(VM.Tabs.Div); 
                        break;
                }
                //console.log("VM.Tabs.Div_Table=" + JSON.stringify(VM.Tabs.Div_Table));
                //console.log("VM.Tabs.Table=" + JSON.stringify(VM.Tabs.Table));
                //console.log("VM.Tabs.Div=" + JSON.stringify(VM.Tabs.Div));
                break;
            case "Click":
                //console.log("UserSvc.MainFunc.Click * pObj=" + JSON.stringify(pObj));
                //console.log("UserSvc.MainFunc._Link * MM.User.Tabs.Idx=" + MM.User.Tabs.Idx);
                switch (pObj.Control) {
                    case "Tab": this.ViewFunc({ Control: pObj.Control, TabSet: "Main", TabIdx: pObj.Idx }); break;
                }
                break;
        }
    }
    this.SizeFunc = function (pObj) {
        //console.log("UserLinkSvc.SizeFunc * pEvent = " + pEvent);
    }
    this.ViewFunc = function (pObj) {
        //console.log("UserLinkSvc.ViewFunc * pObj=" + JSON.stringify(pObj));
        if (pObj.URL != null) {
            //console.log("Obj.URL=" + pObj.URL); 
            switch (pObj.URL) {
                case "User":
                    $location.url("/User");
                    VM.Tabs = MM.User.Tabs;
                    MM.Tabs = MM.User.Tabs;
                    //console.log("VM.Tabs=" + JSON.stringify(VM.Tabs));
                    break;
                default:
                    alert("Unknown pObj.URL=" + pObj.URL);
                    break;
            }
        }
        if (pObj.View != null) {
            //console.log("Obj.View=" + pObj.View); 
            switch (pObj.View) {
                case "Membership": VM.User.Show_View = "Tabs"; MM.Tabs.Idx = 0; break;
                case "Email": VM.User.Show_View = "Tabs"; MM.Tabs.Idx = 1; break;
                case "Phone": VM.User.Show_View = "Tabs"; MM.Tabs.Idx = 2; break;
                case "Options": VM.User.Show_View = "Tabs"; MM.Tabs.Idx = 3; break;
                case "Password": VM.User.Show_View = "Tabs"; MM.Tabs.Idx = 4; break;
            }
            MM.View = pObj.View;
            VM.User.Show_Tab = MM.View;
            if (VM.User.Show_View == "Tabs") UtilitySvc.TabFunc("Show", { Switch: "Fix" });
        }
        if (pObj.TabIdx != null) {
            //console.log("Obj.TabIdx=" + pObj.TabIdx); 
            switch (pObj.TabIdx) {
                default:
                case 0: this.ViewFunc({ View: "Membership" }); break;
                case 1: this.ViewFunc({ View: "Email" }); break;
                case 2: this.ViewFunc({ View: "Phone" }); break;
                case 3: this.ViewFunc({ View: "Options" }); break;
                case 4: this.ViewFunc({ View: "Password" }); break;
            }
        }
        if (pObj.Msg != null) {
            switch (pObj.Msg) {
                case "Error_Server": $rootScope.Msg = "Server error."; break;
            }
        }
    };
}