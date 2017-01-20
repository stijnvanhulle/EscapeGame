using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App4.Data
{
    static class MorseToString
    {
        //extension to string
        public static string getchar(this string morse)
        {
            if (morse == ".-")
            {
                return "a";
            }
            else if (morse == "-...")
            {
                return "b";
            }
            else if (morse == "-...")
            {
                return "b";
            }
            else if (morse == "-.-.")
            {
                return "c";
            }
            else if (morse == "-..")
            {
                return "d";
            }
            else if (morse == ".")
            {
                return "e";
            }
            else if (morse == "..-.")
            {
                return "f";
            }
            else if (morse == "--.")
            {
                return "g";
            }
            else if (morse == "....")
            {
                return "h";
            }
            else if (morse == "..")
            {
                return "i";
            }
            else if (morse == ".---")
            {
                return "j";
            }
            else if (morse == "-.-")
            {
                return "k";
            }
            else if (morse == ".-..")
            {
                return "l";
            }
            else if (morse == "--")
            {
                return "m";
            }
            else if (morse == "-.")
            {
                return "n";
            }
            else if (morse == "---")
            {
                return "o";
            }
            else if (morse == ".--.")
            {
                return "p";
            }
            else if (morse == "--.-")
            {
                return "q";
            }
            else if (morse == ".-.")
            {
                return "r";
            }
            else if (morse == "...")
            {
                return "s";
            }
            else if (morse == "-")
            {
                return "t";
            }
            else if (morse == "..-")
            {
                return "u";
            }
            else if (morse == "...-")
            {
                return "v";
            }
            else if (morse == ".--")
            {
                return "w";
            }
            else if (morse == "-..-")
            {
                return "x";
            }
            else if (morse == "-.--")
            {
                return "y";
            }
            else if (morse == "--..")
            {
                return "z";
            }
            return "";
        }
    }
}
