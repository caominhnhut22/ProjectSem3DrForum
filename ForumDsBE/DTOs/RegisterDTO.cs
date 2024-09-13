namespace ForumDs.DTOs
{
    public class RegisterDTO
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public Guid Specialization_id { get; set; }
        public string Password { get; set; }
        public IFormFile? AvatarFile { get; set; }
    }

}
