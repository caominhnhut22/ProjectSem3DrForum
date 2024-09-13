using ForumDs.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class Specialization : BaseEntity
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string Name { get; set; }

    [Required]
    public string Description { get; set; }

    public List<User>? Users { get; set; }
    public List<Question>? Questions { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdateAt { get; set; }

    public Specialization()
    {
        Id = Guid.NewGuid();
        CreatedAt = DateTime.UtcNow;
    }

    public void Update()
    {
        UpdateAt = DateTime.UtcNow;  // Set UpdateAt to the current UTC time
    }
}