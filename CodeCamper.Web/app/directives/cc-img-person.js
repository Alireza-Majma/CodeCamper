'use strict';
var App;
(function (App) {
    var Directives;
    (function (Directives) {
        var CcImgPerson = (function () {
            function CcImgPerson(config) {
                var _this = this;
                this.config = config;
                this.restrict = "A";
                this.link = function (scope, element, attrs) {
                    var basePath = _this.config.imageSettings.imageBasePath;
                    var unknownImage = _this.config.imageSettings.unknownPersonImageSource;
                    attrs.$observe('ccImgPerson', function (value) {
                        value = basePath + (value || unknownImage);
                        attrs.$set('src', value);
                    });
                };
            }
            CcImgPerson.directiveId = 'ccImgPerson';
            return CcImgPerson;
        })();
        // Register in angular app
        App.app.directive(CcImgPerson.directiveId, ['app.config', function (config) { return new CcImgPerson(config); }]);
    })(Directives = App.Directives || (App.Directives = {}));
})(App || (App = {}));
//# sourceMappingURL=cc-img-person.js.map