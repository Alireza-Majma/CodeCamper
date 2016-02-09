using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CodeCamper.Web.Controllers
{
    public class AppController : Controller
    {
        // GET: Angular
        public ActionResult Index()
        {
            return View();
        }

        
        public PartialViewResult Render(string appName,string featureName,string pageName)
        {
            if (String.IsNullOrEmpty(appName))
            {
                return PartialView(string.Format("~/app/{0}/{1}.cshtml", featureName, pageName));
            }
            return PartialView(string.Format("~/app/{0}/{1}/{2}.cshtml",appName,featureName,pageName));
        }

    }
}
