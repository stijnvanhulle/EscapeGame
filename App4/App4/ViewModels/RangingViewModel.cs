using Acr;
using Acr.UserDialogs;
using Estimotes;
using Java.Lang;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App4.ViewModels
{
    public class RangingViewModel : LifecycleViewModel
    {

        static string[] json = new string[3];

        public override void OnStart()
        {
            this.List = new List<BeaconViewModel>();
            base.OnStart();
        }


        public override async void OnActivate()
        {
            base.OnActivate();
            this.List.Clear();
            this.OnPropertyChanged("List");

            EstimoteManager.Instance.Ranged += this.OnRanged;
            var status = await EstimoteManager.Instance.Initialize();
            if (status != BeaconInitStatus.Success)
                UserDialogs.Instance.Alert($"Beacon functionality failed - {status}");

            else
            {
                foreach (var region in App.Regions)
                    EstimoteManager.Instance.StartRanging(region);
            }
        }


        public override void OnDeactivate()
        {
            base.OnDeactivate();
            EstimoteManager.Instance.Ranged -= this.OnRanged;
            EstimoteManager.Instance.StopAllRanging();
        }

        public void GetBeaconData()
        {
            OnStart();
        }



        void OnRanged(object sender, IEnumerable<IBeacon> beacons)
        {
            try
            {

                var list = new List<BeaconViewModel>();
                int i = 0;
                foreach (var beacon in beacons)
                {
                    list.Add(new BeaconViewModel(beacon));
                    int proximity;
                    string[] b = new string[2];
                    if (beacon.Major == 57413)
                    {
                        b[0] = "Paars";
                        proximity = Convert.ToInt32(beacon.Proximity);
                        b[1] = Convert.ToString(proximity);
                    }
                    else if (beacon.Major == 30185)
                    {
                        b[0] = "Blauw";
                        proximity = Convert.ToInt32(beacon.Proximity);
                        b[1] = Convert.ToString(proximity);
                    }
                    else if (beacon.Major == 32408)
                    {
                        b[0] = "Groen";
                        proximity = Convert.ToInt32(beacon.Proximity);
                        b[1] = Convert.ToString(proximity);
                    }

                        json[i] = JsonConvert.SerializeObject(new { type = "beacon", beaconId = b[0], range = b[1] });
                        i++;


                    App.StuurBeaconsDoor(b);

                }

                this.List = list;
                this.OnPropertyChanged("List");

            }
            catch(Java.Lang.Exception e)
            {
                string message = e.Message;
            }
        }

        public IList<BeaconViewModel> List { get; private set; }
    }
}
