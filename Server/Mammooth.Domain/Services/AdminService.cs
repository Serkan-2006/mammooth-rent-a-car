using System.Text.RegularExpressions;
using Mammooth.Common.DTOs;
using Mammooth.Common.Requests.Car;
using Mammooth.Common.Requests.User;
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
                ImageUrl = request.ImageUrl,
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

            car.Brand = updatedCar.Brand;
            car.Model = updatedCar.Model;
            car.Year = updatedCar.Year;
            car.Seats = updatedCar.Seats;
            car.PricePerDay = updatedCar.PricePerDay;
            car.ImageUrl = updatedCar.ImageUrl;
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
        public async Task<(bool Success, string Message)> AddUser(CreateUserRequest request)
        {
            if (string.IsNullOrEmpty(request.FirstName) || string.IsNullOrEmpty(request.LastName))
            {
                return (false, "First name and last name are required.");
            }

            if (string.IsNullOrEmpty(request.CitizenId))
            {
                return (false, "Citizen ID is required");
            }

            if (string.IsNullOrWhiteSpace(request.PhoneNumber) || !Regex.IsMatch(request.PhoneNumber, @"^\d+$"))
            {
                return (false, "Phone number is required and must contain only digits.");
            }

            if (string.IsNullOrWhiteSpace(request.Email) ||
                    !Regex.IsMatch(request.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            {
                return (false, "A valid email address is required.");
            }


            User newUser = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                CitizenId = request.CitizenId,
                PhoneNumber = request.PhoneNumber,
                UserName = request.UserName,
                NormalizedUserName = request.UserName.ToUpper(),
                Email = request.Email,
                NormalizedEmail = request.Email.ToUpper(),
            };

            _dbContext.Users.Add(newUser);

            await _dbContext.SaveChangesAsync();

            return (true, "User added successfully.");
        }
        public async Task<(bool Success, string Message)> DeleteUser(string id)
        {
            var user = await _dbContext.Users.FindAsync(id);

            if (user == null) return (false, "No user found.");

            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();
            return (true, "User deleted successfully.");
        }
        public async Task<(bool Success, string Message)> UpdateUser(string id, UserUpdateModel updatedUser)
        {
            var user = await _dbContext.Users.FindAsync(id);
            if (user == null) return (false, "No user found.");

            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.CitizenId = updatedUser.CitizenId;
            user.PhoneNumber = updatedUser.PhoneNumber;
            user.UserName = updatedUser.UserName;
            user.NormalizedUserName = updatedUser.UserName.ToUpper();
            user.Email = updatedUser.Email;
            user.NormalizedEmail = updatedUser.Email.ToUpper();
            await _dbContext.SaveChangesAsync();
            return (true, "User updated successfully.");
        }
        public async Task<(bool Success, string Message, List<UserAdminPreviewModel> dataRetrieved)> GetAllUserEnqueries()
        {
            var enqueries = await _dbContext.Users
                                    .Select(c => new UserAdminPreviewModel(c))
                                    .ToListAsync();

            if (enqueries == null || enqueries.Count == 0)
            {
                return (false, "No user inquiries found.", null);
            }

            return (true, "User inquiries retrieved successfully.", enqueries);
        }

        public async Task<(bool Success, string Message, List<RentalRequestModel> dataRetrieved)> GetAllRentalRequests()
        {
            var requests = await _dbContext.RentalRequests.ToListAsync();

            if (!requests.Any())
                return (false, "No rental requests found.", null);

            var rentalModels = new List<RentalRequestModel>();

            foreach (var request in requests)
            {
                var user = await _dbContext.Users.FindAsync(request.UserId);
                var car = await _dbContext.Cars.FindAsync(request.CarId);

                if (user == null || car == null) continue;

                rentalModels.Add(new RentalRequestModel(
                    request,
                    user.UserName,
                    $"{car.Brand} {car.Model}"
                ));
            }

            return (true, "Rental requests retrieved successfully.", rentalModels);
        }

        public async Task<(bool Success, string Message)> ApproveRentalRequest(string requestId)
        {
            var request = await _dbContext.RentalRequests.FindAsync(requestId);

            if (request == null)
                return (false, "Rental request not found.");

            if (request.Status == "Approved")
                return (false, "Request already approved.");

            request.Status = "Approved";
            _dbContext.RentalRequests.Update(request);
            await _dbContext.SaveChangesAsync();

            return (true, "Rental request approved successfully.");
        }        
    }
}