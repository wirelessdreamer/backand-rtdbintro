angular.module('rtdbintroIonic.services', [])

    .service('APIInterceptor', function ($rootScope, $q) {
        var service = this;

        service.responseError = function (response) {
            if (response.status === 401) {
                $rootScope.$broadcast('unauthorized');
            }
            return $q.reject(response);
        };
    })

    .service('ItemsModel', function ($http, Backand) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'items/';

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }

        service.all = function () {
            return $http ({
                method: 'GET',
                url: getUrl(),
                params: {
                    pageSize: 20000,
                    pageNumber: 1,
                    // filter: [
                    //     {
                    //         fieldName: 'description',
                    //         operator: 'equals',
                    //         value: 'testing'
                    //     }
                    // ],
                    sort: '',
                }
            });        
        };

        service.fetch = function (id) {
            return $http.get(getUrlForId(id));
        };

        service.create = function (object) {
            return $http.post(getUrl(), object);
        };

        service.update = function (id, object) {
            return $http.put(getUrlForId(id), object);
        };

        service.delete = function (id) {
            return $http.delete(getUrlForId(id));
        };
    })

    .service('LoginService', function (Backand) {
        var service = this;
        service.user = "anonymous";

        service.signin = function (email, password, appName) {
            //call Backand for sign in
            service.user = email;
            return Backand.signin(email, password);
        };

        service.anonymousLogin= function(){
            // don't have to do anything here,
            // because we set app token att app.js
        }

        service.signout = function () {
            service.user = "anonymous";
            return Backand.signout();
        };
    });
