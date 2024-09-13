using FluentValidation;

namespace ForumDs.DTOs
{
    public class SpecializationDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public class CreateSpecializationDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public class UpdateSpecializationDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public class CreateSpecializationDTOValidator : AbstractValidator<CreateSpecializationDTO>
    {
        public CreateSpecializationDTOValidator()
        {
            RuleFor(dto => dto.Name).NotEmpty().MaximumLength(255);
            RuleFor(dto => dto.Description).MaximumLength(1000);
        }
    }

    public class UpdateSpecializationDTOValidator : AbstractValidator<UpdateSpecializationDTO>
    {
        public UpdateSpecializationDTOValidator()
        {
            RuleFor(dto => dto.Name).NotEmpty().MaximumLength(255);
            RuleFor(dto => dto.Description).MaximumLength(1000);
        }
    }
}