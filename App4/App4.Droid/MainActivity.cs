using System;

using Android.App;
using Android.Content.PM;
using Android.Views;
using Android.OS;
using Plugin.Media;
using Quobject.SocketIoClientDotNet.Client;
using Newtonsoft.Json;
using Estimotes;
using Quobject.EngineIoClientDotNet.ComponentEmitter;
using App4.Models;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace App4.Droid
{
    [Activity(Label = "App4", Icon = "@drawable/icon", Theme = "@style/MainTheme", MainLauncher = true, ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation)]
    public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsAppCompatActivity
    {
        public static object Game;
        public static object eventData;
        public static List<string> letteren = new List<string>();
        public static Socket socket;
        
        IMenuItem _refreshItem;


        protected override async void OnCreate(Bundle bundle)
        {
            TabLayoutResource = Resource.Layout.Tabbar;
            ToolbarResource = Resource.Layout.Toolbar;

            base.OnCreate(bundle);

            await CrossMedia.Current.Initialize();

            Console.WriteLine("test main");
            global::Xamarin.Forms.Forms.Init(this, bundle);
            LoadApplication(new App());

            
            Beacon();
            
        }

        
        #region Beacon

        private async void Beacon()
        {
            var status = await EstimoteManager.Instance.Initialize(); // optionally pass false to authorize foreground ranging only
            if (status != BeaconInitStatus.Success)
            {
                Console.WriteLine("You have a problem with permissions or bluetooth is unavailable on the device, use the enum to figure out what!");
                return;
            }

            EstimoteManager.Instance.Ranged += (sender, beacons) => { };
            EstimoteManager.Instance.RegionStatusChanged += (sender, region) => { };

            // for exact distancing, use ranging - requires your app to be in the foreground
            EstimoteManager.Instance.StartRanging(new BeaconRegion("Beacon Identifier", "B9407F30-F5F8-466E-AFF9-25556B57FE6D"));
            EstimoteManager.Instance.StopRanging(new BeaconRegion("Beacon Identifier", "B9407F30-F5F8-466E-AFF9-25556B57FE6D"));

            // for background monitoring when you don't care about actual distance
            EstimoteManager.Instance.StartMonitoring(new BeaconRegion("Beacon Identifier", "B9407F30-F5F8-466E-AFF9-25556B57FE6D"));
            EstimoteManager.Instance.StopMonitoring(new BeaconRegion("Beacon Identifier", "B9407F30-F5F8-466E-AFF9-25556B57FE6D"));
            
            //Page4.BeaconStuff(aantal);

        }

        #endregion


        public MainActivity()
        {
            if (socket == null)
                StartSocket();
        }

        #region sockets

        private void StartSocket()
        {
            String URL = "http://192.168.1.1:3000/";
            if (MainActivity.socket == null)
            {
                MainActivity.socket = IO.Socket(URL);
                var obj = new { device = "app" };

                socket.Connect();
                

                socket.On("event_start", (data) =>
                {
                    Game = data;

                });

                socket.On("event_end", (data) =>
                {

                    Game = data;

                });
                socket.On("event_finish", (data) =>
                {
                    Game = data;

                });
                socket.On("event_data", (data) =>
                {
                    try
                    {
                        eventData = data;
                        string evtdata = eventData.ToString();
                        var ophalen = JObject.Parse(evtdata);
                        string letter = (string)ophalen["data"]["letter"];
                        letteren.Add(letter);
                    }
                    catch(Exception ex)
                    {

                    }
                    
                });
            }

        }

        public void SendByteArrayToSocket(byte[] image)
        {
            string file = "schilderij_1.jpg";
            string data = "{\"data\":\"" + image + "\", \"image1:\"" + file+ "\"}";

            string[] lettertjes = letteren.ToArray();

            object d = new { data = image, image1 = file, letters = lettertjes };
            string s = JsonConvert.SerializeObject(d);

            socket.Emit("image", s);
        }

        public void SendBeaconToSocket(string b)
        {
            string[] lettertjes = letteren.ToArray();

            string json = JsonConvert.SerializeObject(new { beacon = b, letters = lettertjes });
            socket.Emit("beacon", b);
        }

        internal void SendDataToSocket(string d)
        {
            if(Game != null)
            {
                var ding = "";
                string game = Game.ToString();
                var jh = JObject.Parse(game);
                try
                {
                    ding = (string)jh["gameEvent"]["jobHashEnd"];
                }
                catch (Exception ex)
                {

                }

                string[] lettertjes = letteren.ToArray();

                string json = JsonConvert.SerializeObject(new { input = d, jobHash = ding, letters = lettertjes });
                socket.Emit("input", json);
            }
        }
        
        internal void SendStartToSocket(object obj)
        {

            string s= JsonConvert.SerializeObject(obj);
            socket.Emit("online", s);
        }
        #endregion

    }
}
