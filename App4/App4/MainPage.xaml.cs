using App4.Helpers;
using App4.Models;
using Plugin.Media;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Forms;

namespace App4
{
    public partial class MainPage : ContentPage
    {
        public MainPage()
        {
            InitializeComponent();

        }

        public byte[] bImage;

        private async void btnTakePhoto_Onclicked(object sender, EventArgs e)
        {

            await CrossMedia.Current.Initialize();

            if (!CrossMedia.Current.IsCameraAvailable || !CrossMedia.Current.IsTakePhotoSupported)
            {
                await DisplayAlert("No Camera", ":(No Camera available.", "OK");
                return;
            }

            var file = await CrossMedia.Current.TakePhotoAsync(
                new Plugin.Media.Abstractions.StoreCameraMediaOptions
                {
                    SaveToAlbum = true,
                });

            if (file == null)
                return;
            pathLabel.Text = file.AlbumPath;

            madeImage.Source = ImageSource.FromFile(file.Path);

            var stream = file.GetStream();
            bImage = ReadFully(stream);

            //ImageSource.FromStream(() =>
            //{
                
            //    file.Dispose();

            //    bImage = ReadFully(stream);

            //    return stream;
            //});



            if(bImage != null)
            {

                DependencyService.Get<IFileHelper>().SendByteArray(bImage);
                pathLabel.Text += System.Environment.NewLine +" afbeelding is succesvol doorgestuurd";
            }

            else
            {
                pathLabel.Text = "image is niet verzonden geweest";
            }

        }

        public static byte[] ReadFully(Stream input)
        {
            
            using (MemoryStream ms = new MemoryStream())
            {
                input.CopyTo(ms);
                return ms.ToArray();
            }

        }
    }
}
