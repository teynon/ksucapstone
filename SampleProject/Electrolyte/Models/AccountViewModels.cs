using System.ComponentModel.DataAnnotations;

namespace Electrolyte.Models
{
    public class ExternalLoginConfirmationViewModel
    {
        [Required]
        [Display(Name = "User name")]
        public string UserName { get; set; }
    }

    public class ManageUserViewModel
    {
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Current password")]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "New password")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm new password")]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    public class LoginViewModel
    {
        [Required]
        [Display(Name = "User name")]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }

    public class RegisterViewModel
    {
        [Required]
        [EmailAddress(ErrorMessage = "The {0} is not a valid email address.")]
        [Display(Name = "Email...")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "The {0} is required.")]
        [Display(Name = "First name...")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "The {0} is required.")]
        [Display(Name = "Last name...")]
        public string LastName { get; set; }

        [Display(Name = "Company (optional)...")]
        public string Company { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password...")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password...")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    public class AccountRecoverViewModel
    {
        [Required]
        [EmailAddress(ErrorMessage = "The {0} is not a valid email address.")]
        [Display(Name = "Email...")]
        public string UserName { get; set; }
    }

    public class PasswordResetViewModel
    {
        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password...")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password...")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    public class FeedbackViewModel
    {
        [Required]
        [EmailAddress(ErrorMessage = "The {0} is not a valid email address.")]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "The {0} is required.")]
        [Display(Name = "Name")]
        public string Name { get; set; }

        [Required(ErrorMessage = "The {0} is required.")]
        [Display(Name = "Message")]
        public string Message { get; set; }
    }
}
