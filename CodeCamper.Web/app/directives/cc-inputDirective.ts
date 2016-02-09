'use strict';
module App.Directives {
   //Usage:
   //<formgroup label="@speaker.DisplayNameFor(x => x.FirstName)"
   //ng-model="@speaker.ExpressionFor(x => x.FirstName)" z- validate > </formgroup>
   interface ICcFormGroup extends ng.IDirective {
   }

   class CcFormGroup implements ICcFormGroup {
      static directiveId: string = 'formgroup';
      restrict: string = "E";
      uid: number = 0;
      constructor() {
      }

      public compile(element, attrs) {

         var ngModel = attrs.ngModel;
         if (!ngModel) return; // ngModel is required
         var arr = ngModel.split('.');
         var propName = arr.pop();
         var entityPath = arr.join('.');

         // we store the error messages in a new property on the entityAspect, e.g. customer.entityAspect.CompanyNameErrors
         var errorProp = propName + 'Errors';
         var errorPath = entityPath + '.entityAspect.' + errorProp;

         var type = attrs.type || 'text';
         var miscPart = attrs.misc || '';
         var placeHolder = attrs.placeHolder || '';
         var id = attrs.formid || 'bz-' + attrs.ngModel + this.uid++;
         var idPart = " id='" + id + "'";
         var namePart = " name='" + id + "'";
         var placeHolderPart = "placeholder='" + (attrs.hasOwnProperty('placeHolder') ? attrs.placeHolder : "Enter " + attrs.label) + "'";
         var typePart = type.length == 0 || attrs.hasOwnProperty('selectOptions') ? '' : "type='" + type + "'";
         var selectOptionsPart = attrs.hasOwnProperty('selectOptions') ? " data-ng-options='" + attrs.selectOptions + "'" : "";
         var requiredPart = attrs.hasOwnProperty('required') ? " required='required'" : "";
         var ngModelPart = " ng-model='" + ngModel + "'";
         var tagPart = attrs.hasOwnProperty('selectOptions') ? "select " : "input ";
         var validatorPart = attrs.hasOwnProperty('zValidate') ? "data-z-validate" : "";
         var classPart = " class='form-control'";

         var htmlText = '<div class="form-group">' +
            '<label class="control-label col-sm-2" for="' + id + '">' + attrs.label + '</label>' +
            '<div class="col-sm-10">' +
            '<' + tagPart + classPart + typePart + idPart + namePart + requiredPart + ngModelPart + selectOptionsPart + placeHolderPart + validatorPart + miscPart + '>' +
            '</' + tagPart + '>' +
         //'<span class="help-inline">{{' + errorPath + '}}</span>' +
            '</div>' +
            '</div>';
         element.replaceWith(htmlText);
         return (scope, element, attrs, controller) => {
            // watch the expression, and update the UI on change.
            scope.$watch(ngModel, function (value) {
               var entity = scope.$eval(entityPath);
               if (!entity) return;
               var aspect = entity.entityAspect;
               var errors = aspect.getValidationErrors(propName);
               if (errors.length) {
                  element.addClass('error');
                  var messages = errors.map(function (el) { return el.errorMessage; }).join("; ");  // convert to string
                  aspect[errorProp] = messages;
               } else {
                  element.removeClass('error');
                  aspect[errorProp] = null;
               }
            });
         };
      }

   }

   // Register in angular app
   app.directive(CcFormGroup.directiveId, [() => new CcFormGroup()]);
} 