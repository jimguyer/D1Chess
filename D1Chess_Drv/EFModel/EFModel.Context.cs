﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class Context : DbContext
    {
        public Context()
            : base("name=Context")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Friend> Friends { get; set; }
        public virtual DbSet<Game> Games { get; set; }
        public virtual DbSet<Profile> Profiles { get; set; }
        public virtual DbSet<Token> Tokens { get; set; }
        public virtual DbSet<Url> Urls { get; set; }
        public virtual DbSet<UserGame> UserGames { get; set; }
        public virtual DbSet<User> Users { get; set; }
    }
}