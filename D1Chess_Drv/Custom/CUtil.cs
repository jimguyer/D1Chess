using System;
using System.Collections.Generic;
using System.Text;

namespace D1Chess_Srv.Custom
{
    public class CUtil
    {
        public (int MeRating, int OpRating) CalcRatings(bool pIwon, int pMeRating, int pOpRating)
        {

            (int MeRating, int OpRating) ratings = (pMeRating, pOpRating);
            bool isMeLeader = (pMeRating > pOpRating);

            int ratingGap = (pMeRating > pOpRating) ? pMeRating - pOpRating : pOpRating - pMeRating;
            int pointGap = ratingGap / 10;
            var leaderWinChange = 10 - pointGap;
            var leaderLoseChange = pointGap + 10;

            if (leaderWinChange < 1) leaderWinChange = 1;
            if (leaderLoseChange > 20) leaderLoseChange = 20;
            if (pIwon)
            {
                if (isMeLeader) { ratings.MeRating += leaderWinChange; ratings.OpRating -= leaderWinChange; }
                else { ratings.MeRating += leaderLoseChange; ratings.OpRating -= leaderLoseChange; }
            }
            else
            {
                if (isMeLeader) { ratings.MeRating -= leaderLoseChange; ratings.OpRating += leaderLoseChange; }
                else { ratings.MeRating -= leaderWinChange; ratings.OpRating += leaderWinChange; }
            }

            return ratings;
        }

        public static DateTime GetTurnExpiration(DateTime pLastActionDate, char pTimeInc, int pTimeAmt)
        {
            switch (pTimeInc)
            {
                case 'M': return pLastActionDate.AddMinutes(pTimeAmt);
                case 'Q': return pLastActionDate.AddMinutes(pTimeAmt * 15);
                case 'H': return pLastActionDate.AddHours(pTimeAmt);
                case 'D': return pLastActionDate.AddDays(pTimeAmt);
                default: return DateTime.Now.AddSeconds(45);
            }
        }

    }
}
