using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Web;

namespace ForumDs.Helper
{
    public static class FileUpload
    {
        static readonly string baseFolder = "Uploads";
        static readonly string rootUrl = "http://localhost:5003/";

        public static string SaveAvatar(IFormFile avatarFile)
        {
            try
            {
                string imageName = Guid.NewGuid().ToString() + "_" + avatarFile.FileName;
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), $"{baseFolder}\\Avatars");

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var filePath = Path.Combine(folderPath, imageName);

                Console.WriteLine($"Attempting to save file at: {filePath}");

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    avatarFile.CopyTo(fileStream);
                }

                Console.WriteLine($"Saved new image at: {filePath}");

                return rootUrl + baseFolder + "/Avatars/" + imageName;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving new image: {ex.Message}");
                throw; // Rethrow the exception to propagate it to the caller
            }
        }

        public static void DeleteAvatar(string avatarPath)
        {
            try
            {
                // Chuyển đổi URL thành đường dẫn tuyệt đối
                Uri uri = new Uri(avatarPath);
                string fileName = Path.GetFileName(uri.LocalPath);

                // Kết hợp với thư mục gốc để có đường dẫn tuyệt đối
                string filePath = Path.Combine(Directory.GetCurrentDirectory(), $"{baseFolder}\\Avatars", fileName);

                Console.WriteLine($"Attempting to delete file at: {filePath}");

                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                    Console.WriteLine($"Deleted old image at: {filePath}");
                }
                else
                {
                    Console.WriteLine($"Old image not found at: {filePath}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting old image: {ex.Message}");
            }
        }

        public static void DeleteImage(string imageUrl)
        {
            try
            {
                // Chuyển đổi URL thành đường dẫn tuyệt đối
                Uri uri = new Uri(imageUrl);
                string fileName = Path.GetFileName(uri.LocalPath);

                // Kết hợp với thư mục gốc để có đường dẫn tuyệt đối
                string filePath = Path.Combine(Directory.GetCurrentDirectory(), $"{baseFolder}\\QuestionImages", fileName);

                Console.WriteLine($"Attempting to delete file at: {filePath}");

                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                    Console.WriteLine($"Deleted old image at: {filePath}");
                }
                else
                {
                    Console.WriteLine($"Old image not found at: {filePath}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting old image: {ex.Message}");
            }
        }

        public static string SaveQuestionImage(IFormFile questionFile)
        {
            try
            {
                string imageName = Guid.NewGuid().ToString() + "_" + questionFile.FileName;
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), $"{baseFolder}\\QuestionImages");

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var filePath = Path.Combine(folderPath, imageName);

                Console.WriteLine($"Attempting to save file at: {filePath}");

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    questionFile.CopyTo(fileStream);
                }

                Console.WriteLine($"Saved new image at: {filePath}");

                return rootUrl + baseFolder + "/QuestionImages/" + imageName;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving new image: {ex.Message}");
                throw; // Rethrow the exception to propagate it to the caller
            }
        }
    }
}

