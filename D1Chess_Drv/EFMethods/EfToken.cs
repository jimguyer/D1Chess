using D1Chess_Srv.Common;
using D1Chess_Srv.EfModel;
using D1Chess_Srv.Parms;
using System;
using System.Collections.Generic;
using System.Linq;


namespace D1Chess_Srv.EFMethods
{
    public class EfToken
    {
        #region References

        Context Context = new Context();
        PToken PToken = new PToken();
        public Util Util = new Util();

        #endregion


        public void Add(Token efToken)
        {
            Context.Tokens.Add(efToken);
            Context.Save();
        }

        #region EfGet

        public Token Get(Guid? pId)
        {
            return Context.Tokens.FirstOrDefault(x => x.Id == pId.Value);
        }
        #endregion

        #region EF Gets
        private List<Token> GetsForDeviceId(Guid? pDeviceId)
        {
            return pDeviceId == null ? new List<Token>() : Context.Tokens.Where(x => x.DeviceId == pDeviceId.Value).ToList();
        }
        private List<Token> GetsForIPAddress(string pIPAddress)
        {
            return string.IsNullOrWhiteSpace(pIPAddress) ? new List<Token>() : Context.Tokens.Where(x => x.IPAddress == pIPAddress).ToList();
        }

        private List<Token> GetsForUserId(Guid? pUserId)
        {
            return pUserId == null ? new List<Token>() : Context.Tokens.Where(x => x.UserId == pUserId.Value).ToList();
        }
        #endregion

        public Token Convert(Token pEfToken)
        {
            return new Token()
            {
                Id = Guid.NewGuid(),
                IsAnonymous = pEfToken.IsAnonymous,
                IsJustRegistered = pEfToken.IsJustRegistered,
                IsJustLoggedIn = pEfToken.IsJustLoggedIn,
                IsJustLoggedOut = pEfToken.IsJustLoggedOut,
                UserId = pEfToken.UserId,
                ProfileIdx = pEfToken.ProfileIdx,
                DeviceId = pEfToken.DeviceId,
                Code = pEfToken.Code,
                Msg = pEfToken.Msg,
                URLId = pEfToken.URLId,
                CreateUserId = pEfToken.CreateUserId,
                CreateDT = pEfToken.CreateDT,
                CreateMod = pEfToken.CreateMod,
                ChangeUserId = pEfToken.UserId,
                ChangeDT = System.DateTime.Now,
                ChangeMod = "Swap"
            };
        }



        #region New
        public Token New(Guid? pDeviceid = null, string pMod = "New")
        {
            var deviceId = pDeviceid != null ? pDeviceid : pDeviceid = Guid.NewGuid();

            var newToken = new Token()
            {
                Id = Guid.NewGuid(),
                IsAnonymous = true,
                IsJustRegistered = false,
                IsJustLoggedIn = false,
                IsJustLoggedOut = false,
                UserId = pDeviceid,
                ProfileIdx = 0,
                DeviceId = pDeviceid,
                Code = "",
                Msg = "",
                URLId = null,
                CreateUserId = pDeviceid,
                CreateDT = System.DateTime.Now,
                CreateMod = pMod,
                ChangeUserId = pDeviceid,
                ChangeDT = System.DateTime.Now,
                ChangeMod = pMod
            };
            return newToken;
        }
        #endregion

        public void RemoveRangeForDeviceId(Guid? pDeviceId)
        {
            if (pDeviceId != null) this.RemoveRange(GetsForDeviceId(pDeviceId));
        }
        public void RemoveRangeForIPAddress(string pIPAdress)
        {
            if (!string.IsNullOrWhiteSpace(pIPAdress)) this.RemoveRange(GetsForIPAddress(pIPAdress));
        }
        public void RemoveRangeForUserId(Guid? pUserId)
        {
            if (pUserId != null) this.RemoveRange(GetsForUserId(pUserId));
        }


        private void RemoveRange(List<Token> pTokens)
        {
            Context.Tokens.RemoveRange(pTokens);
        }
    }
}
