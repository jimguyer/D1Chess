using System;

namespace Kata
{
    class Program
    {
        enum eLoc { UpperLeft, UpperCenter, UpperRight, MiddleLeft, Center, MiddleRight, LowerLeft, LowerCenter, LowerRight, Invalid }
        enum eError { None, UL_Taken, UC_Taken, UR_Taken, ML_Taken, C_Taken, MR_Taken, LL_Taken, LC_Taken, LR_Taken, }
        enum eGameover { No, Tie, X_Won, O_Won };
        static int MoveNum;
        static bool X_Turn;
        static string UL, UC, UR, ML, C, MR, LL, LC, LR;

        static void Main(string[] args)
        {
            Start();
            var gameover = eGameover.No;
            WriteBoard(gameover);
            var entry = "";
            while (entry != "Q") 
            {
                entry = Console.ReadLine();
                if (entry.ToUpper() == "Q") Console.WriteLine("Thank you for playing.");
                else
                {
                    var loc = ConverToEnum(entry);
                    if (loc == eLoc.Invalid) Console.WriteLine("Invalid entry. Enter UL, UC, UR, ML, C, MR, LL, LC, LR, Quit");
                    else {
                        var error = CheckForError(loc);
                        switch (error)
                        {
                            case eError.UL_Taken: Console.WriteLine("The upper-left is taken."); break;
                            case eError.UC_Taken: Console.WriteLine("The upper-center is taken."); break;
                            case eError.UR_Taken: Console.WriteLine("The upper-right is taken."); break;
                            case eError.ML_Taken: Console.WriteLine("The middle-left is taken."); break;
                            case eError.C_Taken: Console.WriteLine("The center is taken."); break;
                            case eError.MR_Taken: Console.WriteLine("The middle-right is taken."); break;
                            case eError.LL_Taken: Console.WriteLine("The lower-left is taken."); break;
                            case eError.LC_Taken: Console.WriteLine("The lower-center is taken."); break;
                            case eError.LR_Taken: Console.WriteLine("The lower-right is taken."); break;
                            case eError.None:
                                Move(loc);
                                gameover = GetGameover(loc);
                                X_Turn = !X_Turn;
                                WriteBoard(gameover);
                                if (gameover != eGameover.No) Start();
                                break;
                        }
                    }
                }
            }
        }
        static void Start()
        {
            X_Turn = true;
            MoveNum = 0;
            UL = " "; UC = " "; UR = " ";
            ML = " "; C = " "; MR = " ";
            LL = " "; LC = " "; LR = " ";
        }

        static eLoc ConverToEnum(string pLoc)
        {
            switch (pLoc.ToUpper())
            {
                case "UL": return eLoc.UpperLeft;
                case "UC": return eLoc.UpperCenter;
                case "UR": return eLoc.UpperRight;
                case "ML": return eLoc.MiddleLeft;
                case "C": return eLoc.Center;
                case "MR": return eLoc.MiddleRight;
                case "LL": return eLoc.LowerLeft;
                case "LC": return eLoc.LowerCenter;
                case "LR": return eLoc.LowerRight;
                default: return eLoc.Invalid;
            }
        }

        static eError CheckForError(eLoc pLoc)
        {
            switch (pLoc)
            {
                case eLoc.UpperLeft: return UL == " "? eError.None: eError.UL_Taken; 
                case eLoc.UpperCenter: return UC == " " ? eError.None : eError.UC_Taken;
                case eLoc.UpperRight: return UR == " " ? eError.None : eError.UR_Taken;
                case eLoc.MiddleLeft: return ML == " " ? eError.None : eError.ML_Taken;
                case eLoc.Center: return C == " " ? eError.None : eError.C_Taken;
                case eLoc.MiddleRight: return MR == " " ? eError.None : eError.MR_Taken;
                case eLoc.LowerLeft: return LL == " " ? eError.None : eError.LL_Taken;
                case eLoc.LowerCenter: return LC == " " ? eError.None : eError.LC_Taken;
                case eLoc.LowerRight: return LR == " " ? eError.None : eError.LR_Taken;
            }
            return eError.None;
        }
        static void Move(eLoc pLoc)
        {
            MoveNum++;
            switch (pLoc)
            {
                case eLoc.UpperLeft: UL = X_Turn ? "X" : "O"; break;
                case eLoc.UpperCenter: UC = X_Turn ? "X" : "O"; break;
                case eLoc.UpperRight: UR = X_Turn ? "X" : "O"; break;
                case eLoc.MiddleLeft: ML = X_Turn ? "X" : "O"; break;
                case eLoc.Center: C = X_Turn ? "X" : "O"; break;
                case eLoc.MiddleRight: MR = X_Turn ? "X" : "O"; break;
                case eLoc.LowerLeft: LL = X_Turn ? "X" : "O"; break;
                case eLoc.LowerCenter: LC = X_Turn ? "X" : "O"; break;
                case eLoc.LowerRight: LR = X_Turn ? "X" : "O"; break;
            }
        }
        static eGameover GetGameover(eLoc pELoc)
        {
            if (CheckForWin(pELoc)) return X_Turn ? eGameover.X_Won : eGameover.O_Won;
            if (MoveNum == 9) return eGameover.Tie;
            return eGameover.No;
        }



        static bool CheckForWin(eLoc pELoc)
        {
            switch (pELoc)
            {
                case eLoc.UpperLeft:
                    if (UL == UC && UL == UR) return true;  // Upper
                    if (UL == C && UL == LR) return true;   // Downward Slash
                    if (UL == ML && UL == LL) return true;  // Left
                    return false;
                case eLoc.UpperCenter:
                case eLoc.LowerCenter:
                    if (UC == C && UC == LC) return true;   // Center
                    return false;
                case eLoc.UpperRight:
                    if (UL == UC && UL == UR) return true;  // Upper
                    if (LL == C && LL == UR) return true;   // Upward Slash
                    if (UL == ML && UL == LL) return true;  // Right
                    return false;
                case eLoc.MiddleLeft:
                case eLoc.MiddleRight:
                    if (ML == C && ML == MR) return true;   // Middle
                    return false;
                case eLoc.Center:
                    if (UL == C && UL == LR) return true;   // Downward Slash
                    if (UC == C && UC == LC) return true;   // Center
                    if (LL == C && LL == UR) return true;   // Upward Slash
                    if (ML == C && ML == MR) return true;   // Middle
                    return false;
                case eLoc.LowerLeft:
                    if (LL == C && LL == UR) return true;   // Upward Slash
                    if (UL == ML && UL == LL) return true;  // Left
                    if (LL == LC && LL == LR) return true;  // Lower
                    return false;
                case eLoc.LowerRight:
                    if (LL == C && LL == UR) return true;   // Upward Slash
                    if (UL == ML && UL == LL) return true;  // Left
                    if (LL == LC && LL == LR) return true;  // Lower
                    return false;
            }
            return false;
        }


        static void WriteBoard(eGameover pGameover)
        {
            Console.Clear();
            Console.WriteLine("    _____ _____ _____ ");
            Console.WriteLine("   |     |     |     |");
            Console.WriteLine("   |  {0}  |  {1}  |  {2}  |", UL, UC, UR);
            Console.WriteLine("   |_____|_____|_____|");
            Console.WriteLine("   |     |     |     |");
            Console.WriteLine("   |  {0}  |  {1}  |  {2}  |", ML, C, MR);
            Console.WriteLine("   |_____|_____|_____|");
            Console.WriteLine("   |     |     |     |");
            Console.WriteLine("   |  {0}  |  {1}  |  {2}  |", LL, LC, LR);
            Console.WriteLine("   |_____|_____|_____|");
            Console.WriteLine("");
            Console.WriteLine("");
            Console.WriteLine("UL=Upper-Left, UC=Upper-Center, UR=Upper-Right");
            Console.WriteLine("ML=Middle-Left, C=Center, MR=Middle-Right");
            Console.WriteLine("LL=Lower-Left, LC=Center, LR=Lower-Right");
            Console.WriteLine("");
            switch (pGameover)
            {
                case eGameover.Tie: Console.WriteLine("Tie game."); break;
                case eGameover.X_Won: Console.WriteLine("X won."); break;
                case eGameover.O_Won: Console.WriteLine("O won."); break;
                case eGameover.No:
                    Console.WriteLine("Enter a move for " + (X_Turn ? "X" : "O"));
                    break;
            }
            if(pGameover != eGameover.No)
            {
                Console.WriteLine("");
                Console.WriteLine("Press Q to quit or enter a move to play again.");
            }
        }
    }
}
