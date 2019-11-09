angular.module('RoleMod', []).service('Role', RoleSvc);

function RoleSvc(Hub, Home) {
    //console.log("MemberCtl");

    this.Init = function () {
        GM.View_Event = "App_Boot";
        Home.Init();


        //BoardSvc.RouteFunc("_Link", { View_Event: "Member_Init" });
        //EmailSvc.RouteFunc("_Link", { View_Event: "Member_Init" });
        //GameSvc.RouteFunc("_Link", { View_Event: "Member_Init" });
        //GamesSvc.RouteFunc("_Link", { View_Event: "Member_Init" });
        //HistorySvc.RouteFunc("_Link", { View_Event: "Member_Init" });
        //MembershipSvc.RouteFunc("_Link", { View_Event: "Member_Init" });
        //MessageSvc.RouteFunc("_Link", { View_Event: "Member_Init" });
        //OptionsSvc.RouteFunc("_Link", { View_Event: "Member_Init" });
        //PasswordSvc.RouteFunc("_Link", { View_Event: "Member_Init" });
        //PhoneSvc.RouteFunc("_Link", { View_Event: "Member_Init" });
        //PhotoSvc.RouteFunc("_Link", { View_Event: "Member_Init" });
        //ProfileSvc.RouteFunc("_Link", { View_Event: "Member_Init" });
        //ProfilesSvc.RouteFunc("_Link", { View_Event: "Member_Init" });
        //SearchSvc.RouteFunc("_Link", { View_Event: "Member_Init" });
        //StartEmailSvc.RouteFunc("_Link", { View_Event: "Member_Init" });
        //StartParmsSvc.RouteFunc("_Link", { View_Event: "Member_Init" });
        //UserProfileSvc.RouteFunc("_Link", { View_Event: "Member_Init" });
        //UserSvc.RouteFunc("_Link", { View_Event: "Member_Init" });

        //HistorySvc.MainFunc("_Link", { View_Event: "Member_Init" });
        //StartSvc.MainFunc("_Link", { View_Event: "Member_Init" });
        //UserProfilesSvc.RouteFunc("_Link", { View_Event: "Member_Init" });
        //window.onresize = function () { this.OnResize(); };

    };
    this.OnResize = function () {
        //console.log("Anoymous.OnResize * GM.View=" + GM.View);
        if (GM.Scope === undefined || GM.Scope === null)  return;
        switch (GM.View) {
            //case "Board": GM.Scope.$apply(BoardSvc.RouteFunc("_Link", { View_Event: "Member_Size" })); break;
            //case "Email": GM.Scope.$apply(EmailSvc.RouteFunc("_Link", { View_Event: "Member_Size" })); break;
            //case "Game": GM.Scope.$apply(GameSvc.RouteFunc("_Link", { View_Event: "Member_Size" })); break;
            //case "GamesActive":
            //case "GamesReceived":
            //case "GamesSent": GM.Scope.$apply(GamesSvc.RouteFunc("_Link", { View_Event: "Member_Size" })); break;
            case "Home": GM.Scope.$apply(Home.Size()); break;
            //case "Membership": GM.Scope.$apply(MembershipSvc.RouteFunc("_Link", { View_Event: "Member_Size" })); break;
            //case "Message": GM.Scope.$apply(MessageSvc.RouteFunc("_Link", { View_Event: "Member_Size" })); break;
            //case "Options": GM.Scope.$apply(OptionsSvc.RouteFunc("_Link", { View_Event: "Member_Size" })); break;
            //case "Password": GM.Scope.$apply(PasswordSvc.RouteFunc("_Link", { View_Event: "Member_Size" })); break;
            //case "Phone": GM.Scope.$apply(PhoneSvc.RouteFunc("_Link", { View_Event: "Member_Size" })); break;
            //case "Photo": GM.Scope.$apply(PhotoSvc.RouteFunc("_Link", { View_Event: "Member_Size" })); break;
            //case "Profile": GM.Scope.$apply(ProfileSvc.RouteFunc("_Link", { View_Event: "Member_Size" })); break;
            //case "Profiles": GM.Scope.$apply(ProfilesSvc.RouteFunc("_Link", { View_Event: "Member_Size" })); break;
            //case "Search": GM.Scope.$apply(SearchSvc.RouteFunc("_Link", { View_Event: "Member_Size" })); break;
            //case "StartEmail": GM.Scope.$apply(StartEmailSvc.RouteFunc("_Link", { View_Event: "Member_Size" })); break;
            //case "StartParms": GM.Scope.$apply(StartParmsSvc.RouteFunc("_Link", { View_Event: "Member_Size" })); break;
            //case "UserProfile": GM.Scope.$apply(UserProfileSvc.RouteFunc("_Link", { View_Event: "Member_Size" })); break;
        };
    };
}
