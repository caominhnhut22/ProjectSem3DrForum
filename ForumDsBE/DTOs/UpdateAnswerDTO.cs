using System.ComponentModel.DataAnnotations;

namespace ForumDs.DTOs
{
    public class UpdateAnswerDTO
    {
        [Required]
        public string Content { get; set; }
    }
}
