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
            this.CarId = car.Id;
            this.CarName = car.Brand + " " + car.Model;
            this.Year = car.Year;
            this.Seats = car.Seats;
            this.Description = car.Description;
            this.PricePerDay = car.PricePerDay;
        }
    }
}