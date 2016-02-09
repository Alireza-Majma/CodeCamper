using System.Web;
using System.Web.Mvc;
using CodeCamper.Web.Utilities;

namespace CodeCamper.Web.Helper
{
	public static class JsonHtmlHelpers
	{
		public static IHtmlString JsonFor<T>(this HtmlHelper helper, T obj)
		{
			return helper.Raw(obj.ToJson());
		}
	}
}