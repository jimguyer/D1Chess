using D1Chess_Srv.Common;
using D1Chess_Srv.EFMethods;
using D1Chess_Srv.EfModel;
using D1Chess_Srv.IO;
using D1Chess_Srv.Parms;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace D1Chess_Srv.Repositories
{
    public class RProfile
    {

        #region References
        private readonly Context Context = new Context();
        private readonly EfProfile EfProfile = new EfProfile();
        #endregion

        public (D1Chess_Srv.EfModel.Token, Result) Post_Search(D1Chess_Srv.EfModel.Token pEfToken, object pData)
        {
            var pSearch = ((JObject)pData).ToObject<PSearch>();
            var efProfile = EfProfile.GetForUserIdProfileIdx(pEfToken.UserId.Value, pSearch.ProfileIdx);
            efProfile.Search_By = pSearch.By;
            switch (pSearch.By)
            {
                case "G": efProfile.SearchText_Group = pSearch.Text; break;
                case "F": efProfile.SearchText_NameFirst = pSearch.Text; break;
                case "L": efProfile.SearchText_NameLast = pSearch.Text; break;
                case "U": efProfile.SearchText_UserId = pSearch.Text; break;
            }
            efProfile.Search_RatingMin = pSearch.Min;
            efProfile.Search_RatingMax = pSearch.Max;
            var efProfiles = new List<D1Chess_Srv.EfModel.Profile>();
            var profiles = new List<object>();

            foreach (var profile in efProfiles)
                profiles.Add(
                    new {
                        UserId = profile.UserIDText,
                        Photo_Src = Images.GetBase64String(profile.PhotoBytes),
                        Name = profile.NameFirst + " " + profile.NameLast,
                        profile.Rating
                    }
                );

            //Context.Profiles.Update(efProfile);
            Context.Save();
            return (pEfToken, new Result(profiles));
        }
    }
}
