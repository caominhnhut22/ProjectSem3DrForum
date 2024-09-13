using ForumDs.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Question : BaseEntity
{
    [Key]
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Body { get; set; }
    public bool IsPublic { get; set; }
    public bool IsAccepted { get; set; }
    public string? QuestionImage { get; set; }

    [ForeignKey("User_id")]
    public Guid User_id { get; set; }
    public User User { get; set; }

    [ForeignKey("Specialization_id")]
    public Guid Specialization_id { get; set; }
    public Specialization Specialization { get; set; }

    [NotMapped]
    public IFormFile? QuestionImageFile { get; set; }

    public List<Answer>? Answers { get; set; }

    public List<Like> Likes { get; set; }

    public List<Favorite> Favorites { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdateAt { get; set; }

    public Question()
    {
        Id = Guid.NewGuid();
        CreatedAt = DateTime.UtcNow;
        Update();
    }
    public void Update()
    {
        UpdateAt = DateTime.UtcNow;
    }
}

