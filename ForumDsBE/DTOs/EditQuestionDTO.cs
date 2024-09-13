namespace ForumDs.DTOs
{
    public class EditQuestionDTO
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public bool IsPublic { get; set; }
        public IFormFile? QuestionImageFile { get; set; }
    }
}
