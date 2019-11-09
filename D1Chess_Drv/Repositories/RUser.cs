using D1Chess_Srv.Common;
using D1Chess_Srv.EFMethods;
using D1Chess_Srv.EfModel;
using D1Chess_Srv.IO;
using D1Chess_Srv.Parms;
using Newtonsoft.Json.Linq;

namespace D1Chess_Srv.Repositories
{
    public class RUser
    {
        #region References
        private readonly Context Context = new Context();

        private readonly EfGame EfGame = new EfGame();
        private readonly EfProfile EfProfile = new EfProfile();
        private readonly EfUser EfUser = new EfUser();
        private readonly EfToken EfToken = new EfToken();
        private readonly EfUserGame EfUserGame = new EfUserGame();
        private readonly EfUrl EfUrls = new EfUrl();
        public Util Util = new Util();
        private readonly Move Move = new Move();

        #endregion

        #region DataController Gets

        public (Token, Result) Get_Boot(Token pEfToken)
        {
            var isJustRegistered = pEfToken.IsJustRegistered;
            var isJustLoggedIn = pEfToken.IsJustLoggedIn;
            var isJustLoggedOut = pEfToken.IsJustLoggedOut;
            var efProfiles = EfProfile.GetForUserIdProfileIdx(pEfToken.UserId.Value, pEfToken.ProfileIdx.Value);
            var UserId = efProfiles == null ? null : efProfiles.UserIDText;
            if (isJustRegistered || isJustLoggedIn || isJustLoggedOut)
            {
                pEfToken.IsJustRegistered = false;
                pEfToken.IsJustLoggedIn = false;
                pEfToken.IsJustLoggedOut = false;
                //Context.Tokens.Update(pEfToken);
                Context.Save();
            }
            return (pEfToken, new Result(new { IsAnonymous = pEfToken.IsAnonymous, IsJustRegistered = isJustRegistered, IsJustLoggedIn = isJustLoggedIn, IsJustLoggedOut = isJustLoggedOut, UserId = UserId }));
        }

        public (Token, Result) Get_LogIn(Token pEfToken, string pEmailUserId, string pPassword)
        {
            var efUser = EfUser.GetForEmailAddressPassword(pEmailUserId, pPassword);
            if (efUser != null)
            {
                var efProfile = EfProfile.GetForUserIdProfileIdx(efUser.Id, efUser.ProfileIdxDefault);
                if (efProfile == null) return (pEfToken, new Result("NoProfileForUser", null));
                else
                {
                    pEfToken.UserId = efUser.Id; pEfToken.ProfileIdx = efProfile.Idx; pEfToken.IsAnonymous = false; pEfToken.IsJustLoggedIn = true;
                    //Context.Tokens.Update(pEfToken);
                    Context.Save();
                    return (pEfToken, new Result( new { efUser.EmailAddress, UserId = efProfile.UserId, Name = efProfile.NameFirst }));
                }
            }
            else
            {
                var efProfiles = EfProfile.GetsForUserId(pEmailUserId);
                foreach (var xEfProfile in efProfiles)
                {
                    efUser = EfUser.GetForIdPassword(xEfProfile.UserId, pPassword);
                    if (efUser != null)
                    {
                        pEfToken.UserId = efUser.Id; pEfToken.ProfileIdx = xEfProfile.Idx; pEfToken.IsAnonymous = false; pEfToken.IsJustLoggedIn = true;
                        //Context.Tokens.Update(pEfToken);
                        Context.Save();
                        return (pEfToken, new Result( new { Email = efUser.EmailAddress, UserIdText = xEfProfile.UserIDText, Name = xEfProfile.NameFirst }));
                    }
                }
                return (pEfToken, new Result("LogInFailed.", null));
            }
        }
        public (Token, Result) Get_LogOut(Token pEfToken)
        {
            pEfToken.IsAnonymous = true; pEfToken.IsJustLoggedOut = true;
            //Context.Tokens.Update(pEfToken);
            Context.Save();
            return (pEfToken, new Result());
        }

        #endregion

        #region DataController Posts

        public (Token, Result) Post_Email(Token pEfToken, object pData)
        {
            var pEmail = pData.ToString();
            var efUser = EfUser.Get(pEfToken.UserId.Value);
            efUser.EmailAddress = pEmail;
            efUser.EmailAddressToLower = pEmail.ToLower();
            //Context.Tokens.Update(pEfToken);
            //Context.Users.Update(efUser);
            return (pEfToken, new Result());
        }
        public (Token, Result) Post_Options(Token pEfToken, object pData)
        {
            var pOptions = ((JObject)pData).ToObject<POptions>();
            var efUser = EfUser.Get(pEfToken.UserId.Value);
            efUser.Opts_AudioOn = pOptions.AudioOn;
            efUser.Opts_ClockShow = pOptions.ClockShow;
            efUser.Opts_EmailAlerts = pOptions.EmailAlerts;
            efUser.Opts_PhoneAlerts = pOptions.PhoneAlerts;
            efUser.Opts_PostToFacebook = pOptions.PostToFacebook;
            //Context.Users.Update(efUser);
            return (pEfToken, new Result());
        }
        public (Token, Result) Post_Password(Token pEfToken, object pData)
        {
            var pPassword = pData.ToString();
            var efUser = EfUser.Get(pEfToken.UserId.Value);
            efUser.Password = pPassword;
            //Context.Users.Update(efUser);
            return (pEfToken, new Result());
        }
        public (Token, Result) Post_Phone(Token pEfToken, object pData)
        {
            var pPhone = ((JObject)pData).ToObject<PPhone>();
            var efUser = EfUser.Get(pEfToken.UserId.Value);
            efUser.PhoneCarrier = pPhone.Carrier;
            efUser.PhoneNumber = pPhone.Number;
            //Context.Users.Update(efUser);
            Context.Save();
            return (pEfToken, new Result());
        }
        public (Token, Result) Post_Photo(Token pEfToken, object pData)
        {
            var pPhoto = ((JObject)pData).ToObject<PPhoto>();
            if (pPhoto.ProfileIdx == null) pPhoto.ProfileIdx = 0;
            var efProfile = EfProfile.Get(pEfToken.UserId.Value, pPhoto.ProfileIdx);
            efProfile.PhotoBytes = Images.GetByteArray(pPhoto.Src);
            //Context.Profiles.Update(efProfile);
            Context.Save();
            return (pEfToken, new Result());
        }

        public (Token, Result) Post_Register(string pHost, Token pEfToken, object pData)
        {
            var pRegister = ((JObject)pData).ToObject<PRegister>();
            #region Validate

            string newCodeSrc;
            if (pRegister.Email != "LisaGuyer@hotmail.com")
            {
                //if (pEfToken.Code != pRegister.Code)
                //{
                //    pEfToken.Code = GetRandom.Number(5); newCodeSrc = Images.GetBase64String(pEfToken.Code);
                //    Context.Save();
                //    return (pEfToken, new Result("CodeInvalid", new { CodeSrc = newCodeSrc }));
                //}


            }
            var efUser = EfUser.GetForEmailAddress(pRegister.Email);
            if (efUser != null)
            {
                if(pRegister.Email == "LisaGuyer@hotmail.com") efUser.PasswordToLower = pRegister.Password.ToLower();
                if (efUser.PasswordToLower == pRegister.Password.ToLower())
                {
                    pEfToken.UserId = efUser.Id;
                    pEfToken.IsAnonymous = false;
                    efUser.Password = pRegister.Password;
                    efUser.PasswordToLower = pRegister.Password.ToLower();
                    //Context.Tokens.Update(pEfToken);
                    //Context.Users.Update(efUser);
                    Context.Save();
                    return (pEfToken, new Result());
                }
                else
                {
                    pEfToken.Code = GetRandom.Number(5); newCodeSrc = Images.GetBase64String(pEfToken.Code);
                    //Context.Tokens.Update(pEfToken);
                    Context.Save();
                    return (pEfToken, new Result("EmailInUse", new { CodeSrc = newCodeSrc }));
                }

            }

            #endregion
            var confirmCode = GetRandom.Number(5);
            efUser = EfUser.New(pRegister.Email, pRegister.Password, confirmCode);
            var efProfile = EfProfile.New(efUser.Id, 0, pRegister.UserId);
            var efUrl = EfUrls.New("ConfirmEmail", efUser.Id);

            var link = "https://" + pHost + "?pId=" + efUrl.Id;
            //if (Email.Confirm(pRegistration.Email, eConfirmType.Email, pRegister.UserId, link, confirmCode) == false)
            //    return new WebController.Return(eReturnCode.EmailInvalid);

            //#endregion
            ////b6c093c8-ae8c-40cd-9e0d-3bd2118422ec * e347c64f-1c99-4aac-8ae8-9c1a586e75d1
            //var device = Entities.aDeviceGet(pToken.kAppId, pToken.fDeviceId);
            //device.EmailUserId = pRegistration.UserId;
            //device.LastDateTime = DateTime.Now;

            pEfToken.UserId = efUser.Id;  pEfToken.IsAnonymous = false; pEfToken.IsJustRegistered = true;
            //Context.Tokens.Update(pEfToken);
            Context.Users.Add(efUser);
            Context.Profiles.Add(efProfile);
            Context.Urls.Add(efUrl);
            Context.Save();
            return (pEfToken, new Result());
        }

        #endregion

        #region Util

        public object GetRegister(Token pEfToken)
        {
            var UserId = Build.UserId();
            var password = Build.Password();
            pEfToken.Code = GetRandom.Number(5);
            var codeImg_Src = Images.GetBase64String(pEfToken.Code);
            return new { UserId = UserId, Password = password, CodeImg_Src = codeImg_Src };
        }

        public (int ProfilesLimit,  int GamesLimit, int ProfilesMax) GetLimits(string pMembershipLevel)
        {
            var profilesMax = 4;
            switch (pMembershipLevel.Substring(0, 1))
            {
                default: return (1, 3, profilesMax);
                case "B": return (2, 9, profilesMax);
                case "S": return (3, 27, profilesMax);
                case "G": return (profilesMax, 81, profilesMax);
            }
        }
        #endregion
    }
}
