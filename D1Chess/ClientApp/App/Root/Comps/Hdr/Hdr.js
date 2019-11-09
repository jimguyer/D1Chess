angular.module('HdrMod', [])
  .directive('hdr', HdrDir)
  .controller('HdrCtl', HdrCtl)
  ;

function HdrDir() {
  return { restrict: "E", templateUrl: 'ClientApp/App/Master/Comps/Hdr/Hdr.html', controller: 'HdrCtl as VM' };
}

function HdrCtl($location) {
  //console.log("HdrCtl");
  this.OnClick = function (pControl) {
    //console.log("App.OnClick * pControl=" + pControl);
    switch (pControl) {
      case "LeftDiamond":
        //console.log("Left Diamond");
        Web.Get("Ping", "LeftDiamond", (result) => App.Web(result));
        break;
      case "RightDiamond":
        //console.log("Right Diamond");
        Web.Get("Ping", "RightDiamond", (result) => App.Web(result));
        break;
    }
  };
}

function HdrSvc(Style, Size) {

  this.Init = function () {
    //console.log("App.Init");
    //console.log("App.Init * GM.Src.Background =" + GM.Src.Background);

    VM.App = {
      Background: Style.Build({ L: 0, T: 0, Z: -1, S: "100%", Src: GM.Src.Background }, false),
      View: Style.Build({ Z: -1, W: "100%", H: "100%", Src: GM.Src.Background }, false),
      Div: Style.Build({ Z: 1, L: 0, T: 0, H: GM.H_Header, W: "100%", BgC: "B" }, false),
      Label: Style.Build({ Z: 3, T: 0, X: .5, W: 8, F: "1WhBGeorgia", TA: "C" }, true),
      Img_L: Style.Build({ Z: 1, L: .2, T: .05, S: .9, Src: GM.Src.Diamond }, false),
      Img_R: Style.Build({ Z: 1, R: .2, T: .05, S: .9, Src: GM.Src.Diamond }, false),
      Msg: Style.Build({ X: 0, Y: 15.25, Z: 1, W: 9, F: "A1", TA: "C" }, false)
    };

    //console.log("App.Size * VM.App.Background.Size=" + JSON.stringify(VM.App.Background.Size));
    //console.log("App.Size * VM.App.Background.Style=" + JSON.stringify(VM.App.Background.Style));
    //console.log("App.Size * VM.App.Msg.Style=" + JSON.stringify(VM.App.Msg.Style));
    //console.log("App.Size * VM.App.View.Style=" + JSON.stringify(VM.App.View.Style));
    //console.log("App.Size * VM.App.Div.Style=" + JSON.stringify(VM.App.Div.Style));
    //console.log("App.Size * VM.App.Div.Size=" + JSON.stringify(VM.App.Div.Size));
    //console.log("App.Size * VM.App.Label.Size=" + JSON.stringify(VM.App.Label.Size));
    //console.log("App.Size * VM.App.Img_L.Size=" + JSON.stringify(VM.App.Img_L.Size));
    //console.log("App.Size * VM.App.Img_R.Size=" + JSON.stringify(VM.App.Img_R.Size));
    //console.log("App.Size * VM.App.Msg.Size=" + JSON.stringify(VM.App.Msg.Size));

  };

  this.Web = function (pResult) {
    //console.log("Registration.Web * pResult=" + JSON.stringify(pResult));

    //console.log("Registration.Web * pResult.Action=" + pResult.Action);
    //console.log("Registration.Web * pResult.Success=" + pResult.Success);
    //console.log("Registration.Web * pResult.Data=" + JSON.stringify(pResult.Data));
    var vm = VM.Registration;

    switch (pResult.Action) {
      case "Ping":
        //console.log("Ping returned");
        break;
    }
  };


  this.Size = function () {
    //console.log("App.Size");
    //console.log("App.Size * this.VM.Msg.Size=" + JSON.stringify(this.VM.Msg.Size));
    //if (GM.Sized.App) return;
    //Size.ViewModel(this.VM, false);
    var vm = VM.App;
    Size.Control(vm.Div, false);
    Size.Control(vm.Label, false);
    Size.Control(vm.Img_L, false);
    Size.Control(vm.Img_R, false);
    Size.Control(vm.Msg, false);
    //console.log("App.Size * this.vm.Div.Style =" + JSON.stringify(vm.Div.Style));
    //console.log("App.Size * this.vm.Label.Style =" + JSON.stringify(vm.Label.Style ));
  };

}