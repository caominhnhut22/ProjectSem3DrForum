namespace ForumDs.DTOs
{
    public class UserProfileDTO
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public int? Experience { get; set; }
        public string Bio { get; set; }
        public string Avatar { get; set; }
        public bool IsPublic { get; set; }
        public string Role { get; set; }
        public UserStatus Status { get; set; }

        public SpecializationDTO Specialization { get; set; }

        public List<QuestionDTO> Questions { get; set; }

        public UserProfileDTO(User user)
        {
            UserId = user.Id;
            UserName = user.Name;
            Email = user.Email;
            Address = user.Address ?? string.Empty;
            Phone = user.Phone ?? string.Empty;
            Experience = user.Experience;
            Bio = user.Bio ?? string.Empty;
            Avatar = user.Avatar ?? string.Empty;
            IsPublic = user.IsPublic;
            Role = user.Role;
            Status = user.Status;

            Specialization = user.Specialization != null ? new SpecializationDTO
            {
                Id = user.Specialization.Id,
                Name = user.Specialization.Name,
                Description = user.Specialization.Description
            } : null;

            // Map properties from User's questions
            Questions = user.Questions?.Select(q => new QuestionDTO(q)).ToList() ?? new List<QuestionDTO>();
        }
    }
}
