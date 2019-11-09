angular.module('OptionsMod', [])
    .directive('optionsdir', OptionsDir)
    .controller('OptionsCtl', OptionsCtl)
    .service('OptionsWebSvc', OptionsWebSvc)
    .service('OptionsLinkSvc', OptionsLinkSvc)
    .service('OptionsSvc', OptionsSvc)

;

function OptionsDir() {
    return { restrict: "E", templateUrl: '/Client/Views/Options/Options.html', controller: 'OptionsCtl as VM_Options' };
}

function OptionsCtl($scope, OptionsWebSvc, OptionsLinkSvc, OptionsSvc) {
    $scope.Options = VM.Options;
    GM.Scope = $scope;
    this.ChangeFunc = function () { OptionsSvc.RouteFunc("Change"); }
    this.ClickExitFunc = function () { OptionsLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Exit" }); }
    this.ClickSaveFunc = function () { OptionsWebSvc.RouteFunc("Click", { Control: "Button", Button: "Save" }); }
}

function OptionsWebSvc($http, OptionsLinkSvc, OptionsSvc, UtilitySvc) {
    this.RouteFunc = function (pEvent, pObj) {
        switch (pEvent) {
            case "Click":
                //console.log("OptionsWebSvc.RouteFunc.Click * pObj.Control=" + pObj.Control);
                switch (pObj.Control) {
                    case "Button":
                        OptionsSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        switch (pObj.Button) {
                            case "Save": this.MainFunc("Post", { Event: "OptionsSave", Data: MM.Data }); break;
                        }
                        break;
                }
                break;
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        switch (pEvent) {
            case "Post":
                //console.log("OptionsWebSvc.MainFunc.Post" + " * pObj.Event=" + pObj.Event + " * Data=" + JSON.stringify(pObj.Data));
                var parms = UtilitySvc.WebParmsFunc(pEvent, { Event: pObj.Event, Data: pObj.Data });
                //console.log("OptionsWebSvc.MainFunc.Post" + " * parms=" + JSON.stringify(parms));
                $http
                    .post("api/Web", parms)
                    .success(function (pWebReturn) {
                        if (pWebReturn.Code == "Success") OptionsSvc.RouteFunc("Web", { Event: pObj.Event, Data: pWebReturn.Data });
                        else OptionsSvc.RouteFunc("Error", { Event: pObj.Event, Error: pWebReturn.Code });
                    })
                    .error(function () { OptionsSvc.RouteFunc("Error", { Event: pObj.Event, Error: "Server" }); });
                    ;
                break;
        }
    }
}

function OptionsLinkSvc($location, OptionsSvc, HomeSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        switch (pEvent) {
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        //console.log("SearchLinkSvc.RouteFunc.Click.Button" + " * pObj.Button=" + pObj.Button);
                        OptionsSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        break;
                }
                break;
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("OptionLinkSvc.MainFunc * pEvent = " + pEvent);
        switch (pEvent) {
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        switch (pObj.Button) {
                            case "Exit": HomeSvc.RouteFunc("_Link", { View_Event: "User_ClickExit" }); break;
                        }
                }
                break;
        }
    };
}

function OptionsSvc($rootScope, $location, UtilitySvc, StylesSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("OptionsSvc.RouteFunc * pEvent=" + pEvent);
        switch (pEvent) {
            case "_Link":
                switch (pObj.View_Event) {
                    case "Member_Init": this.InitFunc(); break;
                    case "Member_Size": this.SizeFunc(); break;
                    case "Home_ClickUser":
                    case "User_ClickTab":
                    case "User_WebGetUser": this.MainFunc(pEvent, { View_Event: pObj.View_Event, Data: pObj.Data }); break;
                }
                break;
            case "Change": this.MainFunc(pEvent); break;
            case "Click": this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button }); break;
            case "Error": MM.Processing = false; this.ViewFunc({ Enable: "*", Msg: "Error_" + pObj.Error }); break;
            case "Web": this.MainFunc(pEvent, { Event: pObj.Event, Data: pObj.Data }); break;
        }
    }
    this.InitFunc = function () {
        //console.log("OptionsSvc.Init");
        MM.Options = { Loading: true };
        VM.Options = {};

        //#region Types
        VM.Options.FieldSet = StylesSvc.InitFunc({ Type: "FieldSetT", H: 6.5 });
        VM.Options.Legend_Text = StylesSvc.InitFunc({ Type: "LegendT", X: 3.25, W: 2.5 });

        var addY = 1, xL = 1.5, wL = 5, fsL = .8;
        var xR = xL + wL + .15, wR = 9 - xR - xL;

        var y = 4.25;
        VM.Options.EmailAlerts_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fsL });
        VM.Options.EmailAlerts_CheckBox = StylesSvc.InitFunc({ Type: "CheckBox", Pos: "F", X: xR, Y: y });

        y += addY;
        VM.Options.PhoneAlerts_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fsL });
        VM.Options.PhoneAlerts_CheckBox = StylesSvc.InitFunc({ Type: "CheckBox", Pos: "F", X: xR, Y: y });

        y += addY;
        VM.Options.AudioOn_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fsL });
        VM.Options.AudioOn_CheckBox = StylesSvc.InitFunc({ Type: "CheckBox", Pos: "F", X: xR, Y: y });

        y += addY;
        VM.Options.ShowClock_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fsL });
        VM.Options.ShowClock_CheckBox = StylesSvc.InitFunc({ Type: "CheckBox", Pos: "F", X: xR, Y: y });

        y += addY;
        VM.Options.PostToFacebook_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fsL });
        VM.Options.PostToFacebook_CheckBox = StylesSvc.InitFunc({ Type: "CheckBox", Pos: "F", X: xR, Y: y });

        VM.Options.Exit = MM.ButtonTL; VM.Options.Save = MM.ButtonTR;
        //#endregion 

    }

    this.MainFunc = function (pEvent, pObj) {
        //console.log("OptionsSvc.MainFunc * pEvent=" + pEvent);
        switch (pEvent) {
            //#region case "_Link":
            case "_Link":
                //console.log("OptionsSvc.MainFunc * pEvent=" + pEvent + " * pObj.View_Event=" + pObj.View_Event);
                switch (pObj.View_Event) {
                    case "Home_ClickUser":
                    case "User_ClickTab": this.ViewFunc({ TabView: "Options", Enable: "*" }); break;
                    case "User_WebGetUser":
                        VM.Options.EmailAlerts = pObj.Data.EmailAlerts;
                        VM.Options.PhoneAlerts = pObj.Data.PhoneAlerts;
                        VM.Options.AudioOn = pObj.Data.AudioOn;
                        VM.Options.ClockShow = pObj.Data.ClockShow;
                        VM.Options.PostToFacebook = pObj.Data.PostToFacebook;
                        MM.Options.Loading = false;
                        break;
                }
                if (MM.View == "Options") { this.SizeFunc(); this.ViewFunc({ Legend: "*", Enable: "*" }); }
                break;
            //#endregion


            case "Change": this.ViewFunc({ Enable: "*" }); break;
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        //console.log("OptionsSvc.MainFunc.Click.Button * pObj.Button=" + pObj.Button);
                        switch (pObj.Button) {
                            case "Exit": break;
                            case "Save":
                                MM.Processing = true;
                                MM.Data = {
                                    EmailAlerts: VM.Options.EmailAlerts,
                                    PhoneAlerts: VM.Options.PhoneAlerts,
                                    AudioOn: VM.Options.AudioOn,
                                    ClockShow: VM.Options.ClockShow,
                                    PostToFacebook: VM.Options.PostToFacebook
                                }
                                this.ViewFunc({ Legend: "*", Enable: "*", Msg: "Wait_Save" });
                        }
                        break;
                }
                break;
            case "Web":
                //console.log("OptionsSvc.MainFunc.Web * pObj.Event=" + pObj.Event);
                switch (pObj.Event) {
                    case "OptionsSave":
                        MM.Processing = false;
                        this.ViewFunc({ Legend: "*", Enable: "*", Msg: "Web_Save" })
                 break;
                }
                break;
        }
    }
    this.SizeFunc = function (pEvent, pObj) {
        //console.log("OptionsSvc.SizeFunc * GM.Sized.Search=" + GM.Sized.Search);
        if (GM.Sized.Options) return;
        StylesSvc.SizeFunc(VM.Options.FieldSet); StylesSvc.SizeFunc(VM.Options.Legend_Text);
        StylesSvc.SizeFunc(VM.Options.EmailAlerts_Label); StylesSvc.SizeFunc(VM.Options.EmailAlerts_CheckBox);
        StylesSvc.SizeFunc(VM.Options.PhoneAlerts_Label); StylesSvc.SizeFunc(VM.Options.PhoneAlerts_CheckBox);
        StylesSvc.SizeFunc(VM.Options.AudioOn_Label); StylesSvc.SizeFunc(VM.Options.AudioOn_CheckBox);
        StylesSvc.SizeFunc(VM.Options.ShowClock_Label); StylesSvc.SizeFunc(VM.Options.ShowClock_CheckBox);
        StylesSvc.SizeFunc(VM.Options.PostToFacebook_Label); StylesSvc.SizeFunc(VM.Options.PostToFacebook_CheckBox);
        GM.Sized.Options = true;
        //console.log("VM.Options.FieldSet.NgStyle =" + JSON.stringify(VM.Options.FieldSet.NgStyle));
        //console.log("VM.Options.Legend.NgStyle =" + JSON.stringify(VM.Options.Legend.NgStyle));
        //console.log("VM.Options.EmailAlerts_Label.NgStyle =" + JSON.stringify(VM.Options.EmailAlerts_Label.NgStyle));
        //console.log("VM.Options.EmailAlerts_CheckBox.NgStyle =" + JSON.stringify(VM.Options.EmailAlerts_CheckBox.NgStyle));
    }
    this.ViewFunc = function (pObj) {
        //console.log("OptionsSvc.ViewFunc * pObj=" + JSON.stringify(pObj));
        if (pObj.View != null) {
            MM.View = pObj.View;
            switch ($location.path()) {
                case "/User": VM.User.Show_View = pObj.View; break;
                default: alert("OptionsSvc.ViewFunc * Unknown pObj.URL=" + pObj.URL); break;
            }
        }
        if (pObj.TabView != null) {
            //console.log("OptionsSvc.ViewFunc * pObj.TabView=" +pObj.TabView);
            MM.View = pObj.TabView;
            VM.User.Show_Tab = pObj.TabView;
            switch (pObj.TabView) {
                case "Membership": MM.Tabs.Idx = 0; break;
                case "Email": MM.Tabs.Idx = 1; break;
                case "Phone": MM.Tabs.Idx = 2; break;
                case "Options": MM.Tabs.Idx = 3; break;
                case "Password": MM.Tabs.Idx = 4; break;
            }
        }
        if (pObj.Legend != null) {
            switch (pObj.Legend) {
                case "*":
                    if (MM.Options.Loading) VM.Options.Legend = "Loading...";
                    else if (MM.Processing) VM.Options.Legend = "Saving...";
                    else VM.Options.Legend = "Options";
                    break;
            }
        }
        if (pObj.Enable != null) {
            switch (pObj.Enable) {
                case "*":
                    if (MM.Processing) VM.Options.Disabled = true;

                    break;
                default: alert("Unknown pObj.Enable=" + pObj.Enable); break;
            }
        }
        if (pObj.Msg != null) {
            switch (pObj.Msg) {
                case "Error_Server": $rootScope.Msg = "Options server error."; break;
                case "Info_Change": $rootScope.Msg = "You may change your options."; break;
                case "Wait_Load": $rootScope.Msg = "Loading your options..."; break;
                case "Wait_Save": $rootScope.Msg = "Saving options..."; break;
                case "Web_Save":   $rootScope.Msg = "Options successfully saved."; break;
                default: alert("Options unknown pObj.Msg=" + pObj.Msg); break;
            }
        }
    }
}
