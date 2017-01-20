using System;
using System.Linq;
using System.Threading.Tasks;
using CoreLocation;
using Foundation;
using UIKit;
using Estimote;


namespace Estimotes {

    public class BeaconManagerImpl : AbstractBeaconManagerImpl {
        readonly BeaconManager beaconManager;
//        readonly NearableManager nearableManager;
        readonly EddystoneManager eddystoneManager;


        public BeaconManagerImpl() {
            this.beaconManager = new BeaconManager {
                ReturnAllRangedBeaconsAtOnce = true
            };
            this.beaconManager.EnteredRegion += (sender, args) => {
                var region = this.FromNative(args.Region);
                this.OnRegionStatusChanged(region, true);
            };
            this.beaconManager.ExitedRegion += (sender, args) => {
                var region = this.FromNative(args.Region);
                this.OnRegionStatusChanged(region, false);
            };
            this.beaconManager.RangedBeacons += (sender, args) => {
                var beacons = args.Beacons.Select(x => new Beacon(x));
                this.OnRanged(beacons);
            };

			this.eddystoneManager = new EddystoneManager();
			this.eddystoneManager.Init();
			this.eddystoneManager.DiscoveredEddystones += (sender, args) => {
				var eddystones = args.Eddystones.Select(x => new Eddystone(x));
				this.OnEddystone(eddystones);
			};

            // TODO
//			this.nearableManager = new NearableManager();
//			this.nearableManager.Init ();
//            this.nearableManager.EnteredIdentifierRegion += (sender, args) => { };
//            this.nearableManager.ExitedIdentifierRegion += (sender, args) => { };
        }



        public override async Task<BeaconInitStatus> Initialize(bool backgroundMonitoring) {
            if (!UIDevice.CurrentDevice.CheckSystemVersion(7, 0))
                return BeaconInitStatus.InvalidOperatingSystem;

            if (!CLLocationManager.LocationServicesEnabled)
                return BeaconInitStatus.LocationServicesDisabled;


//			if (UIApplication.SharedApplication.BackgroundRefreshStatus != UIBackgroundRefreshStatus.Denied)
//				return;
            //if (!CLLocationManager.IsMonitoringAvailable())
            //CLLocationManager.IsRangingAvailable
//            var btstatus = this.GetBluetoothStatus();
//            if (btstatus != BeaconInitStatus.Success)
//                return btstatus;

            var good = this.IsGoodStatus(BeaconManager.AuthorizationStatus, backgroundMonitoring);
            if (good)
                return BeaconInitStatus.Success;

			var tcs = new TaskCompletionSource<BeaconInitStatus>();
            var funcPnt = new EventHandler<AuthorizationStatusChangedEventArgs>((sender, args) => {
				if (args.Status == CLAuthorizationStatus.NotDetermined)
					return; // not done yet

				var success = this.IsGoodStatus(args.Status, backgroundMonitoring);
                tcs.TrySetResult(success ? BeaconInitStatus.Success : BeaconInitStatus.PermissionDenied);
			});
			this.beaconManager.AuthorizationStatusChanged += funcPnt;
            if (backgroundMonitoring)
			    this.beaconManager.RequestAlwaysAuthorization();
            else
                this.beaconManager.RequestWhenInUseAuthorization();

			var status = await tcs.Task;
			this.beaconManager.AuthorizationStatusChanged -= funcPnt;

            return status;
        }


//        protected virtual BeaconInitStatus GetBluetoothStatus() {
//            using (var cb = new CBCentralManager()) {
//				cb.
//                switch (cb.State) {
//                    case CBCentralManagerState.Unauthorized: return BeaconInitStatus.PermissionDenied;
//                    case CBCentralManagerState.Unsupported: return BeaconInitStatus.BluetoothMissing;
//                    case CBCentralManagerState.PoweredOn: return BeaconInitStatus.Success;
//                    case CBCentralManagerState.PoweredOff: return BeaconInitStatus.BluetoothOff;
//                    default : return BeaconInitStatus.Unknown;
//                }
//            }
//        }


        protected virtual bool IsGoodStatus(CLAuthorizationStatus status, bool forBg) {
            if (forBg)
                return status == CLAuthorizationStatus.AuthorizedAlways;

			return (
			    status == CLAuthorizationStatus.Authorized ||
			    status == CLAuthorizationStatus.AuthorizedAlways ||
			    status == CLAuthorizationStatus.AuthorizedWhenInUse
			);
		}


        public override void StartEddystoneScanNative(IEddystoneFilter filter) {
			var native = this.ToNative(filter);
			this.eddystoneManager.StartEddystoneDiscovery(native);
        }


		public override void StopEddystoneScanNative(IEddystoneFilter filter) {
			var native = this.ToNative(filter);
			this.eddystoneManager.StopEddystoneDiscovery(native);
        }


//        public override void StartNearableDiscovery() {
//            this.nearableManager.StartRangingForType(NearableType.All);
//        }
//
//
//        public override void StopNearableDiscovery() {
//            this.nearableManager.StopRanging();
//        }


        protected override void StartMonitoringNative(BeaconRegion region) {
			var native = this.ToNative(region);
            this.beaconManager.StartMonitoringForRegion(native);
        }


        protected override void StartRangingNative(BeaconRegion region) {
            var native = this.ToNative(region);
            this.beaconManager.StartRangingBeaconsInRegion(native);
        }


		protected override void StopMonitoringNative(BeaconRegion region) {
			var native = this.ToNative(region);
            this.beaconManager.StopMonitoringForRegion(native);
        }


        protected override void StopRangingNative(BeaconRegion region) {
            var native = this.ToNative(region);
            this.beaconManager.StopRangingBeaconsInRegion(native);
        }


		protected virtual BeaconRegion FromNative(CLBeaconRegion native) {
			return new BeaconRegion(
				native.Identifier,
				native.ProximityUuid.AsString(),
				native.Major?.UInt16Value,
				native.Minor?.UInt16Value
			);
        }


		protected virtual Estimote.EddystoneFilter ToNative(IEddystoneFilter filter) {
			var uid = filter as EddystoneUidFilter;
			if (uid != null) {
				var nid = uid.InstanceId == null
					? new EddystoneUID(uid.Namespace)
					: new EddystoneUID(uid.Namespace, uid.InstanceId);
				return new Estimote.EddystoneFilterUID(nid);
			}
			var url = (EddystoneUrlFilter)filter;
			if (url.IsDomain)
				return new Estimote.EddystoneFilterUrlDomain(url.Url);

			return new Estimote.EddystoneFilterUrl(url.Url);
		}


//		protected virtual IEddystoneFilter FromNative(Estimote.EddystoneFilter filter) {
//			if (filter == null)
//				return null;
//
//			var uid = filter as EddystoneFilterUID;
//			if (uid != null)
//				return new EddystoneUidFilter(uid.EddystoneUID.NamespaceID, uid.EddystoneUID.InstanceID);
//
//			var url = filter as EddystoneFilterUrl;
//			if (url != null)
//				return new EddystoneUrlFilter(url.EddystoneUrl, false);
//
//			var dom = filter as EddystoneFilterUrlDomain;
//			if (dom != null)
//				return new EddystoneUrlFilter(url.EddystoneUrl, true);
//
//			throw new ArgumentException("Invalid eddystone filter");
//		}


        protected virtual CLBeaconRegion ToNative(BeaconRegion region) {
			var uuid = new NSUuid(region.Uuid);
			CLBeaconRegion native = null;

			if (region.Major > 0 && region.Minor > 0)
				native = new CLBeaconRegion(uuid, region.Major.Value, region.Minor.Value, region.Identifier);

			else if (region.Major > 0)
				native = new CLBeaconRegion(uuid, region.Major.Value, region.Identifier);

			else
				native = new CLBeaconRegion(uuid, region.Identifier);

			native.NotifyEntryStateOnDisplay = true;
			native.NotifyOnEntry = true;
			native.NotifyOnExit = true;

			return native;
        }
    }
}