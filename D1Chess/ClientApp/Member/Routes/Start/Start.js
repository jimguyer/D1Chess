angular.module('StartMod', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/Start', { templateUrl: '/Client/Member/Start/Start.html', controller: 'StartCtrl' });
    }])
    .controller("StartCtrl", function ($scope) { $scope.Start = VM.Start; })
    .service('StartSvc', function () {
        this.MainFunc = function (pEvent, pObj) {
            switch (pEvent) {
                case "_Link":
                    switch (pObj.View_Event) {
                        case "Member_Init": this.InitFunc(pEvent, { View_Event: pObj.View_Event, Data: pObj.Data }); break;
                    }
                    break;
            }
        }
        this.InitFunc = function () { VM.Start = { Enabled: {}, Show: {} }; MM.Start = { RowsPerPage: 5 }; }
    })
;
