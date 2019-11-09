using System;
using System.Collections.Generic;
using System.Text;

namespace D1Chess_Srv.IO
{
    public class Result
    {
        public string Error { get; set; }
        public object Data { get; set; }

        public Result() { Error = null; this.Data = null; }
        public Result(string pError) { Error = pError; this.Data = null; }
        public Result(object pData) { this.Data = pData; }
        public Result(string pError, object pData) { Error = pError; this.Data = pData; }
    }
}
