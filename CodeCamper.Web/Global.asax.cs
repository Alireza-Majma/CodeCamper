using CodeCamper.Da;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace CodeCamper.Web
{
    public class MvcApplication : System.Web.HttpApplication
    {
        public static string sulPath;
        protected void Application_Start()
        {
            sulPath = Path.GetDirectoryName(HttpContext.Current.Server.MapPath("~"));
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            AppDomain.CurrentDomain.SetData("SQLServerCompactEditionUnderWebHosting", true);
        }
    }
}
