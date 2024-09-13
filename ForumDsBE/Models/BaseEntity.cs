using System.ComponentModel.DataAnnotations;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace ForumDs.Models
{
    public class BaseEntity
    {
        [Key]
        public Guid Id { get; set; }
    }
}