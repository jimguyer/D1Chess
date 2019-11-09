using D1Chess_Srv.Common;
using D1Chess_Srv.EFMethods;
using D1Chess_Srv.EfModel;
using D1Chess_Srv.Parms;
using System;

namespace D1Chess_Srv.Repositories
{
    public class RToken
    {
        #region References

        Context Context = new Context();
        private EfToken EfToken = new EfToken();
        PToken PToken = new PToken();
        public Util Util = new Util();

        #endregion

        public D1Chess_Srv.EfModel.Token Swap(Guid? pTokenid, Guid? pDeviceId )
        {
            D1Chess_Srv.EfModel.Token oldEfToken;
            D1Chess_Srv.EfModel.Token newEfToken;
            var ipAddress = Util.GetIPAddress();
            if (pTokenid == null) newEfToken = EfToken.New();
            else
            {
                oldEfToken = EfToken.Get(pTokenid);
                if (oldEfToken == null)
                {
                    EfToken.RemoveRangeForIPAddress(ipAddress);
                    EfToken.RemoveRangeForDeviceId(pDeviceId);
                    newEfToken = EfToken.New(null, "Missing"); // Token got deleted
                }
                else if (oldEfToken.IPAddress != ipAddress)
                {
                    // Something wrong
                    EfToken.RemoveRangeForIPAddress(ipAddress);
                    EfToken.RemoveRangeForDeviceId(pDeviceId);
                    EfToken.RemoveRangeForIPAddress(oldEfToken.IPAddress);
                    EfToken.RemoveRangeForDeviceId(oldEfToken.DeviceId);
                    EfToken.RemoveRangeForUserId(oldEfToken.UserId);
                    Context.Save();
                    newEfToken = EfToken.New(null, "Breach"); // Token got copied
                }
                else
                {
                    newEfToken = EfToken.Convert(oldEfToken);
                    EfToken.RemoveRangeForDeviceId(oldEfToken.DeviceId);
                    EfToken.RemoveRangeForUserId(oldEfToken.UserId);
                    Context.Save();

                }
            }
            newEfToken.IPAddress = ipAddress;
            EfToken.Add(newEfToken);
            Context.Save();
            return newEfToken;
        }
    }
}
