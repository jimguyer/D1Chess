using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;

namespace D1Chess_Srv.EfModel
{
    public partial class Context : DbContext { 
        public bool Save()
        {
            try
            {
                SaveChanges();
                //SaveChangesAsync();
            }
            catch (Exception pException)
            //catch (Microsoft.EntityFrameworkCore.)
            //catch (System.Data.Entity.Validation.DbEntityValidationException ex)
            {
                var ex = pException;

                //foreach (var eve in ex.EntityValidationErrors)
                //{

                //    var type = eve.Entry.Entity.GetType().Name;
                //    var state = eve.Entry.State;
                //    foreach (var ve in eve.ValidationErrors)
                //    {
                //        var propertyName = ve.PropertyName;
                //        var ErrorMessage = ve.ErrorMessage;
                //    }
                //}
                //var m = ex;
                throw;
            }
            //SaveChanges();
            return true;
        }
    }
}
