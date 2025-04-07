using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mammooth.Common.Requests.Request;
using Mammooth.Data.Entities;

namespace Mammooth.Domain.Interfaces
{
    public interface IRequestService
    {
        Task<List<Car>> GetAvailableCarsAsync(DateTime startDate, DateTime endDate);
        Task<bool> SubmitRentalRequestAsync(CreateRequestRequest request, string userId);
    }
}