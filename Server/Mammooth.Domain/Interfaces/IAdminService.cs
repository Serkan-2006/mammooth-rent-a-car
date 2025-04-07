using Mammooth.Common.DTOs;
using Mammooth.Common.Requests.Car;
using Mammooth.Domain.DTOs;

namespace Mammooth.Domain.Interfaces
{
    public interface IAdminService
    {
        Task<(bool Success, string Message)> AddCar(CreateCarRequest request);
        Task<(bool Success, string Message)> DeleteCar(string id);
        Task<(bool Success, string Message)> UpdateCar(string id, CarUpdateModel carUpdateModel);
        Task<(bool Success, string Message, List<CarAdminPreviewModel> dataRetrieved)> GetAllCarEnqueries();
    }
}