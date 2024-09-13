public class UserDTO
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Address { get; set; }
    public string Phone { get; set; }
    public int? Experience { get; set; }
    public string Bio { get; set; }
    public string Avatar { get; set; }
    public bool IsPublic { get; set; }
    public string Role { get; set; }
    public UserStatus Status { get; set; }

    // Additional properties from Specialization
    public Guid SpecializationId { get; set; }
    public string SpecializationName { get; set; }
    public string SpecializationDescription { get; set; }

    public UserDTO(User user)
    {
        Id = user.Id;
        Name = user.Name;
        Email = user.Email;
        Address = user.Address ?? string.Empty;
        Phone = user.Phone ?? string.Empty;
        Experience = user.Experience;
        Bio = user.Bio ?? string.Empty;
        Avatar = user.Avatar ?? string.Empty;
        IsPublic = user.IsPublic;
        Role = user.Role;
        Status = user.Status;

        // Map properties from Specialization
        if (user.Specialization != null)
        {
            SpecializationId = user.Specialization.Id;
            SpecializationName = user.Specialization.Name;
            SpecializationDescription = user.Specialization.Description;
        }
    }
}
