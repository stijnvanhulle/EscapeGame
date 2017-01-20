﻿using System;
using System.Threading.Tasks;
using Windows.Devices.Bluetooth.Advertisement;
using UniversalBeaconLibrary.Beacon;


namespace Estimotes {

    public class BeaconManagerImpl : AbstractBeaconManagerImpl {
        readonly BluetoothLEAdvertisementWatcher watcher;
        readonly BeaconManager beaconMgr;


        public override Task<BeaconInitStatus> Initialize(bool backgroundMonitoring) {
            return Task.FromResult(BeaconInitStatus.Unknown);
        }


        protected override void StartRangingNative(BeaconRegion region) {}
        protected override void StopRangingNative(BeaconRegion region) {}
        protected override void StartMonitoringNative(BeaconRegion region) {}
        protected override void StopMonitoringNative(BeaconRegion region) {}
        public override void StartEddystoneScanNative(IEddystoneFilter filter) {}
        public override void StopEddystoneScanNative(IEddystoneFilter filter) {}
        //public override void StartNearableDiscovery() {}
        //public override void StopNearableDiscovery() {}


        //https://github.com/Microsoft/Windows-universal-samples/tree/master/Samples/BluetoothAdvertisement/cs
        public BeaconManagerImpl() {
            this.beaconMgr = new BeaconManager();
            this.beaconMgr.BluetoothBeacons.CollectionChanged += (sender, args) => { };

            this.watcher = new BluetoothLEAdvertisementWatcher();
            this.watcher.Received += (sender, args) => this.beaconMgr.ReceivedAdvertisement(args);

// Begin of watcher configuration. Configure the advertisement filter to look for the data advertised by the publisher
            // in Scenario 2 or 4. You need to run Scenario 2 on another Windows platform within proximity of this one for Scenario 1 to
            // take effect. The APIs shown in this Scenario are designed to operate only if the App is in the foreground. For background
            // watcher operation, please refer to Scenario 3.

            // Please comment out this following section (watcher configuration) if you want to remove all filters. By not specifying
            // any filters, all advertisements received will be notified to the App through the event handler. You should comment out the following
            // section if you do not have another Windows platform to run Scenario 2 alongside Scenario 1 or if you want to scan for
            // all LE advertisements around you.

            // For determining the filter restrictions programatically across APIs, use the following properties:
            //      MinSamplingInterval, MaxSamplingInterval, MinOutOfRangeTimeout, MaxOutOfRangeTimeout

            // Part 1A: Configuring the advertisement filter to watch for a particular advertisement payload

            // First, let create a manufacturer data section we wanted to match for. These are the same as the one
            // created in Scenario 2 and 4.
            //var manufacturerData = new BluetoothLEManufacturerData();

            //// Then, set the company ID for the manufacturer data. Here we picked an unused value: 0xFFFE
            //manufacturerData.CompanyId = 0xFFFE;

            //// Finally set the data payload within the manufacturer-specific section
            //// Here, use a 16-bit UUID: 0x1234 -> {0x34, 0x12} (little-endian)
            //var writer = new DataWriter();
            //writer.WriteUInt16(0x1234);

            //// Make sure that the buffer length can fit within an advertisement payload. Otherwise you will get an exception.
            //manufacturerData.Data = writer.DetachBuffer();

            //// Add the manufacturer data to the advertisement filter on the watcher:
            //watcher.AdvertisementFilter.Advertisement.ManufacturerData.Add(manufacturerData);


            //// Part 1B: Configuring the signal strength filter for proximity scenarios

            //// Configure the signal strength filter to only propagate events when in-range
            //// Please adjust these values if you cannot receive any advertisement
            //// Set the in-range threshold to -70dBm. This means advertisements with RSSI >= -70dBm
            //// will start to be considered "in-range".
            //watcher.SignalStrengthFilter.InRangeThresholdInDBm = -70;

            //// Set the out-of-range threshold to -75dBm (give some buffer). Used in conjunction with OutOfRangeTimeout
            //// to determine when an advertisement is no longer considered "in-range"
            //watcher.SignalStrengthFilter.OutOfRangeThresholdInDBm = -75;

            //// Set the out-of-range timeout to be 2 seconds. Used in conjunction with OutOfRangeThresholdInDBm
            //// to determine when an advertisement is no longer considered "in-range"
            //watcher.SignalStrengthFilter.OutOfRangeTimeout = TimeSpan.FromMilliseconds(2000);

            // By default, the sampling interval is set to zero, which means there is no sampling and all
            // the advertisement received is returned in the Received event
        }
    }
}
/*
  // The timestamp of the event
            DateTimeOffset timestamp = eventArgs.Timestamp;

            // The type of advertisement
            BluetoothLEAdvertisementType advertisementType = eventArgs.AdvertisementType;

            // The received signal strength indicator (RSSI)
            Int16 rssi = eventArgs.RawSignalStrengthInDBm;

            // The local name of the advertising device contained within the payload, if any
            string localName = eventArgs.Advertisement.LocalName;

            // Check if there are any manufacturer-specific sections.
            // If there is, print the raw data of the first manufacturer section (if there are multiple).
            string manufacturerDataString = "";
            var manufacturerSections = eventArgs.Advertisement.ManufacturerData;
            if (manufacturerSections.Count > 0)
            {
                // Only print the first one of the list
                var manufacturerData = manufacturerSections[0];
                var data = new byte[manufacturerData.Data.Length];
                using (var reader = DataReader.FromBuffer(manufacturerData.Data))
                {
                    reader.ReadBytes(data);
                }
                // Print the company ID + the raw data in hex format
                manufacturerDataString = string.Format("0x{0}: {1}",
                    manufacturerData.CompanyId.ToString("X"),
                    BitConverter.ToString(data));
            }

*/



    /*

using System;
using System.Collections.Generic;
using Windows.Storage;
using Windows.Storage.Streams;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Navigation;

using Windows.ApplicationModel.Background;
using Windows.Devices.Bluetooth.Advertisement;
using Windows.Devices.Bluetooth.Background;

using SDKTemplate;

namespace BluetoothAdvertisement
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class Scenario3_BackgroundWatcher : Page
    {
        // The background task registration for the background advertisement watcher
        private IBackgroundTaskRegistration taskRegistration;
        // The watcher trigger used to configure the background task registration
        private BluetoothLEAdvertisementWatcherTrigger trigger;
        // A name is given to the task in order for it to be identifiable across context.
        private string taskName = "Scenario3_BackgroundTask";
        // Entry point for the background task.
        private string taskEntryPoint = "BackgroundTasks.AdvertisementWatcherTask";

        // A pointer back to the main page is required to display status messages.
        private MainPage rootPage;

        /// <summary>
        /// Initializes the singleton application object.  This is the first line of authored code
        /// executed, and as such is the logical equivalent of main() or WinMain().
        /// </summary>
        public Scenario3_BackgroundWatcher()
        {
            this.InitializeComponent();

            // Create and initialize a new trigger to configure it.
            trigger = new BluetoothLEAdvertisementWatcherTrigger();

            // Configure the advertisement filter to look for the data advertised by the publisher in Scenario 2 or 4.
            // You need to run Scenario 2 on another Windows platform within proximity of this one for Scenario 3 to
            // take effect.

            // Unlike the APIs in Scenario 1 which operate in the foreground. This API allows the developer to register a background
            // task to process advertisement packets in the background. It has more restrictions on valid filter configuration.
            // For example, exactly one single matching filter condition is allowed (no more or less) and the sampling interval

            // For determining the filter restrictions programatically across APIs, use the following properties:
            //      MinSamplingInterval, MaxSamplingInterval, MinOutOfRangeTimeout, MaxOutOfRangeTimeout

            // Part 1A: Configuring the advertisement filter to watch for a particular advertisement payload

            // First, let create a manufacturer data section we wanted to match for. These are the same as the one
            // created in Scenario 2 and 4. Note that in the background only a single filter pattern is allowed per trigger.
            var manufacturerData = new BluetoothLEManufacturerData();

            // Then, set the company ID for the manufacturer data. Here we picked an unused value: 0xFFFE
            manufacturerData.CompanyId = 0xFFFE;

            // Finally set the data payload within the manufacturer-specific section
            // Here, use a 16-bit UUID: 0x1234 -> {0x34, 0x12} (little-endian)
            DataWriter writer = new DataWriter();
            writer.WriteUInt16(0x1234);

            // Make sure that the buffer length can fit within an advertisement payload. Otherwise you will get an exception.
            manufacturerData.Data = writer.DetachBuffer();

            // Add the manufacturer data to the advertisement filter on the trigger:
            trigger.AdvertisementFilter.Advertisement.ManufacturerData.Add(manufacturerData);

            // Part 1B: Configuring the signal strength filter for proximity scenarios

            // Configure the signal strength filter to only propagate events when in-range
            // Please adjust these values if you cannot receive any advertisement
            // Set the in-range threshold to -70dBm. This means advertisements with RSSI >= -70dBm
            // will start to be considered "in-range".
            trigger.SignalStrengthFilter.InRangeThresholdInDBm = -70;

            // Set the out-of-range threshold to -75dBm (give some buffer). Used in conjunction with OutOfRangeTimeout
            // to determine when an advertisement is no longer considered "in-range"
            trigger.SignalStrengthFilter.OutOfRangeThresholdInDBm = -75;

            // Set the out-of-range timeout to be 2 seconds. Used in conjunction with OutOfRangeThresholdInDBm
            // to determine when an advertisement is no longer considered "in-range"
            trigger.SignalStrengthFilter.OutOfRangeTimeout = TimeSpan.FromMilliseconds(2000);

            // By default, the sampling interval is set to be disabled, or the maximum sampling interval supported.
            // The sampling interval set to MaxSamplingInterval indicates that the event will only trigger once after it comes into range.
            // Here, set the sampling period to 1 second, which is the minimum supported for background.
            trigger.SignalStrengthFilter.SamplingInterval = TimeSpan.FromMilliseconds(1000);
        }

        /// <summary>
        /// Invoked when this page is about to be displayed in a Frame.
        ///
        /// We will enable/disable parts of the UI if the device doesn't support it.
        /// </summary>
        /// <param name="eventArgs">Event data that describes how this page was reached. The Parameter
        /// property is typically used to configure the page.</param>
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            rootPage = MainPage.Current;

            // Get the existing task if already registered
            if (taskRegistration == null)
            {
                // Find the task if we previously registered it
                foreach (var task in BackgroundTaskRegistration.AllTasks.Values)
                {
                    if (task.Name == taskName)
                    {
                        taskRegistration = task;
                        taskRegistration.Completed += OnBackgroundTaskCompleted;
                        break;
                    }
                }
            }
            else
            {
                taskRegistration.Completed += OnBackgroundTaskCompleted;
            }

            // Attach handlers for suspension to stop the watcher when the App is suspended.
            App.Current.Suspending += App_Suspending;
            App.Current.Resuming += App_Resuming;

            rootPage.NotifyUser("Press Run to register watcher.", NotifyType.StatusMessage);
        }

        /// <summary>
        /// Invoked immediately before the Page is unloaded and is no longer the current source of a parent Frame.
        /// </summary>
        /// <param name="e">
        /// Event data that can be examined by overriding code. The event data is representative
        /// of the navigation that will unload the current Page unless canceled. The
        /// navigation can potentially be canceled by setting Cancel.
        /// </param>
        protected override void OnNavigatingFrom(NavigatingCancelEventArgs e)
        {
            // Remove local suspension handlers from the App since this page is no longer active.
            App.Current.Suspending -= App_Suspending;
            App.Current.Resuming -= App_Resuming;

            // Since the watcher is registered in the background, the background task will be triggered when the App is closed
            // or in the background. To unregister the task, press the Stop button.
            if (taskRegistration != null)
            {
                // Always unregister the handlers to release the resources to prevent leaks.
                taskRegistration.Completed -= OnBackgroundTaskCompleted;
            }
            base.OnNavigatingFrom(e);
        }

        /// <summary>
        /// Invoked when application execution is being suspended.  Application state is saved
        /// without knowing whether the application will be terminated or resumed with the contents
        /// of memory still intact.
        /// </summary>
        /// <param name="sender">The source of the suspend request.</param>
        /// <param name="e">Details about the suspend request.</param>
        private void App_Suspending(object sender, Windows.ApplicationModel.SuspendingEventArgs e)
        {
            if (taskRegistration != null)
            {
                // Always unregister the handlers to release the resources to prevent leaks.
                taskRegistration.Completed -= OnBackgroundTaskCompleted;
            }
            rootPage.NotifyUser("App suspending.", NotifyType.StatusMessage);
        }

        /// <summary>
        /// Invoked when application execution is being resumed.
        /// </summary>
        /// <param name="sender">The source of the resume request.</param>
        /// <param name="e"></param>
        private void App_Resuming(object sender, object e)
        {
            // Get the existing task if already registered
            if (taskRegistration == null)
            {
                // Find the task if we previously registered it
                foreach (var task in BackgroundTaskRegistration.AllTasks.Values)
                {
                    if (task.Name == taskName)
                    {
                        taskRegistration = task;
                        taskRegistration.Completed += OnBackgroundTaskCompleted;
                        break;
                    }
                }
            }
            else
            {
                taskRegistration.Completed += OnBackgroundTaskCompleted;
            }
        }

        /// <summary>
        /// Invoked as an event handler when the Run button is pressed.
        /// </summary>
        /// <param name="sender">Instance that triggered the event.</param>
        /// <param name="e">Event data describing the conditions that led to the event.</param>
        private async void RunButton_Click(object sender, RoutedEventArgs e)
        {
            // Registering a background trigger if it is not already registered. It will start background scanning.
            // First get the existing tasks to see if we already registered for it
            if (taskRegistration != null)
            {
                rootPage.NotifyUser("Background watcher already registered.", NotifyType.StatusMessage);
                return;
            }
            else
            {
                // Applications registering for background trigger must request for permission.
                BackgroundAccessStatus backgroundAccessStatus = await BackgroundExecutionManager.RequestAccessAsync();
                // Here, we do not fail the registration even if the access is not granted. Instead, we allow
                // the trigger to be registered and when the access is granted for the Application at a later time,
                // the trigger will automatically start working again.

                // At this point we assume we haven't found any existing tasks matching the one we want to register
                // First, configure the task entry point, trigger and name
                var builder = new BackgroundTaskBuilder();
                builder.TaskEntryPoint = taskEntryPoint;
                builder.SetTrigger(trigger);
                builder.Name = taskName;

                // Now perform the registration. The registration can throw an exception if the current
                // hardware does not support background advertisement offloading
                try
                {
                    taskRegistration = builder.Register();

                    // For this scenario, attach an event handler to display the result processed from the background task
                    taskRegistration.Completed += OnBackgroundTaskCompleted;

                    // Even though the trigger is registered successfully, it might be blocked. Notify the user if that is the case.
                    if ((backgroundAccessStatus == BackgroundAccessStatus.Denied) || (backgroundAccessStatus == BackgroundAccessStatus.Unspecified))
                    {
                        rootPage.NotifyUser("Not able to run in background. Application must given permission to be added to lock screen.",
                            NotifyType.ErrorMessage);
                    }
                    else
                    {
                        rootPage.NotifyUser("Background watcher registered.", NotifyType.StatusMessage);
                    }
                }
                catch (Exception ex)
                {
                    switch ((uint)ex.HResult)
                    {
                        case (0x80070032): // ERROR_NOT_SUPPORTED
                            rootPage.NotifyUser("The hardware does not support background advertisement offload.", NotifyType.ErrorMessage);
                            break;
                        default:
                            throw ex;
                    }
                }
            }
        }

        /// <summary>
        /// Invoked as an event handler when the Stop button is pressed.
        /// </summary>
        /// <param name="sender">Instance that triggered the event.</param>
        /// <param name="e">Event data describing the conditions that led to the event.</param>
        private void StopButton_Click(object sender, RoutedEventArgs e)
        {
            // Unregistering the background task will stop scanning if this is the only client requesting scan
            // First get the existing tasks to see if we already registered for it
            if (taskRegistration != null)
            {
                taskRegistration.Unregister(true);
                taskRegistration = null;
                rootPage.NotifyUser("Background watcher unregistered.", NotifyType.StatusMessage);
            }
            else
            {
                // At this point we assume we haven't found any existing tasks matching the one we want to unregister
                rootPage.NotifyUser("No registered background watcher found.", NotifyType.StatusMessage);
            }
        }

        /// <summary>
        /// Handle background task completion.
        /// </summary>
        /// <param name="task">The task that is reporting completion.</param>
        /// <param name="e">Arguments of the completion report.</param>
        private async void OnBackgroundTaskCompleted(BackgroundTaskRegistration task, BackgroundTaskCompletedEventArgs eventArgs)
        {
            // We get the advertisement(s) processed by the background task
            if (ApplicationData.Current.LocalSettings.Values.Keys.Contains(taskName))
            {
                string backgroundMessage = (string) ApplicationData.Current.LocalSettings.Values[taskName];
                // Serialize UI update to the main UI thread
                await this.Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
                {
                    // Display these information on the list
                    ReceivedAdvertisementListBox.Items.Add(backgroundMessage);
                });
            }
        }
    }
}
Status API Training Shop Blog About Help
© 2015 GitHub, Inc. Terms Privacy Security Contact
    */