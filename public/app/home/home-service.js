/**
 * Created by natalie on 10/1/2015.
 */
angular.module('buddyApp.home', [])
    .controller('HomeController', ['$scope', '$location', '$interval', '$http', 'Buddies', function ($scope, $location, $interval, $http, Buddies) {
        console.log('line 6 of h-s:');
        $scope.adding = false;
        $scope.sorting = false;
        $scope.orderByField = 'status';
        $scope.reverseSort = false;
        $scope.newBuddy = {};
        $scope.styleAvailable = {
            color: 'green'
        };
        $scope.styleBusy = {
            color: 'red'
        };
        $scope.styleIdle = {
            color: 'orange'
        };
        $scope.styleOffline = {
            color: 'grey'
        };
        $scope.goto = function (place) {
            $location.path(place);
        };
        $scope.checkStatus = function (status) {
            switch (status){
                case 'Available':
                    return $scope.styleAvailable;
                case 'Busy':
                    return $scope.styleBusy;
                case 'Idle':
                    return $scope.styleIdle;
                case 'Offline':
                    return $scope.styleOffline;
            }
        };
        $scope.getBuddies = function (){
          $http.get('buddies/list').
              then(function(response) {
                  if(typeof response.data.message === 'undefined'){
                      $scope.buddyList = response.data;
                      $scope.buddyList.forEach(function (buddy) {
                          buddy.open = false;
                      });
                  }
                  else{
                      $scope.buddyList = response.data.message;
                  }
              }, function(response) {
                  console.log('Error getting log.');
              });
        };
        $scope.addBuddy = function () {
            $scope.processingBuddy = true;
            $scope.message = '';
            $http.get('buddies/list?username=' + $scope.newBuddy.username).
                then(function(response) {
                    console.log('line 31 of h-s', response.data);
                    if(response.data.length === 0){
                        console.log('adding buddy...');
                        $scope.newBuddy.status = 'Offline';
                        $scope.newBuddy.priority = $scope.buddyList.length;
                        $scope.newBuddy.lastOnline = new Date();
                        Buddies.register($scope.newBuddy).then(function (data) {
                            $scope.newBuddy = {};
                            $location.path('/home');
                            $scope.processingBuddy = false;
                            $scope.getBuddies();
                        }, function (data) {
                            $scope.register_err = true;
                            $scope.newBuddy = {};
                            if (data.message) $scope.error_msg = data.message;
                        });
                    }
                    else{
                        $scope.message = 'There is already a buddy with username ' + $scope.newBuddy.username;
                        $scope.adding = true;
                    }
                }, function(response) {
                    console.log('Error getting log.');
                });
        };
        $scope.prettyDate  = function(inDate){
            var date = new Date(inDate);
            return date;
        };
        $scope.deleteBuddy = function (name, $event) {
            $event.stopPropagation();
            var reallyDelete =  confirm('Are you sure you want to delete user ' + name + '?');

            if(reallyDelete){
                $scope.processingBuddy = true;
                Buddies.delete(name).then(function (data) {
                    console.log('line 47 of h-s', data);
                    $location.path('/home');
                    $scope.processingBuddy = false;
                    $scope.getBuddies();
                }, function(data){
                    $scope.delete_err = true;
                    if (data.message) $scope.error_msg = data.message;
                });
                $scope.getBuddies();
            }
        }
    }])
    .service('Buddies', function ($http, $q) {
        var _newBuddy = null;
        return {
            register: function(newBuddy){
                return $q(function (resolve, reject) {
                    $http.post('/buddies/register', newBuddy).success(function (data) {
                        _newBuddy = data.newBuddy;
                        resolve(_newBuddy);
                    }).error(function (data) {
                        reject(data);
                    });
                });
            },
            delete: function (name) {
                return $q(function (resolve, reject) {
                    $http.delete('/buddies/list?username=' + name).success(function (data) {
                        console.log('line 71 of h-s', data);
                        resolve(data);
                    }).error(function (data) {
                        reject(data);
                    });
                });
            },
            get newBuddy() {
                return _newBuddy;
            }
        };
    });