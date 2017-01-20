using Acr;
using Estimotes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App4.ViewModels
{
    public class BeaconViewModel : ViewModel
    {

        public BeaconViewModel(IBeacon beacon)
        {
            this.Information = $"{beacon.Proximity}";
            //			this.Information = $"{beacon.Proximity} {beacon.Identifier}";
            this.Details = $"Major: {beacon.Major} - Minor: {beacon.Minor} - ID: {beacon.Uuid}";
        }


        public string Information { get; }
        public string Details { get; }

    }
}
