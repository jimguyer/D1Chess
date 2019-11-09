angular.module('UserProfilesMod', [])
    .config(UserProfilesConfig)
    .directive('userprofilestabsdir', UserProfilesTabsDir)
    .controller('UserProfilesCtl', UserProfilesCtl)
    .service('UserProfilesWebSvc', UserProfilesWebSvc)
    .service('UserProfilesLinkSvc', UserProfilesLinkSvc)
    .service('UserProfilesSvc', UserProfilesSvc)
;

function UserProfilesConfig($routeProvider) {
    $routeProvider.when('/UserProfiles', { templateUrl: '/Client/Views/UserProfiles/UserProfiles.html', controller: 'UserProfilesCtl as VM_UserProfiles' })
}

function UserProfilesTabsDir() {
    return { restrict: "E", templateUrl: '/Client/Views/App/Tabs.html', controller: 'UserProfilesCtl', controllerAs: 'VM_UserProfiles' };
}

function UserProfilesCtl($scope, UserProfilesWebSvc, UserProfilesLinkSvc, UserProfilesSvc) {
    //console.log("UserProfilesCtrl");
    $scope.Tabs = VM.Tabs;
    $scope.UserProfiles = VM.UserProfiles;
    $scope.ClickTabLeftFunc = function (pTabIdx) { UserProfilesWebSvc.RouteFunc("Click", { Control: "Tab", TabSet: "Left", TabIdx: pTabIdx }); }
    $scope.ClickTabMainFunc = function (pTabIdx) { UserProfilesLinkSvc.RouteFunc("Click", { Control: "Tab", TabSet: "Main", TabIdx: pTabIdx }); }
    $scope.ClickTabRightFunc = function (pTabIdx) { UserProfilesLinkSvc.RouteFunc("Click", { Control: "Tab", TabSet: "Right", TabIdx: pTabIdx }); }
}

function UserProfilesWebSvc($http, UtilitySvc, UserProfilesSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        switch (pEvent) {
            case "Click":
                switch (pObj.Control) {
                    case "Tab":
                        switch (pObj.TabSet) {
                            case "Left":
                                this.MainFunc("Post", { Event: "DeleteProfile", Data: pObj.Idx });
                                break;
                        }
                        break;
                }
                break;
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        switch (pEvent) {
            case "Post":
                var parms = UtilitySvc.WebParmsFunc(pEvent, { Event: pObj.Event, Data: pObj.Data });
                $http
                    .post("api/Web", parms)
                    .success(function (pReturn) {
                        if (pReturn.Code == "Success")
                            UserProfilesSvc.RouteFunc("Web", { Event: pObj.Event, Data: pWebReturn.Data });
                        else
                            UserProfilesSvc.RouteFunc("Error", { Event: pObj.Event, Error: pWebReturn.Code });
                    })
                    .error(function () { UserProfilesSvc.RouteFunc("Error", { Event: pObj.Event, Error: "Server" }); });
                ;
                break;
        }
    }
}

function UserProfilesLinkSvc($location, HomeSvc, PhotoSvc, UserProfilesSvc, UserProfileSvc, MembershipSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("UserProfilesLinkSvc.RouteFunc * pEvent=" + pEvent + " * pObj.View_Event=" + pObj.View_Event);
        switch (pEvent) {

            //#region case "_Link":
            case "_Link":
                //console.log("UserProfilesSvc.RouteFunc.Link * pObj.View_Event=" + pObj.View_Event);
                switch (pObj.View_Event) {
                    case "Home_ClickProfiles":
                        UserProfilesSvc.RouteFunc(pEvent, { View_Event: pObj.View_Event });
                        UserProfileSvc.RouteFunc(pEvent, { View_Event: pObj.View_Event });
                        break;

                }
                break;
            //#endregion

            //#region   case "Click":
            case "Click":
                switch (pObj.Control) {
                    case "Tab":
                        switch (pObj.TabSet) {
                            case "Main":
                                //console.log("UserProfilesLinkSvc.MainFunc * VM.UserProfiles.Show_Tab=" + VM.UserProfiles.Show_Tab);
                                //console.log("MM.UserProfiles.Tabs=" + JSON.stringify(MM.UserProfiles.Tabs));
                                switch (VM.UserProfiles.Show_Tab) {
                                    case "UserProfile": UserProfileSvc.RouteFunc("_Link", { View_Event: "UserProfiles_ClickTab", TabSet: pObj.TabSet, TabIdx: pObj.TabIdx }); break;
                                    case "Photo": PhotoSvc.RouteFunc("_Link", { View_Event: "UserProfiles_ClickTab", TabSet: pObj.TabSet, TabIdx: pObj.TabIdx }); break;
                                }
                                break;

                            case "Right":
                                //console.log("Click_Tab.Right");
                                //console.log("MM.UserProfiles.Limit=" + JSON.stringify(MM.UserProfiles.Limit));
                                //console.log("MM.UserProfiles.List.length=" + JSON.stringify(MM.UserProfiles.List.length));
                                MM.UserProfiles.Limit = 4;
                                if (MM.UserProfiles.List.length >= MM.UserProfiles.Limit)
                                    MembershipSvc.RouteFunc(pEvent, { Control: pObj.Control, TabSet: pObj.TabSet, TabIdx: pObj.TabIdx }); 
                                else
                                    UserProfilesSvc.RouteFunc(pEvent, { Control: pObj.Control, TabSet: pObj.TabSet, TabIdx: pObj.TabIdx }); 
                                break;
                        }
                        break;
                }
                break;
            //#endregion

            case "Error": MM.Processing = false; this.ViewFunc({ Enable: "*", Msg: "Error_" + pObj.Error }); break;
            case "Web": this.MainFunc(pEvent, { Event: pObj.Event, Data: pObj.Data }); break;
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("UserProfilesLinkSvc.MainFunc * pEvent=" + pEvent);
        switch (pEvent) {
            case "_Link":
                //console.log("UserProfilesLinkSvc.MainFunc._Link * pObj.View_Event=" + pObj.View_Event);
                //console.log("pObj.Data=" + JSON.stringify(pObj.Data));;
                switch (pObj.View_Event) {
                    case "Home_ClickProfiles": UserProfilesSvc.RouteFunc(pEvent, { View_Event: pObj.View_Event }); break;
                    case "User_WebGetUser": UserProfilesSvc.RouteFunc(pEvent, { View_Event: pObj.View_Event }); break;
                }
                break;

            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        switch (pObj.Button) {
                            case "Back": HomeSvc.RouteFunc("_Link", { View_Event: "UserProfile_ClickBack" }); break;
                            case "Exit": HomeSvc.RouteFunc("_Link", { View_Event: "UserProfile_ClickExit" }); break;
                        }
                        break;
                    case "Tab":
                        switch (pObj.TabSet) {
                            case "Left": break;
                            case "Main":
                                //console.log("UserProfilesLinkSvc.MainFunc * VM.UserProfiles.Show_Tab=" + VM.UserProfiles.Show_Tab);
                                //console.log("MM.UserProfiles.Tabs=" + JSON.stringify(MM.UserProfiles.Tabs));
                                switch (VM.UserProfiles.Show_Tab) {
                                    case "UserProfile": UserProfilesSvc.RouteFunc("_Link", { View_Event: "UserProfiles_ClickTab", TabSet: pObj.TabSet, TabIdx: pObj.TabIdx }); break;
                                    case "Photo": PhotoSvc.RouteFunc("_Link", { View_Event: "UserProfiles_ClickTab", TabSet: pObj.TabSet, TabIdx: pObj.TabIdx }); break;
                                }
                                break;

                            case "Right":
                                //console.log("Click_Tab.Right");
                                //console.log("MM.UserProfiles.Limit=" + JSON.stringify(MM.UserProfiles.Limit));
                                //console.log("MM.UserProfiles.List.length=" + JSON.stringify(MM.UserProfiles.List.length));
                                MM.UserProfiles.Limit = 4;
                                if (MM.UserProfiles.List.length >= MM.UserProfiles.Limit)
                                    MembershipSvc.RouteFunc("_Link", { View_Event: "UserProfiles_ClickTab", TabSet: pObj.TabSet, TabIdx: pObj.TabIdx, });
                                else
                                    UserProfilesSvc.RouteFunc("_Link", { View_Event: "UserProfiles_ClickTab", TabSet: pObj.TabSet, TabIdx: pObj.TabIdx, });
                                break;
                        }
                        break;
                }
                break;
        }
    };
}

function UserProfilesSvc($rootScope, $location, UtilitySvc, DMCSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("UserProfilesSvc.RouteFunc * pEvent=" + pEvent + " * pObj.View_Event=" + pObj.View_Event);
        //console.log("pObj=" + JSON.stringify(pObj));
        switch (pEvent) {
            case "_Link":
                //console.log("UserProfilesSvc.RouteFunc.Link * pObj.View_Event=" + pObj.View_Event + " * Data=" + pObj.Data );
                switch (pObj.View_Event) {
                    case "Member_Init": this.InitFunc(); break;
                    case "Member_Size": this.SizeFunc(); break;
                    case "Home_ClickProfiles":
                    case "UserProfile_ClickCancel": this.MainFunc(pEvent, { View_Event: pObj.View_Event }); break;
                    case "User_WebGetUser":
                    case "UserProfile_WebSave":
                    case "UserProfile_WebDefaultSave":  this.MainFunc(pEvent, { View_Event: pObj.View_Event, Data: pObj.Data }); break;
                    case "UserProfile_UserIdChange": this.MainFunc(pEvent, { View_Event: pObj.View_Event, Data: pObj.Data }); break;
                }
                break;
            case "Click":
                switch (pObj.Control) {
                    case "Tab": this.MainFunc(pEvent, { Control: pObj.Control, TabSet: pObj.TabSet, TabIdx: pObj.TabIdx }); break;
                }
                break;
            case "Web":
                //console.log("pObj.Event=" + pObj.Event);
                switch (pObj.Event) {
                    case "Delete": this.MainFunc(pEvent, { View_Event: pObj.View_Event, Data: pObj.Data }); break;
                        MM.UserProfiles.List.splice(MM.UserProfiles.List.length - 1, 1);
                        // Delete from client  *****************************************
                        VM.UserProfiles.Views.splice(VM.UserProfiles.Views.length - 1, 1);
                        // If Last, shift one  *****************************************
                        if (MM.UserProfiles.LastIdx > VM.Tabs.Views.length - 1) {
                            MM.UserProfiles.LastIdx = VM.Tabs.Views.length - 1;
                            ProfilesSvc.CopyFunc(VM.UserProfile, MM.UserProfiles.List[MM.UserProfiles.LastIdx]);
                        }
                        break;

                }
                break;
        }
    }
    this.InitFunc = function () {
        //console.log("UserProfilesSvc.InitFunc");
        IM.UserProfiles = { TabSwitch: "Var" };
        MM.UserProfiles = { Loading: true, DefaultIdx: 0, List: [{}] };
        MM.UserProfiles.Tabs = { Idx: 0, Set: "Main", Idx: 0, Left: [], Main: [], Right: [], Show: {} }
        MM.UserProfiles.Tabs.Main[0] = { Name: "Loading your profiles" };
        MM.UserProfiles.Tabs.Include = "/Client/Views/UserProfiles/UserProfilesInclude.html";

        VM.UserProfiles = { Enabled: {}, Show: {}, Show_View: "UserProfile" };
        VM.UserProfiles.Show_Crop = true;
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("UserProfilesSvc.MainFunc * pEvent=" + pEvent);
        //console.log("pObj=" + JSON.stringify(pObj));
        switch (pEvent) {

            //#region case "_Link":
            case "_Link":
                //console.log("UserProfilesSvc.MainFunc._Link * pObj.View_Event=" + pObj.View_Event);            
                switch (pObj.View_Event) {
                    case "Home_ClickProfiles": this.ViewFunc({ URL: "UserProfiles" }); break; break;
                    case "UserProfile_ClickCancel": if (VM.Tabs.Right.length > 0) VM.Tabs.Right[0].Name = "Add"; break;
                    case "UserProfile_UserIdChange":
                        //console.log("UserProfilesSvc.MainFunc._Link.UserProfile_UserIdChange * pObj.Data=" + pObj.Data);   
                        switch (VM.Tabs.Set) {
                            case "Main": VM.Tabs.Main[MM.Tabs.Idx].Name = pObj.Data; break;
                            case "Right": VM.Tabs.Right[MM.Tabs.Idx].Name = pObj.Data; break;
                        }
                        break;
                    case "UserProfile_WebSave": break;
                    case "UserProfile_WebDefaultSave": break;
                    case "User_WebGetUser":
                        //console.log("UserProfilesSvc.MainFunc._Link.User_WebGetUser");
                        //console.log("pObj=" + JSON.stringify(pObj));

                        //console.log("pObj.Data=" + JSON.stringify(pObj.Data));
                        //console.log("pObj.Data.DefaultIdx=" + pObj.Data.DefaultIdx);
                        //console.log("pObj.Data.Limit=" + pObj.Data.Limit);
                        //console.log("pObj.Data.Max=" + pObj.Data.Max);
                        //console.log("pObj.Data.List.length=" + pObj.Data.List.length);
                        MM.UserProfiles.Tabs.Set = "Main";
                        MM.UserProfiles.Tabs.Idx = pObj.Data.DefaultIdx;
                        MM.UserProfiles.Idx = pObj.Data.DefaultIdx;
                        MM.UserProfiles.DefaultIdx = pObj.Data.DefaultIdx;
                        MM.UserProfiles.Max = pObj.Data.Max;
                        MM.UserProfiles.Limit = pObj.Data.Limit;
                        for (var x = 0; x < pObj.Data.List.length; x++) {
                            MM.UserProfiles.List[x] = pObj.Data.List[x];
                            MM.UserProfiles.Tabs.Main[x] = { Name: pObj.Data.List[x].UserId };
                        }
                        if (pObj.Data.List.length < pObj.Data.Max) MM.UserProfiles.Tabs.Right[0] = { Name: "Add" };
                        MM.UserProfiles.Loading = false;
                        break;
                }
                //console.log("UserProfilesSvc.MainFunc * $location.path()=" + $location.path());
                if ($location.path() == "/UserProfiles") {
                    //console.log("UserProfilesSvc.MainFunc $location.path()==/UserProfiles");
                    VM.Tabs = MM.UserProfiles.Tabs;
                    MM.Tabs = MM.UserProfiles.Tabs;
                    VM.Tabs.Set = "Main";
                    VM.Tabs.Idx = (MM.UserProfiles.DefaultIdx != null) ? MM.UserProfiles.DefaultIdx : 0;
                }
                break;
            //#endregion

            //#region case "Click":
            case "Click":
                switch (pObj.Control) {
                    case "Tab":
                        MM.UserProfiles.Idx = pObj.TabIdx;
                        this.ViewFunc({ TabSet: pObj.TabSet, TabIdx: pObj.TabIdx }); break;
                }
                break;
            //#endregion

            case "EditCancel":
                //console.log("MainFunc.EditCancel");
                //console.log("VM.Tabs.Set=" + VM.Tabs.Set);
                //console.log("MM.UserProfiles.Idx=" + MM.UserProfiles.Idx);
                //console.log("MM.UserProfiles.List.length=" + MM.UserProfiles.List.length);
                switch (VM.Tabs.Set) {
                    case "Main": this.ViewFunc({ Set: "Main", TabView: "UserProfile" }); break;
                    case "Right":
                        VM.Tabs.Right[MM.Tabs.Idx].Name = "Add";
                        this.ViewFunc({ Set: "Main", TabIdx: MM.UserProfiles.Idx });
                        break;
                }
                break;
            case "Error": this.ViewFunc({ Enable: "*", Msg: "Error_" + pObj.Error }); break;

            default: alert("UserProfiles.ViewFunc * Unknown pEvent=" + pEvent);
        }
    }
    this.SizeFunc = function (pEvent, pObj) {
        //console.log("UserProfilesSvc.SizeFunc * pEvent=" + pEvent);
        UtilitySvc.TabFunc("Show", { Switch: IM.UserProfiles.TabSwitch });
    }
    this.ViewFunc = function (pObj) {
        //console.log("UserProfilesSvc.ViewFunc * pObj=" + JSON.stringify(pObj));
        if (pObj.URL != null) {
            switch (pObj.URL) {
                case "UserProfiles":
                    $location.url("/UserProfiles");
                    VM.Tabs = MM.UserProfiles.Tabs;
                    MM.Tabs = MM.UserProfiles.Tabs;
                    VM.Tabs.Set = "Main";
                    VM.Tabs.Idx = (MM.UserProfiles.DefaultIdx != null)? MM.UserProfiles.DefaultIdx: 0;
                    break;
                default:
                    alert("Unknown pObj.URL=" + pObj.URL);
                    break;
            }
        }

        if (pObj.TabSet != null) {
            MM.UserProfiles.Show_View = "Tabs";
            VM.Tabs.Set = pObj.TabSet;
        }
        if (pObj.TabIdx != null) {
            MM.UserProfiles.Show_View = "Tabs";
            MM.Tabs.Idx = pObj.TabIdx;
            switch (pObj.TabSet) {
                case "Main": VM.UserProfiles.Show_Tab = "UserProfile"
                case "Right": VM.UserProfiles.Show_Tab = (pObj.TabIdx < MM.UserProfiles.Limit) ? "UserProfile" : "Membership";
            }
            var tabType = DMCSvc.TabFunc("GetType");

            UtilitySvc.TabFunc("Show", { Switch: IM.UserProfiles.TabSwitch });
            VM.UserProfiles.Show_Tab = (MM.Tabs.Idx < MM.UserProfiles.Limit) ? "UserProfile" : "Membership";
            MM.View = VM.UserProfiles.Show_Tab;
        }
        if (pObj.TabView != null) {
            //console.log("MM.View=" + MM.View);
            MM.View = pObj.TabView;
            VM.UserProfiles.Show_Tab = pObj.TabView;
        }
        if (pObj.Msg != null) {
            switch (pObj.Msg) {
                case "Error_Server": $rootScope.Msg = "Server error."; break;
            }
        }
    }
}
