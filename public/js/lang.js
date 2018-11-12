const ATC = angular.module('ATC',[]).config(function($interpolateProvider){
  $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});
ATC.controller("detectlang", function($scope, $http){
  $scope.lang_cate = "";
  $scope.lang = {};
  $scope.detect = function(){
    console.log($scope.lang);
    if($scope.lang.data != undefined){
      $http.post('/lang',$scope.lang)
        .then(function successful(res){
            $scope.lang_cate = res.data;
        }, function errorCallback(res){
          console.log(res.data);
        });
    }
  }

  $scope.tweets =[];
  $scope.twitter ={};
  $scope.classifiy = function(){
    console.log($scope.twitter);
    if($scope.twitter.user != undefined){
      $http.post('/twitter',$scope.twitter)
        .then(function successful(res){
            $scope.tweets = res.data;
        }, function errorCallback(res){
          console.log(res.data);
        });
    }
  }
})
