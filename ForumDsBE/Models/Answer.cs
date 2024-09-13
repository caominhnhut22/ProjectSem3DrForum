using ForumDs.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Answer : BaseEntity
{
    [Key]
    public Guid Id { get; set; }
    public string Content { get; set; }

    [ForeignKey("Question_id")]
    public Guid Question_id { get; set; }
    public Question Question { get; set; }

    [ForeignKey("User_id")]
    public Guid User_id { get; set; }
    public User User { get; set; }

    public List<RepAnswer> RepAnswers { get; set; }

    public List<Like> Likes { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdateAt { get; set; }

    public Answer()
    {
        Id = Guid.NewGuid();
        CreatedAt = DateTime.UtcNow;
    }
    public void Update()
    {
        UpdateAt = DateTime.UtcNow;
    }
}
