using Mammooth.Common.Requests.Car;
using Mammooth.Data.Context;
using Mammooth.Data.Entities;
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

        public async Task<(bool Success, string Message)> ApproveRentalRequest(string rentalRequestId)
        {
            var rentalRequest = await _dbContext.RentalRequests.Include(rr => rr.Car).FirstOrDefaultAsync(rr => rr.Id == rentalRequestId);

            if (rentalRequest == null)
            {
                return (false, "Rental request not found.");
            }

            if (rentalRequest.Status != "Pending")
            {
                return (false, "This rental request has already been processed.");
            }

            rentalRequest.Status = "Approved";

            await _dbContext.SaveChangesAsync();
            return (true, "Rental request approved successfully.");
        }

        public async Task<(bool Success, string Message)> RejectRentalRequest(string rentalRequestId)
        {
            var rentalRequest = await _dbContext.RentalRequests.Include(rr => rr.Car).FirstOrDefaultAsync(rr => rr.Id == rentalRequestId);

            if (rentalRequest == null)
            {
                return (false, "Rental request not found.");
            }

            if (rentalRequest.Status != "Pending")
            {
                return (false, "This rental request has already been processed.");
            }

            rentalRequest.Status = "Rejected";

            await _dbContext.SaveChangesAsync();
            return (true, "Rental request rejected successfully.");
        }
    }
}