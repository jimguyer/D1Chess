using D1Chess_Srv.EfModel;
using System;
using System.Collections.Generic;
using System.Linq;


namespace D1Chess_Srv.EFMethods
{
    public class EfProfile
    {
        private readonly Context Context = new Context();

        public Profile Get(Guid pUserId, int? pIdx)
        {
            return pIdx == null ? Context.Profiles.FirstOrDefault(x => x.UserId == pUserId) : Context.Profiles.FirstOrDefault(x => x.UserId == pUserId && x.Idx == pIdx);
        }

        public List<Profile> Gets(Guid pUserId) { return Context.Profiles.Where(x => x.UserId == pUserId).ToList(); }

        public List<Profile> GetsForUserId(string pUserID)
        {
            return Context.Profiles.Where(x => x.UserIDTextToLower == pUserID.ToLower()).ToList();
        }

        public Profile GetForUserIdProfileIdx(Guid pUserId, int pIdx) { return Context.Profiles.FirstOrDefault(x => x.UserId == pUserId && x.Idx == pIdx); }


        public Profile New(Guid pUserId, int pProfileIdx, string pUserIDText, string pGroup = "Newbie")
        {
            return new Profile()
            {
                UserId = pUserId,
                Idx = pProfileIdx,
                UserIDText = pUserIDText,
                UserIDTextToLower = pUserIDText.ToLower(),
                Group = pGroup,
                GroupToLower = pGroup.ToLower(),
                PhotoBytes = null,
                IsPhotoApproved = false,
                Rating = 1200,
                //StartParmsOpFindBy = "S",
                //StartParmsRated = true,
                //StartParmsTimeInc = "D",
                //StartParmsTimeAmt = 3,
                //StartEmailEmail = "",
                //SearchBy = "U",
                //SearchTextUserId = "",
                //SearchTextGroup = "",
                //SearchRatingMin = 0,
                //SearchRatingMax = 0,
                //CreateDt = DateTime.Now,
                CreateUserId = pUserId,
                //ChangeDt = DateTime.Now,
                ChangeUserId = pUserId
            };
        }

        #region Gets

        public List<Profile> SearchForGroup(string pGroup) { return Context.Profiles.Where(x => x.GroupToLower.Contains(pGroup)).ToList(); }
        public List<Profile> SearchForNameFirst(string pNameFirst) { return Context.Profiles.Where(x => x.NameLast.Contains(pNameFirst)).ToList(); }
        public List<Profile> SearchForNameLast(string pNameLast) { return Context.Profiles.Where(x => x.NameLast.Contains(pNameLast)).ToList(); }
        public List<Profile> SearchForUserId(string pUserId) { return Context.Profiles.Where(x => x.UserIDTextToLower.Contains(pUserId)).ToList(); }

        #endregion
    }
}
