using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using ForumDs.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.Extensions;
using ForumDs.DTOs;
using ForumDs.Helper;

[ApiController]
[Route("api/[controller]")]
public class LikeController : ControllerBase
{
    private readonly ILogger<LikeController> _logger;
    private readonly DatabaseContext _dbContext;
    private readonly IConfiguration _configuration;

    public LikeController(ILogger<LikeController> logger, DatabaseContext dbContext, IConfiguration configuration)
    {
        _logger = logger;
        _dbContext = dbContext;
        _configuration = configuration;
    }

    [HttpPost("likeQuestion")]
    [Authorize] // Requires authentication
    public async Task<IActionResult> LikeQuestion([FromBody] LikeDTO likeDTO)
    {
        try
        {
            var userId = Guid.Parse(User.Identity.Name); // Get user id from authentication token
            var question = await _dbContext.Questions.FindAsync(likeDTO.QuestionId);

            if (question == null)
            {
                return NotFound(new ApiResponse<object>(null, "Câu hỏi không tồn tại", StatusCodes.Status404NotFound));
            }

            var existingLike = await _dbContext.Likes
                .FirstOrDefaultAsync(l => l.UserId == userId && l.QuestionId == likeDTO.QuestionId);

            if (existingLike != null)
            {
                return BadRequest(new ApiResponse<object>(null, "Người dùng đã thích câu hỏi này trước đó", StatusCodes.Status400BadRequest));
            }

            var like = new Like
            {
                UserId = userId,
                QuestionId = likeDTO.QuestionId,
                LikedAt = DateTime.UtcNow
            };

            _dbContext.Likes.Add(like);
            await _dbContext.SaveChangesAsync();

            return Ok(new ApiResponse<object>(null, "Thích câu hỏi thành công", StatusCodes.Status200OK));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi thích câu hỏi");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Lỗi nội bộ", StatusCodes.Status500InternalServerError));
        }
    }

    [HttpPost("likeAnswer")]
    [Authorize] // Requires authentication
    public async Task<IActionResult> LikeAnswer([FromBody] LikeDTO likeDTO)
    {
        try
        {
            var userId = Guid.Parse(User.Identity.Name); // Get user id from authentication token
            var answer = await _dbContext.Answers.FindAsync(likeDTO.AnswerId);

            if (answer == null)
            {
                return NotFound(new ApiResponse<object>(null, "Câu trả lời không tồn tại", StatusCodes.Status404NotFound));
            }

            var existingLike = await _dbContext.Likes
                .FirstOrDefaultAsync(l => l.UserId == userId && l.AnswerId == likeDTO.AnswerId);

            if (existingLike != null)
            {
                return BadRequest(new ApiResponse<object>(null, "Người dùng đã thích câu trả lời này trước đó", StatusCodes.Status400BadRequest));
            }

            var like = new Like
            {
                UserId = userId,
                AnswerId = likeDTO.AnswerId,
                LikedAt = DateTime.UtcNow
            };

            _dbContext.Likes.Add(like);
            await _dbContext.SaveChangesAsync();

            return Ok(new ApiResponse<object>(null, "Thích câu trả lời thành công", StatusCodes.Status200OK));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi thích câu trả lời");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Lỗi nội bộ", StatusCodes.Status500InternalServerError));
        }
    }

    [HttpPost("likeRepAnswer")]
    [Authorize] // Yêu cầu xác thực
    public async Task<IActionResult> LikeRepAnswer([FromBody] LikeDTO likeDTO)
    {
        try
        {
            var userId = Guid.Parse(User.Identity.Name); // Lấy id người dùng từ mã xác thực
            var repAnswer = await _dbContext.RepAnswers.FindAsync(likeDTO.RepAnswerId);

            if (repAnswer == null)
            {
                return NotFound(new ApiResponse<object>(null, "Câu trả lời phụ không tồn tại", StatusCodes.Status404NotFound));
            }

            var existingLike = await _dbContext.Likes
                .FirstOrDefaultAsync(l => l.UserId == userId && l.RepAnswerId == likeDTO.RepAnswerId);

            if (existingLike != null)
            {
                return BadRequest(new ApiResponse<object>(null, "Người dùng đã thích câu trả lời phụ này trước đó", StatusCodes.Status400BadRequest));
            }

            var like = new Like
            {
                UserId = userId,
                RepAnswerId = likeDTO.RepAnswerId,
                LikedAt = DateTime.UtcNow
            };

            _dbContext.Likes.Add(like);
            await _dbContext.SaveChangesAsync();

            return Ok(new ApiResponse<object>(null, "Thích câu trả lời phụ thành công", StatusCodes.Status200OK));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi thích câu trả lời phụ");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Lỗi nội bộ", StatusCodes.Status500InternalServerError));
        }
    }
}


