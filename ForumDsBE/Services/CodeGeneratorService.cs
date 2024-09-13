public interface ICodeGeneratorService
{
    string GenerateCode();
}

public class CodeGeneratorService : ICodeGeneratorService
{
    public string GenerateCode()
    {
        // Implement your code generation logic, for example, generate a random alphanumeric code
        return Guid.NewGuid().ToString("N").Substring(0, 8);
    }
}
