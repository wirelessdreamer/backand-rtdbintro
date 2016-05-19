angular.module('rtdbintroIonic.controllers', [])

    .controller('LoginCtrl', function (Backand, $state, $rootScope, LoginService) {
        var login = this;

        function signin() {
            LoginService.signin(login.email, login.password)
                .then(function () {
                    onLogin();
                }, function (error) {
                    $log.log(error)
                })
        }

        function anonymousLogin(){
            LoginService.anonymousLogin();
            onLogin();
        }

        function onLogin(){
            $rootScope.$broadcast('authorized');
            $state.go('tab.dashboard');
        }

        function signout() {
            LoginService.signout()
                .then(function () {
                    //$state.go('tab.login');
                    $rootScope.$broadcast('logout');
                    $state.go($state.current, {}, {reload: true});
                })

        }

        login.signin = signin;
        login.signout = signout;
        login.anonymousLogin = anonymousLogin;
    })

    .controller('DashboardCtrl', function (ItemsModel, LoginService, Backand, $rootScope, $q, $log, $scope) {
        var vm = this;
        vm.item_types = ['cheese', 'bread', 'water'];
        vm.stats = {};

        function clearStats(){
            angular.forEach(vm.item_types, (type) => {
                vm.stats[type] = {
                    sent: 0,
                    seen: 0
                };
            });
        }

        function addItem(item){
            create({name: item})
                .then(function (result) {
                    vm.stats[item].sent++;
                    getAll();
                });;
        }

        function goToBackand() {
            window.location = 'http://docs.backand.com';
        }

        Backand.on('item_created', function (data) {
            $log.log('Item created', data[2].Value);
            vm.stats[data[2].Value].seen++;
        });

        function getAll() {
            ItemsModel.all()
                .then(function (result) {
                    vm.data = result.data.data;
                });
        }

        function create(object) {
            object.description = 'Created by: ' + LoginService.user;
            $log.log('call create with: ', object);
            return ItemsModel.create(object)
        }

        function update(object) {
            ItemsModel.update(object.id, object)
                .then(function (result) {
                    getAll();
                });
        }

        function deleteObject(id) {
            ItemsModel.delete(id)
                .then(function (result) {
                    getAll();
                });
        }

        function deleteAllObjects(){
            let delete_requests = [];
            $log.log('delete all items');
            ItemsModel.all().then( (result) => {
                angular.forEach(result.data.data, (answer) => {
                    $log.log('delete item')
                    delete_requests.push(ItemsModel.delete(answer.id));
                });
                $q.all(delete_requests).then(function (results) {
                    $log.log('deleted all');
                    clearStats();
                });
            });
        }

        vm.objects = [];
        vm.getAll = getAll;
        vm.create = create;
        vm.update = update;
        vm.delete = deleteObject;
        vm.goToBackand = goToBackand;
        vm.isAuthorized = false;
        vm.addItem = addItem;
        vm.deleteAllObjects = deleteAllObjects;

        $rootScope.$on('authorized', function () {
            vm.isAuthorized = true;
            getAll();
        });

        if(!vm.isAuthorized){
            $rootScope.$broadcast('logout');
        }

        $scope.$on("$ionicView.enter", function () {
            clearStats();
        });

        getAll();

    });

