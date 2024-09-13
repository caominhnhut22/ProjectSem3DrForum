namespace ForumDs.DTOs
{
    public class EditProfileDTO
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Bio { get; set; }
        public int? Experience { get; set; }
        public IFormFile? AvatarFile { get; set; }
    }
}
