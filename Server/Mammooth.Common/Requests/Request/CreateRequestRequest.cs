using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Mammooth.Common.Requests.Request
{
    public class CreateRequestRequest
    {
        [Required(ErrorMessage = "Start date is required.")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "End date is required.")]
        public DateTime EndDate { get; set; }

        [Required(ErrorMessage = "Car ID is required.")]
        public string CarId { get; set; }

    }
}