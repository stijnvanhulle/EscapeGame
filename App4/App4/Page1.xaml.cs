using Android.Hardware;
using Android.OS;
using Android.Views;
using Android.Widget;
using Java.IO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using Xamarin.Forms;
using App4;

namespace App4
{
    public partial class Page1 : ContentPage
    {
        public Page1()
        {
            InitializeComponent();
            TakePhotoButton.Clicked += TakePhotoButton_Clicked;
        }

        async void TakePhotoButton_Clicked(object sender, System.EventArgs e)
        {
            var camerpage = new CameraPage();
            camerpage.OnPhotoResult += Camerpage_OnPhotoResult;
            await Navigation.PushModalAsync(camerpage);
        }

        private async void Camerpage_OnPhotoResult(PhotoResultEventArgs result)
        {
            await Navigation.PopModalAsync();

            if (!result.Success)
                return;

            Photo.Source = ImageSource.FromStream(() => new MemoryStream(result.Image));
        }
        

    }
}
