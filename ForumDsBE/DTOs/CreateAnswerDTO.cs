using System.ComponentModel.DataAnnotations;

namespace ForumDs.DTOs
{
    public class CreateAnswerDTO
    {
        [Required]
        public string Content { get; set; }

        [Required]
        public Guid QuestionId { get; set; }
    }
}
