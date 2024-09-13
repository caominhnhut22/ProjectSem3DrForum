namespace ForumDs.Models
{
    public class CustomStatusCode<T>
    {
        public T Data { get; set; }
        public string Message { get; set; }
        public int Status { get; set; }
        public List<string> Errors { get; set; }
        public string Error { get; set; } // Add this line

        public CustomStatusCode(int statusCode, string message, T data, List<string> errors)
        {
            Status = statusCode;
            Message = message;
            Data = data;
            Errors = errors ?? new List<string>();
        }

        public CustomStatusCode(string message, int statusCode)
        {
            Status = statusCode;
            Message = message;
            Data = default;
            Errors = new List<string>();
        }

        public CustomStatusCode()
        {
            Status = 0;
            Message = "";
            Data = default;
            Errors = new List<string>();
        }
    }
}
