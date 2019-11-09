angular.module('GameMod', [])
    .config(GameConfig)
    .directive('gamedir', GameDir)
    .controller("GameCtl", GameCtl)

    .service("GameWebSvc", GameWebSvc)
    .service("GameLinkSvc", GameLinkSvc)
    .service('GameSvc', GameSvc)
;

function GameConfig($routeProvider) {
    $routeProvider
        .when('/Challenge', { templateUrl: '/Client/Member/Views/Game/Game.html', controller: 'ChallengeCtl as VM_Game' })
        .when('/Game', { templateUrl: '/Client/Views/Game/Game.html', controller: 'GameCtl as VM_Game' });
}

function GameDir() {
    return { restrict: "E", templateUrl: '/Client/Views/Game/Game.html', controller: 'GameCtl as VM_Game' };
}

function GameCtl($scope, $location, GameWebSvc, GameLinkSvc, GameSvc) {
    //console.log("GameCtrl");
    $scope.Game = VM.Game;
    GM.Scope = $scope;
    this.ClickAcceptFunc = function () { GameWebSvc.RouteFunc("Click", { Control: "Button", Button: "Accept" }); };
    this.ClickDeclineFunc = function () { GameWebSvc.RouteFunc("Click", { Control: "Button", Button: "Decline" }); };
    this.ClickResendFunc = function () { GameWebSvc.RouteFunc("Click", { Control: "Button", Button: "Resend" }); };
    this.ClickRestartFunc = function () { GameWebSvc.RouteFunc("Click", { Control: "Button", Button: "Restart" }); };
    this.ClickRetractFunc = function () { GameWebSvc.RouteFunc("Click", { Control: "Button", Button: "Retract" }); };
    this.ClickSendFunc = function () { GameWebSvc.RouteFunc("Click", { Control: "Button", Button: "Send" }); };

    this.ClickBackFunc = function () { GameLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Back" }); };
    this.ClickBoardFunc = function () { GameLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Board" }); };
    this.ClickExitFunc = function () { GameLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Exit" }); };
    this.ClickImgFunc = function () { GameLinkSvc.RouteFunc("Click", { Control: "Img" }); };
    this.ClickNextFunc = function () { GameLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Next" }); };
    this.ClickProfileFunc = function () { GameLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Profile" }); };
}

function GameWebSvc($http, GameLinkSvc, GameSvc, UtilitySvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("GameWebSvc.RouteFunc" + " * pEvent=" + pEvent + " * pObj.Control=" + pObj.Control);
        switch (pEvent) {
            //#region case "Click":
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        //console.log("MessageLinkSvc.RouteFunc.Click.Button" + " * pObj.Button=" + pObj.Button);
                        GameSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        switch (pObj.Button) {
                            case "Accept": this.MainFunc("Post", { Event: "ChallengeAccepts" }); break;
                            case "Decline": this.MainFunc("Post", { Event: "ChallengeDeclines" }); break;
                            case "Resend": this.MainFunc("Post", { Event: "ChallengeResends" }); break;
                            case "Retract": this.MainFunc("Post", { Event: "ChallengeRetracts" }); break;
                            case "Send": this.MainFunc("Post", { Event: "ChallengeSend" }); break;
                        }
                }
                break;
            //#endregion
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        switch (pEvent) {
            case "Post":
                //console.log("GameWebSvc.MainFunc.Post");
                //console.log("GameWebSvc.MainFunc.Post * MM.Data=" + JSON.stringify(MM.Data));
                var parms = UtilitySvc.WebParmsFunc(pEvent, { Event: pObj.Event, Data: MM.Data });
                //GameLinkSvc.RouteFunc("Web", { Event: pObj.Event }); break //******************************** Comment me out!!!!!!!!!!
                $http
                    .post("api/Web", parms)
                    .success(function (pWebReturn) {
                        if (pWebReturn.Code === "Success") {
                            //console.log("pWebReturn.Data=" + JSON.stringify(pWebReturn.Data));
                            GameLinkSvc.RouteFunc("Web", { Event: pObj.Event, Data: pWebReturn.Data });
                        }
                        else
                            GameSvc.RouteFunc("Error", { Event: pObj.Event, Error: pWebReturn.Code });
                    })
                    .error(function () { GameSvc.RouteFunc("Error", { Event: pObj.Event, Error: "Server" }); });
                ;
                break;
        }
    }
}

function GameLinkSvc($location, GameSvc, GamesSvc, HomeSvc, ProfileSvc, MessageSvc, StartParmsSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("GameLinkSvc.RouteFunc" + " * pEvent=" + pEvent + " * pObj.Control=" + pObj.Control);        
        switch (pEvent) {

            //#region case "Click":
            case "Click":
                //console.log("GameLinkSvc.RouteFunc.Click * pObj.Control=" + pObj.Control);     
                switch (pObj.Control) {
                    case "Button":
                        //console.log("GameLinkSvc.RouteFunc.Click.Button" + " * pObj.Button=" + pObj.Button);
                        GameSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        break;
                }
                break;
            //#endregion 

            //#region case "Web":
            case "Web":
                //console.log("GameLinkSvc.RouteFunc.Web * pObj.Event=" + pObj.Event + " * MM.Data =" + JSON.stringify(pObj.Data));
                GameSvc.MainFunc(pEvent, { Event: pObj.Event, Data: pObj.Data });
                //console.log("GameLinkSvc.RouteFunc.Web * pObj.Event=" + pObj.Event + " * MM.Data =" + JSON.stringify(MM.Data));
                this.MainFunc(pEvent, { Event: pObj.Event, Data: MM.Data });
                break;
            //#endregion 
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("GameLinkSvc.MainFunc * pEvent=" + pEvent);
        switch (pEvent) {

            //#region case "Click":
            case "Click":
                switch (pObj.Control) {

                    //#region case "Button":
                    case "Button":
                        //console.log("GameLinkSvc.MainFunc.Click.Button * pObj.Button=" + pObj.Button);  
                        switch (pObj.Button) {
                            case "Back":
                                switch ($location.path()) {
                                    case "/Games": GamesSvc.RouteFunc("_Link", { View_Event: "Game_ClickBack" }); break;
                                    case "/History": GameSvc.RouteFunc("_Link", { View_Event: "Game_ClickBack" }); break;
                                    case "/Players": MessageSvc.RouteFunc("_Link", { View_Event: "Game_ClickBack" }); break;
                                    case "/Start": MessageSvc.RouteFunc("_Link", { View_Event: "Game_ClickBack" }); break;
                                }
                                break;
                            case "Exit": HomeSvc.RouteFunc("_Link", { View_Event: "Game_ClickExit" }); break;
                        }
                        break;
                    //#endregion

                    //#region case "Photo":
                    case "Photo":
                        switch ($location.path()) {
                            case "/Games": ProfileSvc.RouteFunc("_Link", { View_Event: "Game_ClickImg" }); break;
                            case "/History": HistorySvc.MainFunc("_Link", { View_Event: "Game_ClickImg" }); break;
                            case "/Players": ProfileSvc.RouteFunc("_Link", { View_Event: "Game_ClickImg" }); break;
                        }
                        break;
                    //#endregion
                }
                break;
            //#endregion

            case "Web":
                //console.log("GameLinkSvc.MainFunc.Web * pObj.Event=" + pObj.Event + " * pObj.Data=" + JSON.stringify(pObj.Data));
                //console.log("pObj.Data=" + JSON.stringify(pObj.Data));
                //console.log("MM.Data=" + JSON.stringify(MM.Data));
                switch (pObj.Event) {
                    case "ChallengeSend":
                        //console.log("GameLinkSvc.MainFunc.Web.ChallengeSend");
                        //console.log("MM.Data.OpUserId =" + MM.Data.OpUserId);
                        //console.log("MM.Data.OpPhoto_Src.length =" + MM.Data.OpPhoto_Src.length);
                        //console.log("MM.Data.GameName =" + MM.Data.GameName);
                        //console.log("MM.Data.Date =" + MM.Data.Date);
                        //console.log("MM.Data.Rated =" + MM.Data.Rated);
                        //console.log("MM.Data.Time =" + MM.Data.Time);
                        //console.log("MM.Data.ProfileIdx=" + MM.Data.ProfileIdx);
                        GamesSvc.RouteFunc("_Link", { View_Event: "Game_WebSend", Data: MM.Data }); break;
                    case "ChallengeAccepts": GamesSvc.RouteFunc("_Link", { View_Event: "Game_WebAccept", Data: pObj.Data }); break;
                    case "ChallengeDecliness": GamesSvc.RouteFunc("_Link", { View_Event: "Game_WebDecline", Data: pObj.Data }); break;
                    case "ChallengeResends": GamesSvc.RouteFunc("_Link", { View_Event: "Game_WebResend", Data: pObj.Data }); break;
                    case "ChallengeRetracts": GamesSvc.RouteFunc("_Link", { View_Event: "Game_WebRetract", Data: pObj.Data }); break;
                }
                break;
        }
    };
}

function GameSvc($rootScope, $location, StylesSvc, UtilitySvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("GameSvc.RouteFunc * pEvent=" + pEvent + " * pObj.View_Event=" + pObj.View_Event);
        switch (pEvent) {
            case "_Link":
                //console.log("GameSvc.RouteFunc._Link * pObj.View_Event=" + pObj.View_Event + " * pObj.Type=" + pObj.Type);
                switch (pObj.View_Event) {
                    case "Member_Init": this.InitFunc(); break;
                    case "Member_Size": this.SizeFunc(); break;
                    default: this.MainFunc(pEvent, { View_Event: pObj.View_Event, Type: pObj.Type, Data: pObj.Data }); break;
                }
                break;
            case "Click":
                switch (pObj.Control) {
                    case "Button": this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button }); break;
                }
                break;
            case "Error": MM.Processing = false; this.ViewFunc({ Enable: "*", Msg: "Error_" + pObj.Error }); break;
            case "Web": this.MainFunc(pEvent, { Event: pObj.Event, Data: pObj.Data }); break;
        }
    }
    this.InitFunc = function () {
        //console.log("GameSvc.InitFunc");
        MM.Game = {};
        VM.Game = {};

        //#region Types
        VM.Game.OpponentFieldSet = StylesSvc.InitFunc({ Type: "FieldSet", H: 4 });
        VM.Game.OpponentLegend_Text = StylesSvc.InitFunc({ Type: "Legend" });
        var xL = .5, xR = 4.65, wL = 4, wR = 4, fs = 1;
        var yAdd = 1;

        VM.Game.Img = StylesSvc.InitFunc({ Type: "ImgB", X: 1.25, Y: 1.25, S: 6.5 });

        var y = 3; 
        VM.Game.OpEmail_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Game.OpEmail_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, FS: fs });
        y += yAdd; wL = 2;
        VM.Game.OpUserId_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Game.OpUserId_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, FS: fs });
        y += yAdd;
        VM.Game.OpName_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Game.OpName_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, FS: fs });
        y += yAdd;
        VM.Game.OpRating_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Game.OpRating_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, FS: fs });


        //***************************************************************************************

        y = 9; VM.Game.StatsLegend_Text = StylesSvc.InitFunc({ Type: "Legend", Y: y });
        y += yAdd * .5; VM.Game.StatsFieldSet = StylesSvc.InitFunc({ Type: "FieldSet", Y: y, H: 4.5 });  
        var xL = .5, xR = 4.65, wL = 4, wR = 4, fs = 1;

        y += yAdd;
        VM.Game.GameName_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Game.GameName_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, FS: fs });
        y += yAdd;
        VM.Game.Rated_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Game.Rated_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, FS: fs });
        y += yAdd;
        VM.Game.Time_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, FS: fs });
        VM.Game.Time_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, FS: fs });

        VM.Game.Exit = MM.ButtonTL;
        VM.Game.Back = MM.ButtonTC; VM.Game.Decline = MM.ButtonTC; VM.Game.Accept = MM.ButtonTR;
        VM.Game.Retract = MM.ButtonTC; VM.Game.Resend = MM.ButtonTR;
        VM.Game.Board = MM.ButtonTR; VM.Game.Next = MM.ButtonTR; VM.Game.Send = MM.ButtonTR;
        //#endregion
    }

    this.MainFunc = function (pEvent, pObj) {
        //console.log("GameSvc.MainFunc * pEvent=" + pEvent + " * pObj.View_Event=" + pObj.View_Event);
        switch (pEvent) {

            //#region case "_Link":

            case "_Link":
                //console.log("GameSvc.MainFunc._Link * pObj.View_Event=" + pObj.View_Event);
                switch (pObj.View_Event) {

                    //#region case "Games_ClickRow":
                    case "Games_ClickRow":
                        //console.log("GameSvc.MainFunc._Link.Games_ClickRow");
                        //console.log("GameSvc.MainFunc._Link.Games_ClickRow * pObj=" + JSON.stringify(pObj));

                        //console.log("pObj.Data.Id=" + pObj.Data.Id);
                        //console.log("pObj.Data.Rated=" + pObj.Data.Rated);
                        //console.log("pObj.Data.TimeInc=" + pObj.Data.TimeInc);
                        //console.log("pObj.Data.OpPhoto_Src.length=" + pObj.Data.OpPhoto_Src.length);
                        //console.log("pObj.Data.OpUserId=" + pObj.Data.OpUserId);
                        //console.log("pObj.Data.OpEmail=" + pObj.Data.OpEmail);
                        //console.log("pObj.Data.OpName=" + pObj.Data.OpName);
                        //console.log("pObj.Data.OpRating=" + pObj.Data.OpRating);
                        //console.log("pObj.Data.GameName=" + pObj.Data.GameName);
                        MM.GameId = pObj.Data.Id;
                        VM.Game.Stats_Legend.Text = pObj.Data.OpUserId;
                        VM.Game.Opponent_Legend.Text = pObj.Data.OpUserId;
                        VM.Game.Img.NgSrc = pObj.Data.OpPhoto_Src;
                        VM.Game.OpUserId = pObj.Data.OpUserId;
                        VM.Game.GameName = pObj.Data.GameName;
                        VM.Game.Rated = UtilitySvc.BoolFunc("YesNo", { "Bool": MM.Data.Rated });
                        VM.Game.Time = UtilitySvc.TimeFunc("AmtInc", { "Inc": MM.Data.TimeInc, "Amt": MM.Data.TimeAmt });

                        VM.Game.OpEmail = null;
                        VM.Game.OpName = null;
                        //console.log("MM.GameId=" + MM.GameId);
                        //console.log("pObj.Type=" + pObj.Type);
                        this.ViewFunc({ View: "Game", Show: "Photo", Legend: "*", OpText: pObj.Data.OpUserId, Buttons: "BackDeclineAccept" });
                        switch (pObj.Type) {
                            case "GamesActive": case "Active":
                                VM.Game.GameName = pObj.Data.GameName;
                                VM.Game.OpRating = null;
                                this.ViewFunc({ Enable: "*", Buttons: "ExitBackBoard", Msg: "Info_Active" });
                                break;

                            case "GamesReceived": case "Received":
                                VM.Game.GameName = null;
                                VM.Game.OpRating = pObj.Data.OpRating;
                                this.ViewFunc({ Enable: "*", Buttons: "BackDeclineAccept", Msg: "Info_Accept" });
                                break;

                            case "GamesSent": case "Sent":
                                VM.Game.GameName = null;
                                VM.Game.OpRating = null;
                                this.ViewFunc({ Enable: "*", Buttons: "BackRetractResend", Msg: "Info_Resend" });
                        }
                        break;
                    //#endregion

                    //#region case "Message_ClickNext":

                    case "Message_ClickNext":
                        //console.log("GameSvc.MainFunc._LinkMessage_ClickNext");
                        //console.log("MM.Wiz=" + JSON.stringify(MM.Wiz));
                        //console.log("MM.Wiz.Rated=" + MM.Wiz.Rated);
                        //console.log("MM.Wiz.TimeInc=" + MM.Wiz.TimeInc);
                        //console.log("MM.Wiz.TimeAmt=" + MM.Wiz.TimeAmt);
                        //console.log("MM.Wiz.OpPhoto_Src.length=" + MM.Wiz.OpPhoto_Src.length);
                        //console.log("MM.Wiz.OpUserId=" + MM.Wiz.OpUserId);
                        //console.log("MM.Wiz.OpEmail=" + MM.Wiz.OpEmail);
                        //console.log("MM.Wiz.OpName=" + MM.Wiz.OpName);
                        //console.log("MM.Wiz.OpRating=" + MM.Wiz.OpRating);
                        //console.log("MM.Wiz.OpGroup=" + MM.Wiz.OpGroup);
                        VM.Game.Img.NgSrc = MM.Wiz.OpPhoto_Src || IM.PhotoNo_Src;
                        VM.Game.OpName = MM.Wiz.OpName;
                        VM.Game.Rated = UtilitySvc.BoolFunc("YesNo", { "Bool": MM.Wiz.Rated });
                        VM.Game.Time = UtilitySvc.TimeFunc("AmtInc", { "Inc": MM.Wiz.TimeInc, "Amt": MM.Wiz.TimeAmt });

                        if (MM.Wiz.OpUserId == null) {
                            this.ViewFunc({ Show: "Opponent", Opponent_Text: MM.Wiz.OpEmail, StatsText: "Game" });
                        }
                        else {
                            this.ViewFunc({ Show: "Photo", Legend: "*", Text: MM.Wiz.OpUserId });
                        }
                        this.ViewFunc({ View: "Game", Legend: "*", Buttons: "ExitBackSend", Msg: "Info_Complete" });
                        //console.log("VM.Game.Rated=" + VM.Game.Rated_O);
                        //console.log("VM.Game.Time=" + VM.Game.Time_O);
                        break;

                    //#endregion

                    //#region default:
                    default:
                        VM.Game.Rated = UtilitySvc.BoolFunc("YesNo", { "Bool": MM.Wiz.Rated });
                        VM.Game.Time = UtilitySvc.TimeFunc("AmtInc", { "Inc": MM.Wiz.TimeInc, "Amt": MM.Wiz.TimeAmt });
                        break;
                    //#endregion

                }
                if (MM.View == "Game") {
                    //console.log("VM.Game.OpEmail=" + VM.Game.OpEmail);
                    //console.log("VM.Game.OpUserId=" + VM.Game.OpUserId);
                    //console.log("VM.Game.OpName=" + VM.Game.OpName);
                    //console.log("VM.Game.OpRating=" + VM.Game.OpRating);
                    //console.log("VM.Game.GameName=" + VM.Game.GameName);
                    //console.log("VM.Game.Rated=" + VM.Game.Rated);
                    //console.log("VM.Game.Time=" + VM.Game.Time);
                    //console.log("---------------------------------");
                    VM.Game.Disabled = false;
                    this.SizeFunc();
                    VM.Game.Show_OpEmail = (VM.Game.OpEmail != null);
                    VM.Game.Show_OpUserId = (VM.Game.OpUserId != null);
                    VM.Game.Show_OpName = (VM.Game.OpName != null);
                    VM.Game.Show_OpRating = (VM.Game.OpRating != null);
                    VM.Game.Show_GameName = (VM.Game.GameName != null);
                    VM.Game.Show_Rated = (VM.Game.Rated != null);
                    VM.Game.Show_Time = (VM.Game.Time != null);
                }
                break;

            //#endregion

            //#region case "Click":
            case "Click":
                switch (pObj.Control) {

                    //#region case "Button":

                    case "Button":
                        //console.log("MainFunc.Click.Button * pObj.Button=" + pObj.Button);
                        switch (pObj.Button) {
                            default: MM.Data = [MM.GameId]; VM.Game.Disabled = true; break;

                            //#region case "Send":
                            case "Send":
                                //console.log("MainFunc.Click_Button.Send");
                                //console.log("MainFunc.Click_Button.Send * MM.Wiz=" + JSON.stringify(MM.Wiz));
                                //console.log("MM.Wiz.MessageBody=" + MM.Wiz.MessageBody);
                                VM.Game.Disabled = true;
                                MM.Data = { Rated: MM.Wiz.Rated, TimeAmt: MM.Wiz.TimeAmt, TimeInc: MM.Wiz.TimeInc, MessageBody: MM.Wiz.MessageBody }
                                if (MM.Wiz.OpUserId != null) MM.Data.OpUserId = MM.Wiz.OpUserId;
                                else { MM.Data.Email = MM.Wiz.Email; MM.Data.FirstName = MM.Wiz.FirstName; MM.Data.LastName = MM.Wiz.LastName; }
                                //console.log("MM.Data.Email=" + MM.Data.Email);
                                //console.log("MM.Data.FirstName=" + MM.Data.FirstName);
                                //console.log("MM.Data.LastName=" + MM.Data.LastName);
                                //console.log("MM.Data.OpUserId=" + MM.Data.OpUserId);
                                //console.log("MM.Data.Rated=" + MM.Data.Rated);
                                //console.log("MM.Data.Time=" + MM.Data.Time);
                                //console.log("MM.Data.MessageBody=" + MM.Data.MessageBody);
                                break;
                            //#endregion

                        }
                        this.ViewFunc({ Msg: "Wait_Send" });
                        break;

                 //#endregion

                }
                break;
            //#endregion

            //#region case "Web":
            case "Web":
                //console.log("GameSvc.MainFunc.Web * pObj.Event=" + pObj.Event + " * pObj=" + JSON.stringify(pObj));
                switch (pObj.Event) {

                    //#region case "ChallengeSend": break;

                    case "ChallengeSend":
                        //console.log("GameSvc.MainFunc.Web.Challenge * pObj.Data=" + JSON.stringify(pObj.Data));
                        //console.log("pObj.Data.Id=" + pObj.Data.Id);
                        //console.log("pObj.Data.GameName=" + pObj.Data.GameName);
                        //console.log("pObj.Data.Date=" + pObj.Data.Date);

                        //console.log("MM.UserProfiles.ProfileDefaultIdx=" + MM.UserProfiles.ProfileDefaultIdx);
                        //console.log("pObj.Data.Date=" + pObj.Data.Date);

                        //console.log("MM.Data=" + JSON.stringify(MM.Data));
                        //console.log("MM.Data.OpPhoto_Src.length=" + MM.Data.OpPhoto_Src.length);
                        //console.log("MM.Data.OpUserId=" + MM.Data.OpUserId);
                        //console.log("MM.Data.OpName=" + MM.Data.OpName);
                        //console.log("MM.Data.OpRating=" + MM.Data.OpRating);
                        //console.log("MM.Data.Body=" + MM.Data.Body);
                        //console.log("MM.UserProfiles.DefaultIdx=" + MM.UserProfiles.DefaultIdx);
                        //console.log("MM.Wiz=" + JSON.stringify(MM.Wiz));

                        MM.Data = {
                            Id: pObj.Data.Id,
                            GameName: pObj.Data.GameName,
                            Date: pObj.Data.Date,
                            Rated: MM.Wiz.Rated,
                            Time: MM.Wiz.Time,
                            ProfileIdx: MM.UserProfiles.DefaultIdx,
                            OpPhoto_Src: MM.Wiz.OpPhoto_Src,
                            OpUserId: MM.Wiz.OpUserId,
                            OpGroup: MM.Wiz.OpGroup,
                            OpRating: MM.Wiz.OpRating
                        }
                        //console.log("MM.Data=" + JSON.stringify(MM.Data));
                        //console.log("===========================");
                        //console.log("MM.Data.GameName=" + MM.Data.GameName);
                        //console.log("MM.Data.OpPhoto_Src.length=" + MM.Data.OpPhoto_Src.length);
                        //console.log("MM.Data.Date=" + MM.Data.Date);
                        //console.log("MM.Data.Rated=" + MM.Data.Rated);
                        //console.log("MM.Data.Time=" + MM.Data.Time);
                        //console.log("MM.Data.ProfileIdx=" + MM.Data.ProfileIdx);
                        //console.log("===========================");
                        break;
                    //#endregion

                    case "ChallengeAccepts": MM.Data = pObj.Data[0]; break;
                    case "ChallengeDecliness":
                    case "ChallengeResends":                       
                    case "ChallengeRetracts": MM.Data = { Id: pObj.Data[0] }; break;
                }

                break;
            //#endregion
        }
    }
    this.SizeFunc = function (pEvent, pObj) {
        //console.log("GameSvc.SizeFunc * GM.Sized.Game=" + GM.Sized.Game);
        //console.log("GameSvc.SizeFunc * VM.Game.Switch=" + VM.Game.Switch);
        if (GM.Sized.Game) return;
        StylesSvc.SizeFunc(VM.Game.OpponentFieldSet); StylesSvc.SizeFunc(VM.Game.OpponentLegend_Text); 
        StylesSvc.SizeFunc(VM.Game.Img);
        StylesSvc.SizeFunc(VM.Game.OpEmail_Label); StylesSvc.SizeFunc(VM.Game.OpEmail_Text);
        StylesSvc.SizeFunc(VM.Game.OpUserId_Label); StylesSvc.SizeFunc(VM.Game.OpUserId_Text);
        StylesSvc.SizeFunc(VM.Game.OpName_Label); StylesSvc.SizeFunc(VM.Game.OpName_Text);
        StylesSvc.SizeFunc(VM.Game.OpRating_Label); StylesSvc.SizeFunc(VM.Game.OpRating_Text);

        StylesSvc.SizeFunc(VM.Game.StatsFieldSet); StylesSvc.SizeFunc(VM.Game.StatsLegend_Text); 
        StylesSvc.SizeFunc(VM.Game.GameName_Label); StylesSvc.SizeFunc(VM.Game.GameName_Text);
        StylesSvc.SizeFunc(VM.Game.Rated_Label); StylesSvc.SizeFunc(VM.Game.Rated_Text);
        StylesSvc.SizeFunc(VM.Game.Time_Label); StylesSvc.SizeFunc(VM.Game.Time_Text);
        GM.Sized.Game = true;
    }
    this.ViewFunc = function (pObj) {
        if (pObj.View != null) {
            //console.log("GameSvc.ViewFunc.View * $location.path()=" + $location.path() + " * pObj.View=" + pObj.View);
            MM.View = pObj.View;
            switch ($location.path()) {
                case "/Games": VM.Games.Show_View = pObj.View; break
                case "/Players": VM.Players.Show_View = pObj.View; break;
                case "/Start": VM.Start.Show_View = pObj.View; break;
                default: alert("GameSvc.ViewFunc.View * $location.path()=" + $location.path() + " * pObj.View=" + pObj.View); break;
            }
        }
        if (pObj.Show != null) {
            switch (pObj.Show) {
                case "*": VM.Game.Switch = (MM.Wiz.OpUserId == null) ? "Opponent" : "Photo";
                case "Opponent": VM.Game.Switch = "Opponent"; break;
                case "Photo": VM.Game.Switch = "Photo"; break;
                default: alert("GameSvc.ViewFunc * pObj.Switch=" + pObj.Switch); break;
            }
        }
        if (pObj.Legend != null) {
            //console.log("pObj.Legend=" + pObj.Legend);
            //console.log("pObj.Text=" + pObj.Text);
            //console.log("pObj.Opponent_Text=" + pObj.Opponent_Text);
            //console.log("pObj.Stats_Text=" + pObj.Stats_Text);
            switch (pObj.Legend) {
                case "*":
                    if (MM.Processing) {
                        VM.Options.OpponentLegend = "Saving...";
                        VM.Options.StatsLegend = "Saving...";

                    }
                    else {
                        VM.Game.OpponentLegend = "Opponent";
                        VM.Game.StatsLegend = (MM.Wiz.OpUserId == null) ? "Stats" : MM.Wiz.OpUserId; 
                    }
                    break;
            }
            //console.log("VM.Game.OpponentLegend.Text=" + VM.Game.OpponentLegend.Text);
            //console.log("VM.Game.StatsLegend.Text=" + VM.Game.StatsLegend.Text);
        }
        if (pObj.Enable != null) {
            switch (pObj.Enable) {
                case "*": VM.Game.Disabled = MM.Preocessing; break;
                default: alert("Unknown pObj.Enable=" + pObj.Enable); break;
            }
        }
        if (pObj.Buttons != null) {
            //console.log("GameSvc.ViewFunc * pObj.Buttons=" + pObj.Buttons);
            switch (pObj.Buttons) {
                case "BackDeclineAccept":
                    VM.Game.Back_Show = true;
                    VM.Game.Decline_Show = true;
                    VM.Game.Accept_Show = true;

                    VM.Game.Resend_Show = false;
                    VM.Game.Retract_Show = false;
                    break;

                case "BackRetractResend":
                    VM.Game.Back_Show = true;
                    VM.Game.Retract_Show = true;
                    VM.Game.Resend_Show = true;

                    VM.Game.Decline_Show = false;
                    VM.Game.Accept_Show = false;
                    break;
                case "ExitBackBoard":
                    VM.Game.Exit_Show = true;
                    VM.Game.Back_Show = true;
                    VM.Game.Board_Show = true;

                    VM.Game.Retract_Show = false;
                    VM.Game.Resend_Show = false;
                    break;

                case "ExitBackSend":
                    VM.Game.Exit_Show = true;
                    VM.Game.Back_Show = true;
                    VM.Game.Send_Show = true;
                    VM.Game.Board_Show = false;
                    VM.Game.Retract_Show = false;
                    VM.Game.Resend_Show = false;
                    break;
                default: alert("GameSvc.ViewFunc * pObj.Buttons=" + pObj.Buttons); break;
            }
        }
        if (pObj.Msg) {
            //console.log("pObj.Msg=" + pObj.Msg);
            switch (pObj.Msg) {
                case "Error_Server": $rootScope.Msg = "Game server error."
                case "Error_YourUserId": $rootScope.Msg = "You cannot challenge yourself."; break;
                case "Error_EmailInvalid": $rootScope.Msg = "The email is not valid."; break;
                case "Info_Active": case "Active": $rootScope.Msg = "This game is active."; break;
                case "Info_Received": case "Received": $rootScope.Msg = "Click accept or decline to respond."; break;
                case "Info_Sent": case "Sent": $rootScope.Msg = "You may retract or resend the challenge."; break;
                case "Info_Complete": $rootScope.Msg = "Click send to challenge."; break;
                case "Wait_Accept": $rootScope.Msg = "Accepting the challenge..."; break;
                case "Wait_Decline": $rootScope.Msg = "Declining the challenge..."; break;
                case "Wait_ReSend": $rootScope.Msg = "Resending your challenge..."; break;
                case "Wait_Retract": $rootScope.Msg = "Retracting your challenge..."; break;
                case "Wait_Send": $rootScope.Msg = "Sending your challenge..."; break;
                default: alert("Game unknown pObj.Msg=" + pObj.Msg); break;
            }
        }
    }
}

