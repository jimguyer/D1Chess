angular.module('URLActionMod', [])
    .config(['$routeProvider', function ($routeProvider) {
        //$routeProvider.when('/URLAction', { templateUrl: '/Client/Views/Recover/Recover.html', controller: 'URLActionCtrl', controllerAs: 'URLActionVM' })
        $routeProvider.when('/URLAction', { templateUrl: '/Client/Views/URLAction/URLAction.html', controller: 'URLActionCtrl', controllerAs: 'URLActionVM' })
    }])
    .controller("URLActionCtrl", function ($rootScope, $scope, MemberSvc, URLActionSvc, UserWebSvc) {
       //console.log("URLActionCtrl");
        URLActionSvc.LoadFunc();
        UserWebSvc.GetFunc();
    })

    .service('URLActionSvc', function ($rootScope, $location, GameWebSvc, UtilitySvc, DMCSvc) {
       this.LoadFunc = function () {
          //console.log("URLActionSvc.LoadFunc");
          //console.log("Index.URL.Action = " + Index.URL.Action);
           switch (Index.URL.Action) {
               case "AddProfile": this.ViewFunc({ Msg: "Wait_Profile" }); break;
               case "Challenge": this.ViewFunc({ Msg: "Wait_Challenge" }); break;
               case "ConfirmEmail":
               case "ConfirmPhone": this.ViewFunc({ Msg: "Wait_User" }); break;
               case "Membership":
                   switch (Index.URL.Location) {
                       case "/Store": this.ViewFunc({ Msg: "Wait_User" }); break;
                       case "/User": this.ViewFunc({ Msg: "Wait_User" }); break;
                       case "/UserProfiles": this.ViewFunc({ Msg: "Wait_Profile" }); break;
                   }
                   break;
               default: this.ViewFunc({ Msg: "Wait_Reload" }); 
           }
       }
       this.ViewFunc = function (pObj) {
           if (pObj.URL != null) {
               switch (pObj.URL) {
                   //case "Anonymous": $location.url("/Anonymous"); break;
                   //case "Member": $location.url("/Member"); break;
                   case "Board": $location.url("/Board"); MM.View = "Board"; break;
                   case "Game":
                       $location.url("/Game");
                       if (pObj.OpEmailUserIdLabel != null) VM.Game.OpEmailUserIdLabel = pObj.OpEmailUserIdLabel;
                       break;                 
                   default:
                       alert("Unknown pObj.URL=" + pObj.URL);
                       break;
               }
           }
           if (pObj.Msg) {
               switch (pObj.Msg) {
                   case "Wait_Challenge": $rootScope.Msg = "Taking you to the challenge page..."; break;
                   case "Wait_Profile": $rootScope.Msg = "Returning you to the add profile page..."; break;
                   case "Wait_Reload": $rootScope.Msg = "Reloading your page. . . . "; break;
                   case "Wait_Store": $rootScope.Msg = "Returning you to the store..."; break;
                   case "Wait_User": $rootScope.Msg = "Returning you to the user page..."; break;
               }
           }
       }


   })
   .service('URLActionWebSvc', function ($rootScope) {
       //console.log("URLActionWebSvc");
   })
;