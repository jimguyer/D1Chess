angular.module('MembershipMod', [])
    .directive('membershipdir', MembershipDir)
    .controller('MembershipCtl', MembershipCtl)
    .service('MembershipWebSvc', MembershipWebSvc)
    .service('MembershipLinkSvc', MembershipLinkSvc)
    .service('MembershipSvc', MembershipSvc)
    ;

function MembershipDir() {
    return { restrict: "E", templateUrl: '/Client/Views/Membership/Membership.html', controller: 'MembershipCtl as VM_Membership' };
}

function MembershipCtl($scope, MembershipWebSvc, MembershipLinkSvc, MembershipSvc) {
    $scope.Membership = VM.Membership;
    GM.Scope = $scope;
    this.ChangeFunc = function () { MembershipSvc.RouteFunc("Change"); }
    this.ClickExitFunc = function () { MembershipLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Exit" }); }
    this.ClickPaypalFunc = function () { MembershipLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Paypal" }); }
    this.ClickRenewFunc = function () { MembershipLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Renew" }); }
}

function MembershipWebSvc($http, MembershipLinkSvc, MembershipSvc, UtilitySvc) {
    this.RouteFunc = function (pEvent, pObj) {
        switch (pEvent) {
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        MembershipSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        switch (pObj.Button) {
                            case "Upgrade":
                                this.MembershipSvc.MainFunc("Save");
                                this.MainFunc("Link", { Event: pObj.Button, PostParms: parms });
                                break;

                            case "Paypal": MembershipWebSvc.MainFunc("Web", pObj); break;
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
                var parms = UtilitySvc.WebParmsFunc(pEvent, { Event: pObj.Event, Data: MM.Data });
                //console.log("OptionsWebSvc.MainFunc.Post" + " * parms=" + JSON.stringify(parms));
                $http
                    .post("api/Web", parms)
                    .success(function (pWebReturn) {
                        if (pWebReturn.Code == "Success") {
                            MembershipSvc.RouteFunc("Error", { Event: pObj.Event, Error: pWebReturn.Code });
                        }
                        else
                            MembershipSvc.RouteFunc("Error", { Event: pObj.Event, Error: pWebReturn.Code });
                    })
                    .error(function () { MembershipSvc.RouteFunc("Error", { Event: pObj.Event, Error: "Server" }); });
                ;
                break;
        }
    }
}

function MembershipLinkSvc($location, MembershipSvc, UtilitySvc, HomeSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("MembershipLinkSvc.RouteFunc" + " * pEvent=" + pEvent);
        switch (pEvent) {
            case "_Link":
                switch (pObj.Event) {
                    case "UpgradeRenew": this.MainFunc(pEvent, { Event: pObj.Event });
                }
                break;
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        MembershipSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });

                }
                break;
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("MembershipLinkSvc.MainFunc" + " * pEvent=" + pEvent);
        switch (pEvent) {
            case "_Link":
                switch (pObj.Event) {
                    case "UpgradeRenew":
                        var PaypalIds = pWebReturn.Data;
                        var item_name = PaypalSvc.Item_name(VM.Membership.Level);
                        var amount = PaypalSvc.Amount(VM.Membership.Level);
                        var payPalReturn = PaypalSvc.GetHttp(location.host, PaypalIds.Return);
                        var payPalCancelReturn = PaypalSvc.GetHttp(location.host, PaypalIds.Cancel);

                        //console.log("item_name = " + item_name)
                        //console.log("amount = " + amount)
                        //console.log("payPalReturn = " + payPalReturn)
                        //console.log("payPalCancelReturn = " + payPalCancelReturn)

                        window.location.href = PaypalSvc.HRefXClick(item_name, amount, 0, payPalReturn, payPalCancelReturn);
                }
                break;

            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        //console.log("MembershipLinkSvc.MainFunc.Click_Button" + " * pObj.Button=" + pObj.Button);
                        switch (pObj.Button) {
                            case "Back": HomeSvc.RouteFunc("_Link", { View_Event: "User_ClickBack" }); break;
                            case "Exit": HomeSvc.RouteFunc("_Link", { View_Event: "User_ClickExit" }); break;
                            case "Paypal": HomeSvc.RouteFunc("_Link", { View_Event: "Membership_ClickPaypal" }); break;
                            case "Upgrade": HomeSvc.RouteFunc("_Link", { View_Event: "Membership_ClickUpgrade" }); break;
                        }
                        break;


                }
                break;
        }
    };
}

function MembershipSvc($rootScope, $location, StylesSvc, UtilitySvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("MembershipSvc.RouteFunc" + " * pEvent=" + pEvent);
        switch (pEvent) {
            case "_Link":
                //console.log("MembershipSvc.RouteFunc._Link" + " * pObj=" + JSON.stringify(pObj));
                switch (pObj.View_Event) {
                    case "Member_Init": this.InitFunc(); break;
                    case "Member_Size": this.SizeFunc(); break;
                    case "Home_ClickUser":
                    case "User_ClickTab":
                    case "UserProfiles_ClickTab": this.MainFunc(pEvent, { View_Event: pObj.View_Event }); break;
                    case "User_WebGetUser": this.MainFunc(pEvent, { View_Event: pObj.View_Event, Data: pObj.Data }); break;
                }
                break;
            case "Click":
                //console.log("MembershipSvc.RouteFunc.Click" + " * pObj=" + JSON.stringify(pObj));
                switch (pObj.Control) {
                    case "Button": this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button }); break;
                }
                break;
            case "Change": this.MainFunc(pEvent); break;
            case "Error": MM.Processing = false; this.ViewFunc({ Enable: "*", Msg: "Error_" + pObj.Error }); break;
            case "Web": this.MainFunc(pEvent, { Event: pObj.Event, Data: pObj.Data }); break;
        }
    }
    this.InitFunc = function () {

        //console.log("MembershipSvc.InitFunc");
        //#region Init

        MM.Membership = { Loading: true };
        VM.Membership = {};

        //#endregion 

        //#region Controls
        VM.Membership.Legend_Text = StylesSvc.InitFunc({ Type: "LegendT", X: 2.5, W: 4 });
        VM.Membership.FieldSet = StylesSvc.InitFunc({ Type: "FieldSetT" });
        VM.Membership.Table = StylesSvc.InitFunc({ Type: "TableNB", X: 1, Y: 4.25, W: 7, H: 3.5, FS: .565 });
        VM.Membership.TD = MM.TD; VM.Membership.Radio = StylesSvc.InitFunc({ Type: "Radio", Pos: "X" });
        var xLL = 1, xLT = 2.8, xRL = 5, xRT = 6.5;
        var wLL = 1.7, wLT = 1.8, wRL = 1.5, wRT = 1.8;
        var fs = .75;
        y = 9;
        VM.Membership.CurLevel_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xLL, Y: y, W: wLL, FS: fs });
        VM.Membership.CurLevel_Text = StylesSvc.InitFunc({ Type: "Text", X: xLT, Y: y, W: wLT, FS: fs });
        VM.Membership.NewLevel_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xRL, Y: y, W: wRL, FS: fs });
        VM.Membership.NewLevel_Text = StylesSvc.InitFunc({ Type: "Text", X: xRT, Y: y, W: wRT, FS: fs });

        y = 9.75;
        VM.Membership.CurExp_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xLL, Y: y, W: wLL, FS: fs });
        VM.Membership.CurExp_Text = StylesSvc.InitFunc({ Type: "Text", X: xLT, Y: y, W: wLT, FS: fs });
        VM.Membership.NewExp_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xRL, Y: y, W: wRL, FS: fs });
        VM.Membership.NewExp_Text = StylesSvc.InitFunc({ Type: "Text", X: xRT, Y: y, W: wRT, FS: fs });
        y = 11.25;
        VM.Membership.Paypal = StylesSvc.InitFunc({ Type: "Img", X: 2, Y: y, W: 5, H: 2, Src: Dir.General + "Paypal.png" });
        //#endregion 

        //#region Buttons
        VM.Membership.Exit = MM.ButtonTL;
        VM.Membership.Save = MM.ButtonTR;
        //#endregion

        //console.log("VM.Membership.Table.Size" + JSON.stringify(VM.Membership.Table.Size));
        //console.log("VM.Membership.CurLevel_Label.Size" + JSON.stringify(VM.Membership.CurLevel_Label.Size));
        //console.log("VM.Membership.CurLevel_Text.Size" + JSON.stringify(VM.Membership.CurLevel_Text.Size));
        //console.log("VM.Membership.CurLevel_Label.NgStyle" + JSON.stringify(VM.Membership.CurLevel_Label.NgStyle));
        //console.log("VM.Membership.CurLevel_Text.NgStyle" + JSON.stringify(VM.Membership.CurLevel_Text.NgStyle));
        //console.log("VM.Membership.Paypal.NgStyle" + JSON.stringify(VM.Membership.Paypal.NgStyle));
        //console.log("VM.Membership.Paypal.NgSrc" + JSON.stringify(VM.Membership.Paypal.NgSrc));
    };
    this.MainFunc = function (pEvent, pObj) {
        //console.log("MembershipSvc.MainFunc * pEvent=" + pEvent);
        switch (pEvent) {
            //#region case "_Link";
            case "_Link":
                //#regioncase "_Link";
                //console.log("MembershipSvc.MainFunc._Link" + " * pObj=" + JSON.stringify(pObj));
                switch (pObj.View_Event) {
                    case "Home_ClickUser":
                    case "User_ClickTab":
                    case "UserProfiles_ClickTab": this.ViewFunc({ TabView: "Membership" }); break;

                    case "User_WebGetUser":
                        //console.log("MembershipSvc._Link.MainFunc.User_WebGetUser * pObj=" + JSON.stringify(pObj));
                        //console.log("pObj.Data.Level=" + pObj.Data.Level);
                        //pObj.Data = { Level: "Bronze", Expiration: "01/14/18" };
                        VM.Membership.CurLevel = pObj.Data.Level; VM.Membership.NewLevel = pObj.Data.Level;
                        VM.Membership.CurExp = (pObj.Data.Level == "Free") ? UtilitySvc.DateFunc("AddY") : UtilitySvc.DateFunc("Compress", { Date: pObj.Data.Expiration });
                        VM.Membership.NewExp = (pObj.Data.Level == "Free") ? VM.Membership.CurExp : UtilitySvc.DateFunc("AddY", { Date: VM.Membership.CurExp });
                        MM.Membership.Loading = false;
                        break;
                }
                if (MM.View == "Membership") {
                    //console.log("MM.View==Membership");
                    this.SizeFunc();

                    this.ViewFunc({ Legend: "*", Show: "*", Enable: "*" });
                    if (MM.Membership.Loading) this.ViewFunc({ Msg: "Wait_Loading" });
                    else this.ViewFunc({ Msg: "Init" });
                }
                break;
            //#endregion
            case "Change": this.ViewFunc({ Show: "*", Enable: "*", Msg: "Change" }); break;

            case "Click":
                //console.log("MembershipSvc.MainFunc.Click" + " * pObj=" + JSON.stringify(pObj));
                switch (pObj.Control) {
                    case "Button":
                        switch (pObj.Button) {
                            case "Save": MM.Processing = true; this.ViewFunc({ Msg: "Info_Paypal" }); this.ViewFunc({ Msg: "Wait_Purchase" }); break;
                            case "PayPal":
                                MM.Processing = true;
                                VM.Membership.Enabled.Renew = false;
                                VM.Membership.Enabled.Paypal = false;
                                this.ViewFunc({ Msg: "Wait_Purchase" });

                                break;
                            case "Save": MM.Data = { NewLevel: VM.Membership.NewLevel, Expiration: VM.Membership.NewExpiration }; break;

                        }
                    case "Img":
                        switch (pObj.Img) {
                            case "PayPal":
                                VM.Membership.Enabled.Renew = false;
                                VM.Membership.Enabled.Paypal = false;
                                this.ViewFunc({ Msg: "Wait_Purchase" });
                                break;
                            case "Save": MM.Data = { NewLevel: VM.Membership.NewLevel, Expiration: VM.Membership.NewExpiration }; break;
                        }
                        break;
                }
                break;
        }
    }

    this.SizeFunc = function () {
        if (GM.Sized.Membership) return;
        StylesSvc.SizeFunc(VM.Membership.FieldSet); StylesSvc.SizeFunc(VM.Membership.Legend_Text);
        StylesSvc.SizeFunc(VM.Membership.Table); StylesSvc.SizeFunc(VM.Membership.Radio);
        StylesSvc.SizeFunc(VM.Membership.CurLevel_Label); StylesSvc.SizeFunc(VM.Membership.CurLevel_Text);
        StylesSvc.SizeFunc(VM.Membership.CurExp_Label); StylesSvc.SizeFunc(VM.Membership.CurExp_Text);
        StylesSvc.SizeFunc(VM.Membership.NewLevel_Label); StylesSvc.SizeFunc(VM.Membership.NewLevel_Text);
        StylesSvc.SizeFunc(VM.Membership.NewExp_Label); StylesSvc.SizeFunc(VM.Membership.NewExp_Text);
        StylesSvc.SizeFunc(VM.Membership.Paypal);
        GM.Sized.Membership = true;
        //VM.Tabs.Div.NgStyle.width = "244px";
        //VM.Membership.FieldSet.NgStyle.width = "200px";
        //console.clear();
        //console.log("VM.Tabs.Div.NgStyle" + JSON.stringify(VM.Tabs.Div.NgStyle));
        //console.log("VM.Membership.FieldSet.NgStyle" + JSON.stringify(VM.Membership.FieldSet.NgStyle));


        //console.log("VM.Tabs.Div.W=" + VM.Tabs.Div.W + " * VM.Tabs.Div.NgStyle.width=" + VM.Tabs.Div.NgStyle.width + " " + VM.Tabs.Div.NgStyle.W / VM.Tabs.Div.W);
        //console.log("VM.Membership.FieldSet.W=" + VM.Membership.FieldSet.W + " * VM.Membership.FieldSet.NgStyle.width=" + VM.Membership.FieldSet.NgStyle.width + " " + VM.Membership.FieldSet.NgStyle.W / VM.Membership.FieldSet.W );
    }

    this.ViewFunc = function (pObj) {
        //console.log("MembershipSvc.ViewFunc * pObj=" + JSON.stringify(pObj));
        if (pObj.View != null) {
            //console.log("this.ViewFunc * pObj.View=" + pObj.View);
            //console.log("this.ViewFunc * $location.path()=" + $location.path());
            MM.View = pObj.View;
            switch ($location.path()) {
                case "/Games": VM.Games.Show_View = pObj.View; break;
                case "/History": VM.History.Show_View = pObj.View; break;
                case "/LogOn": VM.History.Show_View = pObj.View; break;
                case "/Players": VM.Players.Show_View = pObj.View; break;
                case "/Register": VM.Register.Show_View = pObj.View; break;
                case "/Start": VM.Start.Show_View = pObj.View; break;
                case "/URLAction": VM.URLAction.Show_View = pObj.View; break;
                case "/User": VM.User.Show_View = pObj.View; break;
                case "/UserProfiles": VM.UserProfiles.Show_View = pObj.View; break;
            }
        }
        if (pObj.Legend != null) {
            switch (pObj.Legend) {
                case "*":
                    if (MM.Membership.Loading) VM.Membership.Legend = "Loading...";
                    else if (MM.Processing) VM.Membership.Legend = "Saving...";
                    else VM.Membership.Legend = "Membership";
                    break;
            }
        }
        if (pObj.ShowHide != null) {
            switch (pObj.ShowHide) {
                case "All":
                    switch (VM.Membership.NewLevel) {
                        case "Free":
                            VM.Membership.CurLevel_Show = true; VM.Membership.CurExp_Show = false;
                            VM.Membership.NewLevel_Show = false; VM.Membership.NewExp_Show = false;
                            break;
                        default:
                            VM.Membership.CurLevel_Show = true; VM.Membership.CurExp_Show = true;
                            VM.Membership.NewLevel_Show = true; VM.Membership.NewExp_Show = true;
                    }
                    break;
            }
        }
        if (pObj.Show != null) {
            //console.log("this.ViewFunc.Show * VM.Membership.CurLevel=" + VM.Membership.CurLevel + " * VM.Membership.NewLevel=" + VM.Membership.NewLevel);
            switch (pObj.Show) {
                case "*":
                    if (VM.Membership.CurLevel == "Free") {
                        VM.Membership.CurLevel_Show = true;
                        VM.Membership.NewLevel_Show = (VM.Membership.NewLevel != "Free");
                        VM.Membership.CurExp_Show = (VM.Membership.NewLevel != "Free");
                        VM.Membership.NewExp_Show = false;
                    }
                    else {
                        VM.Membership.CurLevel_Show = true;
                        VM.Membership.NewLevel_Show = (VM.Membership.NewLevel != VM.Membership.CurLevel);
                        VM.Membership.CurExp_Show = true;
                        VM.Membership.NewExp_Show = true;
                    }
            }
            //console.log("VM.Membership.CurLevel_Show=" + JSON.stringify(VM.Membership.CurLevel_Show));
            //console.log("VM.Membership.CurExp_Show=" + JSON.stringify(VM.Membership.CurExp_Show));
            //console.log("VM.Membership.NewLevel_Show=" + JSON.stringify(VM.Membership.NewLevel_Show));
            //console.log("VM.Membership.NewExp_Show=" + JSON.stringify(VM.Membership.NewExp_Show));
        }
        if (pObj.Hide != null) {
            switch (pObj.Hide) {
                case "All":
                    VM.Membership.CurLevel_Show = false; VM.Membership.CurExp_Show = false;
                    VM.Membership.NewLevel_Show = false; VM.Membership.NewExp_Show = false;
                    break;
            }
        }
        if (pObj.Enable != null) {
            //console.log("pObj.Enable=" + pObj.Enable);
            switch (pObj.Enable) {
                case "*":
                    VM.Membership.Disabled = MM.Processing;
                    if (VM.Membership.Level == "Free") VM.Membership.Save_Disabled = true;
                    //else if (VM.Membership.Level == MM.Membership.Level) VM.Membership.Save_Disabled = true;
                    else VM.Membership.Save_Disabled = false;
                    break;
                case "All":
                    VM.Membership.Disabled_Free = false;
                    VM.Membership.Disabled_Bronze = false;
                    VM.Membership.Disabled_Silver = false;
                    VM.Membership.Disabled_Gold = false;
                    break;
                case "BonzeSilverGold": VM.Membership.Disabled_Bronze = false; VM.Membership.Disabled_Silver = false; VM.Membership.Disabled_Gold = false; break;
                case "SilverGold": VM.Membership.Disabled_Silver = false; VM.Membership.Disabled_Gold = false; break;
                case "Gold": VM.Membership.Disabled_Gold = false; break;
            }
        }
        if (pObj.Msg != null) {
            switch (pObj.Msg) {
                case "Init":
                    switch ($location.path()) {
                        case "/User": $rootScope.Msg = "You may upgrade and/or renew."; break;
                        case "/UserProfiles": $rootScope.Msg = "You must upgrade to add a profile."; break;
                    }
                    break;
                case "Change":
                    switch ($location.path()) {
                        case "/User": $rootScope.Msg = "You may upgrade and/or renew."; break;
                        case "/UserProfiles": $rootScope.Msg = "You must upgrade to add a profile."; break;
                    }
                    break;
                case "Error_Server": $rootScope.Msg = "Membership server error."; break;
                case "Info_Paypal": $rootScope.Msg = "Click Paypal to pay."; break;
                case "Wait_Loading": $rootScope.Msg = "Loading membership data..."; break;
                case "Wait_Purchase": $rootScope.Msg = "Preparing your purchase..."; break;
            }
            VM.Membership.Show_BigMsg = $rootScope.Msg;
        }
    }
}