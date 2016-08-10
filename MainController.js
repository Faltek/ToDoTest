/**
 * Created by Faltek on 07.08.2016.
 */
angular.module('todoTestApp', ['ngMaterial', 'LocalStorageModule'])
    .directive('enterCheck', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.enterCheck);
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .controller('todoTestCtrl', function($scope, $mdDialog, localStorageService ) {
        $scope.taskListKey = 'taskList';
        var todoTask = function (title) {
            this.title = title;
            this.completed = false;
        };

        $scope.updateTask = function(task, ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'EditTaskTemplate.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                locals:{task: task},

            })
                .then(function() {
                    localStorageService.set($scope.taskListKey, $scope.tasks);
                }, function() {
                    localStorageService.set($scope.taskListKey, $scope.tasks);
                });
        }

        $scope.addTask = function () {
            var newTask = new todoTask($scope.task.title);
            $scope.tasks.push(newTask);
            localStorageService.set($scope.taskListKey, $scope.tasks);
            $scope.task.title = '';
        }

        $scope.removeTask = function(task) {
            $scope.tasks.splice($scope.tasks.indexOf(task), 1);
            localStorageService.set($scope.taskListKey, $scope.tasks);
        }

        var init = function() {
            $scope.tasks = [];
            var tasks = localStorageService.get($scope.taskListKey);
            if(tasks != null)
            {
                $scope.tasks = tasks;
            }
            $scope.task  = new todoTask('');

        }

        init();
    });

    function DialogController($scope, $mdDialog, task) {

        $scope.task = angular.copy(task);

        $scope.update = function() {
            task.title = $scope.task.title;
            task.completed = $scope.task.completed;

            $mdDialog.hide();
            $scope.$destroy();
        };

        $scope.cancel = function() {

            $mdDialog.cancel();
            $scope.$destroy();
        };

    }