using System.ComponentModel.DataAnnotations;

namespace ForumDs.DTOs
{
    public class CreateRepAnswerDTO
    {
        [Required]
        public string Content { get; set; }

        [Required]
        public Guid AnswerId { get; set; }
    }
}
