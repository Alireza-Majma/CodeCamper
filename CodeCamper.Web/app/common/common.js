'use strict';
var App;
(function (App) {
    var Shared;
    (function (Shared) {
        var Common = (function () {
            //#endregion
            //#region constructor
            function Common($q, $rootScope, $timeout, commonConfig, logger, config) {
                this.commonConfig = commonConfig;
                this.logger = logger;
                this.throttles = {};
                this.$rootScope = $rootScope;
                this.$timeout = $timeout;
                this.$q = $q;
                this.config = config;
            }
            //#endregion
            //#region public methods
            Common.prototype.activateController = function (promises, controllerId) {
                return this.$q.all(promises).then(this.broadcastSuccessEvent(controllerId));
            };
            Common.prototype.broadcastSuccessEvent = function (controllerId) {
                var data = { controllerId: controllerId };
                return this.$broadcast(this.commonConfig.config.controllerActivateSuccessEvent, data);
            };
            Common.prototype.$broadcast = function (eventName, data) {
                return this.$rootScope.$broadcast.apply(this.$rootScope, arguments);
            };
            Common.prototype.createSearchThrottle = function (viewmodel, list, filteredList, filterMatch, delay) {
                // After a delay, search a viewmodel's list using 
                // a filter function, and return a filteredList.
                var _this = this;
                // custom delay or use default
                delay = +delay || 300;
                // if only vm and list parameters were passed, set others by naming convention 
                if (!filteredList) {
                    // assuming list is named sessions, filteredList is filteredSessions
                    filteredList = 'filtered' + list[0].toUpperCase() + list.substr(1).toLowerCase(); // string
                    // filter function is named sessionFilter
                    filterMatch = list + 'Filter'; // function in string form
                }
                // create the filtering function we will call from here
                var filterFn = function () {
                    // translates to ...
                    // vm.filteredSessions 
                    //      = vm.sessions.filter(function(item( { returns vm.sessionFilter (item) } );
                    viewmodel[filteredList] = viewmodel[list].filter(function (item) {
                        return viewmodel[filterMatch](item);
                    });
                };
                return (function () {
                    // Wrapped in outer IFFE so we can use closure 
                    // over filterInputTimeout which references the timeout
                    var filterInputTimeout;
                    // return what becomes the 'applyFilter' function in the controller
                    return function (searchNow) {
                        if (filterInputTimeout) {
                            _this.$timeout.cancel(filterInputTimeout);
                            filterInputTimeout = null;
                        }
                        if (searchNow || !delay) {
                            filterFn();
                        }
                        else {
                            filterInputTimeout = _this.$timeout(filterFn, delay);
                        }
                    };
                })();
            };
            Common.prototype.attachSearch = function (vm, applyFilterSucceeded) {
                var _this = this;
                return function ($event) {
                    var searchNow = false;
                    if ($event.keyCode === _this.config.keyCodes.esc) {
                        vm.searchText = '';
                        searchNow = true;
                    }
                    vm['applyFillter'](searchNow).then(applyFilterSucceeded);
                };
            };
            Common.prototype.buildSearchThrottle = function (vm, applyFilterSucceeded, delay) {
                // After a delay, search a viewmodel's list using 
                // a filter function, and return a filteredList.
                var _this = this;
                // custom delay or use default
                delay = +delay || 300;
                // create the filtering function we will call from here
                var filterFn = function (defered) {
                    // translates to ...
                    // vm.filteredSessions 
                    var filteredList = vm.modelData.filter(vm.searchMatcher);
                    defered.resolve(filteredList);
                };
                vm['applyFillter'] = (function () {
                    // Wrapped in outer IFFE so we can use closure 
                    // over filterInputTimeout which references the timeout
                    var filterInputTimeout;
                    // return what becomes the 'applyFilter' function in the controller
                    return function (searchNow) {
                        var defered = _this.$q.defer();
                        if (filterInputTimeout) {
                            _this.$timeout.cancel(filterInputTimeout);
                            filterInputTimeout = null;
                        }
                        if (searchNow || !delay) {
                            filterFn(defered);
                        }
                        else {
                            filterInputTimeout = _this.$timeout(function () {
                                filterFn(defered);
                            }, delay);
                        }
                        return defered.promise;
                    };
                })();
                if (!applyFilterSucceeded) {
                    applyFilterSucceeded = function (data) { vm.filteredList = data; };
                }
                vm.search = this.attachSearch(vm, applyFilterSucceeded);
                //run it for the first time
                vm.search({ keyCode: this.config.keyCodes.esc });
                return vm.search;
            };
            Common.prototype.debouncedThrottle = function (key, callback, delay, immediate) {
                // Perform some action (callback) after a delay. 
                // Track the callback by key, so if the same callback 
                // is issued again, restart the delay.
                var defaultDelay = 1000;
                delay = delay || defaultDelay;
                if (this.throttles[key]) {
                    this.$timeout.cancel(this.throttles[key]);
                    this.throttles[key] = undefined;
                }
                if (immediate) {
                    callback();
                }
                else {
                    this.throttles[key] = this.$timeout(callback, delay);
                }
            };
            Common.prototype.isNumber = function (val) {
                // negative or positive
                return /^[-]?\d+$/.test(val);
            };
            Common.prototype.textContains = function (text, searchText) {
                return text && -1 !== text.toLowerCase().indexOf(searchText.toLowerCase());
            };
            Common.serviceId = 'common';
            return Common;
        })();
        Shared.Common = Common;
        // Creates "common" service
        Shared.commonModule.factory(Common.serviceId, ['$q', '$rootScope', '$timeout', 'commonConfig', 'logger', 'app.config',
            function ($q, $rootScope, $timeout, commonConfig, logger, config) { return new Common($q, $rootScope, $timeout, commonConfig, logger, config); }
        ]);
    })(Shared = App.Shared || (App.Shared = {}));
})(App || (App = {}));
//# sourceMappingURL=common.js.map