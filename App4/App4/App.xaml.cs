using App4.Helpers;
using Estimotes;
using Newtonsoft.Json;
using System.Collections.Generic;
using Xamarin.Forms;
using System;
using App4.Data;

namespace App4
{
    public partial class App : Application
    {
        //public static SampleDbConnection Data { get; private set; }
        public static bool IsBackgrounded { get; private set; }
        public static IList<BeaconRegion> Regions { get; } = new List<BeaconRegion> {
            new BeaconRegion("Beacons",  "B9407F30-F5F8-466E-AFF9-25556B57FE6D"),
            new BeaconRegion("test", "B9407F30-F5F8-466E-AFF9-25556B57FE6D")
        };


        public App()
        {
            InitializeComponent();


            //MainPage = new App4.MainPage();

            MainPage = new TabbedPage
            {
                Children = {
                    new MainPage(),
                    new CameraPage(){Title="Light"},
                    new Page2(),
                    new Page4(){Title="Beacon"},
                    new Page3(){Title="Aliens"}


                }
            };


            var obj =  new { device = "app" };
            DependencyService.Get<IFileHelper>().SendStart(obj);
             

        }

        //public static PictureDatabase Database
        //{
        //    get
        //    {
        //        if (database == null)
        //        {
        //            database = new PictureDatabase(DependencyService.Get<IFileHelper>().GetLocalFilePath("PictureSQLite.db3"));
        //        }
        //        return database;
        //    }
        //}

        internal static void StuurBeaconsDoor(string[] b)
        {
            string beacon = b[0];
            string afstand = b[1];
            string json = JsonConvert.SerializeObject(new {beaconId = b[0], range = b[1] });

            DependencyService.Get<IFileHelper>().SendBeacon(json);
        }

        internal static void StuurDataDoor(string text)
        {
            DependencyService.Get<IFileHelper>().SendData(text);
        }



        protected override void OnStart()
        {
            // Handle when your app starts
        }

        protected override void OnSleep()
        {
            // Handle when your app sleeps
        }

        protected override void OnResume()
        {
            // Handle when your app resumes
        }
    }
}
