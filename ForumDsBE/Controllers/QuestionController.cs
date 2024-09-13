using ForumDs.DTOs;
using ForumDs.Helper;
using ForumDs.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class QuestionController : ControllerBase
{
    private readonly DatabaseContext _dbContext;
    private readonly ILogger<QuestionController> _logger;
    private readonly IEmailService _emailService;

    public QuestionController(IEmailService emailService, DatabaseContext dbContext, ILogger<QuestionController> logger)
    {
        _emailService = emailService;
        _dbContext = dbContext;
        _logger = logger;
    }

    [HttpGet("getAllQuestions")]
    [AllowAnonymous]
    public IActionResult GetAllQuestions()
    {
        try
        {
            var questions = _dbContext.Questions
                .Include(q => q.User)
                .Include(q => q.Specialization)
                .Include(q => q.Answers)
                .ThenInclude(a => a.User)
                .ToList();

            var questionDTOs = questions.Select(question => new QuestionDTO(question)).ToList();

            return Ok(questionDTOs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting the list of questions");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Internal Server Error", StatusCodes.Status500InternalServerError));
        }
    }

    [HttpGet("getAllUnacceptedQuestions")]
    [AllowAnonymous]
    public IActionResult GetAllUnacceptedQuestions()
    {
        try
        {
            var unacceptedQuestions = _dbContext.Questions
                .Include(q => q.User)
                .Include(q => q.Specialization)
                .Include(q => q.Answers)
                .ThenInclude(a => a.User)
                .Where(q => !q.IsAccepted)
                .ToList();

            var questionDTOs = unacceptedQuestions.Select(question => new QuestionDTO(question)).ToList();

            return Ok(questionDTOs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting the list of unaccepted questions");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Internal Server Error", StatusCodes.Status500InternalServerError));
        }
    }

    [HttpGet("getQuestionsBySpecializationId/{specializationId?}")]
    public IActionResult GetQuestionsBySpecializationId(Guid? specializationId, int? page = 1, int? pageSize = 10)
    {
        try
        {
            var skipAmount = pageSize * (page - 1);

            var questions = _dbContext.Questions
                .Include(q => q.User)
                .Include(q => q.Specialization)
                .Include(q => q.Answers)
                .ThenInclude(a => a.User)
                .Where(q => (specializationId == null || q.Specialization_id == specializationId) && q.IsAccepted) 
                .OrderByDescending(q => q.CreatedAt)
                .Skip(skipAmount ?? 0)
                .Take(pageSize ?? 10)
                .ToList();

            var questionDTOs = questions.Select(question => new QuestionDTO(question)).ToList();

            return Ok(questionDTOs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting questions for specializationId {specializationId}");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Internal Server Error", StatusCodes.Status500InternalServerError));
        }
    }

    [HttpGet("getTotalQuestionsBySpecializationId/{specializationId?}")]
    [AllowAnonymous]
    public IActionResult GetTotalQuestionsBySpecializationId(Guid? specializationId)
    {
        try
        {
            // Triển khai logic để lấy tổng số câu hỏi từ database dựa trên specializationId và điều kiện IsAccepted
            var totalQuestions = _dbContext.Questions
                .Where(q => (specializationId == null || q.Specialization_id == specializationId) && q.IsAccepted)
                .Count();

            return Ok(totalQuestions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting total questions for specializationId {specializationId}");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Internal Server Error", StatusCodes.Status500InternalServerError));
        }
    }

    [HttpGet("getQuestionById/{id}")]
    [AllowAnonymous]
    public IActionResult GetQuestionById(Guid id)
    {
        try
        {
            var question = _dbContext.Questions
                .Include(q => q.User)
                .Include(q => q.Specialization)
                .Include(q => q.Answers)
                .ThenInclude(a => a.User)
                .FirstOrDefault(q => q.Id == id);

            if (question == null)
            {
                return NotFound(new ApiResponse<object>(null, "Question not found", StatusCodes.Status404NotFound));
            }

            var questionDTO = new QuestionDTO(question);

            return Ok(questionDTO);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting question with id {id}");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Internal Server Error", StatusCodes.Status500InternalServerError));
        }
    }

    [HttpPost("createQuestion"), Authorize(Roles = "User")]
    public async Task<IActionResult> CreateQuestion([FromForm] CreateQuestionDTO createQuestionDTO)
    {
        try
        {
            var userIdClaim = HttpContext.User.FindFirst("UserId");
            var specializationIdClaim = HttpContext.User.FindFirst("Specialization_id");

            if (userIdClaim == null || specializationIdClaim == null)
            {
                return BadRequest(new ApiResponse<object>(null, "Thông tin người dùng không hợp lệ trong token", StatusCodes.Status400BadRequest));
            }

            var question = new Question
            {
                Title = createQuestionDTO.Title,
                Body = createQuestionDTO.Body,
                IsPublic = createQuestionDTO.IsPublic,
                User_id = Guid.Parse(userIdClaim.Value),
                Specialization_id = Guid.Parse(specializationIdClaim.Value)
            };

            ProcessQuestionFile(question, createQuestionDTO.QuestionImageFile);

            _dbContext.Questions.Add(question);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuestionById), new { id = question.Id }, new ApiResponse<Guid>(question.Id, "Tạo câu hỏi thành công", StatusCodes.Status201Created));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo câu hỏi");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Lỗi nội bộ", StatusCodes.Status500InternalServerError));
        }
    }

    [HttpPut("updateQuestion/{id}"), Authorize(Roles = "User")]
    public async Task<IActionResult> UpdateQuestion(Guid id, [FromForm] EditQuestionDTO editQuestionDTO)
    {
        try
        {
            var question = await _dbContext.Questions.FindAsync(id);

            if (question == null)
            {
                return NotFound(new ApiResponse<object>(null, "Question not found", StatusCodes.Status404NotFound));
            }

            var userIdClaim = HttpContext.User.FindFirst("UserId");

            if (userIdClaim == null)
            {
                return BadRequest(new ApiResponse<object>(null, "Thông tin người dùng không hợp lệ trong token", StatusCodes.Status400BadRequest));
            }

            // Ensure the user can only update their own question
            if (question.User_id != Guid.Parse(userIdClaim.Value))
            {
                return Forbid();
            }

            // Update question details
            question.Title = editQuestionDTO.Title;
            question.Body = editQuestionDTO.Body;
            question.IsPublic = editQuestionDTO.IsPublic;
            question.UpdateAt = DateTime.Now;

            // If a new image is provided, delete the old one and save the new image
            if (editQuestionDTO.QuestionImageFile != null)
            {
                // Delete the old image
                FileUpload.DeleteImage(question.QuestionImage);

                // Save the new image
                question.QuestionImage = FileUpload.SaveQuestionImage(editQuestionDTO.QuestionImageFile);
            }

            _dbContext.Questions.Update(question);
            await _dbContext.SaveChangesAsync();

            return Ok(new ApiResponse<object>(null, "Question updated successfully", StatusCodes.Status200OK));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error updating question with id {id}");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Internal Server Error", StatusCodes.Status500InternalServerError));
        }
    }

    [HttpDelete("deleteQuestion/{id}"), Authorize(Roles = "User")]
    public async Task<IActionResult> DeleteQuestion(Guid id)
    {
        try
        {
            var question = await _dbContext.Questions.FindAsync(id);

            if (question == null)
            {
                return NotFound(new ApiResponse<object>(null, "Question not found", StatusCodes.Status404NotFound));
            }

            _dbContext.Questions.Remove(question);
            await _dbContext.SaveChangesAsync();

            return Ok(new ApiResponse<object>(null, "Question deleted successfully", StatusCodes.Status200OK));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error deleting question with id {id}");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Internal Server Error", StatusCodes.Status500InternalServerError));
        }
    }

    [HttpPut("changeIsAccepted/{id}"), Authorize(Roles = "Admin, User")]
    public async Task<IActionResult> ChangeIsAccepted(Guid id, [FromBody] ChangeIsAcceptedDTO changeIsAcceptedDTO)
    {
        try
        {
            var question = await _dbContext.Questions
                .Include(q => q.User)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (question == null)
            {
                return NotFound(new ApiResponse<object>(null, "Question not found", StatusCodes.Status404NotFound));
            }

            if (changeIsAcceptedDTO.IsAccepted)
            {
                // Nếu đồng ý, thực hiện cập nhật và gửi email thông báo
                question.IsAccepted = true;
                _dbContext.Questions.Update(question);
                await _dbContext.SaveChangesAsync();

                var subject = "Notification about the status of your post";
                var body = $"Your post with Id {question.Id} titled '{question.Title}' has been approved";
                if (question.User != null)
                {
                    await _emailService.SendEmailAsync(question.User.Email, subject, body);
                }
                else
                {
                    Console.WriteLine("User information is null. Cannot send email.");
                }

                return Ok(new ApiResponse<object>(null, "IsAccepted changed to true. Email sent.", StatusCodes.Status200OK));
            }
            else
            {
                _dbContext.Questions.Remove(question);
                await _dbContext.SaveChangesAsync();

                var subject = "Notification about the status of your post";
                var body = $"Your post with Id {question.Id} titled '{question.Title}' has been rejected";
                if (question.User != null)
                {
                    await _emailService.SendEmailAsync(question.User.Email, subject, body);
                }
                else
                {
                    Console.WriteLine("User information is null. Cannot send email.");
                }

                return Ok(new ApiResponse<object>(null, "Question rejected. Email sent.", StatusCodes.Status200OK));
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error changing IsAccepted for question with id {id}");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Internal Server Error", StatusCodes.Status500InternalServerError));
        }
    }

    private void ProcessQuestionFile(Question question, IFormFile? questionFile)
    {
        if (questionFile != null && questionFile.Length > 0)
        {
            question.QuestionImage = FileUpload.SaveQuestionImage(questionFile);
        }
    }
}
