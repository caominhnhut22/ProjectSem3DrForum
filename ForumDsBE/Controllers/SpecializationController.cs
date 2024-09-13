using ForumDs.DTOs;
using ForumDs.Models;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ForumDs.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpecializationController : ControllerBase
    {
        private readonly DatabaseContext _dbContext;

        public SpecializationController(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("getAllSpecializations")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<SpecializationDTO>>> GetSpecializations()
        {
            var user = HttpContext.User;

            // Log or inspect user claims
            var roles = user.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
            Console.WriteLine($"Roles in GetSpecializations: {string.Join(", ", roles)}");

            var specializations = await _dbContext.Specializations
                .Select(s => new SpecializationDTO
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description
                })
                .ToListAsync();

            return Ok(specializations);
        }

        [HttpGet("getSpecializations")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<SpecializationDTO>>> GetSpecializations([FromQuery] int? maxCount = null)
        {
            var user = HttpContext.User;

            // Log or inspect user claims
            var roles = user.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
            Console.WriteLine($"Roles in GetSpecializations: {string.Join(", ", roles)}");

            IQueryable<Specialization> query = _dbContext.Specializations;

            if (maxCount.HasValue)
            {
                query = query.Take(maxCount.Value);
            }

            var specializations = await query
                .Select(s => new SpecializationDTO
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description
                })
                .ToListAsync();

            return Ok(specializations);
        }


        [HttpGet("getSpecilizationById/{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<SpecializationDTO>> GetSpecialization(Guid id)
        {
            var specialization = await _dbContext.Specializations
                .Where(s => s.Id == id)
                .Select(s => new SpecializationDTO
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description
                })
                .FirstOrDefaultAsync();

            if (specialization == null)
            {
                return NotFound();
            }

            return Ok(specialization);
        }

        [HttpPost("createSpecilization")]
        public async Task<ActionResult<SpecializationDTO>> CreateSpecialization([FromBody] CreateSpecializationDTO createSpecializationDTO)
        {
            var validator = new CreateSpecializationDTOValidator();
            var validationResult = await validator.ValidateAsync(createSpecializationDTO);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(error => error.ErrorMessage).ToList());
            }

            var specialization = new Specialization
            {
                Name = createSpecializationDTO.Name,
                Description = createSpecializationDTO.Description
            };

            _dbContext.Specializations.Add(specialization);
            await _dbContext.SaveChangesAsync();

            var specializationDTO = new SpecializationDTO
            {
                Id = specialization.Id,
                Name = specialization.Name,
                Description = specialization.Description
            };

            return CreatedAtAction(nameof(GetSpecialization), new { id = specializationDTO.Id }, specializationDTO);
        }

        [HttpPut("updateSpecilization/{id}")]
        public async Task<IActionResult> UpdateSpecialization(Guid id, [FromBody] UpdateSpecializationDTO updateSpecializationDTO)
        {
            var specialization = await _dbContext.Specializations.FindAsync(id);

            if (specialization == null)
            {
                return NotFound();
            }

            specialization.Name = updateSpecializationDTO.Name;
            specialization.Description = updateSpecializationDTO.Description;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SpecializationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteSpecialization(Guid id)
        //{
        //    var specialization = await _dbContext.Specializations.FindAsync(id);

        //    if (specialization == null)
        //    {
        //        return NotFound();
        //    }

        //    _dbContext.Specializations.Remove(specialization);
        //    await _dbContext.SaveChangesAsync();

        //    return NoContent();
        //}

        private bool SpecializationExists(Guid id)
        {
            return _dbContext.Specializations.Any(e => e.Id == id);
        }
    }
}