using D1Chess_Srv.EfModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace D1Chess_Srv.EFMethods
{
    public class EfGame
    {
        private readonly Context Context = new Context();

        public void Add(Game pGame) { Context.Games.Add(pGame); Context.Save(); }

        public Game Get(Guid pId)
        {
            return Context.Games.FirstOrDefault(x => x.Id == pId);
        }

        public void Update(Game pGame) {

            //Context.Games..Games..Update(pGame); 
            Context.Save(); 
        
        }



       public bool RemoveRange(Guid pId)
        {
            Context.Games.RemoveRange(Context.Games.Where(x => x.Id == pId));
            return true;
        }


        public Game Convert(Game pEfGame, Token pToken)
        {
            if (pEfGame == null)
            {
                pEfGame = new Game()
                {
                    Id = pToken.IsAnonymous ? pToken.DeviceId.Value : pToken.UserId.Value,
                    CreateUserId = pToken.UserId == null ? pToken.DeviceId.Value : pToken.UserId.Value,
                    CreateDT = DateTime.Now
                };
            };
            pEfGame.LastActionDT = DateTime.Now;
            pEfGame.ChangeUserId = pToken.UserId == null ? pToken.DeviceId.Value : pToken.UserId.Value;
            pEfGame.ChangeDT = DateTime.Now;
            return pEfGame;
        }
    }
}