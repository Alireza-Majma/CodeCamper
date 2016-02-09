using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace CodeCamper.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "LayoutRoute",
                url: "app/{featureName}/{pageName}",
                defaults: new { controller = "App", action = "Render"}
            );

            routes.MapRoute(
                name: "AppRoute",
                url: "app/{appName}/{featureName}/{pageName}",
                defaults: new { controller = "App", action = "Render" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
