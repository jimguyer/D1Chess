using D1Chess_Srv.IO;
using D1Chess_Srv.EfModel;
using D1Chess_Srv.Common;
using System;
using System.Linq;

namespace D1Chess_Srv.Common
{
    public class Util
    {

        #region DataController



        #endregion

        #region Util

        public string GetIPAddress()
        {
            var ipAddresses = System.Net.Dns.GetHostEntry(System.Net.Dns.GetHostName()).AddressList;
            switch (ipAddresses.Count())
            {
                case 0: return null; 
                case 1: return ipAddresses.GetValue(0).ToString();
                default: return ipAddresses.GetValue(1).ToString();
            }
        }

        public bool Guid_IsNullOrEmpty(Guid? pGuid)
        {
            return pGuid == null || pGuid.Value == Guid.Empty;
        }
        public Guid? ConvertGuid(string pGuid)
        {
            if (pGuid == null || pGuid == "") return null;
            Guid.TryParse(pGuid, out Guid guid);
            return ConvertGuid(guid);
        }
        public Guid? ConvertGuid(Guid? pGuid)
        {
            if (pGuid == Guid.Empty) return null;
            return pGuid;
        }


        #endregion

        public string GetTimeSelect(string pTimeCode)
        {
            switch (pTimeCode)
            {
                default: return "3 Days";
                case "Min5": return "5 mins";
                case "Hour": return "1 Hour";
                case "Day": return "1 Day";
                case "Day3": return "3 Days";
                case "Week": return "1 Week";
            }
        }


        public string GetTime(string pTimeInc, int pTimeAmt)
        {
            switch (pTimeInc)
            {
                default: return "Unknown";
                case "M":
                    switch (pTimeAmt)
                    {
                        case 1: return "1 Minute";
                        case 2: return "2 Minutes";
                        case 3: return "3 Minutes";
                        case 4: return "4 Minutes";
                        case 5: return "5 Minutes";
                        case 6: return "6 Minutes";
                        case 7: return "7 Minutes";
                        case 8: return "8 Minutes";
                    }
                    break;
                case "Q":
                    switch (pTimeAmt)
                    {
                        case 1: return "15 Minutes";
                        case 2: return "30 Minutes";
                        case 3: return "45 Minutes";
                        case 4: return "1 Hour";
                        case 5: return "75 Minutes";
                        case 6: return "90 Minutes";
                        case 7: return "105 Minutes";
                        case 8: return "2 Hours";
                    }
                    break;
                case "H":
                    switch (pTimeAmt)
                    {
                        case 1: return "1 Hour";
                        case 2: return "2 Hours";
                        case 3: return "3 Hours";
                        case 4: return "4 Hours";
                        case 5: return "5 Hours";
                        case 6: return "6 Hours";
                        case 7: return "7 Hours";
                        case 8: return "8 Hours";
                    }
                    break;
                case "D":
                    switch (pTimeAmt)
                    {
                        case 1: return "1 Day";
                        case 2: return "2 Days";
                        case 3: return "3 Days";
                        case 4: return "4 Days";
                        case 5: return "5 Days";
                        case 6: return "6 Days";
                        case 7: return "7 Days";
                        case 8: return "8 Days";
                    }
                    break;
            }
            return null;
        }



    }
}
