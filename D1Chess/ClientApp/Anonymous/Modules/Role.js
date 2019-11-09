angular.module('RoleMod', []).service('Role', RoleSvc);

function RoleSvc(Hub, LogOn, Privacy, Recover, Register, Registration ) {
    this.Init = function () {
        //console.log("Role.Init");
        GM.View_Event = "App_Boot";
        LogOn.Init();
        //Practice.Init();
        Privacy.Init();
        Recover.Init();
        Register.Init();
        Registration.Init();
    };
    this.OnResize = function () {
         //console.log("Anoymous.OnResize * GM.View=" + GM.View);
        if (GM.Scope === null) return;
        switch (GM.View) {
            case "LogOn": GM.Scope.$apply(LogOn.Size()); break;
            case "Privacy": GM.Scope.$apply(Privacy.Size()); break;
            case "Recover": GM.Scope.$apply(Recover.Size()); break;
        }
    };
}