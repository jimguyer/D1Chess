using System;
using System.Collections.Generic;
using System.Drawing;
using System.Text;

namespace D1Chess_Srv.Common
{
    public class Images
    {


        public static string GetBase64String(string pText)
        {
            var font = new Font("Verdana", 24);
            var bitmap = GetBitmap(pText, font, new Bitmap(150, 60), Color.LightYellow);
            var ms = new System.IO.MemoryStream();
            bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
            var base64String = Convert.ToBase64String(ms.GetBuffer());

            //var byteArray = Images.GetByteArray(bitmap);
            //var base64String = Convert.ToBase64String(byteArray);
            return string.Format("data:image/png;base64,{0}", base64String);
        }

        public static Bitmap GetBitmap(string pText, Font pfont, Bitmap pBitmap, Color pColor)
        {
            var graphics = Graphics.FromImage(pBitmap); graphics.Clear(pColor);
            var brush = new SolidBrush(Color.Black);
            var leftMargin = 10; var topMargin = 5; var characterWidth = 25;

            for (var fIndex = 0; fIndex < pText.Length; fIndex++)
            {
                var character = pText.Substring(fIndex, 1);
                graphics.DrawString(character, pfont, brush, leftMargin + fIndex * characterWidth, topMargin);
                graphics.Flush();
            }
            graphics.Dispose(); pfont.Dispose();
            return pBitmap;
        }

        public static byte[] GetByteArray(string pstring)
        {
            var idx = pstring.IndexOf(",");
            var myString = pstring.Substring(idx + 1);
            return Convert.FromBase64String(myString);
        }
        //public static byte[] GetByteArray(Bitmap pBitmap)
        //{
        //    ImageConverter converter = new ImageConverter();
        //    return (byte[])Convert.ToSByte(pBitmap));
        //}


        public static string GetBase64String(byte[] pBytes)
        {
            if (pBytes == null) return "";
            var base64String = Convert.ToBase64String(pBytes);
            return string.Format("data:image/png;base64,{0}", base64String);
        }
        //public static byte[] GetByteArray(string pText)
        //{
        //    var font = new Font("Verdana", 22);
        //    var bitmap = GetBitmap(pText, font, new Bitmap(150, 60), Color.LightYellow);
        //    return GetByteArray(bitmap);
        //}
    }
}
