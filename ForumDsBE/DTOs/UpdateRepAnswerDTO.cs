using System.ComponentModel.DataAnnotations;

namespace ForumDs.DTOs
{
    public class UpdateRepAnswerDTO
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public string Content { get; set; }
    }
}
