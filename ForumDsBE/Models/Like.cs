﻿using System.ComponentModel.DataAnnotations;

namespace ForumDs.Models
{
    public class Like
    {
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid? QuestionId { get; set; }
        public Guid? AnswerId { get; set; }
        public Guid? RepAnswerId { get; set; }
        public DateTime LikedAt { get; set; }

        public User User { get; set; }
        public Question Question { get; set; }
        public Answer Answer { get; set; }
        public RepAnswer RepAnswer { get; set; }
    }
}
