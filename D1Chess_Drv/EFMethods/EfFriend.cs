using D1Chess_Srv.EfModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace D1Chess_Srv.EFMethods
{
    public class EfFriend
    {
        private readonly Context Context = new Context();

        public bool EfFriendAdd(Friend pFriend) { Context.Friends.Add(pFriend); return true; }

        public Friend EfFriendGet(Guid pAppId, Guid pMyUserId, int pProfileIdx, Guid pFriendUserId, int pFriendProfileIdx)
        {
            return Context.Friends.FirstOrDefault(x => x.UserId == pMyUserId && x.ProfileIdx == pProfileIdx &&
                x.FriendUserId == pFriendUserId && x.FriendProfileIdx == pFriendProfileIdx);
        }
        public Friend EfFriendNew(Guid pAppId, Guid pMyUserId, int pProfileIdx, Guid pFriendUserId, int pFriendProfileIdx)
        {
            return
                new Friend()
                {
                    UserId = pMyUserId,
                    ProfileIdx = pProfileIdx,
                    FriendUserId = pFriendUserId,
                    FriendProfileIdx = pFriendProfileIdx,
                    Sequence = 0
                };
        }
        public List<Friend> EfFriendsGet(Guid pUserId)
        {
            return Context.Friends.Where(x => x.UserId == pUserId).ToList();
        }
        public List<Friend> EfFriendsGet(Guid pUserId, int pProfileIdx)
        {
            return Context.Friends.Where(x => x.UserId == pUserId && x.ProfileIdx == pProfileIdx).ToList();
        }
    }
}
