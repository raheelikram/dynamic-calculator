angular.module('app', [])
.controller('ctrl', ['$scope', '$timeout', function ($scope, $timeout) {
  $scope.vars = {};
  $scope.input = "Force=Mass*Acceleration";
  $scope.getResult = getResult;
  
  // showMsg("Test message");
  $scope.buildTree = function () {
    $scope.fm = {};
    $scope.vars = {};
    var input = $scope.input.split('=');
    if (input.length != 2) return showMsg("Invalid math equation");
    $scope.target = input[0];

    $scope.equation = input[1].replace(/\S\w*/g, function (val, ind) {
      if(/^\d+(\.\d+)?$/.test(val)) {
        return val;
      }
      if (ind == 0) {
        $scope.vars[val] = 1;
        return `(1 * $scope.vars['${val}'])`;
      }
      var opr = val[0], name = val.slice(1);

      if (/^\d+(\.\d+)?$/.test(name)) {
        return `${opr}${name}`;
      }
      $scope.vars[name] = 1;
      return `${opr}(1 * $scope.vars['${name}'])`;
    });
    $scope.getResult($scope.target);
  }

  function getResult(target) {
    target = target || $scope.target;
    $scope.fm[target] = eval(`(function($scope){ return ${$scope.equation} })`)($scope)
  }

  function showMsg(msg) {
    $scope.msg = msg;
    $timeout(function() { delete $scope.msg; }, 3000);
  }

  function getOpr(str) {
    var oprs = ['=', '+', '-', '*', '/'];
    for ( var i in oprs) {
      if (str.indexOf(oprs[i]) != -1) {
        return oprs[i];
      }
    }
    return false;
  }

  function getTree(str) {
    var opr = getOpr(str);
    if ( opr === false ) {
      if (/^\d+$/.test(str)) {
        return (1 * str);      
      }
      $scope.vars[str] = true;
      return str;
    }
    var parts = str.split(opr);
    return {
      opr,
      left: getTree(parts[0]),
      right: getTree(parts[1]),
    }
  }
}])