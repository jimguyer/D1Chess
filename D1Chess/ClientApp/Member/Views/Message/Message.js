angular.module('MessageMod', [])
    .directive('messagedir', MessageDir)
    .controller('MessageCtl', MessageCtl)
    .service('MessageLinkSvc', MessageLinkSvc)
    .service('MessageSvc', MessageSvc)
;

function MessageDir() {
    return { restrict: "E", templateUrl: '/Client/Views/Message/Message.html', controller: 'MessageCtl as VM_Message' };
}

function MessageCtl($scope, MessageLinkSvc, MessageSvc) {
    //console.log("MessageCtl");
    $scope.Message = VM.Message;
    GM.Scope = $scope;
    this.ClickNextFunc = function () { MessageLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Next" }); }
    this.ClickBackFunc = function () { MessageLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Back" }); }
    this.ClickExitFunc = function () { MessageLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Exit" }); }
}

function MessageLinkSvc($location, GameSvc, HomeSvc, MessageSvc, ProfilesSvc, StartEmailSvc, StartParmsSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("MessageLinkSvc.RouteFunc" + " * pEvent=" + pEvent + " * pObj.Control=" + pObj.Control);        
        switch (pEvent) {
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        //console.log("MessageLinkSvc.RouteFunc.Click.Button" + " * pObj.Button=" + pObj.Button);
                        MessageSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        break;
                }
                break;
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("MessageLinkSvc.MainFunc * pEvent=" + pEvent);
        switch (pEvent) {
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        switch (pObj.Button) {
                            case "Back":
                                //console.log("MessageLinkSvc.MainFunc.Click_Button.Back * $location.path()=" + $location.path());
                                switch ($location.path()) {
                                    case "/History": StartParmsSvc.RouteFunc("_Link", { View_Event: "Message_ClickBack" }); break;
                                    case "/Players": StartParmsSvc.RouteFunc("_Link", { View_Event: "Message_ClickBack" }); break;
                                    case "/Start":
                                        //console.log("MessageLinkSvc.MainFunc.Click_Button.Back./Start * MM.Data.OpFindBy=" + MM.Data.OpFindBy);
                                        switch (MM.Share.OpFindBy) {
                                            case "A": GameSvc.RouteFunc("_Link", { View_Event: "Message_ClickBack" }); break;
                                            case "E": StartEmailSvc.RouteFunc("_Link", { View_Event: "Message_ClickBack" }); break;
                                            case "S": ProfilesSvc.RouteFunc("_Link", { View_Event: "Message_ClickBack" }); break;
                                        }
                                }
                                break;
                            case "Exit":
                                switch ($location.path()) {
                                    case "/History": HomeSvc.RouteFunc("_Link", { View_Event: "History_ClickExit" }); break;
                                    case "/Players": HomeSvc.RouteFunc("_Link", { View_Event: "Players_ClickExit" }); break;
                                    case "/Start": HomeSvc.RouteFunc("_Link", { View_Event: "Start_ClickExit" }); break;
                                }
                                break;
                            case "Next": GameSvc.RouteFunc("_Link", { View_Event: "Message_ClickNext", Data: MM.Data }); break;
                        }
                        break;
                }
                break;
        }
    };
}

function MessageSvc($rootScope, $location, GameSvc, StylesSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("MessageSvc.RouteFunc * pEvent=" + pEvent);
        switch (pEvent) {
            case "_Link":
                //console.log("MessageSvc.RouteFunc._Link * pObj.View_Event=" + pObj.View_Event);
                //console.log("MessageSvc.RouteFunc._Link * pObj.Data=" + JSON.stringify(pObj.Data));
                switch (pObj.View_Event) {
                    case "Member_Init": this.InitFunc(); break;
                    case "Member_Size": this.SizeFunc(); break;
                    case "Profile_ClickSelect": 
                    case "Profiles_ClickNext": 
                    case "StartEmail_WebSave": 
                    case "StartParms_WebSave": this.MainFunc(pEvent, { View_Event: pObj.View_Event, Data: pObj.Data }); break;
                    case "Game_ClickBack": this.MainFunc(pEvent, { View_Event: pObj.View_Event }); break;
                }
                this.SizeFunc();
                break;
            case "Change": his.MainFunc(pEvent, { Control: pObj.Control }); break;
            case "Click":
                switch (pObj.Control) {
                    case "Button": this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button }); break;
                }
                break;
        }
    }
    this.InitFunc = function () {
        //console.log("MessageSvc.InitFunc");
        MM.Message = {};
        VM.Message = { Body: ""};

        //#region Types
        VM.Message.OpponentFieldSet = StylesSvc.InitFunc({ Type: "FieldSet" });
        VM.Message.OpponentLegend_Text = StylesSvc.InitFunc({ Type: "Legend" });

        VM.Message.Img = StylesSvc.InitFunc({ Type: "ImgB", X: 1.5, W: 6, H: 6 });
        var xL = .5, xR = 4.65, wL = 4, wR = 4, fs = 1;
        var yAdd = 1;

        var y = 3;
        VM.Message.OpEmail_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Message.OpEmail_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, FS: fs });
        y += yAdd;
        VM.Message.OpUserId_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Message.OpUserId_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, FS: fs });
        y += yAdd;
        VM.Message.OpName_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Message.OpName_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, FS: fs });
        y += yAdd;
        VM.Message.OpRating_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Message.OpRating_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, FS: fs });

        y = 8; VM.Message.BodyLegend_Text = StylesSvc.InitFunc({ Type: "Legend", Y: y });
        y += yAdd * .5; VM.Message.BodyFieldSet = StylesSvc.InitFunc({ Type: "FieldSet", Y: y, H: 5.5 });

        y += yAdd; VM.Message.Body_TextArea = StylesSvc.InitFunc({ Type: "TextArea", Y: y, H: 3.5, FS: .7 });

        VM.Message.Exit = MM.ButtonL;
        VM.Message.Back = MM.ButtonC;
        VM.Message.Next = MM.ButtonR;
        //#endregion
    }
    this.MainFunc = function (pEvent, pObj) {
        switch (pEvent) {
            case "_Link":
                //console.log("MessageSvc.ViewFunc._Link * pObj.View_Event=" + pObj.View_Event);
                //console.log("MessageSvc.ViewFunc._Link * pObj.Data=" + JSON.stringify(pObj.Data));
                switch (pObj.View_Event) {
                    case "Game_ClickBack": this.ViewFunc({ View: "Message", Msg: "Info_Back" });
                    case "Profile_ClickSelect":
                    case "Profiles_ClickNext":
                        this.ViewFunc({ View: "Message", Show: "Photo", Msg: "Init" });
                        break;
                    case "StartEmail_WebSave":
                        this.ViewFunc({ View: "Message", Show: "Photo", Msg: "Init" });
                        VM.Message.Img.NgSrc = MM.Wiz.OpPhoto_Src || IM.PhotoNo_Src;
                        break;

                    case "StartParms_WebSave":
                        //console.log("MessageSvc.ViewFunc._Link.StartParms_WebSave");
                        //console.log("MessageSvc.ViewFunc._Link.StartParms_WebSave * pObj.Data=" + JSON.stringify(pObj.Data));
                        //console.log("MessageSvc.ViewFunc._Link.StartParms_WebSave * MM.Wiz=" + JSON.stringify(MM.Wiz));
                        //console.log("MessageSvc.ViewFunc._Link.StartParms_WebSave * MM.Wiz.OpPhoto_Src.length=" + MM.Wiz.OpPhoto_Src.length);
                        this.ViewFunc({ View: "Message", Show: "Photo", Msg: "Init" });
                        VM.Message.Img.NgSrc = MM.Wiz.OpPhoto_Src;
                        VM.Message.OpUserId = MM.Wiz.OpUserId;
                        VM.Message.OpEmail = MM.Wiz.OpEmail;
                        VM.Message.OpName = MM.Wiz.OpName;
                        VM.Message.OpRating = MM.Wiz.OpRating;

                        break;
                }
                if (MM.View == "Message") {
                    //console.log("MessageSvc.MainFunc._Link * MM.View =" + MM.View);
                    this.SizeFunc();
                    VM.Message.Img.NgSrc = MM.Wiz.OpPhoto_Src || IM.PhotoNo_Src;
                    var name = MM.UserProfiles.List[MM.UserProfiles.DefaultIdx].FirstName + " " + MM.UserProfiles.List[MM.UserProfiles.DefaultIdx].LastName
                    VM.Message.Body = name + " has challenged you to a game of Diamond Chess.";
                    VM.Message.OpEmail_Show = (VM.Message.OpEmail != null);
                    VM.Message.OpUserId_Show = (VM.Message.OpUserId != null);
                    VM.Message.OpName_Show = (VM.Message.OpName != null);
                    VM.Message.OpRating_Show = (VM.Message.OpRating != null);
                    this.ViewFunc({ Legend: "*" });
                }
                break;
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        //console.log("MainFunc.Click.Button * pObj.Button=" + pObj.Button);
                        switch (pObj.Button) {
                            case "Next": break;
                                //console.log("VM.Body=" + VM.Body);
                                MM.Wiz.MessageBody = VM.Body;
                                this.ViewFunc({ Enable: "*", B_Disable: "Next", Msg: "Wait_Saving" });
                                //console.log("MM.Wiz.MessageBody=" + MM.Wiz.MessageBody);
                                break;
                        }
                        break;
                }
                break;
        }
    }
    this.SizeFunc = function () {
        //console.log("xxxxMessageSvc.SizeFunc * GM.Sized.Message=" + GM.Sized.Message);
        if (GM.Sized.Message) return;
        StylesSvc.SizeFunc(VM.Message.OpponentFieldSet); StylesSvc.SizeFunc(VM.Message.OpponentLegend_Text);
        StylesSvc.SizeFunc(VM.Message.OpEmail_Label); StylesSvc.SizeFunc(VM.Message.OpEmail_Text);
        StylesSvc.SizeFunc(VM.Message.OpUserId_Label); StylesSvc.SizeFunc(VM.Message.OpUserId_Text);
        StylesSvc.SizeFunc(VM.Message.OpName_Label); StylesSvc.SizeFunc(VM.Message.OpName_Text);
        StylesSvc.SizeFunc(VM.Message.OpRating_Label); StylesSvc.SizeFunc(VM.Message.OpRating_Text);
        StylesSvc.SizeFunc(VM.Message.Img); 
        StylesSvc.SizeFunc(VM.Message.BodyFieldSet); StylesSvc.SizeFunc(VM.Message.BodyLegend_Text);
        StylesSvc.SizeFunc(VM.Message.Body_TextArea); 
        GM.Sized.Message = true;
        //console.log("VM.Message.Email_FieldSet.NgStyle =" + JSON.stringify(VM.Message.Email_FieldSet.NgStyle))
        //console.log("VM.Message.Email_Legend.NgStyle =" + JSON.stringify(VM.Message.Email_Legend.NgStyle));

        //console.log("VM.Message.Opponent_FieldSet.NgStyle =" + JSON.stringify(VM.Message.Opponent_FieldSet.NgStyle));
        //console.log("VM.Message.Opponent_Legend.NgStyle =" + JSON.stringify(VM.Message.Opponent_Legend.NgStyle));

        //console.log("VM.Message.Body_FieldSet =" + JSON.stringify(VM.Message.Body_FieldSet));
        //console.log("VM.Message.Body_Legend =" + JSON.stringify(VM.Message.Body_Legend));
        //console.log("VM.Message.Body_TextArea =" + JSON.stringify(VM.Message.Body_TextArea));
        //console.log("VM.Message.Img.NgStyle =" + JSON.stringify(VM.Message.Img.NgStyle));

    }
    this.ViewFunc = function (pObj) {
        if (pObj.View != null) {
            MM.View = pObj.View;
            switch ($location.path()) {
                case "/Players": VM.Players.Show_View = pObj.View; break;
                case "/Start": VM.Start.Show_View = pObj.View; break;
                default: alert("MessageProfilesSvc.ViewFunc * Unknown pObj.URL=" + pObj.URL); break;
            }
        }
        if (pObj.Show != null) {
            switch (pObj.Show) {
                case "Opponent": VM.Message.Switch = "Opponent"; break;
                case "Photo": VM.Message.Switch = "Photo"; break;
                default: alert("Unknown pObj.Show=" + pObj.Show); break;
            }
        }
        if (pObj.Legend != null) {
            switch (pObj.Legend) {
                case "*":
                    VM.Message.OpponentLegend = (MM.Wiz.OpName != null) ? MM.Wiz.OpName : "Opponent";
                    VM.Message.BodyLegend = "Message";
            }
        }
        if (pObj.Enable != null) {
            switch (pObj.Enable) {
                case "*":
                    if (MM.Processing) VM.Message.Disabled = true;
                    else if (VM.Message.Body == "") VM.Message.Next_Disabled = true;
                    break;
                default: alert("Unknown pObj.Enable=" + pObj.Enable); break;
            }
        }
        if (pObj.Msg != null) {
            //console.log("StartParmsSvc.ViewFunc * pObj.Msg=" + pObj.Msg);
            switch (pObj.Msg) {
                case "Init": $rootScope.Msg = "Enter a message for " + MM.Wiz.OpUserId; break;
                case "NoBody": $rootScope.Msg = "A message is required."; break;
                case "Info_Back":
                    switch ($location.path()) {
                        case "/History": $rootScope.Msg = "Challenge cancelled."; break;
                        case "/Players": $rootScope.Msg = "You may change the message for " + MM.Wiz.UserId + "."; break;
                        case "/Start":
                            $rootScope.Msg = (MM.Wiz.UserId == null) ? "You may change the message." : "You may change the message for " + MM.Wiz.OpUserId + "."; break;
                    }
                    break;
                case "Saving": $rootScope.Msg = "Saving..."; break;

                default: alert("Unknown pObj.Msg=" + pObj.Msg); break;
            }
        }
    }
}

