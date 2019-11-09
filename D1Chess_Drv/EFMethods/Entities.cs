//using D1Chess_Srv.EfModel;
//using System;
//using System.Linq;

//namespace D1Chess_Srv
//{
//    public class Entities
//    {
//        private readonly Context Context = new Context();
//        //public bool SaveChanges()
//        //{
//        //    try
//        //    {
//        //        Context.SaveChangesAsync();
//        //    }
//        //    catch (System.Data.Entity.Validation.DbEntityValidationException ex)
//        //    {

//        //        foreach (var eve in ex.EntityValidationErrors)
//        //        {

//        //            var type = eve.Entry.Entity.GetType().Name;
//        //            var state = eve.Entry.State;
//        //            foreach (var ve in eve.ValidationErrors)
//        //            {
//        //                var propertyName = ve.PropertyName;
//        //                var ErrorMessage = ve.ErrorMessage;
//        //            }
//        //        }
//        //        var m = ex;
//        //        throw;
//        //    }
//        //    //DMCConnection.SaveChanges();
//        //    return true;
//        //}



//        #region aCodes

//        public bool aCodeAdd(aCode pCode) { DMCConnection.aCodes.Add(pCode); return true; }
//        public aCode aCodeGet(Guid pDeviceId)
//        {

//            return DMCConnection.aCodes.Where(x => x.kDeviceId == pDeviceId).FirstOrDefault();
//        }
//        public aCode aCodeSave(Guid pDeviceId, string pCode)
//        {
//            var humanCode = aCodeGet(pDeviceId);
//            if (humanCode == null)
//            {
//                humanCode = new aCode();
//                humanCode.kDeviceId = pDeviceId;
//                humanCode.Code = pCode;
//                aCodeAdd(humanCode);
//            }
//            else
//            {
//                humanCode.Code = pCode;
//            }
//            return humanCode;
//        }

//        #endregion

//        #region aPhoneCarriers

//        public aPhoneCarrier aPhoneCarrierGet(string pCarrierName)
//        {
//            return DMCConnection.aPhoneCarriers.Where(x => x.kName == pCarrierName).FirstOrDefault();

//        }

//        public IQueryable<aPhoneCarrier> aPhoneCarriersGet()
//        {
//            return DMCConnection.aPhoneCarriers;
//        }
//        #endregion


//        #region aTokens

//        public aToken aTokenAdd(Guid pAppId, Guid pDeviceId, Guid pUserId, bool pIsLoggedIn, string pEmailUserId, string pURLAction, string pURLLocation, string pMsgId)
//        {
//            var token = new aToken()
//            {
//                kAppId = pAppId,
//                kId = Guid.NewGuid(),
//                fDeviceId = pDeviceId,
//                fUserId = pUserId,
//                IsLoggedIn = pIsLoggedIn,
//                URLAction = pURLAction,
//                URLLocation = pURLLocation,
//                MsgId = pMsgId,
//                CreateUserId = pUserId,
//                CreateDate = DateTime.Now,
//                ChangeUserId = pUserId,
//                ChangeDate = DateTime.Now
//            };

//            DMCConnection.aTokens.Add(token); return token;
//        }

//        public aToken aTokenAdd(Guid pAppId, Guid pDeviceId, Guid pUserId, bool pIsLoggedIn, string pEmailUserId, string pMsgId)
//        {
//            var token = new aToken()
//            {
//                kAppId = pAppId,
//                kId = Guid.NewGuid(),
//                fDeviceId = pDeviceId,
//                fUserId = pUserId,
//                IsLoggedIn = pIsLoggedIn,
//                MsgId = pMsgId,
//                URLAction = null,
//                URLLocation = null,
//                CreateUserId = pUserId,
//                CreateDate = DateTime.Now,
//                ChangeUserId = pUserId,
//                ChangeDate = DateTime.Now
//            };

//            DMCConnection.aTokens.Add(token); return token;
//        }

//        public aToken aTokenAdd(Guid pAppId, Guid pDeviceId)
//        {
//            var token = new aToken()
//            {
//                kAppId = pAppId,
//                kId = Guid.NewGuid(),
//                fDeviceId = pDeviceId,
//                fUserId = pDeviceId,
//                IsLoggedIn = false,
//                URLAction = null,
//                URLLocation = null,
//                URLPaypal = null,
//                URLGameId = null,
//                MsgId = "Welcome",
//                CreateUserId = pDeviceId,
//                CreateDate = DateTime.Now,
//                ChangeUserId = pDeviceId,
//                ChangeDate = DateTime.Now
//            };

//            DMCConnection.aTokens.Add(token); return token;
//        }



//        public bool aTokenAdd(aToken pToken)
//        {
//            DMCConnection.aTokens.Add(pToken); return true;
//        }

//        public aToken aTokenGet(Guid? pAppId, Guid pDeviceId, Guid? pTokenId)
//        {
//            if (pAppId == null) return null;
//            if (pTokenId == null) return null;
//            var token = DMCConnection.aTokens.FirstOrDefault(x => x.kAppId == pAppId && x.kId == pTokenId.Value);
//            return token;
//        }
//        public aToken aTokenUpdate(aToken pToken, Guid pDeviceId, Guid pUserId, int pProfileIdx, bool pIsLoggedIn, string pEmailUserId, string pMsgId, Guid? pURLParmId = null)
//        {
//            pToken.fDeviceId = pDeviceId;
//            pToken.fUserId = pUserId;
//            pToken.IsLoggedIn = pIsLoggedIn;

//            if (pToken.CreateUserId == pToken.fDeviceId) pToken.CreateUserId = pUserId;
//            pToken.ChangeUserId = pUserId;
//            pToken.ChangeDate = DateTime.Now;
//            return pToken;
//        }





//        #region Get

//        public aToken aTokenGet(Guid pAppId, Guid pTokenId)
//        {
//            return DMCConnection.aTokens.FirstOrDefault(x => x.kAppId == pAppId && x.kId == pTokenId);
//        }

//        public aToken aTokenGet(Guid pAppId, Guid pDeviceId, Guid pTokenId)
//        {
//          return DMCConnection.aTokens.FirstOrDefault(x => x.kAppId == pAppId && x.fDeviceId == pDeviceId && x.kId == pTokenId);
//        }

//        #endregion

//        public aToken aTokenCopy(aToken pToken)
//        {
//            return new aToken()
//            {
//                kAppId = pToken.kAppId,
//                kId = Guid.NewGuid(),
//                fDeviceId = pToken.fDeviceId,
//                fUserId = pToken.fUserId,
//                IsLoggedIn = pToken.IsLoggedIn,
//                MsgId = pToken.MsgId,
//                URLAction = pToken.URLAction,
//                URLLocation = pToken.URLLocation,
//                URLPaypal = pToken.URLPaypal,
//                URLGameId = pToken.URLGameId,
//                CreateUserId = pToken.fUserId,
//                CreateDate = pToken.CreateDate,
//                ChangeUserId = pToken.fUserId,
//                ChangeDate = DateTime.Now
//            };
//        }


//        private aToken aTokenNew(Guid pAppId, Guid pId, Guid pDeviceId, Guid pUserId, bool pIsLoggedIn)
//        {
//            return new aToken()
//            {
//                kAppId = pAppId,
//                kId = pId,
//                fDeviceId = pDeviceId,
//                fUserId = pUserId,
//                IsLoggedIn = pIsLoggedIn,
//                CreateUserId = pUserId,
//                CreateDate = DateTime.Now,
//                ChangeUserId = pUserId,
//                ChangeDate = DateTime.Now
//            };
//        }

//        public bool aTokensRemoveRange(Guid pAppId, Guid pDeviceId)
//        {
//            DMCConnection.aTokens.RemoveRange(DMCConnection.aTokens.Where(x => x.kAppId == pAppId && x.fDeviceId == pDeviceId));
//            return true;
//        }
//        #endregion

//        #region aUsers
//        public bool aUserAdd(aUser pUser) { DMCConnection.aUsers.Add(pUser); return true; }

//        public aUser aUserGet(Guid pAppId, Guid pUserIdKey)
//        {
//            return DMCConnection.aUsers.FirstOrDefault(x => x.kAppId == pAppId && x.kId == pUserIdKey);
//        }

//        public aUser aUserGet(Guid pAppId, Guid pUserId, string pPassword)
//        {
//            var aUser = DMCConnection.aUsers.FirstOrDefault(x => x.kAppId == pAppId && x.kId == pUserId);
//            if (aUser.Password.ToLower() != pPassword.ToLower()) return null;
//            return aUser;

//            //return DMCConnection.aUsers.FirstOrDefault(x => x.AppId == pAppId && x.Id == pUserId && x.PasswordToLower == pPassword.ToLower());
//        }

//        public aUser aUserGet(Guid pAppId, string pEmailAddress)
//        {
//            return DMCConnection.aUsers.FirstOrDefault(x => x.kAppId == pAppId && x.EmailAddressToLower == pEmailAddress.ToLower());
//        }

//        public aUser aUserGet(Guid pAppId, long pPhoneNumber)
//        {
//            return DMCConnection.aUsers.FirstOrDefault(x => x.kAppId == pAppId && x.PhoneNumber == pPhoneNumber);
//        }

//        public aUser aUserGet(Guid pAppId, string pEmail, string pPassword)
//        {
//            return DMCConnection.aUsers.FirstOrDefault(x => x.kAppId == pAppId && x.EmailAddressToLower == pEmail.ToLower() && x.Password == pPassword);
//        }
//        public aUser aUserGetForConnectionId(Guid pAppId, Guid pConnectionId)
//        {
//            return DMCConnection.aUsers.FirstOrDefault(x => x.kAppId == pAppId && x.ConnectionId == pConnectionId);
//        }

//        public aUser aUserNew(Guid pAppId, string pEmailAddress, string pPassword)
//        {
//            var userId = Guid.NewGuid();
//            return new aUser()
//            {
//                kAppId = pAppId,
//                kId = userId,
//                Password = pPassword,
//                PasswordToLower = pPassword.ToLower(),
//                IsOnline = false,
//                EmailAddress = pEmailAddress,
//                EmailAddressToLower = pEmailAddress.ToLower(),
//                EmailConfirmCode = "",


//                PhoneCarrier = "",
//                PhoneNumber = 0,
//                PhoneConfirmCode = "",

//                Opts_EmailAlerts = false,
//                Opts_PhoneAlerts = false,
//                Opts_AudioOn = false,
//                Opts_ClockShow = false,
//                Opts_PostToFacebook = false,

//                Role = "Member",
//                MembershipLevel = "Free",
//                MembershipExpiration = null,
//                RegisterDateTime = DateTime.Now,
//                LastActivityDateTime = DateTime.Now,
//                IsApproved = false,
//                IsLockedOut = false,
//                CreateDate = DateTime.Now,
//                CreateUserId = userId,
//                ChangeDate = DateTime.Now,
//                ChangeUserId = userId
//            };
//        }
//        public aUser aUserNew(Guid pAppId, string pEmailAddress, string pPassword, string pEmailConfirmCode)
//        {
//            var userId = Guid.NewGuid();
//            return new aUser()
//            {
//                kAppId = pAppId,
//                kId = userId,
//                Password = pPassword,
//                PasswordToLower = pPassword.ToLower(),
//                IsOnline = false,
//                EmailAddress = pEmailAddress,
//                EmailAddressToLower = pEmailAddress.ToLower(),
//                EmailConfirmCode = pEmailConfirmCode,

//                PhoneCarrier = "",
//                PhoneNumber = 0,
//                PhoneConfirmCode = "",
//                Opts_EmailAlerts = false,
//                Opts_PhoneAlerts = false,
//                Opts_AudioOn = false,
//                Opts_ClockShow = false,
//                Opts_PostToFacebook = false,

//                Role = "Member",
//                MembershipLevel = "Free",
//                MembershipExpiration = null,
//                RegisterDateTime = DateTime.Now,
//                LastActivityDateTime = DateTime.Now,
//                IsApproved = false,
//                IsLockedOut = false,
//                CreateDate = DateTime.Now,
//                CreateUserId = userId,
//                ChangeDate = DateTime.Now,
//                ChangeUserId = userId
//            };
//        }


//        #endregion

//        #region aURLParms

//        public bool aURLParmAdd(aURLParm pURLParm) { DMCConnection.aURLParms.Add(pURLParm); return true; }


//        public aURLParm aURLParmAdd(Guid pAppId, Guid pDeviceId, Guid pUserId, string pURLParmAction, string pLocation = null, string pPaypal = null)
//        {
//            var uRLParm = new aURLParm()
//            {
//                kAppId = pAppId,
//                kId = Guid.NewGuid(),
//                fUserId = pUserId,
//                Action = pURLParmAction,
//                Location = pLocation,
//                Paypal = pPaypal,
//                CreateUserId = pUserId,
//                CreateDate = DateTime.Now,
//                ChangeUserId = pUserId,
//                ChangeDate = DateTime.Now
//            };
//            DMCConnection.aURLParms.Add(uRLParm);
//            return uRLParm;
//        }
//        public aURLParm URLParmNew(Guid pAppId, Guid pId, Guid pDeviceId, Guid pUserId, string pAction, Guid pGameId, Guid pMyUserId)
//        {
//            var uRLParm = new aURLParm()
//            {
//                kAppId = pAppId,
//                kId = pId,
//                fUserId = pUserId,
//                Action = pAction,
//                GameId = pGameId,
//                CreateUserId = pMyUserId,
//                CreateDate = DateTime.Now,
//                ChangeUserId = pMyUserId,
//                ChangeDate = DateTime.Now
//            };
//            return uRLParm;
//        }




//        public aURLParm aURLParmGet(Guid pAppId, Guid pId)
//        {
//            return DMCConnection.aURLParms.Where(x => x.kAppId == pAppId && x.kId == pId).FirstOrDefault();
//        }

//        public bool aURLParmRemove(Guid pAppId, Guid pId)
//        {
//            DMCConnection.aURLParms.Remove(DMCConnection.aURLParms.FirstOrDefault(x => x.kAppId == pAppId && x.kId == pId));
//            return true;
//        }

//        public bool aURLParmRemoveRange(Guid pAppId, Guid pUserId, string pAction)
//        {
//            DMCConnection.aURLParms.RemoveRange(DMCConnection.aURLParms.Where(x => x.kAppId == pAppId && x.fUserId == pUserId && x.Action == pAction));
//            return true;
//        }


//        #endregion

//        #region dGames
//        public bool dGameAdd(dGame pGame) { DMCConnection.dGames.Add(pGame); return true; }

//        public dGame dGameGet(Guid pAppId, Guid pId)
//        {
//            return DMCConnection.dGames.FirstOrDefault(x => x.kAppId == pAppId && x.kId == pId);
//        }
//        public dGame dGameGet(Guid pAppId, Guid pId, string pType)
//        {
//            return DMCConnection.dGames.FirstOrDefault(x => x.kAppId == pAppId && x.kId == pId && x.kId == pId);
//        }


//        public dGame dGameNewPractice(Guid pAppId, Guid pId) { return dGameNew(pAppId, pId, false, "",0, "Practice", pId); }
//        public dGame dGameNewOnLine(Guid pAppId, bool pRated, string pTimeIncrement, int pTimeAmt, Guid pUserId)
//        {
//            return dGameNew(pAppId, Guid.NewGuid(), pRated, pTimeIncrement, pTimeAmt, "Challenge", pUserId);
//        }
//        private dGame dGameNew(Guid pAppId, Guid pId, bool pRated, string pTimeInc, int pTimeAmt, string pSts, Guid pUserId)
//        {
//            return new dGame()
//            {
//                kAppId = pAppId,
//                kId = pId,
//                RelatedId = null,
//                PiecePos = "0, 1, 14, 7, 2, 8, 3, 9, 15, 21, 48, 47, 34, 41, 46, 40, 45, 39, 33, 27",
//                Script = "",
//                Rated = pRated,
//                TimeInc = pTimeInc,
//                TimeAmt = pTimeAmt,
//                StartDate = null,
//                LastActionDate = DateTime.Now,
//                Sts = pSts,             
//                Over = false,
//                OverDate = null,
//                CreateUserId = pUserId,
//                CreateDate = DateTime.Now,
//                ChangeUserId = pUserId,
//                ChangeDate = DateTime.Now
//            };
//        }
//        public bool dGameRemoveRange(Guid pAppId, Guid pId)
//        {
//            DMCConnection.dGames.RemoveRange(DMCConnection.dGames.Where(x => x.kAppId == pAppId && x.kId == pId));
//            return true;
//        }

//        #endregion

//        #region dProfiles
//        public bool dProfileAdd(dProfile pProfile) { DMCConnection.dProfiles.Add(pProfile); return true; }

//        public dProfile dProfileGet(Guid pAppId, Guid pUserId, int? pProfileIdx)
//        {
//            if (pProfileIdx == null)
//            {
//                return DMCConnection.dProfiles.FirstOrDefault(x => x.kAppId == pAppId && x.kUserId == pUserId);
//            }
//            else
//            {
//                return DMCConnection.dProfiles.FirstOrDefault(x => x.kAppId == pAppId && x.kUserId == pUserId && x.kIdx == pProfileIdx);
//            }
//        }

//        public dProfile dProfileGet(Guid pAppId, string pUserIdName)
//        {
//            return DMCConnection.dProfiles.FirstOrDefault(x => x.kAppId == pAppId && x.UserIdToLower == pUserIdName.ToLower());
//        }

//        public dProfile dProfileGet(Guid pAppId, string pUserIdName, string pPassword)
//        {
//            return DMCConnection.dProfiles.FirstOrDefault(x => x.kAppId == pAppId && x.UserIdToLower == pUserIdName.ToLower() && x.aUser.PasswordToLower == pPassword.ToLower());
//        }


//        public dProfile dProfileNew(Guid pAppId, Guid pUserId, int pProfileIdx, string pUserIdName, string pFirstName, string pLastName = "", string pGroup = "", int pRating = 1200)
//        {
//            return new dProfile()
//            {
//                kAppId = pAppId,
//                kUserId = pUserId,
//                kIdx = pProfileIdx,
//                UserIdName = pUserIdName,
//                UserIdToLower = pUserIdName.ToLower(),
//                FirstName = pFirstName,
//                LastName = pLastName,
//                Group = "Newbie",
//                GroupToLower = "newbie",

//                IsApproved = false,
//                PhotoBytes = null,
//                IsPhotoApproved = false,
//                LastActivityDate = DateTime.Now,
//                Rating = pRating,
//                StartParms_OpFindBy = "S",
//                StartParms_Rated = true,
//                StartParms_TimeInc = "D",
//                StartParms_TimeAmt = 3,
//                StartEmail_Email = "",
//                StartEmail_FirstName = "",
//                StartEmail_LastName = "",
//                Search_By = "LastName",
//                Search_Text = "",
//                Search_RatingMin = 0,
//                Search_RatingMax = 0,
//                Games = 0,
//                Wins = 0,
//                Losses = 0,
//                CreateDate = DateTime.Now,
//                CreateUserId = pUserId,
//                ChangeDate = DateTime.Now,
//                ChangeUserId = pUserId
//            };
//        }


//        //public int dProfilesCount(Guid pAppId, Guid? pUserId) { return dProfilesCount(pAppId, pUserId.Value); }
//        public int dProfilesCount(Guid pAppId, Guid pUserId) { return DMCConnection.dProfiles.Count(x => x.kAppId == pAppId && x.kUserId == pUserId); }

//        public dProfile dProfileUpdate(Guid pAppId, Guid? pUserId, int? pProfileIdx, string pUserIdName, string pFirstName, string pLastName, string pGroup)
//        {
//            return dProfileUpdate(pAppId, pUserId.Value, pProfileIdx.Value, pUserIdName, pFirstName, pLastName, pGroup);
//        }
//        public dProfile dProfileUpdate(dProfile dProfile, string pUserIdName, string pFirstName, string pLastName, string pGroup)
//        {
//            dProfile.UserIdName = pUserIdName;
//            dProfile.UserIdToLower = pUserIdName.ToLower();
//            dProfile.FirstName = pFirstName;
//            dProfile.LastName = pLastName;
//            dProfile.Group = pGroup;
//            dProfile.GroupToLower = pGroup.ToLower();
//            return dProfile;
//        }


//        public IQueryable<dProfile> dProfilesGet(Guid pAppId, Guid? pUserId)
//        {
//            return dProfilesGet(pAppId, pUserId.Value);
//        }
//        public IQueryable<dProfile> dProfilesGet(Guid pAppId, Guid pUserId)
//        {
//            return DMCConnection.dProfiles.Where(x => x.kAppId == pAppId && x.kUserId == pUserId);
//        }

//        public IQueryable<dProfile> dSearch( Guid pAppId, Guid pUserId, string pSearchBy, string pSearchText, int pRatingMin, int pRatingMax )
//        {
//            if (pRatingMax == 0) pRatingMax = 9999;
//            switch (pSearchBy)
//            {
//                default:
//                case "U": return DMCConnection.dProfiles
//                        .Where(x => x.kAppId == pAppId && x.aUser.kId != pUserId && x.UserIdToLower.StartsWith(pSearchText.ToLower())  
//                        && x.Rating >= pRatingMin && x.Rating <= pRatingMax
//                        ).OrderBy(x => x.UserIdName);
//                case "F":
//                    return DMCConnection.dProfiles
//                        .Where(x => x.kAppId == pAppId && x.aUser.kId != pUserId && x.FirstName.StartsWith(pSearchText)
//                        && x.Rating >= pRatingMin && x.Rating <= pRatingMax
//                        ).OrderBy(x => x.FirstName);
//                case "L":
//                    return DMCConnection.dProfiles
//                        .Where(x => x.kAppId == pAppId && x.aUser.kId != pUserId && x.LastName.StartsWith(pSearchText)
//                        && x.Rating >= pRatingMin && x.Rating <= pRatingMax
//                        ).OrderBy(x => x.LastName);
//                case "G":
//                    return DMCConnection.dProfiles
//                        .Where(x => x.kAppId == pAppId && x.aUser.kId != pUserId && x.GroupToLower.StartsWith(pSearchText)
//                        && x.Rating >= pRatingMin && x.Rating <= pRatingMax
//                        ).OrderBy(x => x.LastName);
//            }
//        }

//        public bool dProfileRemoveRange(Guid pAppId, Guid? pUserId, int? pIdx)
//        {
//            return dProfileRemoveRange(pAppId, pUserId.Value, pIdx.Value);
//        }
//        public bool dProfileRemoveRange(Guid pAppId, Guid pUserId, int pIdx)
//        {
//            DMCConnection.dProfiles.RemoveRange(DMCConnection.dProfiles.Where(x => x.kAppId == pAppId && x.kUserId == pUserId && x.kIdx == pIdx));
//            return true;
//        }

//        #endregion

//        #region dUserGames
//        public bool dUserGameAdd(dUserGame pUserGame) { DMCConnection.dUserGames.Add(pUserGame); return true; }

//        public dUserGame dUserGameGet(Guid pAppId, Guid pUserId, Guid pGameId)
//        {
//            return DMCConnection.dUserGames.FirstOrDefault(x => x.kAppId == pAppId && x.kUserId == pUserId && x.GameId == pGameId);
//        }

//        public dUserGame dUserGameGet(Guid pAppId, Guid pId, string pSts)
//        {
//            return DMCConnection.dUserGames.FirstOrDefault(x => x.kAppId == pAppId && x.GameId == pId && x.Sts == pSts);
//        }

//        public dUserGame dUserGameGet(Guid pAppId, Guid pId, bool pPlayingAsWhite)
//        {
//            return DMCConnection.dUserGames.FirstOrDefault(x => x.kAppId == pAppId && x.GameId == pId && x.PlayingAsWhite == pPlayingAsWhite);
//        }

//        public dUserGame dUserGameGetForId(Guid pAppId, Guid pId)
//        {
//            return DMCConnection.dUserGames.FirstOrDefault(x => x.kAppId == pAppId && x.GameId == pId);
//        }
//        public dUserGame dUserGameGetForType(Guid pAppId, Guid pUserId, string pSts)
//        {
//            return DMCConnection.dUserGames.FirstOrDefault(x => x.kAppId == pAppId && x.kUserId == pUserId && x.Sts == pSts);
//        }

//        public dUserGame dUserGameNew(Guid pAppId, Guid pMyUserId, int pProfileIdx, string pSts, Guid pId, int pRatingBefore, Guid pUserId, Guid? pURLParmId = null)
//        {
//            return new dUserGame()
//            {
//                kAppId = pAppId,
//                kUserId = pMyUserId,
//                kProfileIdx = pProfileIdx,
//                fURLParmId = pURLParmId,
//                Sts = pSts,
//                GameId = pId,
//                GameName = "",
//                MyTurn = false,
//                PlayingAsWhite = null,
//                IWon = null,
//                RatingBefore = pRatingBefore,
//                RatingAfter = null,
//                RematchSent = false,
//                CreateUserId = pUserId,
//                CreateDate = DateTime.Now,
//                ChangeUserId = pUserId,
//                ChangeDate = DateTime.Now
//            };
//        }

//        public int dUserGamesCount(Guid pAppId, Guid pUserId, int pProfileIdx,  string pSts)
//        {
//            return DMCConnection.dUserGames.Where(x => x.kAppId == pAppId && x.kUserId == pUserId && x.kProfileIdx == pProfileIdx &&  x.Sts == pSts).Count();
//        }

//        public int dUserGamesCount(Guid pAppId, Guid pUserId, int pProfileIdx, bool pIWon)
//        {
//            return DMCConnection.dUserGames.Where(x => x.kAppId == pAppId && x.kUserId == pUserId && x.kProfileIdx == pProfileIdx && x.IWon == pIWon).Count();
//        }

//        public IQueryable<dUserGame> dUserGamesGet(Guid pAppId, Guid pUserIdKey)
//        {
//            return DMCConnection.dUserGames
//                .Where(x => x.kAppId == pAppId && x.kUserId == pUserIdKey)
//                .OrderBy(x => x.MyTurn)
//                .ThenBy(x => x.ChangeDate);
//        }

//        public IQueryable<dUserGame> dUserGamesGetForType(Guid pAppId, Guid pUserIdKey, string pSts)
//        {
//            return DMCConnection.dUserGames.Where(x => x.kAppId == pAppId && x.kUserId == pUserIdKey && x.Sts == pSts);
//        }
//        //public dUserGame dUserGames_GetOpUserGame(Guid pAppId, Guid pGameId, Guid pMeUserId)
//        //{
//        //    var userGames = DMCConnection.dUserGames.Where(x => x.kAppId == pAppId && x.GameId == pGameId);
//        //    foreach (var userGame in userGames) { if (userGame.kUserId == pMeUserId) continue; return userGame; }
//        //    return null;
//        //}
//        //public IQueryable<dUserGame> dUserGamesGet(Guid pAppId, Guid pUserIdKey, string pType)
//        //{
//        //    return DMCConnection.dUserGames.Where(x => x.kAppId == pAppId && x.kUserId == pUserIdKey && x.Type == pType);
//        //}
//        //public void dUserGameRemove(dUserGame pUserGame)
//        //{
//        //    DMCConnection.dUserGames.Remove(pUserGame);
//        //}
//        public bool dUserGameRemoveRange(Guid pAppId, Guid pGameId)
//        {
//            var userGames = DMCConnection.dUserGames.Where(x => x.kAppId == pAppId && x.GameId == pGameId);
//            DMCConnection.dUserGames.RemoveRange(userGames);
//            return true;
//        }


//        #endregion
//    }
//}
