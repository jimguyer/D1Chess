//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace D1Chess_Srv.EfModel
{
    using System;
    using System.Collections.Generic;
    
    public partial class Profile
    {
        public System.Guid UserId { get; set; }
        public int Idx { get; set; }
        public string UserIDText { get; set; }
        public string UserIDTextToLower { get; set; }
        public byte[] PhotoBytes { get; set; }
        public Nullable<bool> IsPhotoApproved { get; set; }
        public string NameFirst { get; set; }
        public string NameLast { get; set; }
        public string Group { get; set; }
        public string GroupToLower { get; set; }
        public int Rating { get; set; }
        public string StartParms_OpFindBy { get; set; }
        public string StartParms_TimeInc { get; set; }
        public Nullable<int> StartParms_TimeAmt { get; set; }
        public Nullable<bool> StartParms_Rated { get; set; }
        public string StartEmail_Email { get; set; }
        public string StartEmail_NameFirst { get; set; }
        public string StartEmail_NameLast { get; set; }
        public string Search_By { get; set; }
        public string SearchText_UserId { get; set; }
        public string SearchText_Group { get; set; }
        public string SearchText_NameLast { get; set; }
        public string SearchText_NameFirst { get; set; }
        public Nullable<int> Search_RatingMin { get; set; }
        public Nullable<int> Search_RatingMax { get; set; }
        public Nullable<System.Guid> CreateUserId { get; set; }
        public Nullable<System.DateTime> CreateDT { get; set; }
        public Nullable<System.Guid> ChangeUserId { get; set; }
        public Nullable<System.DateTime> ChangeDT { get; set; }
    }
}