using System;
using System.Collections.Generic;
using System.Text;

namespace D1Chess_Srv.Parms
{
    public class PToken
    {
        public Guid? Id { get; set; }
        public bool IsAnonymous { get; set; }
        public Guid? UserId { get; set; }
        public Guid DeviceId { get; set; } 
        public string Code { get; set; }
        public Guid URLId { get; set; }
    }
}
