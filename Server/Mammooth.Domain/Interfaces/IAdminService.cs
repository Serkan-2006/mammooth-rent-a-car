using Mammooth.Common.Requests.Car;

namespace Mammooth.Domain.Interfaces
{
    public interface IAdminService
    {
        Task<(bool Success, string Message)> AddCar(CreateCarRequest request);
        Task<(bool Success, string Message)> ApproveRentalRequest(string rentalRequestId);
        Task<(bool Success, string Message)> RejectRentalRequest(string rentalRequestId);
    }
}