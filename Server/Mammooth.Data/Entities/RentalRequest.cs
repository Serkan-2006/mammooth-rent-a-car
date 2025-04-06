namespace Mammooth.Data.Entities
{
    public class RentalRequest
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public int UserId { get; set; }
        public required User User { get; set; }
        public int CarId { get; set; }
        public required Car Car { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public required string Status { get; set; }  // Pending, Approved, Rejected
    }
}