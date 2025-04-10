using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mammooth.Domain.DTOs
{
    public class CarUpdateModel
    {
        public string Brand { get; set; }
        public string Model { get; set; }
        public int Year { get; set; }
        public int Seats { get; set; }
        public double PricePerDay { get; set; }
    }
}