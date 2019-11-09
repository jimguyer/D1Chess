using System.Web.Mvc;

namespace D1Chess.Controllers
{
    public class ViewController : Controller
    {
        private const string AppViewName = "D1Chess";
        //private D1Chess_Srv.Repository repository = new Repository();
        [HttpGet]
        public ActionResult Index(string pId)
        {
            //var webParms = Cookie.ParmGet(AppViewName, ControllerContext);
            //if (pId != null)
            //{
            //    webParms = repository.URLParm(AppViewName, webParms, pId);
            //    if (webParms != null) Cookie.ParmsSave(AppViewName, ControllerContext, webParms);
            //    return RedirectToAction("Index");
            //}

            //var viewModel = repository.ViewModelGet(webParms);
            //Cookie.ParmsSave(AppViewName, ControllerContext, viewModel.WebParms);
            //return View("Index", viewModel);
            return View("Index", null);
        }

        [HttpPost]
        public ActionResult Index()
        {
            //var parms = Cookie.ParmGet(AppViewName, ControllerContext);
            //var viewModel = repository.ViewModelPost(parms);
            ////var role = viewModel.Role;
            ////Cookie.ParmsSave(AppViewName, ControllerContext, viewModel.WebParms);
            //return View("Index", viewModel);
            return View("Index", null);
        }
    }
}