using D1Chess_Srv.EfModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace D1Chess_Srv.EFMethods
{
    public class EfUser
    {
        private readonly Context Context = new Context();
        public bool CheckEmailInUse(string pEmailAddress)
        {
            return Context.Users.FirstOrDefault(x => x.EmailAddressToLower == pEmailAddress) != null;
        }

        public User Get(Guid pId) { return Context.Users.FirstOrDefault(x => x.Id == pId); }
        public User GetForIdPassword(Guid pId, string pPassword) { return Context.Users.FirstOrDefault(x => x.Id == pId && x.Password == pPassword); }
        public User GetForLogOn(string pEmailAddress, string pPassword) { return Context.Users.FirstOrDefault(x => x.EmailAddress == pEmailAddress); }
        public User GetForEmailAddressPassword(string pEmailAddress, string pPassword)
        {
            return Context.Users.FirstOrDefault(x => x.EmailAddressToLower == pEmailAddress && x.Password == pPassword);
        }
        public User GetForEmailAddress(string pEmailAddress)
        {
            return Context.Users.FirstOrDefault(x => x.EmailAddressToLower == pEmailAddress);
        }
        public User New(string pEmailAddress, string pPassword, string pEmailConfirmCode)
        {
            var UserId = Guid.NewGuid();
            return new User()
            {
                Id = UserId,
                Password = pPassword,
                PasswordToLower = pPassword.ToLower(),
                IsOnline = false,
                EmailAddress = pEmailAddress,
                EmailAddressToLower = pEmailAddress.ToLower(),
                EmailConfirmCode = pEmailConfirmCode,

                PhoneCarrier = "",
                PhoneNumber = 0,
                PhoneConfirmCode = "",
                //OptsEmailAlerts = false,
                //OptsPhoneAlerts = false,
                //OptsAudioOn = false,
                //OptsClockShow = false,
                //OptsPostToFacebook = false,

                Role = "Member",
                MembershipLevel = "F",
                MembershipExpiration = null,
                LastActivityDT = DateTime.Now,
                CreateDT = DateTime.Now,
                CreateUserId = UserId,
                ChangeDT = DateTime.Now,
                ChangeUserId = UserId
            };
        }
    }
}
