angular.module('PracticeMod', [])
    .config(PracticeConfig)
    .controller('PracticeCtl', PracticeCtl)
    .service('Practice', PracticeSvc)
    ;

function PracticeConfig($routeProvider) {
    $routeProvider.when('/practice', { templateUrl: '/Client/Anonymous/Routes/Practice/Practice.html', controller: 'PracticeCtl as VC' });
}

function PracticeCtl($scope) {
    //console.log("PracticeCtl");
    Constructor();
    ngOnInit();

    function Constructor() {
        //console.log("Practice.Constructor");
        GM.Route = $scope;
        GM.Route.VM = VM.Practice;
    }

    function ngOnInit() {
        //console.log("LogOn.ngOnInit * GM.View_Event=" + GM.View_Event);
        var vm = GM.Route.VM
        GM.Location = "Practice";
        switch (GM.View_Event) {
            case "LogOn_Practice": this.VM.Switch = "Board"; break;
        }
    }
}
function PracticeSvc() {
    this.Init = function () {
        //console.log("PracticeSvc.Init");
        VM.Practice = { Switch: "Registration" };
    };
}