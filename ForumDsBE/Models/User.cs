using BCrypt.Net;
using ForumDs.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

public class User : BaseEntity
{
    [Key]
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public int? Experience { get; set; }
    public string? Bio { get; set; }
    public string? Avatar { get; set; }
    public bool IsPublic { get; set; }
    public string Role { get; set; }

    [ForeignKey("Specialization_id")]
    public Guid? Specialization_id { get; set; }
    public Specialization Specialization { get; set; }

    [NotMapped]
    public IFormFile? AvatarFile { get; set; }

    public UserStatus Status { get; set; } // New property for user status

    public List<Question>? Questions { get; set; }
    public List<Answer>? Answers { get; set; }
    public List<RepAnswer>? RepAnswers { get; set; }
    public List<UserVerification>? UserVerifications { get; set; }
    public List<Like>? Likes { get; set; }
    public List<Favorite>? Favorites { get; set; }

    public string? ResetToken { get; set; }
    public DateTime? ResetTokenExpiry { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdateAt { get; set; }

    public void SetPassword(string password)
    {
        Password = BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string password)
    {
        return BCrypt.Net.BCrypt.Verify(password, Password);
    }

    public User()
    {
        Id = Guid.NewGuid();
        Status = UserStatus.Registered;
        CreatedAt = DateTime.UtcNow;
    }
    public void Update()
    {
        UpdateAt = DateTime.UtcNow;
    }
}

public enum UserStatus
{
    Registered,       // User has registered but not verified
    VerificationSent, // Verification code has been sent to the user
    Verified,         // User has entered the verification code
    Completed         // User has completed all necessary information
}

