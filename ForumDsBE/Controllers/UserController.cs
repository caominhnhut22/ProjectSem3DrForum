using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc;
using ForumDs.DTOs;
using ForumDs.Models;
using ForumDs.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ForumDs.Helper;   
using System.Net.Mail;
using System.Net;

namespace ForumDs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ILogger<UserController> _logger;
        private readonly DatabaseContext _dbContext;
        private readonly CodeGeneratorService _codeGenerator;
        private readonly IConfiguration _configuration;

        public UserController(IEmailService emailService, ILogger<UserController> logger, DatabaseContext dbContext, CodeGeneratorService codeGeneratorService, IConfiguration configuration)
        {
            _emailService = emailService;
            _logger = logger;
            _dbContext = dbContext;
            _codeGenerator = codeGeneratorService;
            _configuration = configuration;
        }

        [HttpGet("getAllUsers")]
        [AllowAnonymous]
        public IActionResult GetAllUsers()
        {
            try
            {
                // Lấy danh sách người dùng có vai trò là "User"
                var userUsers = _dbContext.Users
                    .Include(u => u.Specialization)
                    .Where(u => u.Role == "User")
                    .ToList();

                // Chuyển đổi danh sách người dùng thành DTO và trả về
                var userUserDTOs = userUsers.Select(user => new UserDTO(user)).ToList();

                return Ok(userUserDTOs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách người dùng có vai trò User");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Lỗi nội bộ", StatusCodes.Status500InternalServerError));
            }
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromForm] RegisterDTO registerDTO)
        {
            try
            {
                if (EmailExistsData(registerDTO.Email))
                {
                    var responseEm = new ApiResponse<object>(
                        null,
                        "Email already exists",
                        StatusCodes.Status400BadRequest,
                        null
                    );

                    return BadRequest(responseEm);
                }

                var user = new User
                {
                    Name = registerDTO.Name,
                    Email = registerDTO.Email,
                    Specialization_id = registerDTO.Specialization_id,
                    Address = string.Empty,  // Set default value for Address
                    Phone = string.Empty,    // Set default value for Phone
                    Experience = null,       // Set default value for Experience
                    Bio = string.Empty,      // Set default value for Bio
                    IsPublic = true,         // Set default value for IsPublic
                    Role = "User",           // Set default value for Role
                    Status = UserStatus.Registered,
                };

                user.SetPassword(registerDTO.Password);
                ProcessAvatarFile(user, registerDTO.AvatarFile);

                _dbContext.Users.Add(user);
                await _dbContext.SaveChangesAsync();

                // Generate and send verification code
                var verificationCode = _codeGenerator.GenerateCode();
                await SendVerificationEmail(user, verificationCode);

                // Update user status to VerificationSent
                user.Status = UserStatus.VerificationSent;
                await _dbContext.SaveChangesAsync();

                var responseDTO = new RegisterDTO
                {
                    Name = user.Name,
                    Email = user.Email,
                };

                var response = new ApiResponse<RegisterDTO>(
                    responseDTO,
                    "Tài nguyên đã được tạo, Kiểm Tra Email Để Nhận Mã Kích Hoạt",
                    StatusCodes.Status201Created,
                    null
                );

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi đăng ký người dùng");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<RegisterDTO>(null, "Lỗi nội bộ", StatusCodes.Status500InternalServerError));
            }
        }

        [HttpPost("verify-email")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDTO verifyEmailDTO)
        {
            try
            {
                var user = _dbContext.Users
                    .Include(u => u.UserVerifications)
                    .FirstOrDefault(u => u.Email == verifyEmailDTO.Email);

                if (user == null)
                {
                    return NotFound(new ApiResponse<object>(null, "Người dùng không tồn tại", StatusCodes.Status404NotFound));
                }

                if (user.Status != UserStatus.VerificationSent)
                {
                    return BadRequest(new ApiResponse<object>(null, "Người dùng chưa gửi mã xác nhận", StatusCodes.Status400BadRequest));
                }

                if (user.UserVerifications == null)
                {
                    return BadRequest(new ApiResponse<object>(null, "Không tìm thấy mã xác nhận", StatusCodes.Status400BadRequest));
                }

                var verification = user.UserVerifications.OrderByDescending(uv => uv.ExpiryDate).FirstOrDefault();

                if (verification == null || verification.VerificationCode != verifyEmailDTO.VerificationCode)
                {
                    return BadRequest(new ApiResponse<object>(null, "Mã xác nhận không hợp lệ", StatusCodes.Status400BadRequest));
                }

                if (verification.ExpiryDate < DateTime.UtcNow)
                {
                    // Generate a new verification code
                    var newVerificationCode = _codeGenerator.GenerateCode();

                    // Call the existing function to send a new verification code
                    await SendVerificationEmail(user, newVerificationCode);

                    // Xóa dữ liệu không cần thiết trong UserVerification khi Status là Verified
                    _dbContext.UserVerifications.RemoveRange(user.UserVerifications);
                    await _dbContext.SaveChangesAsync();

                    return BadRequest(new ApiResponse<object>(null, "Mã xác nhận đã hết hạn. Một mã mới đã được gửi đến email của bạn.", StatusCodes.Status400BadRequest));
                }

                // Update user status to Verified
                user.Status = UserStatus.Verified;
                await _dbContext.SaveChangesAsync();

                // Xóa dữ liệu không cần thiết trong UserVerification khi Status là Verified
                _dbContext.UserVerifications.RemoveRange(user.UserVerifications);
                await _dbContext.SaveChangesAsync();

                return Ok(new ApiResponse<object>(null, "Xác nhận thành công", StatusCodes.Status200OK));
            }
            catch (Exception ex)
            {
                // Handle exceptions appropriately
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Lỗi nội bộ", StatusCodes.Status500InternalServerError));
            }
        }

        [HttpDelete("delete-user/{userId}")]
        public IActionResult DeleteUser(Guid userId)
        {
            try
            {
                var user = _dbContext.Users.Find(userId);

                if (user == null)
                {
                    return NotFound(new ApiResponse<object>(null, "Người dùng không tồn tại", StatusCodes.Status404NotFound));
                }

                _dbContext.Users.Remove(user);
                _dbContext.SaveChanges();

                return Ok(new ApiResponse<object>(null, "Người dùng đã được xóa", StatusCodes.Status200OK));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa người dùng");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Lỗi nội bộ", StatusCodes.Status500InternalServerError));
            }
        }

        [HttpGet("getUserById/{userId}")]
        [AllowAnonymous]
        public IActionResult GetUserById(Guid userId)
        {
            try
            {
                var user = _dbContext.Users
                    .Include(u => u.Specialization)
                    .Include(u => u.Questions)
                    .FirstOrDefault(u => u.Id == userId);

                if (user == null)
                {
                    return NotFound(new ApiResponse<object>(null, "Người dùng không tồn tại", StatusCodes.Status404NotFound));
                }

                var userProfileDTO = new UserProfileDTO(user);

                return Ok(userProfileDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy thông tin người dùng theo Id");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Lỗi nội bộ", StatusCodes.Status500InternalServerError));
            }
        }

        [HttpPut("edit-profile/{userId}")]
        public async Task<IActionResult> EditProfileUser(Guid userId, [FromForm] EditProfileDTO editProfileDTO)
        {
            try
            {
                var user = _dbContext.Users.Find(userId);

                if (user == null)
                {
                    return NotFound(new ApiResponse<object>(null, "Người dùng không tồn tại", StatusCodes.Status404NotFound));
                }

                // Update user properties based on the data in editProfileDTO
                user.Name = editProfileDTO.Name;
                user.Address = editProfileDTO.Address;
                user.Phone = editProfileDTO.Phone;
                user.Bio = editProfileDTO.Bio;
                user.Experience = editProfileDTO.Experience;

                //ProcessAvatarFile(user, editProfileDTO.AvatarFile);

                // Check if all relevant properties are not null
                if (user.Name != null && user.Address != null && user.Phone != null && user.Bio != null && user.Experience != null)
                {
                    // Update user status to Completed
                    user.Status = UserStatus.Completed;
                }

                if (editProfileDTO.AvatarFile != null)
                {
                    // Delete the old image
                    FileUpload.DeleteAvatar(user.Avatar);

                    // Save the new image
                    user.Avatar = FileUpload.SaveAvatar(editProfileDTO.AvatarFile);
                }

                _dbContext.Users.Update(user);
                await _dbContext.SaveChangesAsync();

                var responseDTO = new EditProfileDTO
                {
                    Name = user.Name,
                    Address = user.Address,
                    Phone = user.Phone,
                    Bio = user.Bio,
                    Experience = user.Experience,
                };

                var response = new ApiResponse<EditProfileDTO>(
                    responseDTO,
                    "Thông tin người dùng đã được cập nhật",
                    StatusCodes.Status200OK,
                    null
                );

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi chỉnh sửa thông tin người dùng");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Lỗi nội bộ", StatusCodes.Status500InternalServerError));
            }
        }

        [HttpPut("change-status/{userId}")]
        public IActionResult ChangeStatusUser(Guid userId)
        {
            try
            {
                var user = _dbContext.Users.Find(userId);

                if (user == null)
                {
                    return NotFound(new ApiResponse<object>(null, "Người dùng không tồn tại", StatusCodes.Status404NotFound));
                }

                // Toggle the IsPublic property
                user.IsPublic = !user.IsPublic;

                _dbContext.Users.Update(user);
                _dbContext.SaveChanges();

                var responseDTO = new ChangeStatusUserDTO
                {
                    IsPublic = user.IsPublic,
                };

                var response = new ApiResponse<ChangeStatusUserDTO>(
                    responseDTO,
                    "Trạng thái người dùng đã được cập nhật",
                    StatusCodes.Status200OK,
                    null
                );

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi thay đổi trạng thái người dùng");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Lỗi nội bộ", StatusCodes.Status500InternalServerError));
            }
        }

        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO forgotPasswordDTO)
        {
            try
            {
                var user = _dbContext.Users.FirstOrDefault(u => u.Email == forgotPasswordDTO.Email);

                if (user == null)
                {
                    return NotFound(new ApiResponse<object>(null, "Người dùng không tồn tại", StatusCodes.Status404NotFound));
                }

                // Generate a reset token
                var resetToken = _codeGenerator.GenerateCode();

                // Save the reset token and its expiry date in the database
                user.ResetToken = resetToken;
                user.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(15); // Set an expiry time (adjust as needed)
                await _dbContext.SaveChangesAsync();

                // Send an email with the reset link
                await SendResetPasswordEmail(user, resetToken);

                var response = new ApiResponse<object>(
                    null,
                    "Một email đã được gửi với hướng dẫn đặt lại mật khẩu",
                    StatusCodes.Status200OK,
                    null
                );

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xử lý quên mật khẩu");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Lỗi nội bộ", StatusCodes.Status500InternalServerError));
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO resetPasswordDTO)
        {
            try
            {
                var user = _dbContext.Users.FirstOrDefault(u => u.Email == resetPasswordDTO.Email);

                if (user == null)
                {
                    return NotFound(new ApiResponse<object>(null, "Người dùng không tồn tại", StatusCodes.Status404NotFound));
                }

                // Check if the reset token is valid and not expired
                if (user.ResetToken == resetPasswordDTO.ResetToken && user.ResetTokenExpiry > DateTime.UtcNow)
                {
                    // Set the new password
                    user.SetPassword(resetPasswordDTO.NewPassword);

                    // Clear the reset token and its expiry
                    user.ResetToken = null;
                    user.ResetTokenExpiry = null;

                    await _dbContext.SaveChangesAsync();

                    var response = new ApiResponse<object>(
                        null,
                        "Mật khẩu đã được đặt lại thành công",
                        StatusCodes.Status200OK,
                        null
                    );

                    return Ok(response);
                }

                return BadRequest(new ApiResponse<object>(null, "Đặt lại mật khẩu không hợp lệ hoặc đã hết hạn", StatusCodes.Status400BadRequest));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi đặt lại mật khẩu");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Lỗi nội bộ", StatusCodes.Status500InternalServerError));
            }
        }

        [HttpPut("change-password/{userId}")]
        public async Task<IActionResult> ChangePassword(Guid userId, [FromBody] ChangePasswordDTO changePasswordDTO)
        {
            try
            {
                var user = await _dbContext.Users.FindAsync(userId);

                if (user == null)
                {
                    return NotFound(new ApiResponse<object>(null, "Người dùng không tồn tại", StatusCodes.Status404NotFound));
                }

                // Kiểm tra xác thực mật khẩu hiện tại
                if (!user.VerifyPassword(changePasswordDTO.CurrentPassword))
                {
                    return BadRequest(new ApiResponse<object>(null, "Mật khẩu hiện tại không đúng", StatusCodes.Status400BadRequest));
                }

                // Kiểm tra mật khẩu mới và xác nhận mật khẩu
                if (changePasswordDTO.NewPassword != changePasswordDTO.ConfirmPassword)
                {
                    return BadRequest(new ApiResponse<object>(null, "Mật khẩu mới và xác nhận mật khẩu không khớp", StatusCodes.Status400BadRequest));
                }

                // Cập nhật mật khẩu mới
                user.SetPassword(changePasswordDTO.NewPassword);
                _dbContext.Users.Update(user);
                await _dbContext.SaveChangesAsync();

                var response = new ApiResponse<object>(
                    null,
                    "Mật khẩu đã được thay đổi thành công",
                    StatusCodes.Status200OK,
                    null
                );

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi thay đổi mật khẩu");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Lỗi nội bộ", StatusCodes.Status500InternalServerError));
            }
        }

        private async Task SendVerificationEmail(User user, string verificationCode)
        {
            var userVerification = new UserVerification
            {
                User_id = user.Id,
                VerificationCode = verificationCode,
                ExpiryDate = DateTime.UtcNow.AddMinutes(1), 
            };

            _dbContext.UserVerifications.Add(userVerification);
            await _dbContext.SaveChangesAsync();

            var emailBody = $"Your verification code is: {verificationCode}";
            await _emailService.SendEmailAsync(user.Email, "Verification Code", emailBody);
        }

        [HttpGet("getUsersBySpecialization/{specializationId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsersBySpecialization(Guid specializationId)
        {
            var specialization = await _dbContext.Specializations
                .Include(s => s.Users)
                .FirstOrDefaultAsync(s => s.Id == specializationId);

            if (specialization == null)
            {
                return NotFound("Specialization not found");
            }

            var userDTOs = specialization.Users
                .Select(u => new UserDTO(u)) 
                .ToList();

            return Ok(userDTOs);
        }

        [HttpGet("getStatistics")]
        [AllowAnonymous]
        public IActionResult GetStatistics()
        {
            try
            {
                var totalUsers = _dbContext.Users.Count();

                var totalMembers = _dbContext.Users.Count(user => user.Status >= UserStatus.Verified);

                var response = new
                {
                    TotalUsers = totalUsers,
                    TotalMembers = totalMembers,
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy thống kê người dùng");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<object>(null, "Lỗi nội bộ", StatusCodes.Status500InternalServerError));
            }
        }

        private bool EmailExists(string email)
        {
            try
            {
                // Tạo một kết nối đến hệ thống email server
                using (SmtpClient client = new SmtpClient())
                {
                    client.Host = _configuration["SmtpServer"];
                    client.Port = int.Parse(_configuration["SmtpPort"]);
                    client.Credentials = new NetworkCredential(_configuration["SmtpUsername"], _configuration["SmtpPassword"]);
                    client.EnableSsl = bool.Parse(_configuration["EnableSsl"]);

                    // Tạo một yêu cầu đơn giản để kiểm tra sự tồn tại của email
                    using (MailMessage mailMessage = new MailMessage(_configuration["SenderEmail"], email))
                    {
                        mailMessage.Subject = "Check Email Existence";
                        mailMessage.Body = "This is a test email to check the existence of the email address.";

                        // Gửi yêu cầu và kiểm tra trạng thái
                        client.Send(mailMessage);
                    }

                    return true;
                }
            }
            catch (Exception)
            {
                // Nếu có lỗi, email có thể không tồn tại hoặc có vấn đề khác
                return false;
            }
        }

        private bool EmailExistsData(string email)
        {
            return _dbContext.Users.Any(u => u.Email == email);
        }

        private void ProcessAvatarFile(User user, IFormFile? avatarFile)
        {
            if (avatarFile != null && avatarFile.Length > 0)
            {
                user.Avatar = FileUpload.SaveAvatar(avatarFile);
            }
        }

        private async Task SendResetPasswordEmail(User user, string resetToken)
        {
            var resetUrl = $"https://yourdomain.com/reset-password?email={user.Email}&token={resetToken}";

            var emailBody = $"Click the following link to reset your password: {resetUrl}";
            await _emailService.SendEmailAsync(user.Email, "Reset Password", emailBody);
        }
    }
}
