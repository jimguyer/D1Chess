using D1Chess_Srv.Common;
using D1Chess_Srv.EFMethods;
using D1Chess_Srv.EfModel;
using D1Chess_Srv.IO;
using D1Chess_Srv.Parms;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;

namespace D1Chess_Srv.Repositories
{
    public class RGame
    {
        #region References
        private readonly Context Context = new Context();
        private readonly EfGame EfGame = new EfGame();
        private readonly EfUser EfUser = new EfUser();
        private readonly EfUserGame EfUserGame = new EfUserGame();
        Move Move = new Move();
        #endregion

        #region Data Controller Gets



        public (D1Chess_Srv.EfModel.Token, Result) Get_Restart(D1Chess_Srv.EfModel.Token pEfToken)
        {
            var gameId = pEfToken.IsAnonymous ? pEfToken.DeviceId.Value : pEfToken.UserId.Value;
            var efGame = EfGame.Get(gameId);
            efGame.Script = null;
            EfGame.Update(efGame);
            return (pEfToken, new Result(true));
        }

        #endregion

        #region Data Controller Posts

        public (D1Chess_Srv.EfModel.Token, Result) Post_GetMoves(D1Chess_Srv.EfModel.Token pEfToken, object pData)
        {
            var pWhitesTurnPiecePos = ((JObject)pData).ToObject<PWhitesTurnPiecePos>();
            var turn = Move.GetTurn(pWhitesTurnPiecePos.WhitesTurn, pWhitesTurnPiecePos.PiecePos);
            return (pEfToken, new Result(turn));
        }

        public (D1Chess_Srv.EfModel.Token, Result) Post_Turn(D1Chess_Srv.EfModel.Token pEfToken, object pData)
        {
            #region Prep
            var pTurn = ((JObject)pData).ToObject<PTurn>();
            Guid gameId;
            var game_Script = new List<List<Script>>();
            var turn_piecePos = Move.StartPiecePos;
            #endregion


            if (pTurn.GameId == null || pTurn.GameId == Guid.Empty) gameId = pEfToken.IsAnonymous ? pEfToken.DeviceId.Value : pEfToken.UserId.Value;
            else gameId = pTurn.GameId.Value;
            var efGame = EfGame.Get(gameId);
            var add = efGame == null;
            efGame = EfGame.Convert(efGame, pEfToken);

            if (pTurn.Idx > 0)
            {

                if (efGame.PiecePos != null) turn_piecePos= JsonConvert.DeserializeObject<int[]>(efGame.PiecePos);
                game_Script = JsonConvert.DeserializeObject<List<List<Script>>>(efGame.Script);
                if (pTurn.Idx < game_Script.Count)
                {
                    #region RollBack
                    if (pTurn.Idx < game_Script.Count())
                    {
                        for (var xT = game_Script.Count() - 1; xT > pTurn.Idx - 1; xT--)
                            for (var xS = game_Script[xT].Count() - 1; xS >= 0; xS--)
                                turn_piecePos[game_Script[xT][xS].PieceIdx] = game_Script[xT][xS].PrevIdx;

                    }
                    game_Script = game_Script.GetRange(0, pTurn.Idx); //  Truncate Script
                    #endregion
                }

            }
            game_Script.Add(pTurn.Script);
            foreach(var script in pTurn.Script) turn_piecePos[script.PieceIdx] = script.PosIdx;

            efGame.Script = JsonConvert.SerializeObject(game_Script);
            efGame.PiecePos = JsonConvert.SerializeObject(turn_piecePos);
            
            if (add) EfGame.Add(efGame); else EfGame.Update(efGame);
            Context.Save();
 

            var turn = Move.GetTurn(pTurn.Idx, turn_piecePos);

            //int? opRating = null;
            int? meRating = null;
            if (pTurn.GameId == null) return (pEfToken, new Result( new { Turn = turn }));
            else
            {
                var eOpUserGame = EfUserGame.GetForIdDifferentUserId(pTurn.GameId, pEfToken.UserId.Value);
                var efOpUser = EfUser.Get(eOpUserGame.UserId);
                //if (efOpUser.ConnectionId != null)
                //    Hub.Send(efOpUser.ConnectionId, "TurnSave", new { GameId = pTurn.GameId.Value, Script = pTurn.Script, Turn = turn, Rating = opRating });
                return (pEfToken, new Result( new { GameId = pTurn.GameId, Turn = turn, Rating = meRating }));
            }
        }

        #endregion

        #region Util



        public object GetGame(Guid pId)
        {
            var efGame = EfGame.Get(pId);

            if (efGame == null || efGame.Script == null) return null;
            else
            {
                var game_Script = JsonConvert.DeserializeObject<List<List<Script>>>(efGame.Script);
                var turn_piecePos = JsonConvert.DeserializeObject<int[]>(efGame.PiecePos);
                var turn = Move.GetTurn(game_Script, turn_piecePos);
                turn.PiecePos = turn_piecePos;
                return new { Script = game_Script, Turn = turn };
            }
        }
        public object GetPractice(D1Chess_Srv.EfModel.Token pEfToken) { return GetGame(pEfToken.IsAnonymous ? pEfToken.DeviceId.Value : pEfToken.UserId.Value); }

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
        #endregion

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
