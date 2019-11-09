using D1Chess_Srv.EfModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace D1Chess_Srv.EFMethods
{
    public class EfUserGame
    {
        private readonly Context Context = new Context();
        public UserGame GetForIdUserId(Guid? pGameId, Guid pUserId)
        {
            return Context.UserGames.FirstOrDefault(x => x.GameId == pGameId && x.UserId == pUserId);
        }
        public UserGame GetForIdDifferentUserId(Guid? pGameId, Guid pUserId)
        {
            return Context.UserGames.FirstOrDefault(x => x.GameId == pGameId && x.UserId != pUserId);
        }
        public List<UserGame> GetsForUserId(Guid pUserId)
        {
            return Context.UserGames.Where(x => x.UserId == pUserId).OrderBy(x => x.UserId).ToList();
        }
        public int CountForUserIdProfileIdxSts(Guid pUserId, int pProfileIdx, string pSts)
        {
            return Context.UserGames.Where(x => x.UserId == pUserId && x.ProfileIdx == pProfileIdx && x.Sts == pSts.Substring(0)).Count();
        }
        public int CountForUserIdProfileIdxIWon(Guid pUserId, int pProfileIdx, bool pIWon)
        {
            return Context.UserGames.Where(x => x.UserId == pUserId && x.ProfileIdx == pProfileIdx && x.IWon == pIWon).Count();
        }
    }
}