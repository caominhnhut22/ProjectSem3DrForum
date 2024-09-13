namespace ForumDs.DTOs
{
    public class QuestionDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public bool IsPublic { get; set; }
        public bool IsAccepted { get; set; }

        public string? QuestionImage { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdateAt { get; set; }

        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string? UserAvatar { get; set; }

        public Guid SpecializationId { get; set; }
        public string SpecializationName { get; set; }
        public string SpecializationDescription { get; set; }

        public List<AnswerDTO>? Answers { get; set; }

        public QuestionDTO(Question question)
        {
            Id = question.Id;
            Title = question.Title;
            Body = question.Body;
            QuestionImage = question.QuestionImage;
            IsPublic = question.IsPublic; 
            IsAccepted = question.IsAccepted;

            UserId = question.User_id;
            UserName = question.User?.Name;
            UserAvatar = question.User?.Avatar; 

            SpecializationId = question.Specialization_id;
            SpecializationName = question.Specialization?.Name;
            SpecializationDescription = question.Specialization?.Description;

            // Map AnswerDTOs if Answers is not null
            Answers = question.Answers?.Select(answer => new AnswerDTO(answer)).ToList();
        }
    }

}
