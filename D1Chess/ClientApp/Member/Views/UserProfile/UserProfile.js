angular.module('UserProfileMod', [])
    .directive('userprofiledir', UserProfileDir)
    .controller('UserProfileCtl', UserProfileCtl)
    .service('UserProfileWebSvc', UserProfileWebSvc)
    .service('UserProfileLinkSvc', UserProfileLinkSvc)
    .service('UserProfileSvc', UserProfileSvc)
    ;

function UserProfileDir() {
    return { restrict: "E", templateUrl: '/Client/Views/UserProfile/UserProfile.html', controller: 'UserProfileCtl as VM_UserProfile' };
}

function UserProfileCtl($scope, $location, UserProfileWebSvc, UserProfileLinkSvc, UserProfileSvc) {
    //console.log("UserProfileCtl");
    $scope.UserProfile = VM.UserProfile;
    GM.Scope = $scope;
    this.ClickDefaultFunc = function () { UserProfileWebSvc.RouteFunc("Click", { Control: "Button", Button: "Default" }); };
    this.ClickSaveFunc = function () { UserProfileWebSvc.RouteFunc("Click", { Control: "Button", Button: "Save" }); };
    
    this.ChangeFunc = function (pField) {
        //console.log("UserProfileCtl.ChangeFunc");

        UserProfileLinkSvc.RouteFunc("Change", { Field: pField })
    };

    this.ClickImgFunc = function () { UserProfileLinkSvc.RouteFunc("Click", { Control: "Img" }); };

    this.ClickExitFunc = function () {
        //console.log("UserProfileCtl.ClickExitFunc");

        UserProfileLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Exit" });
    };
    this.ClickCancelFunc = function () { UserProfileLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Cancel" }); };
    this.ClickPhotoFunc = function () { UserProfileLinkSvc.RouteFunc("Click", { Control: "Button", Button: "Photo" }); };

    this.ClickBackFunc = function () { UserProfileSvc.RouteFunc("Click", { Control: "Button", Button: "Back" }); };
    this.ClickEditFunc = function () { UserProfileSvc.RouteFunc("Click", { Control: "Button", Button: "Edit" }); };
}

function UserProfileWebSvc($http, UserProfileLinkSvc, UserProfileSvc, UserProfilesSvc, UtilitySvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("UserProfileWebSvc.RouteFunc * pEvent=" + pEvent);
        //console.log("pObj=" + JSON.stringify(pObj));
        switch (pEvent) {
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        UserProfileSvc.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        //console.log("UserProfileWebSvc.RouteFunc.Click.Button" + " * MM.Data=" + JSON.stringify(MM.Data));
                        switch (pObj.Button) {
                            case "Default": this.MainFunc("Post", { Event: "UserProfileDefault", Data: MM.Data }); break;
                            case "Save": this.MainFunc("Post", { Event: "UserProfileSave", Data: MM.Data }); break;
                        }
                }
                break;
        }
    }
    this.MainFunc = function (pEvent, pObj) {
        //console.log("UserProfileWebSvc.MainFunc * pEvent=" + pEvent);
        //console.log("pObj=" + JSON.stringify(pObj));
        var parms = UtilitySvc.WebParmsFunc(pEvent, { Event: pObj.Event, Data: MM.Data });
        switch (pEvent) {
            case "Post":
                //console.log("pObj.PostParms=" + JSON.stringify(pObj.PostParms));
                $http
                    .post("api/Web", parms)
                    .success(function (pWebReturn) {
                        //console.log("UserProfileWebSvc.MainFunc.Post.Success * pObj.Event=" + pObj.Event + " * MM.Data=" + JSON.stringify(MM.Data));
                        if (pWebReturn.Code == "Success") UserProfileLinkSvc.RouteFunc("Web", { Event: pObj.Event, Data: MM.Data });
                        else UserProfileSvc.RouteFunc("Error", { Event: pObj.Event, Error: pWebReturn.Code });
                    })
                    .error(function () { UserProfileSvc.RouteFunc("Error", { Event: pObj.Event, Error: "Server" }); });
                    ;
                break;
        }
    }
}

function UserProfileLinkSvc($http, UtilitySvc, UserProfileSvc, UserProfilesSvc, HomeSvc, PhotoSvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("UserProfileLinkSvc.RouteFunc * pEvent=" + pEvent);
        //console.log("pObj=" + JSON.stringify(pObj));
        switch (pEvent) {
            case "Change":
                //console.log("UserProfileLinkSvc.RouteFunc.Change * pObj.Field=" + pObj.Field);   
                this.MainFunc(pEvent, { Field: pObj.Field });
                UserProfileSvc.MainFunc(pEvent, { Field: pObj.Field });
                break;
            case "Click":
                //console.log("UserProfileLinkSvc.RouteFunc.Click * pObj.Control=" + pObj.Control);
                switch (pObj.Control) {
                    case "Button":
                        //console.log("UserProfileLinkSvc.RouteFunc.Click.Button" + " * pObj.Button=" + pObj.Button);
                         UserProfileSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                    case "Img":
                        //console.log("MessageLinkSvc.RouteFunc.Click.Button" + " * pObj.Button=" + pObj.Button);
                        UserProfileSvc.RouteFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button });
                        break;
                }
                break;
            case "Web":
                //console.log("UserProfileLinkSvc.RouteFunc.Web *   pObj.Event=" + pObj.Event + " * pObj.Data=" + JSON.stringify(pObj.Data));
                UserProfileSvc.RouteFunc(pEvent, { Event: pObj.Event, Data: pObj.Data });
                this.MainFunc(pEvent, { Event: pObj.Event, Data: pObj.Data });
                break;
        }
    };
    this.MainFunc = function (pEvent, pObj) {
        //console.log("UserProfileLinkSvc.MainFunc * pEvent=" + pEvent);
        //console.log("pObj=" + JSON.stringify(pObj));
        switch (pEvent) {
            case "Change":
                switch (pObj.Field) {
                    case "UserId": UserProfilesSvc.RouteFunc("_Link", { View_Event: "UserProfile_UserIdChange", Field: pObj.Field, Data: VM.UserProfile.UserId }); break;
                }
                break;

            case "Click":
                //console.log("UserProfileLinkSvc.MainFunc.Click * pObj.Control=" + pObj.Control);
                switch (pObj.Control) {
                    case "Button":
                        //console.log("UserProfileLinkSvc.MainFunc.Click.Button" + " * pObj.Button=" + pObj.Button);
                        switch (pObj.Button) {
                            case "Back": HomeSvc.RouteFunc("_Link", { View_Event: "UserProfile_ClickBack" }); break;
                            case "Cancel": UserProfilesSvc.RouteFunc("_Link", { View_Event: "UserProfile_ClickCancel" }); break;
                            case "Exit": HomeSvc.RouteFunc("_Link", { View_Event: "UserProfile_ClickExit" }); break;
                            case "Photo": PhotoSvc.RouteFunc("_Link", { View_Event: "UserProfile_ClickPhoto", Data: MM.UserProfiles.List[MM.Tabs.Idx].Photo_Src }); break;
                        }
                        break;
                    case "Img": PhotoSvc.RouteFunc("_Link", { View_Event: "UserProfile_ClickPhoto", Data: MM.UserProfiles.List[MM.Tabs.Idx].Photo_Src }); break;
                }
                break;
            case "Web":
                //console.log("UserProfileLinkSvc.MainFunc.Web");
                 switch (pObj.Event) {
                    case "DefaultSave": UserProfilesSvc.RouteFunc(pEvent, { View_Event: "UserProfile_Web_DefaultSave" }); break;
                    case "UserProfileSave": UserProfilesSvc.RouteFunc(pEvent, { View_Event: "UserProfileSave" }); break;
                }
                break
        }
    };
}

function UserProfileSvc($location, $rootScope, StylesSvc, UtilitySvc) {
    this.RouteFunc = function (pEvent, pObj) {
        //console.log("UserProfilesSvc.RouteFunc * pEvent=" + pEvent);
        //console.log("pObj=" + JSON.stringify(pObj));
        switch (pEvent) {
            //#region case "_Link":
            case "_Link":
                //console.log("UserProfile.MainFunc._Link * pObj.View_Event=" + pObj.View_Event);
                //console.log("pObj=" + JSON.stringify(pObj));
                switch (pObj.View_Event) {
                    case "Member_Init": this.InitFunc(); break;
                    case "Member_Size": this.SizeFunc(); break;
                    case "Photo_WebSave":         
                    case "Home_ClickProfiles":
                    case "UserProfiles_ClickTab": this.MainFunc(pEvent, { View_Event: pObj.View_Event, TabSet: pObj.TabSet, TabIdx: pObj.TabIdx }); break;
                    case "User_WebGetUser": this.MainFunc(pEvent, { View_Event: pObj.View_Event, Data: pObj.Data }); break;
                }
                break;
            //#endregion

            case "Change": this.MainFunc(pEvent, { Field: pObj.Field }); break;

            case "Click":
                //console.log("pObj=" + JSON.stringify(pObj));
                switch (pObj.Control) {
                    case "Button": this.MainFunc(pEvent, { Control: pObj.Control, Button: pObj.Button }); break;
                    case "Img": this.MainFunc(pEvent, { Control: pObj.Control }); break;
                    case "Tab": this.MainFunc(pEvent, { Control: pObj.Control, TabSet: pObj.TabSet, TabIdx: pObj.TabIdx  }); break;
                }
            case "Web":
                //console.log("UserProfilesSvc.RouteFunc.Web * pObj.Event=" + pObj.Event);
                this.MainFunc(pEvent, { Event: pObj.Event, Data: pObj.Data }); break;
        }
    }
    this.InitFunc = function () {
        //console.log("UserProfileSvc.InitFunc");
        //#region Init
        IM.UserProfile = { TabSwitch: "Var" };
        MM.UserProfile = { Loading: true };
        VM.UserProfile = {};
        VM.UserProfile.Img = { NgSrc: IM.PhotoLoading_Src };
        //#endregion 

        //#region Controls
        VM.UserProfile.FieldSet = StylesSvc.InitFunc({ Type: "FieldSetT" });
        VM.UserProfile.Legend_Text = StylesSvc.InitFunc({ Type: "LegendT" });
        VM.UserProfile.Img = StylesSvc.InitFunc({ Type: "ImgT" });

        var xL = .5, wL = 3, hL = .6, hR = .6, fs = .7;
        var xR = xL + wL + .15, wR = 9 - xR - xL;
        //*******************  Output  ************************************************
        var y = 10, yAdd = .7;
        VM.UserProfile.UserName_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, H: hL, FS: fs });
        VM.UserProfile.UserName_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, H: hR, FS: fs });

        var xL = .5, wL = 4.25, hL = .6, xR = xL + wL + .15, wR = 9 - xR - xL, hR = .6, fs = .7;
        y += yAdd;
        VM.UserProfile.Group_LabelO = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, H: hL, FS: fs });
        VM.UserProfile.Group_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, H: hR, FS: fs });
        y += yAdd;
        VM.UserProfile.Rating_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, H: hL, FS: fs });
        VM.UserProfile.Rating_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, H: hR, FS: fs });
        y += yAdd;
        VM.UserProfile.Challenges_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, H: hL, FS: fs });
        VM.UserProfile.Challenges_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, H: hR, FS: fs });

        var xL = .5, wL = 6.5, xR = xL + wL + .15, wR = 9 - xR - xL, fs = .6;
        y += yAdd;
        VM.UserProfile.GamesWinsLosses_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, H: hL, FS: fs });
        VM.UserProfile.GamesWinsLosses_Text = StylesSvc.InitFunc({ Type: "Text", X: xR, Y: y, W: wR, H: hR, FS: fs });

        //*******************  Input  ************************************************
        var xL = .5, wL = 2.75, hL = .6, xR = xL + wL + .15, wR = 9 - xR - xL - .25, hR = .5, fs = .7;
        var y = 10, yAdd = .8;
        VM.UserProfile.UserId_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, H: hL, FS: fs });
        VM.UserProfile.UserId_Input = StylesSvc.InitFunc({ Type: "Input", X: xR, Y: y, W: wR, H: hR, FS: fs });
        y += yAdd;
        VM.UserProfile.FirstName_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, H: hL, FS: fs });
        VM.UserProfile.FirstName_Input = StylesSvc.InitFunc({ Type: "Input", X: xR, Y: y, W: wR, H: hR, FS: fs });
        y += yAdd;
        VM.UserProfile.LastName_Label = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, H: hL, FS: fs });
        VM.UserProfile.LastName_Input = StylesSvc.InitFunc({ Type: "Input", X: xR, Y: y, W: wR, H: hR, FS: fs });
        y += yAdd;
        VM.UserProfile.Group_LabelI = StylesSvc.InitFunc({ Type: "LabelR", X: xL, Y: y, W: wL, H: hL, FS: fs });
        VM.UserProfile.Group_Input = StylesSvc.InitFunc({ Type: "Input", X: xR, Y: y, W: wR, H: hR, FS: fs });
        //#endregion

        //#region Buttons
        VM.UserProfile.Exit = MM.ButtonTL;

        VM.UserProfile.Back = MM.ButtonTC;
        VM.UserProfile.Cancel = MM.ButtonTC;
        VM.UserProfile.Default = MM.ButtonTC;
        VM.UserProfile.Photo = MM.ButtonTC;

        VM.UserProfile.Edit = MM.ButtonTR;
        VM.UserProfile.Save = MM.ButtonTR;
        //#endregion
    }

    this.MainFunc = function (pEvent, pObj) {
        //console.log("UserProfile.MainFunc * pEvent=" + pEvent + " * pObj.View_Event=" + pObj.View_Event);
        switch (pEvent) {
            //#region case "_Link":
            case "_Link":
                //console.log("UserProfile.MainFunc._Link * pObj.View_Event=" + pObj.View_Event);
                switch (pObj.View_Event) {
                    case "Photo_WebSave": VM.UserProfile.Photo_Src = pObj.Data; this.ViewFunc({ View: "UserProfile", Msg: "Web_PhotoChanged" }); break;
                    case "Photo_ClickBack": this.ViewFunc({ View: "UserProfile", Msg: "Info_PhotoCancelled" }); break;
                    case "MembershipUpgrade": this.ViewFunc({ View: "UserProfile", Msg: "Web_MemberUpgrade" }); break;
                    case "Home_ClickProfiles": this.ViewFunc({ View: "UserProfile", Switch: "Output" }); break;
                    case "UserProfiles_ClickTab": this.ViewFunc({ View: "UserProfile", Switch: "Output" });
                        MM.Tabs.Set = pObj.TabSet;
                        MM.Tabs.Idx = pObj.TabIdx;
                        break;
                    case "User_WebGetUser":
                        break;
                }
                //console.log("MM.View=" + MM.View);
                if (MM.View == "UserProfile") {
                    //console.log("------------------- UserProfile ---------------------------------");
                    MM.Tabs = MM.UserProfiles.Tabs;
                    this.ViewFunc({ Switch: "Output" });
                    this.SizeFunc();
                    //console.log("MM.UserProfiles.Loading=" + MM.UserProfiles.Loading);
                    if (MM.UserProfiles.Loading) {
                        VM.UserProfile.Photo_Src = Dir.Photo + "PhotoLoading.png";
                        this.ViewFunc({ Buttons: "ExitPhotoEdit", Enable: "*", Msg: "Wait_Loading" });
                        break;
                    }
                    else {
                        //console.log("------------------- Loaded ---------------------------------");
                        //console.log("MM.Tabs.Set=" + MM.Tabs.Set);
                        //console.log("MM.Tabs.Idx=" + MM.Tabs.Idx);

                        //console.log("MM.UserProfiles.Tabs.Set=" + MM.UserProfiles.Tabs.Set);
                        //console.log("MM.UserProfiles.Tabs.Idx=" + MM.UserProfiles.Tabs.Idx);

                        //console.log("MM.UserProfiles.Tabs=" + JSON.stringify(MM.UserProfiles.Tabs));
                        //console.log("MM.Tabs=" + JSON.stringify(MM.Tabs));
                        //console.log("VM.Tabs=" + JSON.stringify(VM.Tabs));
                        switch (VM.Tabs.Set) {
                            case "Main":
                                //console.log("UserProfile.MainFunc._Link * pObj.View_Event=" + pObj.View_Event);
                                //console.log("UserProfileSvc.MainFunc.Loaded.Main");
                                //console.log("MM.Tabs.Idx=" + JSON.stringify(MM.Tabs.Idx));
                                //console.log("MM.UserProfiles.List.length=" + MM.UserProfiles.List.length);
                                VM.UserProfile.Legend = MM.UserProfiles.List[MM.Tabs.Idx].UserId;
                                MM.UserProfiles.Idx = MM.Tabs.Idx;
                                MM.Photo = { Photo_SaveSrc: MM.UserProfiles.List[MM.Tabs.Idx].Photo_Src };
                                VM.UserProfile.Img.NgSrc = (MM.UserProfiles.List[MM.Tabs.Idx].Photo_Src.length == 0) ?
                                    IM.PhotoClick_Src : MM.UserProfiles.List[MM.Tabs.Idx].Photo_Src;
                                VM.UserProfile.UserId = MM.UserProfiles.List[MM.Tabs.Idx].UserId;
                                VM.UserProfile.FirstName = MM.UserProfiles.List[MM.Tabs.Idx].FirstName;
                                VM.UserProfile.LastName = MM.UserProfiles.List[MM.Tabs.Idx].LastName;
                                VM.UserProfile.UserName = MM.UserProfiles.List[MM.Tabs.Idx].FirstName + " " + MM.UserProfiles.List[MM.Tabs.Idx].LastName;
                                VM.UserProfile.Group = MM.UserProfiles.List[MM.Tabs.Idx].Group;
                                VM.UserProfile.Rating = MM.UserProfiles.List[MM.Tabs.Idx].Rating;
                                VM.UserProfile.Challenges = MM.UserProfiles.List[MM.Tabs.Idx].Challenges;
                                VM.UserProfile.GamesWinsLosses = MM.UserProfiles.List[MM.Tabs.Idx].GamesWinsLosses;
                                this.ViewFunc({ Msg: "Init" });

                                if (VM.UserProfile.Switch == "Input") this.ViewFunc({ Msg: "Init_Edit" });
                                else if (MM.UserProfiles.List.length == 1) this.ViewFunc({ Buttons: "ExitPhotoEdit", Enable: "PhotoEdit", Msg: "Init_Only" });
                                else if (MM.UserProfiles.Idx == MM.UserProfiles.DefaultIdx) this.ViewFunc({ Buttons: "ExitPhotoEdit", Enable: "PhotoEdit", Msg: "Init_Default" });
                                else this.ViewFunc({ Buttons: "ExitDefaultEdit", Enable: "PhotoEdit", Msg: "Init_NotDefault" });
                                break;
                            case "Right":
                                //console.log("------------------- Right ---------------------------------");
                                MM.UserProfile.Mode = "Add";
                                VM.UserProfile.Photo_Src = IM.PhotoClick_Src;
                                VM.UserProfile.UserId = "";
                                VM.UserProfile.FirstName = "";
                                VM.UserProfile.LastName = "";
                                VM.UserProfile.Group = "Newbie";
                                this.ViewFunc({ Switch: "Input", Buttons: "ExitCancelSave", Enable: "Disable_Save", Msg: "Init_New" });
                                break;
                        }
                    }
                    break;
                }
            //#endregion":
            case "Change":
                switch (pObj.Field) {
                    case "UserId": this.ViewFunc({ Legend: VM.UserProfile.UserId }); break;
                }
                this.ViewFunc({ Enable: "Save" }); break;
            case "Click":
                switch (pObj.Control) {
                    case "Button":
                        //console.log("UserProfile.MainFunc.Click.Button * pObj.Button=" + pObj.Button);
                        switch (pObj.Button) {
                            case "Cancel":
                                VM.UserProfile.Photo_Src = MM.UserProfiles.List[MM.UserProfiles.Idx].Photo_Src;
                                VM.UserProfile.FirstName = MM.UserProfiles.List[MM.UserProfiles.Idx].FirstName;
                                VM.UserProfile.LastName = MM.UserProfiles.List[MM.UserProfiles.Idx].LastName;
                                VM.UserProfile.Group = MM.UserProfiles.List[MM.UserProfiles.Idx].Group;
                                VM.UserProfile.UserName = MM.UserProfiles.List[MM.UserProfiles.Idx].FirstName + " " + MM.UserProfiles.List[MM.UserProfiles.Idx].LastName;
                                this.ViewFunc({Switch: "Output"});
                                if (MM.UserProfiles.Idx == MM.UserProfiles.DefaultIdx) this.ViewFunc({ Buttons: "ExitPhotoEdit" }); else this.ViewFunc({ Buttons: "ExitDefaultEdit" });
                                break;
                            case "Default":
                                //console.log("ViewFunc.Click_Button.Default= * MM.UserProfiles.Idx=" + MM.UserProfiles.Idx);
                                MM.UserProfiles.DefaultIdx = MM.UserProfiles.Idx;
                                MM.Practice.MePhoto_NgSrc = MM.UserProfiles.List[MM.UserProfiles.DefaultIdx].Photo_Src;
                                MM.Data = MM.UserProfiles.Idx;
                                this.ViewFunc({ Enable: "Disable", Msg: "Wait_Default" });    
                                break;
                            case "Edit":
                                MM.UserProfile.Mode = "Edit";
                                this.ViewFunc({ Switch: "Input", Enable: "All", Buttons: "ExitCancelSave", Enable: "Cancel", Disable: "Save_Disable", Msg: "Init_Input" });
                                break;
                            case "Save":
                                //console.log("ViewFunc.Click_Button.Save= * MM.UserProfile.Mode=" + MM.UserProfile.Mode);
                                //console.log("MM.UserProfiles.Idx=" + MM.UserProfiles.Idx);
                                //console.log("MM.UserProfiles.List.length=" + MM.UserProfiles.List.length);
                                //MM.Photo.Photo_SaveSrc
                                //console.log("MM.UserProfiles.Idx=" + MM.UserProfiles.Idx);
                                MM.Data = {
                                    Idx: (MM.UserProfile.Mode == "Add") ? MM.UserProfiles.List.length : MM.UserProfiles.Idx,
                                    UserId: VM.UserProfile.UserId,
                                    FirstName: VM.UserProfile.FirstName,
                                    LastName: VM.UserProfile.LastName,
                                    Group: VM.UserProfile.Group
                                };
                                this.ViewFunc({ Disable: "All", B_Disable: "CancelSave", Msg:"Wait_Update" });

                                //console.log("MM.Data=" + JSON.stringify(MM.Data));
                                break;
                        }
                        break;
                    case "Img":
                }
                break;

            case "Web":
                //console.log("UserProfileSvc.MainFunc.Web * pObj.Event=" + pObj.Event + " * pObj.Data=" + JSON.stringify(pObj.Data));
                switch (pObj.Event) {
                    case "UserProfileDefault": this.ViewFunc({ Buttons: "ExitPhotoEdit", Enable: "All", Msg: "Web_Default" });

                        break;
                    case "UserProfileSave":
                        //console.log("UserProfileSvc.MainFunc.Web.UserProfileSave * pObj.Data=" + JSON.stringify(pObj.Data));
                        //console.log("MM.UserProfile.Mode=" + MM.UserProfile.Mode);
                        VM.UserProfile.UserName = VM.UserProfile.FirstName + " " + VM.UserProfile.LastName;
                        this.ViewFunc({ Switch: "Output", Buttons: "ExitPhotoEdit", B_Enable: "All" }); 
                        if (MM.UserProfiles.Idx == MM.UserProfiles.DefaultIdx) this.ViewFunc({ Buttons: "ExitPhotoEdit" });
                        else this.ViewFunc({ Buttons: "ExitDefaultEdit" });

                        MM.UserProfiles.List[pObj.Data.Idx].UserId = pObj.Data.UserId;
                        MM.UserProfiles.List[pObj.Data.Idx].FirstName = pObj.Data.FirstName;
                        MM.UserProfiles.List[pObj.Data.Idx].LastName = pObj.Data.LastName;
                        MM.UserProfiles.List[pObj.Data.Idx].Group = pObj.Data.Group;

                        if (MM.UserProfile.Mode == "Add") {
                            VM.UserProfile.Rating = "1200";
                            VM.UserProfile.Challenges = "0";
                            VM.UserProfile.GamesWinsLosses = "0/0/0";
                        }
                        this.ViewFunc({ Msg: "Web_Save" });

                }
                break;
            default: alert("Unkown");

        }
    }
    this.SizeFunc = function (pEvent) {
        //console.log("UserProfileSvc.SizeFunc");
        //console.log("UserProfileSvc.SizeFunc * VM.UserProfile.Switch=" + VM.UserProfile.Switch);
        UtilitySvc.TabFunc("Show", { Switch: IM.UserProfile.TabSwitch });
        if (GM.Sized.UserProfile) return;
        StylesSvc.SizeFunc(VM.UserProfile.FieldSet);
        StylesSvc.SizeFunc(VM.UserProfile.Legend_Text, true); 
        StylesSvc.SizeFunc(VM.UserProfile.Img);
        StylesSvc.SizeFunc(VM.UserProfile.UserName_Label); StylesSvc.SizeFunc(VM.UserProfile.UserName_Text);
        StylesSvc.SizeFunc(VM.UserProfile.Group_LabelO); StylesSvc.SizeFunc(VM.UserProfile.Group_Text);
        StylesSvc.SizeFunc(VM.UserProfile.Rating_Label); StylesSvc.SizeFunc(VM.UserProfile.Rating_Text);
        StylesSvc.SizeFunc(VM.UserProfile.Challenges_Label); StylesSvc.SizeFunc(VM.UserProfile.Challenges_Text);
        StylesSvc.SizeFunc(VM.UserProfile.GamesWinsLosses_Label); StylesSvc.SizeFunc(VM.UserProfile.GamesWinsLosses_Text);
        StylesSvc.SizeFunc(VM.UserProfile.UserId_Label); StylesSvc.SizeFunc(VM.UserProfile.UserId_Input);
        StylesSvc.SizeFunc(VM.UserProfile.FirstName_Label); StylesSvc.SizeFunc(VM.UserProfile.FirstName_Input);
        StylesSvc.SizeFunc(VM.UserProfile.LastName_Label); StylesSvc.SizeFunc(VM.UserProfile.LastName_Input);
        StylesSvc.SizeFunc(VM.UserProfile.Group_LabelI); StylesSvc.SizeFunc(VM.UserProfile.Group_Input);

        //console.log("UserProfileSvc.SizeFunc * VM.UserProfile.UserId_Label.Size=" + JSON.stringify(VM.UserProfile.UserId_Label.Size));
        //console.log("UserProfileSvc.SizeFunc * VM.UserProfile.UserId_Label.NgStyle=" + JSON.stringify(VM.UserProfile.UserId_Label.NgStyle));

        GM.Sized.UserProfile = true;
    }
    this.ViewFunc = function (pObj) {
        //console.log("UserProfileSvc.ViewFunc pObj=" + JSON.stringify(pObj));
        if (pObj.View != null) {
            //console.log("pObj.View=" + pObj.View);
            MM.View = pObj.View;
            //console.log("UserProfileSvc.ViewFunc $location.path()=" + $location.path());
            //console.log("UserProfileSvc.ViewFunc pObj=" + JSON.stringify(pObj));
            switch ($location.path()) {
                case "/UserProfiles":
                    VM.UserProfiles.Show_View = "Tabs";
                    VM.UserProfiles.Show_Tab = pObj.View;
                    break;
            }
        }
        if (pObj.Legend != null) {
            //console.log("pObj.Legend=" + pObj.Legend);
            VM.UserProfile.Legend = pObj.Legend;
        }
        if (pObj.TabIdx != null) {
            MM.Tabs.Idx = pObj.TabIdx;
            MM.View = (pObj.TabIdx < MM.UserProfiles.Limit) ? "UserProfile" : "Membership";
            VM.UserProfiles.Show_Tab = MM.View;
        }
        if (pObj.Switch != null) {
            //console.log("pObj.Switch=" + pObj.Switch);
            VM.UserProfile.Switch = pObj.Switch;
        }
        if (pObj.Buttons != null) {
            //console.log("pObj.Buttons=" + pObj.Buttons);
            switch (pObj.Buttons) {
                case "ExitCancelSave":
                    VM.UserProfile.Back_Show = false;
                    VM.UserProfile.Cancel_Show = true;
                    VM.UserProfile.Default_Show = false;
                    VM.UserProfile.Edit_Show = false;
                    VM.UserProfile.Photo_Show = false;
                    VM.UserProfile.Save_Show = true;
                    break;

                case "ExitDefaultEdit":
                    VM.UserProfile.Back_Show = false;
                    VM.UserProfile.Cancel_Show = false;
                    VM.UserProfile.Default_Show = true;
                    VM.UserProfile.Edit_Show = true;
                    VM.UserProfile.Photo_Show = false;
                    VM.UserProfile.Save_Show = false;
                    break;
                case "ExitPhotoEdit":
                    VM.UserProfile.Back_Show = false;
                    VM.UserProfile.Cancel_Show = false;
                    VM.UserProfile.Default_Show = false;
                    VM.UserProfile.Edit_Show = true;
                    VM.UserProfile.Photo_Show = true;
                    VM.UserProfile.Save_Show = false;
                    break;
            }
        }
        if (pObj.Enable != null) {
            switch (pObj.Enable) {
                case "*": VM.UserProfile.Disabled = (MM.UserProfiles.Loading); break;
                case "Disable": VM.UserProfile.Disabled = true; break;
                case "Save_Disable": Save_Disabled = false;
                case "Save_Disable": Save_Disabled = true;
                case "PhotoEdit": VM.UserProfile.Photo_Save = true; VM.UserProfile.Edit_Save = true; break;

            }
        }
        if (pObj.Msg != null) {
            //console.log("UserProfileSvc.ViewFunc * pObj.Msg=" + pObj.Msg);
            switch (pObj.Msg) {
                case "Err_IdInUse": $rootScope.Msg = "This User ID is already in use. "; break;
                case "Err_NoChange": $rootScope.Msg = "No changes were made."; break;
                case "Err_Server": $rootScope.Msg = "Server error."; break;

                case "Info_Back": VM.UserProfile.Photo_Save = true; VM.UserProfile.Edit_Save = true; break;
                case "Info_EditCancel": $rootScope.Msg = (MM.UserProfile.Mode == "Add") ? "You profile add has been canceled." : "You profile changes have been canceled."; break;
                case "Info_PhotoCancelled": $rootScope.Msg = "Photo change cancelled."; break;

                case "Init_Default": $rootScope.Msg = VM.UserProfile.UserId + " is your default profile."; break;
                case "Init_Edit": $rootScope.Msg = "You may edit " + VM.UserProfile.UserId; break;
                case "Init_Input": $rootScope.Msg = "You may change your profile."; break;
                case "Init_New": $rootScope.Msg = "Enter your new profile information."; break;
                case "Init_NotDefault": $rootScope.Msg = VM.UserProfile.UserId + " is not your default profile."; break;
                case "Init_Only": $rootScope.Msg = VM.UserProfile.UserId + " is your only profile."; break;

                case "Wait_Default": $rootScope.Msg = "Making this profile your default..."; break;
                case "Wait_Loading": $rootScope.Msg = "Loading your profiles..."; break;
                case "Wait_Update": $rootScope.Msg = (MM.UserProfile.Mode == "Add") ? "Adding your new profile..." : "Updating your profile..."; break;

                case "Web_Default": $rootScope.Msg = VM.UserProfile.UserId + " is now your default profile."; break;
                case "Web_MemberUpgrade": $rootScope.Msg = "Your membership has been upgraded."; break;
                case "Web_PhotoChanged": $rootScope.Msg = "Photo change completed."; break;
                case "Web_Save": $rootScope.Msg = VM.UserProfile.UserId + " has been saved."; break;
                case "Web_Updated": $rootScope.Msg = (MM.UserProfile.Mode == "Add") ? "Profile added" : "Profile Updated"; break;
            }
        }
    }
}