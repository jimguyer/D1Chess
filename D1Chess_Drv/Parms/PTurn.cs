using System;
using System.Collections.Generic;
using System.Text;

namespace D1Chess_Srv.Parms
{
    public class PTurn
    {
        public Guid? GameId { get; set; }
        public int Idx { get; set; }
        public List<Script> Script { get; set; }
    }
}
