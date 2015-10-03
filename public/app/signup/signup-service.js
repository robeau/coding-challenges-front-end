/**
 * Created by natalie on 10/1/2015.
 */
angular.module('buddyApp.signup', [])
    .controller('SignupController', ['$scope', '$location', '$interval', '$http', 'Members', function ($scope, $location, $interval, $http, Members) {
        $scope.user = Members.user;
        console.log('line 6 of s-s:', $scope.user);
        $scope.nomatch = true;
        $scope.disabled = true;
        $scope.prettyDate  = function(inDate){
            var date = new Date(inDate);
            return date;
        };
        $scope.userDisabled = function () {
            var arr = Array.prototype.slice.call(arguments);

            $scope.disabled = arr.some(function (error) {
                return error;
            });

            return $scope.disabled;
        };
        $scope.addUser = function () {
            if ($scope.disabled){
                $scope.message = 'Please fill all required fields.';
            }
            else{
                $scope.processing = true;
                $scope.message = '';
                $http.get('members/list?username=' + $scope.user.username).
                    then(function(response) {
                        console.log('line 28 of s-s', response.data);
                        if(response.data.length === 0){
                            console.log('adding user...');
                            $scope.user.bio = '';
                            $scope.user.interests = '';
                            Members.register($scope.user).then(function (data) {
                                console.log('line 34 of s-s', Members.user);
                                $scope.processing = false;
                                $location.path('/success');
                            }, function (data) {
                                $scope.register_err = true;
                                $scope.user = {};
                                if (data.message) $scope.error_msg = data.message;
                            });
                        }
                        else{
                            $scope.message = 'There is already a user with username ' + $scope.user.username;
                        }
                    }, function(response) {
                        console.log('Error getting log.');
                    });
            }
        };
        $scope.updateUser = function () {
            $scope.processing = true;
            $scope.message = '';
            console.log('adding user...');
            Members.update($scope.user).then(function (data) {
                $scope.processing = false;
            }, function (data) {
                $scope.register_err = true;
                if (data.message) $scope.error_msg = data.message;
            });
        };
        $scope.matchPass = function () {
            if($scope.user.password === $scope.passwordConfirm){
                $scope.nomatch = false;
            }
            else $scope.nomatch = true;;
        };
        $scope.minDate = function () {
            var current = new Date();
            var minYear = current.getFullYear() - 150;
            var min = new Date(minYear,current.getMonth(),current.getDate()).toISOString();
            return min;
        };
        $scope.maxDate = function () {
            var current = new Date();
            var maxYear = current.getFullYear() - 14;
            var  max = new Date(maxYear, current.getMonth(), current.getDate()).toISOString();
            return max;
        };
        $scope.reallyClear = function ($event) {
            var conf = confirm('Do you really want to clear the form and reset all values?');

            if(conf){
                $scope.user = {};
                $scope.userForm.$setPristine();
                $scope.userForm.$setUntouched();
                $scope.userForm.birthday = '';
            }
            else{
                $event.stopPropagation();
            }
        }
    }])
    .service('Members', function ($http, $q) {
        var _user = null;
        return {
            register: function(user){
                return $q(function (resolve, reject) {
                    $http.post('/members/register', user).success(function (data) {
                        _user = data;
                        resolve(_user);
                    }).error(function (data) {
                        reject(data);
                    });
                });
            },
            update: function (user) {
                return $q(function (resolve, reject) {
                    $http.patch('/members/register', user).success(function (data) {
                        _user = data;
                        resolve(_user);
                    }).error(function (data) {
                        reject(data);
                    });
                });
            },
            get user() {
                return _user;
            }
        };
    });