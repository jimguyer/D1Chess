using D1Chess_Srv.EfModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace D1Chess_Srv.EFMethods
{
    public class EfUrl
    {
        private readonly Context Context = new Context();

        public Url Add(Guid pUserId, string pAction, string pPaypal = null)
        {
            var efUrl = new Url()
            {
                Id = Guid.NewGuid(),
                UserId = pUserId,
                Action = pAction,
                Paypal = pPaypal,
                CreateUserId = pUserId,
                CreateDT = DateTime.Now,
                ChangeUserId = pUserId,
                ChangeDT = DateTime.Now
            };
            Context.Urls.Add(efUrl);
            return efUrl;
        }
        public Url New(string pAction, Guid pUserId)
        {
            var uRLParm = new Url()
            {
                Id = Guid.NewGuid(),
                UserId = pUserId,
                Action = pAction,
                CreateUserId = pUserId,
                CreateDT = DateTime.Now,
                ChangeUserId = pUserId,
                ChangeDT = DateTime.Now
            };
            return uRLParm;
        }


        public Url New(Guid pId, Guid pDeviceId, Guid pUserId, string pAction, Guid pGameId, Guid pMyUserId)
        {
            var uRLParm = new Url()
            {
                Id = pId,
                UserId = pUserId,
                Action = pAction,
                GameId = pGameId,
                CreateUserId = pUserId,
                CreateDT = DateTime.Now,
                ChangeUserId = pUserId,
                ChangeDT = DateTime.Now
            };
            return uRLParm;
        }




        public Url Get(Guid pId)
        {
            return Context.Urls.FirstOrDefault(x => x.Id == pId);
        }

        public bool Remove(Guid pId)
        {
            Context.Urls.Remove(Context.Urls.FirstOrDefault(x => x.Id == pId));
            return true;
        }

        public bool RemoveRange(Guid pUserId, string pAction)
        {
            Context.Urls.RemoveRange(Context.Urls.Where(x => x.Action == pAction));
            return true;
        }
    }
}