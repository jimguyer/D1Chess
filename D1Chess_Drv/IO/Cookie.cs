using D1Chess_Srv.EfModel;
using D1Chess_Srv.Common;
using System;
using System.Web;

namespace D1Chess_Srv.IO
{
    public class Cookie
    {
        //public ControllerContext Context { get; set; }
        public static HttpContext HttpContext { get; set; }

        public Util Util = new Util();

        #region Properties
        public Guid? TokenId { get; set; }
        public Guid? DeviceId { get; set; }
        #endregion

        public Cookie() { }
        public Cookie(HttpContext pHttpContext) { HttpContext = pHttpContext; }

        public Cookie Get()
        {
            this.TokenId = Util.ConvertGuid(HttpContext.Request.Cookies["TokenId"].ToString());
            this.DeviceId = Util.ConvertGuid(HttpContext.Request.Cookies["DeviceId"].ToString());
            return this;
        }
        public bool Save(Cookie pCookie, Token pEfToken)
        {
            pCookie.TokenId = pEfToken.Id;
            pCookie.DeviceId = pEfToken.DeviceId;
            return Save(pCookie);
        }

        public bool Save(Cookie pCookie)
        {
            //var CookieOptions = new CookieOptions { Expires = DateTime.Now.AddYears(1) };
            //HttpContext.Response.Cookies.Add("TokenId", pCookie.TokenId.ToString(), CookieOptions);
            //HttpContext.Response.Cookies.Add("DeviceId", pCookie.DeviceId.ToString(), CookieOptions);
            return true;
        }
    }
}
