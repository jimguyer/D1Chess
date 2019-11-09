angular.module('FtrMod', [])
  .directive('ftrdir', FtrDir)
  .controller('FtrCtl', FtrCtl)
  ;

function FtrDir() {
  return { restrict: "E", templateUrl: 'ClientApp/App/Master/Comps/Ftr/Ftr.html', controller: 'FtrCtl as VM_Ftr' };
}

function FtrCtl($scope) {
  //console.log("FtrCtl");
}