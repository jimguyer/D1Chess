angular.module('RegisterMod', [])
    .config(RegisterConfig)
    .controller('RegisterCtl', RegisterCtl)
    .service('Register', RegisterSvc)
;

function RegisterConfig($routeProvider) {
    $routeProvider.when('/register', { templateUrl: '/Client/Anonymous/Routes/Register/Register.html', controller: 'RegisterCtl as VC' });
}

function RegisterCtl($scope) {
    //console.log("RegisterCtl");
    Constructor();
    ngOnInit();

    function Constructor() {
        //console.log("Register.Constructor");
        GM.Route = $scope;
        GM.Route.VM = VM.Register;
    }

    function ngOnInit() {
        //console.log("LogOn.ngOnInit * GM.View_Event=" + GM.View_Event);
        var vm = GM.Route.VM 
        GM.Location = "Register";
        switch (GM.View_Event) {
            case "LogOn_Register": this.VM.Switch = "Registration"; break;
        }
    }
}
function RegisterSvc() {
    this.Init = function () {
        //console.log("RegisterSvc.Init");
        VM.Register = { Switch: "Registration" };
    };
}