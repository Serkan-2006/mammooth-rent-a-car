namespace Mammooth.Data.Entities
{
    public class Car
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public required string Brand { get; set; }
        public required string Model { get; set; }
        public int Year { get; set; }
        public int Seats { get; set; }
        public required string Description { get; set; }
        public required string ImageUrl { get; set; }
        public double PricePerDay { get; set; }
        public required ICollection<RentalRequest> RentalRequests { get; set; }
    }
}