using Mammooth.Data.Entities;

namespace Mammooth.Common.DTOs
{
    public class CarAdminPreviewModel
    {
        public string CarId { get; set; }
        public string CarName { get; set; }
        public int Year { get; set; }
        public int Seats { get; set; }
        public string Description { get; set; }
        public double PricePerDay { get; set; }

        public CarAdminPreviewModel(Car car)
        {
            CarId = car.Id;
            CarName = car.Brand + " " + car.Model;
            Year = car.Year;
            Seats = car.Seats;
            Description = car.Description;
            PricePerDay = car.PricePerDay;
        }
    }
}