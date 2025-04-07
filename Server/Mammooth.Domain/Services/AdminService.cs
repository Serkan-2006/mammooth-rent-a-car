using Mammooth.Common.DTOs;
using Mammooth.Common.Requests.Car;
using Mammooth.Data.Context;
using Mammooth.Data.Entities;
using Mammooth.Domain.DTOs;
using Mammooth.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Mammooth.Domain.Services
{
    public class AdminService(AppDbContext dbContext) : IAdminService
    {
        private readonly AppDbContext _dbContext = dbContext;

        public async Task<(bool Success, string Message)> AddCar(CreateCarRequest request)
        {
            if (string.IsNullOrEmpty(request.Brand) || string.IsNullOrEmpty(request.Model))
            {
                return (false, "Car brand and model are required.");
            }

            if (request.Year <= 0 || request.Seats <= 0 || request.PricePerDay <= 0)
            {
                return (false, "Invalid car details provided.");
            }

            Car newCar = new Car
            {
                Brand = request.Brand,
                Model = request.Model,
                Year = request.Year,
                Seats = request.Seats,
                Description = request.Description ?? string.Empty,
                PricePerDay = request.PricePerDay,
                RentalRequests = new List<RentalRequest>()
            };

            _dbContext.Cars.Add(newCar);

            await _dbContext.SaveChangesAsync();

            return (true, "Car added successfully.");
        }
        public async Task<(bool Success, string Message)> DeleteCar(string id)
        {
            var car = await _dbContext.Cars.FindAsync(id);

            if (car == null) return (false, "No car found.");

            _dbContext.Cars.Remove(car);
            await _dbContext.SaveChangesAsync();
            return (true, "Car deleted successfully.");
        }
        public async Task<(bool Success, string Message)> UpdateCar(string id, CarUpdateModel updatedCar)
        {
            var car = await _dbContext.Cars.FindAsync(id);
            if (car == null) return (false, "No car found.");

            car.Brand = updatedCar.CarName;
            // car.Seats = 0;
            // car.Description = updatedCar.Description;
            // car.PricePerDay = updatedCar.PricePerDay;
            car.Year = updatedCar.Year;
            await _dbContext.SaveChangesAsync();
            return (true, "Car updated successfully.");
        }
        public async Task<(bool Success, string Message, List<CarAdminPreviewModel> dataRetrieved)> GetAllCarEnqueries()
        {
            var enqueries = await _dbContext.Cars
                                    .Select(c => new CarAdminPreviewModel(c))
                                    .ToListAsync();

            if (enqueries == null || enqueries.Count == 0)
            {
                return (false, "No car inquiries found.", null);
            }

            return (true, "Car inquiries retrieved successfully.", enqueries);
        }
    }
}