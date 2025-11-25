using Microsoft.AspNetCore.Mvc;
using Hongsa.Rtms.Api.Models;

namespace Hongsa.Rtms.Api.Controllers;

[ApiController]
[Route("api/[controller]")] // api/User
public class UserController : ControllerBase
{
    // mock data for users
    private static readonly List<User> _users = new List<User>
    {
        new User { 
            Id = 1, 
            Username = "john", 
            Email = "john@email.com", 
            Fullname = "John Doe"
        },
        new User { 
            Id = 2, 
            Username = "samit", 
            Email = "samit@email.com", 
            Fullname = "Samit Koyom"
        },
    };

    // GET: api/User
    [HttpGet]
    public ActionResult<IEnumerable<User>> GetUsers()
    {
        // IEnumerable คืออะไร
        // IEnumerable เป็น interface ใน .NET Framework ที่ใช้แทน collection ของ object
        // interface นี้กำหนด method เพียงตัวเดียวคือ GetEnumerator()
        // GetEnumerator() : method นี้ return enumerator
        // enumerator : object ที่ใช้วนซ้ำผ่าน collection
        // ในที่นี้เราใช้ IEnumerable ในการ return ข้อมูลของ users

        // วนซ้ำผ่าน collection โดยใช้ foreach
        // foreach (var user in _users)
        // {
        //     Console.WriteLine($"{user.Id} - {user.Username}");
        // }

        return Ok(_users);
    }

    // GET: api/User/{id}
    [HttpGet("{id}")]
    public ActionResult<User> GetUser(int id)
    {
        var user = _users.Find(u => u.Id == id); // find user by id
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }


    // POST: api/User
    [HttpPost]
    public ActionResult<User> CreateUser([FromBody] User user)
    {
        _users.Add(user);
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }

    // PUT: api/User/{id}
    [HttpPut("{id}")]
    public IActionResult UpdateUser(int id, [FromBody] User user)
    {
        // Validate user id
        if (id != user.Id)
        {
            return BadRequest();
        }

        // Find existing user
        var existingUser = _users.Find(u => u.Id == id);
        if (existingUser == null)
        {
            return NotFound();
        }

        // Update user
        existingUser.Username = user.Username;
        existingUser.Email = user.Email;
        existingUser.Fullname = user.Fullname;

        // Return updated user
        return Ok(existingUser);
    }

    // DELETE: api/User/2
    [HttpDelete("{id}")]
    public ActionResult DeleteUser(int id)
    {
        // Find existing user
        var user = _users.Find(u => u.Id == id);

        if (user == null)
        {
            return NotFound();
        }

        // Remove user from list
        _users.Remove(user);
        return NoContent();
    }


}