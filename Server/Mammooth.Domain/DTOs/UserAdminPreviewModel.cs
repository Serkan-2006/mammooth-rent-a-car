using Mammooth.Data.Entities;

namespace Mammooth.Common.DTOs
{
    public class UserAdminPreviewModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CitizenId { get; set; }
        public string PhoneNumber { get; set; }
        public string UserName { get; set; }
        public string NormalizedUserName { get; set; }
        public string Email { get; set; }
        public string NormalizedEmail { get; set; }

        public UserAdminPreviewModel(User user)
        {
            this.FirstName = user.FirstName;
            this.LastName = user.LastName;
            this.CitizenId = user.CitizenId;
            this.PhoneNumber = user.PhoneNumber;
            this.UserName = user.UserName;
            this.NormalizedUserName = user.NormalizedUserName;
            this.Email = user.Email;
            this.NormalizedEmail = user.NormalizedEmail;
        }
    }
}