var App;
(function (App) {
    var Shared;
    (function (Shared) {
        //#region explanation
        //-------STARTING COMMON MODULE----------
        // NB! script for this file must get loaded before the "child" script files
        // THIS CREATES THE ANGULAR CONTAINER NAMED 'app.common', A BAG THAT HOLDS SERVICES
        // CREATION OF A MODULE IS DONE USING ...module('moduleName', []) => retrieved using ...module.('...')
        // Contains services:
        //  - common
        //  - logger
        //  - spinner
        //#endregion
        Shared.commonModule = angular.module('app.common', []);
    })(Shared = App.Shared || (App.Shared = {}));
})(App || (App = {}));
//(function () {
//    'use strict';
//    // Define the common module 
//    // Contains services:
//    //  - common
//    //  - logger
//    //  - spinner
//    var commonModule = angular.module('app.common', []);
//    // Must configure the common service and set its 
//    // events via the commonConfigProvider
//    commonModule.provider('commonConfig', commonConfigProvider);
//    function commonConfigProvider () {
//        this.config = {
//            // These are the properties we need to set
//            //controllerActivateSuccessEvent: '',
//            //spinnerToggleEvent: ''
//        };
//        this.$get = function () {
//            return {
//                config: this.config
//            };
//        };
//    }
//})(); 
//# sourceMappingURL=common.module.js.map