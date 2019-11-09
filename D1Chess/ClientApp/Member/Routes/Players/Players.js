angular.module('PlayersMod', []).config(PlayersConfig).controller('PlayersCtl', PlayersCtl);

function PlayersConfig($routeProvider) {
    $routeProvider.when('/Players', { templateUrl: '/Client/Routes/Member/Players/Players.html', controller: 'PlayersCtl' });
}

function PlayersCtl($scope, UserWebSvc, UserLinkSvc, UserSvc) { $scope.Players = VM.Players; }