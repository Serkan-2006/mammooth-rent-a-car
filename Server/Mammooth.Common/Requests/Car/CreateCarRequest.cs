using System.ComponentModel.DataAnnotations;

namespace Mammooth.Common.Requests.Car
{
    public class CreateCarRequest
    {
        [Required(ErrorMessage = "Brand is required.")]
        [MinLength(2, ErrorMessage = "Brand must be at least 2 characters.")]
        [MaxLength(50, ErrorMessage = "Brand cannot be longer than 50 characters.")]
        public required string Brand { get; set; }

        [Required(ErrorMessage = "Model is required.")]
        [MinLength(2, ErrorMessage = "Model must be at least 2 characters.")]
        [MaxLength(50, ErrorMessage = "Model cannot be longer than 50 characters.")]
        public required string Model { get; set; }

        [Required(ErrorMessage = "Year is required.")]
        [Range(1886, 2025, ErrorMessage = "Year must be between 1886 and 2050.")]
        public int Year { get; set; }
        [Required(ErrorMessage = "Seats is required.")]
        [Range(1886, 2025, ErrorMessage = "Seats must be between 1886 and 2050.")]
        public int Seats { get; set; }
        [Required(ErrorMessage = "Description is required.")]
        [MinLength(5, ErrorMessage = "Description must be at least 5 characters.")]
        [MaxLength(10000, ErrorMessage = "Description cannot be longer than 10000 characters.")]
        public required string Description { get; set; }

        [Required(ErrorMessage = "Price is required.")]
        [Range(100, 1000000, ErrorMessage = "Price must be between 100 and 1,000,000")]
        public double PricePerDay { get; set; }
    }
}