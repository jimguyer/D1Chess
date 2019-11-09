using D1Chess.Controllers;
using System;

namespace D1Chess
{
    public class Model
    {
        private const string AppViewName = "DMChess";
        public MURL URL { get; set; }
        public string Role { get; set; }
        public MParms Parms { get; set; }
        public WebController.Parms WebParms { get; set; }

        public Model() { }

        public Model(string pRole, WebController.Parms pWebParms, string pMsgId)
        {
            this.Role = pRole;
            this.WebParms = pWebParms;
            this.Parms = new MParms() { MsgId = pMsgId };
            this.URL = new MURL();
        }

        public Model(WebController.Parms pWebParms, string pEmailUserId, string pFirstName, string pMsgId)
        {
            this.WebParms = pWebParms;
            this.Parms = new MParms() { EmailUserId = pEmailUserId, FirstName = pFirstName, MsgId = pMsgId };
            this.URL = new MURL();
        }


        public Model(WebController.Parms pWebParms, string pEmailUserId, string pFirstName, string pMsgId, string pAction, string pLocation, string pPaypal, Guid? pId)
        {
            this.Parms = new MParms() { EmailUserId = pEmailUserId, FirstName = pFirstName, MsgId = pMsgId };
            this.WebParms = pWebParms;
            this.URL = new MURL() { Action = pAction, Location = pLocation, Paypal = pPaypal, Id = pId };
        }
        public class MURL
        {
            public string Action { get; set; }
            public string Location { get; set; }
            public string Paypal { get; set; }
            public Guid? Id { get; set; }
        }
        public class MParms
        {

            public string EmailUserId { get; set; }
            public string FirstName { get; set; }
            public string MsgId { get; set; }
        }

    }
}
