using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mammooth.Common.Requests.Request;
using Mammooth.Data.Context;
using Mammooth.Data.Entities;
using Mammooth.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Mammooth.Domain.Services
{
    public class RequestService : IRequestService
    {
        private readonly AppDbContext _context;

        public RequestService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Car>> GetAvailableCarsAsync(DateTime startDate, DateTime endDate)
        {
            var unavailableCarIds = await _context.RentalRequests
                .Where(r =>
                    r.Status == "Approved" &&
                    (
                        (startDate >= r.StartDate && startDate <= r.EndDate) ||
                        (endDate >= r.StartDate && endDate <= r.EndDate) ||
                        (r.StartDate >= startDate && r.EndDate <= endDate)
                    )
                )
                .Select(r => r.CarId)
                .ToListAsync();

            var availableCars = await _context.Cars
                .Where(c => !unavailableCarIds.Contains(c.Id))
                .ToListAsync();

            return availableCars;
        }

        public async Task<bool> SubmitRentalRequestAsync(CreateRequestRequest request, string userId)
        {
            var rentalRequest = new RentalRequest
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                CarId = request.CarId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Status = "Pending"
            };

            _context.RentalRequests.Add(rentalRequest);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}