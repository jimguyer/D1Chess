using System;
using System.Collections.Generic;
using System.Text;

namespace D1Chess_Srv.Common
{
    public static class GetRandom
    {
        public static string Text(int pLength)
        {
            if (pLength > 36) { throw new InvalidOperationException("Random Word Characters cannot be greater than 36"); }

            var charArray = new char[36];
            for (int fAscii = 65; fAscii < 65 + 26; fAscii++) charArray[fAscii - 65] = (char)fAscii;
            for (int fAscii = 48; fAscii <= 57; fAscii++) charArray[26 + (fAscii - 48)] = (char)fAscii;

            var charString = new StringBuilder();
            var random = new Random();

            for (int fChaIdx = 0; fChaIdx < pLength; fChaIdx++) charString.Append(charArray[random.Next(36)].ToString());

            return charString.ToString();

        }
        public static string Number(int pLength)
        {
            var charArray = new char[10];
            for (int fAscii = 48; fAscii <= 57; fAscii++) charArray[fAscii - 48] = (char)fAscii;

            var charString = new StringBuilder();
            var random = new Random();

            for (int fChaIdx = 0; fChaIdx < pLength; fChaIdx++) charString.Append(charArray[random.Next(10)].ToString());

            return charString.ToString();

        }
    }
}
