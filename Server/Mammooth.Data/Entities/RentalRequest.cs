namespace Mammooth.Data.Entities
{
    public class RentalRequest
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; }
        public string CarId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public required string Status { get; set; }  // Pending, Approved, Rejected

    }
}