using ForumDs.DTOs;
using ForumDs.Helper;
using ForumDs.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ForumDs.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RepAnswerController : ControllerBase
    {
        private readonly DatabaseContext _dbContext;
        private readonly ILogger<RepAnswerController> _logger;

        public RepAnswerController(DatabaseContext dbContext, ILogger<RepAnswerController> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        [HttpPost("createRepAnswer"), Authorize(Roles = "User")]
        public async Task<IActionResult> CreateRepAnswer([FromBody] CreateRepAnswerDTO createRepAnswerDTO)
        {
            try
            {
                var userIdClaim = HttpContext.User.FindFirst("UserId");
                var answer = await _dbContext.Answers.FindAsync(createRepAnswerDTO.AnswerId);

                if (userIdClaim == null || answer == null)
                {
                    return BadRequest(new ApiResponse<object>(null, "Invalid user or answer", StatusCodes.Status400BadRequest));
                }

                var repAnswer = new RepAnswer
                {
                    Content = createRepAnswerDTO.Content,
                    Answer = answer,
                    User_id = Guid.Parse(userIdClaim.Value),
                    CreatedAt = DateTime.UtcNow
                };

                _dbContext.RepAnswers.Add(repAnswer);
                await _dbContext.SaveChangesAsync();

                return CreatedAtAction(nameof(GetRepAnswerById), new { id = repAnswer.Id }, new ApiResponse<Guid>(repAnswer.Id, "RepAnswer created successfully", StatusCodes.Status201Created));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating a repAnswer");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Internal Server Error", StatusCodes.Status500InternalServerError));
            }
        }

        [HttpPut("updateRepAnswer/{id}"), Authorize(Roles = "User")]
        public async Task<IActionResult> UpdateRepAnswer(Guid id, [FromBody] UpdateRepAnswerDTO updateRepAnswerDTO)
        {
            try
            {
                var userIdClaim = HttpContext.User.FindFirst("UserId");
                var repAnswer = await _dbContext.RepAnswers.FindAsync(id);

                if (userIdClaim == null || repAnswer == null)
                {
                    return BadRequest(new ApiResponse<object>(null, "Invalid user or repAnswer", StatusCodes.Status400BadRequest));
                }

                if (repAnswer.User_id != Guid.Parse(userIdClaim.Value))
                {
                    return Forbid();
                }

                repAnswer.Content = updateRepAnswerDTO.Content;
                repAnswer.Update();
                await _dbContext.SaveChangesAsync();

                return Ok(new ApiResponse<object>(null, "RepAnswer updated successfully", StatusCodes.Status200OK));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating a repAnswer");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Internal Server Error", StatusCodes.Status500InternalServerError));
            }
        }

        [HttpDelete("deleteRepAnswer/{id}"), Authorize(Roles = "User")]
        public async Task<IActionResult> DeleteRepAnswer(Guid id)
        {
            try
            {
                var userIdClaim = HttpContext.User.FindFirst("UserId");
                var repAnswer = await _dbContext.RepAnswers.FindAsync(id);

                if (userIdClaim == null || repAnswer == null)
                {
                    return BadRequest(new ApiResponse<object>(null, "Invalid user or repAnswer", StatusCodes.Status400BadRequest));
                }

                if (repAnswer.User_id != Guid.Parse(userIdClaim.Value))
                {
                    return Forbid();
                }

                _dbContext.RepAnswers.Remove(repAnswer);
                await _dbContext.SaveChangesAsync();

                return Ok(new ApiResponse<object>(null, "RepAnswer deleted successfully", StatusCodes.Status200OK));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting a repAnswer");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Internal Server Error", StatusCodes.Status500InternalServerError));
            }
        }

        [HttpGet("getRepAnswerById/{id}")]
        public async Task<IActionResult> GetRepAnswerById(Guid id)
        {
            try
            {
                var repAnswer = await _dbContext.RepAnswers.FindAsync(id);

                if (repAnswer == null)
                {
                    return NotFound(new ApiResponse<object>(null, "RepAnswer not found", StatusCodes.Status404NotFound));
                }

                return Ok(new ApiResponse<RepAnswerDTO>(new RepAnswerDTO(repAnswer), "RepAnswer retrieved successfully", StatusCodes.Status200OK));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving a repAnswer");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Internal Server Error", StatusCodes.Status500InternalServerError));
            }
        }

        // You can add more actions based on your requirements
    }
}
