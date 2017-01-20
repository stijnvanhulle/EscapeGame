//using App4.Models;
//using SQLite;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace App4.Data
//{
//    public class PictureDatabase
//    {
//        readonly SQLiteAsyncConnection database;

//        public PictureDatabase(string dbPath)
//        {
//            database = new SQLiteAsyncConnection(dbPath);
//            database.CreateTableAsync<Picture>().Wait();
//        }

//        public Task<List<Picture>> GetItemsAsync()
//        {
//            return database.Table<Picture>().ToListAsync();
//        }

//        /*public Task<List<Picture>> GetItemsNotDoneAsync()
//        {
//            return database.QueryAsync<Picture>("SELECT * FROM [Picture] WHERE [Done] = 0");
//        }*/

//        public Task<Picture> GetItemAsync(int id)
//        {
//            return database.Table<Picture>().Where(i => i.ID == id).FirstOrDefaultAsync();
//        }

//        public Task<int> SaveItemAsync(Picture item)
//        {
//            if (item.ID != 0)
//            {
//                return database.UpdateAsync(item);
//            }
//            else
//            {
//                return database.InsertAsync(item);
//            }
//        }

//        public Task<int> DeleteItemAsync(Picture item)
//        {
//            return database.DeleteAsync(item);
//        }
//    }
//}
