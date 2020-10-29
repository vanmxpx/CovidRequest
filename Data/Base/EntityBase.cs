using System.ComponentModel.DataAnnotations;

namespace CovidRequest.Data.Base
{
    public class EntityBase
    {
        [Key]
        public long Id { get; set; }
    }
}