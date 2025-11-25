using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hongsa.Rtms.Api.Models;
using Hongsa.Rtms.Api.Data;
using Microsoft.AspNetCore.Authorization;

namespace Hongsa.Rtms.Api.Controllers;

// [Authorize] // กำหนดว่า API นี้ต้องมีการ Login ก่อนเข้าถึง
[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    // สร้าง Object ของ ApplicationDbContext
    private readonly ApplicationDbContext _context;

    // สร้าง Constructor รับค่า ApplicationDbContext
    public ProductController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ทดสอบเขียนฟังก์ชันการเชื่อมต่อ database
    // GET: /api/Product/testconnectdb
    [HttpGet("testconnectdb")]
    public IActionResult TestConnection()
    {
        try
        {
            _context.Database.OpenConnection();
            _context.Database.CloseConnection();
            return Ok("Connected");
        }
        catch (Exception ex)
        {
            return BadRequest($"Not Connected: {ex.Message}");
        }
    }

    // ฟังก์ชันสำหรับการดึงข้อมูลสินค้าทั้งหมด
    // GET: /api/Product
    [Authorize]
    [HttpGet]
    public ActionResult<Product> GetProducts()
    {
        // LINQ สำหรับการดึงข้อมูลจากตาราง Products ทั้งหมด
        // var products = _context.Product.ToList();

        // แบบอ่านที่มีเงื่อนไข
        // var products = _context.Product.Where(p => p.UnitPrice > 45000).ToList();

        // แบบเชื่อมกับตารางอื่น products เชื่อมกับ categories
        var products = _context.Product
            .Join(
                _context.Category,
                p => p.CategoryID,
                c => c.CategoryID,
                (p, c) => new
                {
                    p.ProductID,
                    c.CategoryName,
                    p.ProductName,
                    p.UnitPrice,
                    p.UnitInStock,
                    p.ProductPicture,
                    p.CreatedDate
                }
            ).ToList();

        // ส่งข้อมูลกลับไปให้ผู้ใช้งาน
        return Ok(products);
    }

    // ฟังก์ชันสำหรับการดึงข้อมูลสินค้าตาม id
    // GET: /api/Product/{id}
    [Authorize]
    [HttpGet("{id}")]
    public ActionResult<Product> GetProduct(int id)
    {
        // LINQ สำหรับการดึงข้อมูลจากตาราง Products ตาม id
        var product = _context.Product.FirstOrDefault(p => p.ProductID == id);

        // ถ้าไม่พบข้อมูลจะแสดงข้อความ Not Found
        if (product == null)
        {
            return NotFound();
        }

        // ส่งข้อมูลกลับไปให้ผู้ใช้งาน
        return Ok(product);
    }

    // ฟังก์ชันสำหรับการเพิ่มข้อมูลสินค้า
    // POST: /api/Product
    [Authorize(Roles = UserRolesModel.Admin)]
    [HttpPost]
    public ActionResult<Product> CreateProduct(Product product)
    {
        // เพิ่มข้อมูลลงในตาราง Products
        _context.Product.Add(product);
        _context.SaveChanges();

        // ส่งข้อมูลกลับไปให้ผู้ใช้
        return Ok(product);
    }

    // ฟังก์ชันสำหรับการแก้ไขข้อมูลสินค้า
    // PUT: /api/Product/{id}
    [Authorize(Roles = UserRolesModel.Admin)]
    [HttpPut("{id}")]
    public ActionResult<Product> UpdateProduct(int id, Product product)
    {
        // ดึงข้อมูลสินค้าตาม id
        var existingProduct = _context.Product.FirstOrDefault(p => p.ProductID == id);

        // ถ้าไม่พบข้อมูลจะแสดงข้อความ Not Found
        if (existingProduct == null)
        {
            return NotFound();
        }

        // แก้ไขข้อมูลสินค้า
        existingProduct.ProductName = product.ProductName;
        existingProduct.UnitPrice = product.UnitPrice;
        existingProduct.UnitInStock = product.UnitInStock;
        existingProduct.CategoryID = product.CategoryID;

        // บันทึกข้อมูล
        _context.SaveChanges();

        // ส่งข้อมูลกลับไปให้ผู้ใช้
        return Ok(existingProduct);
    }

    // ฟังก์ชันสำหรับการลบข้อมูลสินค้า
    // DELETE: /api/Product/{id}
    [Authorize(Roles = UserRolesModel.Admin)]
    [HttpDelete("{id}")]
    public ActionResult<Product> DeleteProduct(int id)
    {
        // ดึงข้อมูลสินค้าตาม id
        var product = _context.Product.FirstOrDefault(p => p.ProductID == id);

        // ถ้าไม่พบข้อมูลจะแสดงข้อความ Not Found
        if (product == null)
        {
            return NotFound();
        }

        // ลบข้อมูล
        _context.Product.Remove(product);
        _context.SaveChanges();

        // ส่งข้อมูลกลับไปให้ผู้ใช้
        return Ok(product);
    }
}