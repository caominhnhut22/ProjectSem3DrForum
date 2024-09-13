namespace ForumDs.DTOs
{
    public class CreateQuestionDTO
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public bool IsPublic { get; set; }
        public Guid UserId { get; set; }
        public IFormFile? QuestionImageFile { get; set; }
        public Guid SpecializationId { get; set; }
    }
}
