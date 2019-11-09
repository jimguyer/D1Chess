using D1Chess_Srv.Parms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace D1Chess_Srv.Common
{
    public class Move
    {
        #region Properties
        public int[] StartPiecePos = { 0, 1, 14, 7, 2, 8, 3, 9, 15, 21, 48, 47, 34, 41, 46, 40, 45, 39, 33, 27 };
        //public int[int[]] StartMoveSets = {[], [], [], [], [38, 32, 44], [32], [44, 37, 38], [38, 31, 32], [32, 25, 26], [26, 19, 20] };

        private int[,] Grid { get; set; }
        private int[] Row { get; set; }
        private int[] Col { get; set; }
        private int[] Rank { get; set; }
        private int[] RowAdj { get; set; }
        private int[] ColAdj { get; set; }
        private int[] KingAxis { get; set; }
        private bool[] Perp { get; set; }
        private bool[] BishopPerp { get; set; }
        private int?[] PosPiece { get; set; }



        #endregion

        public Move()
        {
            this.KingAxis = new int[6];
            this.Perp = new bool[12]; this.RowAdj = new int[24]; this.ColAdj = new int[24]; this.Grid = new int[7, 7]; this.Row = new int[49]; this.Col = new int[49]; this.Rank = new int[20];
            this.BishopPerp = new bool[12];

            this.KingAxis[0] = 3; this.KingAxis[1] = 4; this.KingAxis[2] = 5; this.KingAxis[3] = 0; this.KingAxis[4] = 1; this.KingAxis[5] = 2;

            this.Perp[0] = false; this.Perp[1] = true; this.Perp[2] = false; this.Perp[3] = true; this.Perp[4] = false; this.Perp[5] = true;
            this.Perp[6] = false; this.Perp[7] = true; this.Perp[8] = false; this.Perp[9] = true; this.Perp[10] = false; this.Perp[11] = true;

            this.BishopPerp[0] = false; this.BishopPerp[1] = true; this.BishopPerp[2] = false; this.BishopPerp[3] = false; this.BishopPerp[4] = false; this.BishopPerp[5] = true;
            this.BishopPerp[6] = false; this.BishopPerp[7] = true; this.BishopPerp[8] = false; this.BishopPerp[9] = false; this.BishopPerp[10] = false; this.BishopPerp[11] = true;



            this.RowAdj[0] = -1; this.RowAdj[1] = -1; this.RowAdj[2] = -2; this.RowAdj[3] = -1; this.RowAdj[4] = -1; this.RowAdj[5] = 0;
            this.RowAdj[6] = 1; this.RowAdj[7] = 1; this.RowAdj[8] = 2; this.RowAdj[9] = 1; this.RowAdj[10] = 1; this.RowAdj[11] = 0;

            this.ColAdj[0] = -1; this.ColAdj[1] = 0; this.ColAdj[2] = 1; this.ColAdj[3] = 1; this.ColAdj[4] = 2; this.ColAdj[5] = 1;
            this.ColAdj[6] = 1; this.ColAdj[7] = 0; this.ColAdj[8] = -1; this.ColAdj[9] = -1; this.ColAdj[10] = -2; this.ColAdj[11] = -1;
            //Knight move Adj
            this.RowAdj[13] = -2; this.RowAdj[15] = -2; this.RowAdj[17] = 0; this.RowAdj[19] = 2; this.RowAdj[21] = 2; this.RowAdj[23] = 0;
            this.ColAdj[13] = 0; this.ColAdj[15] = 2; this.ColAdj[17] = 2; this.ColAdj[19] = 0; this.ColAdj[21] = -2; this.ColAdj[23] = -2;




            this.Grid[0, 0] = 0; this.Grid[0, 1] = 1; this.Grid[0, 2] = 2; this.Grid[0, 3] = 3; this.Grid[0, 4] = 4; this.Grid[0, 5] = 5; this.Grid[0, 6] = 6;
            this.Grid[1, 0] = 7; this.Grid[1, 1] = 8; this.Grid[1, 2] = 9; this.Grid[1, 3] = 10; this.Grid[1, 4] = 11; this.Grid[1, 5] = 12; this.Grid[1, 6] = 13;
            this.Grid[2, 0] = 14; this.Grid[2, 1] = 15; this.Grid[2, 2] = 16; this.Grid[2, 3] = 17; this.Grid[2, 4] = 18; this.Grid[2, 5] = 19; this.Grid[2, 6] = 20;
            this.Grid[3, 0] = 21; this.Grid[3, 1] = 22; this.Grid[3, 2] = 23; this.Grid[3, 3] = 24; this.Grid[3, 4] = 25; this.Grid[3, 5] = 26; this.Grid[3, 6] = 27;
            this.Grid[4, 0] = 28; this.Grid[4, 1] = 29; this.Grid[4, 2] = 30; this.Grid[4, 3] = 31; this.Grid[4, 4] = 32; this.Grid[4, 5] = 33; this.Grid[4, 6] = 34;
            this.Grid[5, 0] = 35; this.Grid[5, 1] = 36; this.Grid[5, 2] = 37; this.Grid[5, 3] = 38; this.Grid[5, 4] = 39; this.Grid[5, 5] = 40; this.Grid[5, 6] = 41;
            this.Grid[6, 0] = 42; this.Grid[6, 1] = 43; this.Grid[6, 2] = 44; this.Grid[6, 3] = 45; this.Grid[6, 4] = 46; this.Grid[6, 5] = 47; this.Grid[6, 6] = 48;
            this.Row[0] = 0; this.Row[1] = 0; this.Row[2] = 0; this.Row[3] = 0; this.Row[4] = 0; this.Row[5] = 0; this.Row[6] = 0;
            this.Row[7] = 1; this.Row[8] = 1; this.Row[9] = 1; this.Row[10] = 1; this.Row[11] = 1; this.Row[12] = 1; this.Row[13] = 1;
            this.Row[14] = 2; this.Row[15] = 2; this.Row[16] = 2; this.Row[17] = 2; this.Row[18] = 2; this.Row[19] = 2; this.Row[20] = 2;
            this.Row[21] = 3; this.Row[22] = 3; this.Row[23] = 3; this.Row[24] = 3; this.Row[25] = 3; this.Row[26] = 3; this.Row[27] = 3;
            this.Row[28] = 4; this.Row[29] = 4; this.Row[30] = 4; this.Row[31] = 4; this.Row[32] = 4; this.Row[33] = 4; this.Row[34] = 4;
            this.Row[35] = 5; this.Row[36] = 5; this.Row[37] = 5; this.Row[38] = 5; this.Row[39] = 5; this.Row[40] = 5; this.Row[41] = 5;
            this.Row[42] = 6; this.Row[43] = 6; this.Row[44] = 6; this.Row[45] = 6; this.Row[46] = 6; this.Row[47] = 6; this.Row[48] = 6;
            this.Col[0] = 0; this.Col[1] = 1; this.Col[2] = 2; this.Col[3] = 3; this.Col[4] = 4; this.Col[5] = 5; this.Col[6] = 6;
            this.Col[7] = 0; this.Col[8] = 1; this.Col[9] = 2; this.Col[10] = 3; this.Col[11] = 4; this.Col[12] = 5; this.Col[13] = 6;
            this.Col[14] = 0; this.Col[15] = 1; this.Col[16] = 2; this.Col[17] = 3; this.Col[18] = 4; this.Col[19] = 5; this.Col[20] = 6;
            this.Col[21] = 0; this.Col[22] = 1; this.Col[23] = 2; this.Col[24] = 3; this.Col[25] = 4; this.Col[26] = 5; this.Col[27] = 6;
            this.Col[28] = 0; this.Col[29] = 1; this.Col[30] = 2; this.Col[31] = 3; this.Col[32] = 4; this.Col[33] = 5; this.Col[34] = 6;
            this.Col[35] = 0; this.Col[36] = 1; this.Col[37] = 2; this.Col[38] = 3; this.Col[39] = 4; this.Col[40] = 5; this.Col[41] = 6;
            this.Col[42] = 0; this.Col[43] = 1; this.Col[44] = 2; this.Col[45] = 3; this.Col[46] = 4; this.Col[47] = 5; this.Col[48] = 6;
            this.Rank[0] = 0; this.Rank[1] = 1; this.Rank[2] = 2; this.Rank[3] = 3; this.Rank[4] = 4;
            this.Rank[5] = 5; this.Rank[6] = 5; this.Rank[7] = 5; this.Rank[8] = 5; this.Rank[9] = 5;
            this.Rank[10] = 0; this.Rank[11] = 1; this.Rank[12] = 2; this.Rank[13] = 3; this.Rank[14] = 4;
            this.Rank[15] = 5; this.Rank[16] = 5; this.Rank[17] = 5; this.Rank[18] = 5; this.Rank[19] = 5;
        }

        public Turn GetStartTurn()
        {
            var turn = new Turn { PiecePos = StartPiecePos};
            turn.MoveSets[4] = new List<int>() { 38, 32, 44 };
            turn.MoveSets[5] = new List<int>() { 32 };
            turn.MoveSets[6] = new List<int>() { 44, 37, 38 };
            turn.MoveSets[7] = new List<int>() { 38, 31, 32 };
            turn.MoveSets[8] = new List<int>() { 32, 25, 26 };
            turn.MoveSets[9] = new List<int>() { 26, 19, 20 };
            return turn;
        }
        public Turn GetTurn(int pTurnIdx, int[] pPiecePos) { return GetTurn(pTurnIdx % 2 != 0, pPiecePos); }

        public Turn GetTurn(List<List<Script>> pScript, int[] pPiecePos) { return GetTurn((pScript.Count() % 2 == 0), pPiecePos); }

        public Turn GetTurn(bool pWhitesTurn, int[] pPiecePos)
        {
            var locks = new List<int>[20]; List<int> blocks = null;
            PosPiece = new int?[67]; for (var xPiece = 0; xPiece < 20; xPiece++) { PosPiece[pPiecePos[xPiece]] = xPiece; }
            var kingHex = (pWhitesTurn) ? pPiecePos[10] : pPiecePos[0];
            var checks = new List<int>();
            for (var xPath = 0; xPath < 12; xPath++)
            {
                var kingsPath = GetPath(kingHex, xPath);
                if (kingsPath.Threat != null)
                {
                    if (kingsPath.Obst != null) locks[kingsPath.Obst.Value] = kingsPath.Inner.Concat(kingsPath.Outer).ToList();  // Create lock for an obstructing piece
                    if (Rank[kingsPath.Threat.Value] == 4 || kingsPath.Obst == null) checks.Add(kingsPath.Threat.Value);
                    if (checks.Count() > 1) blocks = new List<int>();           // Multiple checks
                    else if (Rank[kingsPath.Threat.Value] == 4) blocks = (kingsPath.Obst == null) ? kingsPath.Inner : kingsPath.Outer; // The knight hex will be in outer if obstructed                    
                    else if (kingsPath.Obst == null) blocks = kingsPath.Inner;  // Not knight threat and unobstructed
                    else blocks = null;                                         // Obstructed threat
                }
            }
            #region Move Sets
            var moveSets = new List<int>[10];
            moveSets[0] = King(kingHex); // Get King Moves
            var hasMoves = moveSets[0].Count() > 0;
            for (var xSet = 1; xSet < 10; xSet++)
            {
                moveSets[xSet] = new List<int>();
                if (checks.Count() > 1 && blocks == null) continue;     // King is in check with no blocks, none of the other peices have any valid moves
                var xPiece = (pWhitesTurn) ? xSet + 10 : xSet;          // Determine piece  
                var pos = pPiecePos[xPiece]; if (pos > 48) continue;    // Piece has been captured
                //if (blocks != null & locks[xPiece] != null) continue; // Both Blocks & Locks. If the king is in check, & this piece is locked, this piece has no moves
                List<int> pieceMoves = null;
                switch (Rank[xSet])
                {
                    case 1: pieceMoves = Queen(pos); break;
                    case 2: pieceMoves = Rook(pos); break;
                    case 3: pieceMoves = Bishop(pos); break;
                    case 4: pieceMoves = Knight(pos); break;
                    case 5: pieceMoves = (pWhitesTurn) ? WhitePawn(pos) : BlackPawn(pos); break;
                }
                if (pieceMoves.Count() == 0) continue;                                                                              // No moves
                if (blocks == null & locks[xPiece] == null) { moveSets[xSet] = pieceMoves; hasMoves = true; continue; }             // No Blocks or Locks. This piece is not locked, piece has all moves
                var allowedMoves = (blocks != null)? blocks.ToArray() : locks[xPiece].ToArray();                                   // Get Allowed moves from Blocks or Locks
                foreach (var xMove in pieceMoves) { if (Array.IndexOf(allowedMoves, xMove) > -1) { moveSets[xSet].Add(xMove); } }   // If move is in allowed moves, add it to the Move Set
                if (moveSets[xSet].Count() > 0) hasMoves = true;
            }

            #endregion

            return new Turn(moveSets, checks);
        }

        private List<int> King(int pHex)
        {
            var pKing = PosPiece[pHex];
            var pRow = Row[pHex]; var pCol = Col[pHex];
            var moves = new int?[6];
            var threats = new bool?[6];
            for (var xMove = 0; xMove < 6; xMove++)
            {
                var movePathIdx = xMove * 2 + 1;            // Get PerpPath Index for move
                moves[xMove] = GetMove(pHex, movePathIdx);  // Get move (on board and not blocked by like colored piece)
                if (moves[xMove] == null) continue;         // If no move continue
                for (var xThreatPathIdx = 0; xThreatPathIdx < 12; xThreatPathIdx++)
                {
                    var threatPath = GetPath(moves[xMove].Value, xThreatPathIdx, (pKing > 9));
                    if (threatPath.Obst == null & threatPath.Threat != null)
                        threats[xMove] = true;
                    if (movePathIdx == xThreatPathIdx)
                    {
                        #region Check to see if space on otherside of King is threatened.
                        if (threatPath.Occupant != null)
                        {
                            if (pKing > 9 != threatPath.Occupant > 9) // Not same color
                            {
                                var occupantRank = Rank[threatPath.Occupant.Value];
                                if (occupantRank == 1 || occupantRank == 2 || occupantRank == 4) threats[KingAxis[xMove]] = true;
                            }
                        }
                        else if (threatPath.Obst == null & threatPath.Threat != null)
                        {
                            var rankOfThreat = Rank[threatPath.Threat.Value];
                            if (rankOfThreat == 1 || rankOfThreat == 2 || rankOfThreat == 4) threats[KingAxis[xMove]] = true;
                        }
                        #endregion
                    }
                }
            }
            var moveSet = new List<int>();
            for (var xMove = 0; xMove < 6; xMove++)
            {
                if (moves[xMove] == null) continue;
                if (threats[xMove] == true) continue;
                moveSet.Add(moves[xMove].Value);
            }
            return moveSet;
        }
        private List<int> Queen(int pHex)
        {
            var moves = new List<int>();
            for (var x = 0; x < 12; x++) { var path = GetPath(pHex, x); moves = moves.Concat(path.Inner).ToList(); }
            return moves;
        }
        private List<int> Rook(int pHex)
        {
            var moves = new List<int>();
            for (var xPerp = 1; xPerp < 12; xPerp += 2) { var path = GetPath(pHex, xPerp); moves = moves.Concat(path.Inner).ToList(); }
            return moves;
        }
        private List<int> Bishop(int pHex)
        {
            var moves = new List<int>();
            for (var xDiag = 0; xDiag < 12; xDiag += 2) { var path = GetPath(pHex, xDiag); moves = moves.Concat(path.Inner).ToList(); }
            moves = AddMove(pHex, 11, moves); moves = AddMove(pHex, 1, moves); moves = AddMove(pHex, 5, moves); moves = AddMove(pHex, 7, moves);
            return moves;
        }
        private List<int> Knight(int pHex)
        {
            var moves = new List<int>();
            for (var xPath = 0; xPath < 12; xPath++) { var path = (Perp[xPath]) ? xPath + 12 : xPath; moves = AddMove(pHex, path, moves); }
            return moves;
        }
        private List<int> BlackPawn(int pHex)
        {
            var moves = new List<int>();
            moves = AddMove(pHex, 5, moves); moves = AddMove(pHex, 6, moves); moves = AddMove(pHex, 7, moves);
            return moves;
        }
        private List<int> WhitePawn(int pHex)
        {
            var moves = new List<int>();
            moves = AddMove(pHex, 11, moves); moves = AddMove(pHex, 0, moves); moves = AddMove(pHex, 1, moves);
            return moves;
        }
        private List<int> AddMove(int pHex, int pPath, List<int> pMoves = null)
        {
            if (pMoves == null) pMoves = new List<int>();
            var move = GetMove(pHex, pPath);
            if (move != null) pMoves.Add(move.Value);
            return pMoves;
        }
        private int? GetMove(int pHex, int pPath)
        {
            var pPiece = PosPiece[pHex]; var pBlackTurn = (pPiece < 10) ? true : false;
            var row = Row[pHex] + RowAdj[pPath]; var col = Col[pHex] + ColAdj[pPath];   // Update Row & Column
            if (row < 0 | row > 6 | col < 0 | col > 6) return null;                     // Check for off board
            var move = Grid[row, col]; var obst = PosPiece[move];                         // Set move & obst
            if (obst != null) { if ((obst < 10) == (pPiece < 10)) return null; }        // Obstructed by like color
            return move;
        }
        private Path GetPath(int pHex, int pPath, bool? pWhitesTurn = null)
        {
            if (pWhitesTurn == null) pWhitesTurn = PosPiece[pHex] > 9;
            var pPiece = PosPiece[pHex];
            var path = new Path() { Occupant = PosPiece[pHex] };
            var row = Row[pHex]; var col = Col[pHex];
            for (var xHexCount = 1; xHexCount < 7; xHexCount++)
            {
                row += RowAdj[pPath]; col += ColAdj[pPath]; if (row < 0 | row > 6 | col < 0 | col > 6) return path;             // Update Row & Column, check for off board
                var hex = Grid[row, col]; var piece = PosPiece[hex];                                                            // Set Hex & Piece Index
                if (piece == null) { if (path.Obst == null) path.Inner.Add(hex); else path.Outer.Add(hex); continue; }          // No piece, add hex to list & go to next hex
                if (pWhitesTurn == (piece > 9)) { if (path.Obst == null) { path.Obst = piece; continue; } else return path; }   // Found myPiece, go to next hex or return                                                                          // My Color
                if (path.Obst == null) path.Inner.Add(hex); else path.Outer.Add(hex);                                           // Found opPiece, add hex to path so it can be captured

                switch (Rank[piece.Value])
                {
                    default: if (Perp[pPath] & xHexCount == 1) path.Threat = piece; return path;                                    // King
                    case 1: path.Threat = piece; return path;                                                                       // Queen
                    case 2: if (Perp[pPath]) path.Threat = piece; return path;                                                      // Rook
                    case 3: if (BishopPerp[pPath] & xHexCount == 1 || !Perp[pPath]) path.Threat = piece; return path;               // Bishop
                    case 4: if (Perp[pPath] & xHexCount == 2 || !Perp[pPath] && xHexCount == 1) path.Threat = piece; return path;   // Knight 
                    case 5:
                        if (xHexCount > 1) return path;                                                                         // Pawn too far away
                        if (piece < 10) { if (pPath == 11 || pPath < 2) { path.Threat = piece; } return path; }                     // Black Pawn
                        if (pPath > 4 & pPath < 8) { path.Threat = piece; return path; }
                        return path;                               // White Pawn
                }
            }
            return path;
        }

        public class Path
        {
            public List<int> Inner { get; set; }
            public int? Occupant { get; set; }
            public int? Obst { get; set; }
            public List<int> Outer { get; set; }
            public int? Threat { get; set; }
            public Path() { this.Inner = new List<int>(); this.Outer = new List<int>(); }
        }
        public class Turn
        {
            public int[] PiecePos { get; set; }
            public List<int>[] MoveSets { get; set; }
            public List<int> Checks { get; set; }
            public Turn()
            {
                this.PiecePos = new int[20];
                this.MoveSets = new List<int>[10] {
                    new List<int>(), new List<int>(), new List<int>(), new List<int>(), new List<int>(),
                    new List<int>(), new List<int>(), new List<int>(), new List<int>(), new List<int>()};
                this.Checks = new List<int>();
            }

            public Turn(List<int>[] pMoveSets, List<int> pChecks)
            {
                this.MoveSets = (pMoveSets.Count() == 0) ? null : pMoveSets;
                this.Checks = (pChecks.Count() == 0) ? null : pChecks;
            }
        }
    }
}
