using Mammooth.Data.Entities;

public class RentalRequestModel
{
    public string Id { get; set; }
    public string UserName { get; set; }
    public string CarInfo { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; }

    public RentalRequestModel(RentalRequest request, string userName, string carInfo)
    {
        Id = request.Id;
        UserName = userName;
        CarInfo = carInfo;
        StartDate = request.StartDate;
        EndDate = request.EndDate;
        Status = request.Status;
    }
}
