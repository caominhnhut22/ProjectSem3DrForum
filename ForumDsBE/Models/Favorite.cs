using System.ComponentModel.DataAnnotations;

namespace ForumDs.Models
{
    public class Favorite
    {
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid QuestionId { get; set; }
        public DateTime FavoritedAt { get; set; }

        public User User { get; set; }
        public Question Question { get; set; }
    }
}
