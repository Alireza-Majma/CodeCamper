'use strict';
var App;
(function (App) {
    var Shared;
    (function (Shared) {
        var CommonConfig = (function () {
            function CommonConfig() {
                var _this = this;
                this.config = {};
                this.$get = function () {
                    return { config: _this.config };
                };
            }
            CommonConfig.providerId = 'commonConfig';
            return CommonConfig;
        })();
        App.Shared.commonModule.provider(CommonConfig.providerId, CommonConfig);
    })(Shared = App.Shared || (App.Shared = {}));
})(App || (App = {}));
//# sourceMappingURL=commonConfig.js.map