namespace ForumDs.DTOs
{
    public class AnswerDTO
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdateAt { get; set; }

        public Guid QuestionId { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string UserAvatar { get; set; } // New property for User Avatar

        public List<RepAnswerDTO>? RepAnswers { get; set; }

        public AnswerDTO(Answer answer)
        {
            Id = answer.Id;
            Content = answer.Content;
            CreatedAt = answer.CreatedAt;
            UpdateAt = answer.UpdateAt;

            QuestionId = answer.Question_id;
            UserId = answer.User_id;
            UserName = answer.User?.Name;
            UserAvatar = answer.User?.Avatar; // Fetch User's Avatar property

            // Map RepAnswerDTOs if RepAnswers is not null
            RepAnswers = answer.RepAnswers?.Select(repAnswer => new RepAnswerDTO(repAnswer)).ToList();
        }
    }
}
