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

namespace ForumDs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnswerController : ControllerBase
    {
        private readonly DatabaseContext _dbContext;
        private readonly ILogger<AnswerController> _logger;

        public AnswerController(DatabaseContext dbContext, ILogger<AnswerController> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        [HttpPost("createAnswer"), Authorize(Roles = "User")]
        public async Task<IActionResult> CreateAnswer([FromBody] CreateAnswerDTO createAnswerDTO)
        {
            try
            {
                var userIdClaim = HttpContext.User.FindFirst("UserId");
                var question = await _dbContext.Questions.FindAsync(createAnswerDTO.QuestionId);

                if (userIdClaim == null || question == null)
                {
                    return BadRequest(new ApiResponse<object>(null, "Invalid user or question", StatusCodes.Status400BadRequest));
                }

                var answer = new Answer
                {
                    Content = createAnswerDTO.Content,
                    Question = question,
                    User_id = Guid.Parse(userIdClaim.Value),
                    CreatedAt = DateTime.UtcNow
                };

                _dbContext.Answers.Add(answer);
                await _dbContext.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAnswerById), new { id = answer.Id }, new ApiResponse<Guid>(answer.Id, "Answer created successfully", StatusCodes.Status201Created));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating an answer");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Internal Server Error", StatusCodes.Status500InternalServerError));
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAnswerById(Guid id)
        {
            var answer = await _dbContext.Answers.FindAsync(id);

            if (answer == null)
            {
                return NotFound(new ApiResponse<object>(null, "Answer not found", StatusCodes.Status404NotFound));
            }

            return Ok(new ApiResponse<Answer>(answer, "Answer retrieved successfully", StatusCodes.Status200OK));
        }

        [HttpGet("question/{questionId}")]
        [AllowAnonymous]
        public IActionResult GetAnswersForQuestion(Guid questionId, int? numberOfAnswers = null)
        {
            IQueryable<Answer> query = _dbContext.Answers
                .Include(a => a.User)
                .Include(a => a.RepAnswers)
                .Where(a => a.Question_id == questionId)
                .OrderByDescending(a => a.CreatedAt);

            if (numberOfAnswers.HasValue)
            {
                query = query.Take(numberOfAnswers.Value);
            }

            var answers = query.ToList();

            var responseAnswers = answers.Select(answer => new AnswerDTO(answer)).ToList();

            return Ok(new ApiResponse<List<AnswerDTO>>(responseAnswers, "Answers retrieved successfully", StatusCodes.Status200OK));
        }

        [HttpGet("question/{questionId}/total")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTotalAnswersForQuestion(Guid questionId)
        {
            try
            {
                var totalAnswers = await _dbContext.Answers
                    .Where(a => a.Question_id == questionId)
                    .CountAsync();

                return Ok(new ApiResponse<int>(totalAnswers, "Total answers retrieved successfully", StatusCodes.Status200OK));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving total answers for a question");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Internal Server Error", StatusCodes.Status500InternalServerError));
            }
        }

        [HttpPut("{id}/update"), Authorize(Roles = "User")]
        public async Task<IActionResult> UpdateAnswer(Guid id, [FromBody] UpdateAnswerDTO updateAnswerDTO)
        {
            try
            {
                var userIdClaim = HttpContext.User.FindFirst("UserId");
                var answer = await _dbContext.Answers.FindAsync(id);

                if (userIdClaim == null || answer == null)
                {
                    return NotFound(new ApiResponse<object>(null, "Answer not found", StatusCodes.Status404NotFound));
                }

                if (answer.User_id != Guid.Parse(userIdClaim.Value))
                {
                    return Forbid();
                }

                answer.Content = updateAnswerDTO.Content;
                answer.Update();

                await _dbContext.SaveChangesAsync();

                return Ok(new ApiResponse<Guid>(answer.Id, "Answer updated successfully", StatusCodes.Status200OK));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating an answer");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Internal Server Error", StatusCodes.Status500InternalServerError));
            }
        }

        [HttpDelete("{id}/delete"), Authorize(Roles = "User")]
        public async Task<IActionResult> DeleteAnswer(Guid id)
        {
            try
            {
                var userIdClaim = HttpContext.User.FindFirst("UserId");
                var answer = await _dbContext.Answers.FindAsync(id);

                if (userIdClaim == null || answer == null)
                {
                    return NotFound(new ApiResponse<object>(null, "Answer not found", StatusCodes.Status404NotFound));
                }

                if (answer.User_id != Guid.Parse(userIdClaim.Value))
                {
                    return Forbid();
                }

                _dbContext.Answers.Remove(answer);
                await _dbContext.SaveChangesAsync();

                return Ok(new ApiResponse<Guid>(answer.Id, "Answer deleted successfully", StatusCodes.Status200OK));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting an answer");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Internal Server Error", StatusCodes.Status500InternalServerError));
            }
        }
    }
}
