using D1Chess_Srv.EfModel;
using System;
using System.Collections.Generic;
using System.Linq;


namespace D1Chess_Srv.EfMethods
{
    public class EfCarrier
    {
        private readonly Context Context = new Context();

        //public List<Carriers> Gets() { return Context.Carriers.ToList(); }

        //public Carriers GetForName(string pName ) { return Context.Carriers.FirstOrDefault( x => x.Name == pName); }

        //public List<string> GetNames() { return Context.Carriers.Select(x => x.Name).ToList(); }

    }
}
