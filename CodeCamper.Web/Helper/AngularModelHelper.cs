using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CodeCamper.Web.Utilities;
using System.Reflection;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using HtmlTags;
using Humanizer;

namespace CodeCamper.Web.Helper
{
	public class AngularModelHelper<TModel>
	{
		protected readonly HtmlHelper Helper;
		private readonly string _expressionPrefix;

		public AngularModelHelper(HtmlHelper helper, string expressionPrefix)
		{
			Helper = helper;
			_expressionPrefix = expressionPrefix;
		}

		/// <summary>
		/// Converts an lambda expression into a camel-cased string, prefixed
		/// with the helper's configured prefix expression, ie:
		/// vm.model.parentProperty.childProperty
		/// </summary>
		public IHtmlString ExpressionFor<TProp>(Expression<Func<TModel, TProp>> property)
		{
			var expressionText = ExpressionForInternal(property);
			return new MvcHtmlString(expressionText);
		}

        /// <summary>
		/// Converts an lambda expression into a FormGroup Input
		/// </summary>
		public HtmlTag FormGroupFor<TProp>(Expression<Func<TModel, TProp>> property)
        {
            var metadata = ModelMetadata.FromLambdaExpression(property,
                new ViewDataDictionary<TModel>());

            //Turns x => x.SomeName into "SomeName"
            var name = ExpressionHelper.GetExpressionText(property);
            var id = string.Format("{0}.{1}", _expressionPrefix , name);

            //Turns x => x.SomeName into vm.model.someName
            var expression = ExpressionForInternal(property);

            var labelText = metadata.DisplayName ?? name.Humanize().Transform(To.TitleCase);

            //Creates <label class="control-label" for="Name">Name</label>
            var label = new HtmlTag("label")
                .AddClass("control-label")
                .AddClass("col-sm-2")
                .Attr("for", id)
                .Text(labelText);

            var tagName = (metadata.DataTypeName == "MultilineText")? "textarea" : "input";
            //var tagName = (metadata.DataTypeName == DataType.MultilineText.ttt(LetterCasing.AllCaps)) ? "textarea" : "input";

            var placeholder = metadata.Watermark ??
                              (labelText + "...");

            //Creates <input ng-model="expression"
            //		   class="form-control" name="Name" type="text" >
            var input = new HtmlTag(tagName)
                .AddClass("form-control")
                .Attr("data-z-validate","")
                .Attr("ng-model", expression)
                .Attr("name", id)
                .Attr("id", id)
                .Attr("type", (metadata.DataTypeName == "ImageUrl") ? "file" : "text")
                .Attr("placeholder", placeholder);

            var divInput = new HtmlTag("div")
                .AddClass("col-sm-10")
                .Append(input);

            //Creates <div class="form-group">
            var formGroup = new HtmlTag("div")
                .AddClasses("form-group")
                .Append(label)
                .Append(divInput);

            return formGroup;
        }

        /// <summary>
		/// Converts an lambda expression into a space separated string, prefixed
		/// with the helper's configured prefix expression, ie:
		/// vm.model.parentProperty.childProperty
		/// </summary>
		public IHtmlString DisplayNameFor<TProp>(Expression<Func<TModel, TProp>> property)
        {
            var metadata = ModelMetadata.FromLambdaExpression(property, new ViewDataDictionary<TModel>());

            //Turns x => x.SomeName into "SomeName"
            var name = ExpressionHelper.GetExpressionText(property);
            
            var labelText = metadata.DisplayName ?? name.Humanize().Transform(To.TitleCase);

            return new MvcHtmlString(labelText);

            /*
            var name = ExpressionHelper.GetExpressionText(property);
            //((System.ComponentModel.DataAnnotations.DisplayAttribute)((System.Attribute[])(typeof(TModel).GetProperty("FirstName").GetCustomAttributes()))[1]).Name
            var att =(System.ComponentModel.DataAnnotations.DisplayAttribute)  typeof(TModel).GetProperty(name).GetCustomAttribute(typeof(DisplayAttribute));
            if (att != null)
            {
                return new MvcHtmlString(att.Name);
            }
            var nameParts = Regex.Split(name, @"([A-Z][a-z]*)").Where(x => x.Length > 0).ToArray();
            return new MvcHtmlString(string.Join(" ",nameParts));
            */
        }


        /// <summary>
        /// Converts a lambda expression into a camel-cased AngularJS binding expression, ie:
        /// {{vm.model.parentProperty.childProperty}} 
        /// </summary>
        public IHtmlString BindingFor<TProp>(Expression<Func<TModel, TProp>> property)
		{
			return MvcHtmlString.Create("{{" + ExpressionForInternal(property) + "}}");
		}

		/// <summary>
		/// Creates a div with an ng-repeat directive to enumerate the specified property,
		/// and returns a new helper you can use for strongly-typed bindings on the items
		/// in the enumerable property.
		/// </summary>
		public AngularNgRepeatHelper<TSubModel> Repeat<TSubModel>(
			Expression<Func<TModel, IEnumerable<TSubModel>>> property, string variableName)
		{
			var propertyExpression = ExpressionForInternal(property);
			return new AngularNgRepeatHelper<TSubModel>(
				Helper, variableName, propertyExpression);
		}
		
		private string ExpressionForInternal<TProp>(Expression<Func<TModel, TProp>> property)
		{
			var camelCaseName = property.ToCamelCaseName();

			var expression = !string.IsNullOrEmpty(_expressionPrefix)
				? _expressionPrefix + "." + camelCaseName
				: camelCaseName;

			return expression;
		}

        private static string GetPropertyName<TProp>(Expression<Func<TModel>> expression)
        {
            MemberExpression propertyExpression = (MemberExpression)expression.Body;
            MemberInfo propertyMember = propertyExpression.Member;

            Object[] displayAttributes = propertyMember.GetCustomAttributes(typeof(DisplayAttribute), true);
            if (displayAttributes != null && displayAttributes.Length == 1)
                return ((DisplayAttribute)displayAttributes[0]).Name;

            return propertyMember.Name;
        }
    }
}