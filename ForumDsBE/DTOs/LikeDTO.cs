namespace ForumDs.DTOs
{
    public class LikeDTO
    {
        public Guid QuestionId { get; set; }
        public Guid AnswerId { get; set; }
        public Guid RepAnswerId { get; set; }
    }
}
