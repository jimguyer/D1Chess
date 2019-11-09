using System;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace D1Chess.Controllers
{
    public class WebController : ApiController
    {
        //private DataController DataController = new DataController();

        [HttpGet]
        public async Task<object> Get(string Action, string Key, Guid DeviceId, Guid TokenId)
        {
            var pParms = new Parms(Action, Key, DeviceId, TokenId);
            pParms.URL = HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority);
            //return await Task.Run(() => repository.WebGet(pParms));
            return await Task.Run(() => new { });
        }
        public async Task<object> Post(Parms pParms)
        {
            pParms.URL = HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority);
            //return await Task.Run(() => repository.WebPost(pParms));
            return await Task.Run(() => new { });
        }
        public class Parms
        {
            public string URL { get; set; }
            public string Action { get; set; }
            public object Key { get; set; }
            public object Data { get; set; }
            public Guid DeviceId { get; set; }
            public Guid TokenId { get; set; }



            public Parms() { }
            public Parms(Guid pDeviceId, Guid pTokenId)
            {
                this.DeviceId = pDeviceId;
                this.TokenId = pTokenId;
            }
            public Parms(String pAction, object pKey, Guid pDeviceId, Guid pTokenId)
            {
                this.Action = pAction;
                this.Key = pKey;
                this.DeviceId = pDeviceId;
                this.TokenId = pTokenId;
            }
        }
        public class Result
        {
            public bool Success { get; set; }
            public object Data { get; set; }
            public Result(bool pSuccess, object pData) { this.Success = pSuccess; this.Data = pData; }
        }


        public class Return
        {
            public string Code { get; set; }
            public object Data { get; set; }

            public Return(string pUnknownCode)
            {
                this.Code = pUnknownCode;
            }
        }

        #region Non-Async Version

        //*********************************************************************************

        //public object Post(WebPost pWebPost) {
        //    pWebPost.URL = HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority);
        //    if (pWebPost.Action == null| pWebPost.Parms == null | pWebPost.Data == null) {
        //        var appId = pWebPost.Parms.AppId;
        //        var profileIdx = pWebPost.Parms.ProfileIdx;
        //    }
        //    return repository.WebPost(pWebPost);
        //}
        //*********************************************************************************
        #endregion

    }
}
