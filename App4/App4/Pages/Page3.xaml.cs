using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;

namespace App4
{
    public partial class Page3 : ContentPage
    {
        public Page3()
        {
            InitializeComponent();
            String[] aliennamen = { "Ginevra Puliti", "Cesare Conti", "Neri Cecconi", "Marta Malevolti", "Giulio Zanobini", "Luciana Ferrini", "Emanuela Tacchi", "Giuseppe Bigi", "Piero Ciulli", "Marino Paoli" };
            List<string> aliens;
            aliens = aliennamen.ToList();

            lstView.ItemsSource = aliens;
        }
    }
}
