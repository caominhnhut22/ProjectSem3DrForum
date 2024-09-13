using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ForumDs.Models
{

    public class UserVerification
    {
        [ForeignKey("User_id")]
        public Guid User_id { get; set; }
        public User User { get; set; }
        public string VerificationCode { get; set; }
        public DateTime ExpiryDate { get; set; }
    }
}
