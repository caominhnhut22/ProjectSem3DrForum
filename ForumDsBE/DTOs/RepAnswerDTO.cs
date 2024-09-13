namespace ForumDs.DTOs
{
    public class RepAnswerDTO
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdateAt { get; set; }

        public Guid UserId { get; set; }
        public string UserName { get; set; }

        public Guid AnswerId { get; set; }

        public RepAnswerDTO(RepAnswer repAnswer)
        {
            Id = repAnswer.Id;
            Content = repAnswer.Content;
            CreatedAt = repAnswer.CreatedAt;
            UpdateAt = repAnswer.UpdateAt;

            UserId = repAnswer.User_id;
            UserName = repAnswer.User?.Name;

            AnswerId = repAnswer.Answer_id;
        }
    }

}
