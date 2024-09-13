using ForumDs.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class RepAnswer : BaseEntity
{
    [Key]
    public Guid Id { get; set; }
    public string Content { get; set; }

    [ForeignKey("User_id")]
    public Guid User_id { get; set; }
    public User User { get; set; }


    [ForeignKey("Answer_id")]
    public Guid Answer_id { get; set; }
    public Answer Answer { get; set; }

    public List<Like> Likes { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdateAt { get; set; }

    public RepAnswer()
    {
        Id = Guid.NewGuid();
        CreatedAt = DateTime.UtcNow;
    }
    public void Update()
    {
        UpdateAt = DateTime.UtcNow;
    }
}
