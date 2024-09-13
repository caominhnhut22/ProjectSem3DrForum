using ForumDs.DTOs;
using ForumDs.Models;
using ForumDs.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ForumDs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DatabaseContext _dbContext;
        private static int _loggedInUsersCount = 0;
        private static readonly object _lockObject = new object();

        public AuthController(IConfiguration configuration, DatabaseContext databaseContext)
        {
            _configuration = configuration;
            _dbContext = databaseContext;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO credentials)
        {
            try
            {
                var user = await GetUserByEmail(credentials.Email);

                if (user != null)
                {
                    var isPasswordValid = user.VerifyPassword(credentials.Password);

                    if (isPasswordValid)
                    {
                        // Tăng số lượng người đang đăng nhập
                        lock (_lockObject)
                        {
                            _loggedInUsersCount++;
                        }

                        var roles = new[] { "User" };
                        var tokenString = TokenService.GenerateJSONWebToken(_configuration, user);

                        Console.WriteLine($"Token generated: {tokenString}");
                        Console.WriteLine($"Roles during login: {string.Join(", ", roles)}");

                        var handler = new JwtSecurityTokenHandler();
                        var jsonToken = handler.ReadToken(tokenString) as JwtSecurityToken;
                        var decodedRoles = jsonToken?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
                        Console.WriteLine($"Decoded Roles: {decodedRoles}");

                        return Ok(new { Token = tokenString });
                    }
                }

                return Unauthorized();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new CustomStatusCode<User>()
                {
                    Message = "Có lỗi xảy ra trong quá trình xử lý yêu cầu.",
                    Error = ex.Message
                });
            }
        }

        [Authorize]
        [HttpGet("auth")]
        public IActionResult GetUserInfo()
        {
            var userId = User.FindFirst("UserId")?.Value;
            var email = User.FindFirst("Email")?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            var userInfo = new
            {
                UserId = userId,
                Email = email,
                Role = role,
            };

            return Ok(userInfo);
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            lock (_lockObject)
            {
                _loggedInUsersCount--;
            }

            return Ok(new { Message = "Logout successful" });
        }

        [HttpGet("getLoggedInUsersCount")]
        [AllowAnonymous]
        public IActionResult GetLoggedInUsersCount()
        {
            return Ok(new { LoggedInUsersCount = _loggedInUsersCount });
        }

        private async Task<User> GetUserByEmail(string email)
        {
            try
            {
                if (string.IsNullOrEmpty(email))
                {
                    // Handle the case where email is null or empty
                    return null;
                }

                try
                {
                    var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);

                    if (user != null)
                    {
                        return user;
                    }
                    else
                    {
                        // Handle the case where the user is not found
                        return null;
                    }
                }
                catch (Exception ex)
                {
                    // Log details for troubleshooting
                    Console.WriteLine($"Error getting user by email: {ex.Message}");
                    throw new Exception($"Error getting user by email: {ex.Message}", ex);
                }
            }
            catch (Exception ex)
            {
                // Log details for troubleshooting
                Console.WriteLine($"Error getting user by email: {ex.Message}");
                throw new Exception($"Error getting user by email: {ex.Message}", ex);
            }
        }
    }
}
