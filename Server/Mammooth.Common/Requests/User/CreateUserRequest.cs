using System.ComponentModel.DataAnnotations;

namespace Mammooth.Common.Requests.User
{
    public class CreateUserRequest
    {
        [Required(ErrorMessage = "First name is required.")]
        public required string FirstName { get; set; }

        [Required(ErrorMessage = "Last name is required.")]
        public required string LastName { get; set; }

        [Required(ErrorMessage = "Citizen ID is required.")]
        public required string CitizenId { get; set; }

        [Required(ErrorMessage = "Phone number is required.")]
        public required string PhoneNumber { get; set; }

        [Required(ErrorMessage = "User name is required.")]
        public required string UserName { get; set; }

        [Required(ErrorMessage = "Normalized user name is required.")]
        public required string NormalizedUserName { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Normalized Email is required.")]
        public required string NormalizedEmail { get; set; }
    }
}