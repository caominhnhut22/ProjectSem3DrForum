namespace ForumDs.DTOs
{
    public class ResetPasswordDTO
    {
        public string Email { get; set; }
        public string ResetToken { get; set; }
        public string NewPassword { get; set; }
    }
}
