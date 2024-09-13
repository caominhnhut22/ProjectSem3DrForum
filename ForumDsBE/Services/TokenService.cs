using ForumDs.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ForumDs.Services
{
    public class TokenService
    {
        public static string GenerateJSONWebToken(IConfiguration configuration, User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var expirationTime = DateTime.Now.AddMinutes(60);

            var claims = new[]
            {
                new Claim("UserId", user.Id.ToString()),
                new Claim("Email", user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("Role", user.Role),
                new Claim("Name", user.Name),
                new Claim("Status", user.Status.ToString()),
                new Claim("Specialization_id", user.Specialization_id.ToString()),
                new Claim("exp", expirationTime.ToString("yyyy-MM-ddTHH:mm:ss"))
            };

            var token = new JwtSecurityToken(configuration["Jwt:Issuer"],
                configuration["Jwt:Audience"],
                claims,
                expires: expirationTime,
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
